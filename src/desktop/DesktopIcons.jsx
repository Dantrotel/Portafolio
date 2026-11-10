import { useRef, useState } from 'react'
import RenameField from './RenameField'
import FileIcon from './FileIcon'
import { displayName, isDirLike } from './fsOps'
import { CELL_H, CELL_W, cellToPx } from './iconLayout'
import { DRAG_TYPE } from './apps/Files'
import { DESKTOP_ID } from './fsOps'

// Soltar algo arrastrado desde Archivos sobre una carpeta, la papelera o el fondo del escritorio
function htmlDrop(targetId, onDropInto) {
  return {
    onDragOver: (e) => {
      if (!e.dataTransfer.types.includes(DRAG_TYPE)) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    },
    onDrop: (e) => {
      e.preventDefault()
      let ids = []
      try { ids = JSON.parse(e.dataTransfer.getData(DRAG_TYPE) || '[]') } catch { /* nada que soltar */ }
      ids = ids.filter((id) => id !== targetId)
      if (ids.length) onDropInto(ids, targetId)
    },
  }
}

const DRAG_THRESHOLD = 5

// Íconos del escritorio: hijos de ~/Escritorio en una cuadrícula.
// Un clic selecciona; doble clic o Enter abre; Ctrl/Shift suman; arrastrar sobre el fondo selecciona con un rectángulo.
export default function DesktopIcons({
  nodes, lang, d, ids, layout, vw, selection, setSelection,
  renaming, onRename, onOpen, onDelete, onStartRename, onMove, onDropInto, onContextMenu,
}) {
  const [focusId, setFocusId] = useState(null)
  const [drag, setDrag] = useState(null) // { ids, dx, dy, over }
  const [band, setBand] = useState(null) // { x0, y0, x1, y1 }
  const anchor = useRef(null)
  const pointer = useRef(null)
  const listRef = useRef(null)

  const current = ids.includes(focusId) ? focusId : ids[0]
  const selected = new Set(selection)

  const positions = Object.fromEntries(ids.map((id) => [id, cellToPx(layout[id], vw)]))

  // Orden visual: columna por columna desde la derecha, de arriba abajo (para Shift+clic)
  const visualOrder = [...ids].sort((a, b) => layout[a].col - layout[b].col || layout[a].row - layout[b].row)

  const focusIcon = (id) => {
    setFocusId(id)
    listRef.current?.querySelector(`[data-icon="${CSS.escape(id)}"]`)?.focus()
  }

  // ----- selección con el puntero -----

  const select = (id, e) => {
    if (e.ctrlKey || e.metaKey) {
      setSelection(selected.has(id) ? selection.filter((x) => x !== id) : [...selection, id])
      anchor.current = id
    } else if (e.shiftKey && anchor.current && ids.includes(anchor.current)) {
      const a = visualOrder.indexOf(anchor.current)
      const b = visualOrder.indexOf(id)
      setSelection(visualOrder.slice(Math.min(a, b), Math.max(a, b) + 1))
    } else if (!selected.has(id)) {
      setSelection([id])
      anchor.current = id
    }
    setFocusId(id)
  }

  const onIconPointerDown = (e, id) => {
    if (e.button !== 0 || renaming === id) return
    select(id, e)
    if (e.ctrlKey || e.metaKey || e.shiftKey) return
    const group = selected.has(id) ? selection : [id]
    pointer.current = { id, x: e.clientX, y: e.clientY, group, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onIconPointerMove = (e) => {
    const p = pointer.current
    if (!p) return
    const dx = e.clientX - p.x
    const dy = e.clientY - p.y
    if (!p.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    p.moved = true
    // Lo que hay debajo del puntero, sin contar los íconos que se arrastran
    const under = document.elementsFromPoint(e.clientX, e.clientY)
      .map((el) => el.closest('[data-drop-id]'))
      .find((el) => el && !p.group.includes(el.dataset.dropId))
    setDrag({ ids: p.group, dx, dy, over: under?.dataset.dropId || null })
  }

  const onIconPointerUp = (e) => {
    const p = pointer.current
    pointer.current = null
    if (!p?.moved) {
      // Un clic simple sin modificadores deja solo ese ícono seleccionado
      if (p && !e.ctrlKey && !e.metaKey && !e.shiftKey) setSelection([p.id])
      setDrag(null)
      return
    }
    const finished = drag
    setDrag(null)
    if (!finished) return
    if (finished.over) onDropInto(finished.ids, finished.over)
    else onMove(finished.ids, -Math.round(finished.dx / CELL_W), Math.round(finished.dy / CELL_H))
  }

  // ----- rectángulo de selección sobre el fondo -----

  const onBgPointerDown = (e) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const additive = e.ctrlKey || e.metaKey
    setBand({ x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY, base: additive ? selection : [] })
    if (!additive) setSelection([])
    document.activeElement?.blur?.()
  }

  const onBgPointerMove = (e) => {
    if (!band) return
    const next = { ...band, x1: e.clientX, y1: e.clientY }
    setBand(next)
    const left = Math.min(next.x0, next.x1)
    const right = Math.max(next.x0, next.x1)
    const top = Math.min(next.y0, next.y1)
    const bottom = Math.max(next.y0, next.y1)
    const hit = ids.filter((id) => {
      const p = positions[id]
      return p.x < right && p.x + CELL_W > left && p.y < bottom && p.y + CELL_H > top
    })
    setSelection([...new Set([...band.base, ...hit])])
  }

  const onBgPointerUp = () => setBand(null)

  // ----- teclado -----

  const nearest = (fromId, dir) => {
    const from = positions[fromId]
    let best = null
    let bestScore = Infinity
    for (const id of ids) {
      if (id === fromId) continue
      const p = positions[id]
      const dx = p.x - from.x
      const dy = p.y - from.y
      const ok = { ArrowLeft: dx < 0, ArrowRight: dx > 0, ArrowUp: dy < 0, ArrowDown: dy > 0 }[dir]
      if (!ok) continue
      const main = dir === 'ArrowLeft' || dir === 'ArrowRight' ? Math.abs(dx) : Math.abs(dy)
      const cross = dir === 'ArrowLeft' || dir === 'ArrowRight' ? Math.abs(dy) : Math.abs(dx)
      const score = main + cross * 3
      if (score < bestScore) { bestScore = score; best = id }
    }
    return best
  }

  const onKeyDown = (e) => {
    if (renaming) return
    const id = current
    if (!id) return
    if (e.key.startsWith('Arrow')) {
      e.preventDefault()
      const next = nearest(id, e.key)
      if (!next) return
      if (e.shiftKey) setSelection([...new Set([...selection, id, next])])
      else if (!e.ctrlKey) setSelection([next])
      anchor.current = e.shiftKey ? anchor.current : next
      focusIcon(next)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      onOpen(selected.has(id) ? selection : [id])
    } else if (e.key === ' ') {
      e.preventDefault()
      if (e.ctrlKey) setSelection(selected.has(id) ? selection.filter((x) => x !== id) : [...selection, id])
      else setSelection([id])
    } else if (e.key === 'Delete') {
      e.preventDefault()
      onDelete(selected.has(id) ? selection : [id])
    } else if (e.key === 'F2') {
      e.preventDefault()
      onStartRename(id)
    } else if ((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu') {
      e.preventDefault()
      if (!selected.has(id)) setSelection([id])
      const rect = e.target.getBoundingClientRect()
      onContextMenu({ id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, returnFocus: e.target })
    } else if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      setSelection(ids)
    } else if (e.key === 'Escape' && selection.length) {
      setSelection([])
    }
  }

  return (
    <>
      <div
        className="icons-bg"
        onPointerDown={onBgPointerDown}
        onPointerMove={onBgPointerMove}
        onPointerUp={onBgPointerUp}
        onPointerCancel={onBgPointerUp}
        {...htmlDrop(DESKTOP_ID, onDropInto)}
        onContextMenu={(e) => {
          e.preventDefault()
          setSelection([])
          onContextMenu({ id: null, x: e.clientX, y: e.clientY, returnFocus: null })
        }}
      />

      <div
        ref={listRef}
        className="icons"
        role="listbox"
        aria-label={d.desktop.label}
        aria-multiselectable="true"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
      >
        {ids.map((id) => {
          const node = nodes[id]
          const p = positions[id]
          const dragging = drag?.ids.includes(id)
          const dropTarget = isDirLike(nodes, node)
          const name = displayName(node, lang)
          return (
            <div
              key={id}
              role="option"
              aria-selected={selected.has(id)}
              tabIndex={id === current ? 0 : -1}
              className="desk-icon"
              data-icon={id}
              data-drop-id={dropTarget ? id : undefined}
              data-dragging={dragging || undefined}
              data-over={drag?.over === id || undefined}
              title={name}
              style={{
                transform: `translate3d(${p.x + (dragging ? drag.dx : 0)}px, ${p.y + (dragging ? drag.dy : 0)}px, 0)`,
              }}
              onFocus={() => setFocusId(id)}
              onPointerDown={(e) => onIconPointerDown(e, id)}
              onPointerMove={onIconPointerMove}
              onPointerUp={onIconPointerUp}
              onPointerCancel={() => { pointer.current = null; setDrag(null) }}
              onDoubleClick={() => onOpen(selected.has(id) ? selection : [id])}
              {...(dropTarget ? htmlDrop(id, onDropInto) : {})}
              onContextMenu={(e) => {
                e.preventDefault()
                if (!selected.has(id)) setSelection([id])
                setFocusId(id)
                onContextMenu({ id, x: e.clientX, y: e.clientY, returnFocus: e.currentTarget })
              }}
            >
              <FileIcon nodes={nodes} node={node} />
              {renaming === id
                ? <RenameField initial={node.name} onDone={(value) => { onRename(id, value); focusIcon(id) }} />
                : <span className="desk-icon-label">{name}</span>}
            </div>
          )
        })}
      </div>

      {band && (
        <div
          className="select-band"
          aria-hidden="true"
          style={{
            left: Math.min(band.x0, band.x1),
            top: Math.min(band.y0, band.y1),
            width: Math.abs(band.x1 - band.x0),
            height: Math.abs(band.y1 - band.y0),
          }}
        />
      )}
    </>
  )
}
