import { useEffect, useRef, useState } from 'react'
import {
  FiArrowLeft, FiArrowRight, FiArrowUp, FiGrid, FiList, FiHome, FiMonitor, FiFolder, FiFileText, FiMusic,
  FiTrash2, FiEdit2, FiRotateCcw, FiMoreHorizontal,
} from 'react-icons/fi'
import FileIcon from '../FileIcon'
import RenameField from '../RenameField'
import CaseStudy from '../CaseStudy'
import Markdown, { PlainText } from '../Markdown'
import { projectsData } from '../../data/projectsData'
import {
  HOME_ID, TRASH_ID, DESKTOP_ID, children, displayName, formatSize, isDirLike, isInTrash, pathOf,
  resolveTarget, shortPath, sizeOf, sortedChildren,
} from '../fsOps'

const PLACES = [
  { id: HOME_ID, Icon: FiHome },
  { id: DESKTOP_ID, Icon: FiMonitor },
  { id: 'projects', Icon: FiFolder },
  { id: 'documents', Icon: FiFileText },
  { id: 'music', Icon: FiMusic },
  { id: TRASH_ID, Icon: FiTrash2 },
]

export const DRAG_TYPE = 'application/x-desk-ids'

const LONG_PRESS_MS = 500

// Mantener presionado abre el menú (iOS no dispara contextmenu; Android sí: se usa el primero que llegue)
function longPress(onLong) {
  let timer = null
  let fired = false
  const cancel = () => { clearTimeout(timer); timer = null }
  return {
    onPointerDown: (e) => {
      if (e.pointerType === 'mouse') return
      fired = false
      const target = e.currentTarget
      timer = setTimeout(() => { fired = true; onLong(target) }, LONG_PRESS_MS)
    },
    onPointerMove: cancel,
    onPointerUp: cancel,
    onPointerCancel: cancel,
    onContextMenu: (e) => {
      e.preventDefault()
      e.stopPropagation() // si no, el panel abriría encima el menú del fondo
      cancel()
      if (!fired) { fired = true; onLong(e.currentTarget) }
    },
    onClickCapture: (e) => {
      // El toque que terminó una pulsación larga no abre el archivo
      if (fired) { e.preventDefault(); e.stopPropagation(); fired = false }
    },
  }
}

// Celular: lista simple. Tocar abre; "⋯" o mantener presionado abre el menú como hoja inferior.
function MobileItems({ nodes, items, lang, d, onOpen, onContextMenu, cwd, label }) {
  return (
    <ul className="fm-mlist" aria-label={label}>
      {items.map((node) => {
        const name = displayName(node, lang)
        const menu = (el) => onContextMenu({ id: node.id, x: 0, y: 0, returnFocus: el, dir: cwd })
        return (
          <li key={node.id} className="fm-mrow">
            <button type="button" className="fm-mopen" onClick={() => onOpen(node.id)} {...longPress(menu)}>
              <FileIcon nodes={nodes} node={node} size={32} />
              <span className="fm-mname">{name}</span>
            </button>
            <button type="button" className="fm-more" aria-label={d.menu.more(name)} onClick={(e) => menu(e.currentTarget)}>
              <FiMoreHorizontal size={18} aria-hidden="true" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function dropIds(e) {
  try { return JSON.parse(e.dataTransfer.getData(DRAG_TYPE) || '[]') } catch { return [] }
}

// Migas de pan de la ruta; un clic en el lápiz (o Ctrl+L) la vuelve editable
function PathBar({ nodes, cwd, lang, d, onNavigate, onOpenPath, editing, setEditing }) {
  const crumbs = []
  for (let n = nodes[cwd]; n; n = nodes[n.parent]) {
    crumbs.unshift(n)
    if (n.id === HOME_ID) break
  }
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  if (editing) {
    return (
      <form
        className="fm-path"
        onSubmit={(e) => {
          e.preventDefault()
          onOpenPath(inputRef.current.value)
        }}
      >
        <input
          ref={inputRef}
          className="fm-path-input"
          defaultValue={shortPath(nodes, cwd)}
          aria-label={d.files.pathLabel}
          spellCheck={false}
          autoCapitalize="off"
          onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); setEditing(false) } }}
          onBlur={() => setEditing(false)}
        />
      </form>
    )
  }

  return (
    <nav className="fm-path" aria-label={d.files.pathLabel}>
      <ol className="fm-crumbs">
        {crumbs.map((n, i) => (
          <li key={n.id}>
            {i > 0 && <span className="fm-crumb-sep" aria-hidden="true">/</span>}
            <button
              type="button"
              className="fm-crumb"
              aria-current={n.id === cwd ? 'location' : undefined}
              onClick={() => onNavigate(n.id)}
            >
              {n.id === HOME_ID ? displayName(n, lang) : n.id === 'root' ? '/' : displayName(n, lang)}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="fm-tool fm-path-edit" onClick={() => setEditing(true)} aria-label={d.files.editPath} title={`${d.files.editPath} (Ctrl+L)`}>
        <FiEdit2 size={13} aria-hidden="true" />
      </button>
    </nav>
  )
}

function Preview({ nodes, cwd, selection, lang, t, d }) {
  const isEn = lang === 'en'
  const focusId = selection.length === 1 ? resolveTarget(nodes, selection[0]) : null
  const subject = nodes[focusId] || (selection.length ? null : nodes[cwd])
  if (!subject) return null
  if (subject.project) {
    const project = projectsData.find((p) => p.slug === subject.project)
    if (subject.kind === 'dir' && project) return <CaseStudy project={project} t={t} d={d} isEn={isEn} />
  }
  if (subject.kind === 'file' && subject.content) {
    const text = subject.content(lang)
    return (
      <div className="fm-doc">
        <p className="fm-doc-path">{shortPath(nodes, subject.id)}</p>
        {subject.type === 'md' ? <Markdown text={text} offset={2} /> : <PlainText text={text} />}
      </div>
    )
  }
  return null
}

export default function Files({
  nodes, lang, t, d, cwd, canBack, canForward, onBack, onForward, onNavigate, onOpen, onOpenPath,
  selection, setSelection, view, setView, renaming, onRename, onStartRename, onTrash, onRestore,
  onEmptyTrash, onContextMenu, onDropInto, mobile = false,
}) {
  const [editingPath, setEditingPath] = useState(false)
  const rootRef = useRef(null)
  const wasEditing = useRef(false)
  const [over, setOver] = useState(null)
  const [focusId, setFocusId] = useState(null)
  const listRef = useRef(null)
  const anchor = useRef(null)

  // Al terminar de escribir una ruta, el foco vuelve al botón de la ruta (no se pierde en el body)
  useEffect(() => {
    if (wasEditing.current && !editingPath) rootRef.current?.querySelector('.fm-path-edit')?.focus({ preventScroll: true })
    wasEditing.current = editingPath
  }, [editingPath])

  const inTrash = cwd === TRASH_ID
  const items = sortedChildren(nodes, cwd, { showHidden: false })
  const ids = items.map((n) => n.id)
  const selected = new Set(selection)
  const current = ids.includes(focusId) ? focusId : ids[0]
  const parent = nodes[cwd]?.parent

  const focusItem = (id) => {
    setFocusId(id)
    listRef.current?.querySelector(`[data-item="${CSS.escape(id)}"]`)?.focus()
  }

  const select = (id, e) => {
    if (e.ctrlKey || e.metaKey) {
      setSelection(selected.has(id) ? selection.filter((x) => x !== id) : [...selection, id])
      anchor.current = id
    } else if (e.shiftKey && anchor.current && ids.includes(anchor.current)) {
      const a = ids.indexOf(anchor.current)
      const b = ids.indexOf(id)
      setSelection(ids.slice(Math.min(a, b), Math.max(a, b) + 1))
    } else {
      setSelection([id])
      anchor.current = id
    }
    setFocusId(id)
  }

  // Columnas reales de la vista de íconos (para que arriba/abajo salten una fila)
  const columns = () => {
    const els = [...(listRef.current?.querySelectorAll('[data-item]') || [])]
    if (view === 'list' || els.length < 2) return 1
    const top = els[0].offsetTop
    const n = els.findIndex((el) => el.offsetTop !== top)
    return n === -1 ? els.length : n
  }

  const onKeyDown = (e) => {
    if (renaming) return
    const index = ids.indexOf(current)
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns(), ArrowUp: -columns() }[e.key]
    if (step !== undefined && !e.altKey) {
      if (view === 'list' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return
      e.preventDefault()
      const next = ids[Math.max(0, Math.min(ids.length - 1, index + step))]
      if (!next) return
      if (e.shiftKey) setSelection([...new Set([...selection, current, next])])
      else if (!e.ctrlKey) setSelection([next])
      focusItem(next)
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      const next = e.key === 'Home' ? ids[0] : ids[ids.length - 1]
      if (next) { setSelection([next]); focusItem(next) }
    } else if (e.key === 'Enter' && current) {
      e.preventDefault()
      ;(selected.has(current) ? selection : [current]).forEach(onOpen)
    } else if (e.key === ' ' && current) {
      e.preventDefault()
      if (e.ctrlKey) setSelection(selected.has(current) ? selection.filter((x) => x !== current) : [...selection, current])
      else setSelection([current])
    } else if (e.key === 'Delete' && current && !inTrash) {
      e.preventDefault()
      onTrash(selected.has(current) ? selection : [current])
    } else if (e.key === 'F2' && current) {
      e.preventDefault()
      onStartRename(current)
    } else if (((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu') && current) {
      e.preventDefault()
      if (!selected.has(current)) setSelection([current])
      const r = e.target.getBoundingClientRect()
      onContextMenu({ id: current, x: r.left + r.width / 2, y: r.top + r.height / 2, returnFocus: e.target, dir: cwd })
    } else if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      setSelection(ids)
    }
  }

  // Atajos de navegación de la ventana: Alt+flechas, Retroceso, Ctrl+L
  const onRootKeyDown = (e) => {
    if (e.target.tagName === 'INPUT') return
    if ((e.altKey && e.key === 'ArrowLeft') || e.key === 'Backspace') { e.preventDefault(); if (canBack) onBack() }
    else if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); if (canForward) onForward() }
    else if (e.altKey && e.key === 'ArrowUp') { e.preventDefault(); if (parent) onNavigate(parent) }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setEditingPath(true) }
  }

  // Arrastrar y soltar (HTML5): a carpetas, a los lugares de la barra lateral o a la papelera del escritorio
  const dragProps = (id) => ({
    draggable: !mobile && renaming !== id,
    onDragStart: (e) => {
      const group = selected.has(id) ? selection : [id]
      if (!selected.has(id)) setSelection([id])
      e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(group))
      e.dataTransfer.effectAllowed = 'move'
    },
  })

  const dropProps = (targetId) => ({
    onDragOver: (e) => {
      if (!e.dataTransfer.types.includes(DRAG_TYPE)) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setOver(targetId)
    },
    onDragLeave: () => setOver((o) => (o === targetId ? null : o)),
    onDrop: (e) => {
      e.preventDefault()
      setOver(null)
      const dragged = dropIds(e).filter((x) => x !== targetId)
      if (dragged.length) onDropInto(dragged, targetId)
    },
  })

  const restorable = selection.filter((id) => nodes[id]?.parent === TRASH_ID)
  // Se llama como función (no tiene hooks) para saber si hay algo que mostrar antes de reservarle espacio
  const preview = inTrash ? null : Preview({ nodes, cwd, selection, lang, t, d })

  return (
    <div ref={rootRef} className="fm" onKeyDown={onRootKeyDown} data-mobile={mobile || undefined}>
      <div className="fm-toolbar">
        <button type="button" className="fm-tool" onClick={onBack} disabled={!canBack} aria-label={d.files.back} title={`${d.files.back} (Alt+←)`}>
          <FiArrowLeft size={16} aria-hidden="true" />
        </button>
        <button type="button" className="fm-tool" onClick={onForward} disabled={!canForward} aria-label={d.files.forward} title={`${d.files.forward} (Alt+→)`}>
          <FiArrowRight size={16} aria-hidden="true" />
        </button>
        <button type="button" className="fm-tool" onClick={() => onNavigate(parent)} disabled={!parent} aria-label={d.files.up} title={`${d.files.up} (Alt+↑)`}>
          <FiArrowUp size={16} aria-hidden="true" />
        </button>
        <PathBar
          nodes={nodes} cwd={cwd} lang={lang} d={d}
          onNavigate={onNavigate}
          onOpenPath={(value) => { setEditingPath(false); onOpenPath(value) }}
          editing={editingPath}
          setEditing={setEditingPath}
        />
        <div className="fm-views" role="group" aria-label={d.files.viewLabel} hidden={mobile}>
          <button type="button" className="fm-tool" aria-pressed={view === 'icons'} onClick={() => setView('icons')} aria-label={d.files.iconView}>
            <FiGrid size={15} aria-hidden="true" />
          </button>
          <button type="button" className="fm-tool" aria-pressed={view === 'list'} onClick={() => setView('list')} aria-label={d.files.listView}>
            <FiList size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      {inTrash && (
        <div className="fm-trashbar">
          <p>{d.files.trashNote}</p>
          <button type="button" className="btn btn-secondary btn-sm" disabled={!restorable.length} onClick={() => onRestore(restorable)}>
            <FiRotateCcw size={14} aria-hidden="true" />
            {d.menu.restore}
          </button>
          <button type="button" className="btn btn-secondary btn-sm" disabled={!items.length} onClick={onEmptyTrash}>
            {d.menu.emptyTrash}
          </button>
        </div>
      )}

      <div className="fm-body">
        <nav className="fm-side" aria-label={d.files.places}>
          <ul>
            {PLACES.map(({ id, Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  className="fm-place"
                  aria-current={cwd === id ? 'location' : undefined}
                  data-over={over === id || undefined}
                  onClick={() => onNavigate(id)}
                  {...dropProps(id)}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span>{displayName(nodes[id], lang)}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="fm-main">
          <div
            className="fm-pane"
            onContextMenu={(e) => {
              if (e.target.closest('[data-item]')) return
              e.preventDefault()
              setSelection([])
              onContextMenu({ id: null, x: e.clientX, y: e.clientY, returnFocus: null, dir: cwd })
            }}
            onPointerDown={(e) => { if (!e.target.closest('[data-item]')) setSelection([]) }}
            {...dropProps(cwd)}
          >
            {items.length === 0 ? (
              <p className="fm-empty">{cwd === 'music' ? d.files.emptyMusic : inTrash ? d.files.emptyTrash : d.files.empty}</p>
            ) : mobile ? (
              <MobileItems
                nodes={nodes} items={items} lang={lang} d={d} cwd={cwd}
                label={d.files.contentsOf(displayName(nodes[cwd], lang))}
                onOpen={onOpen} onContextMenu={onContextMenu}
              />
            ) : (
              <div
                ref={listRef}
                className={`fm-items fm-items--${view}`}
                role="listbox"
                aria-label={d.files.contentsOf(displayName(nodes[cwd], lang))}
                aria-multiselectable="true"
                onKeyDown={onKeyDown}
              >
                {view === 'list' && (
                  <div className="fm-row fm-row--head" aria-hidden="true">
                    <span>{d.props.name}</span><span>{d.props.type}</span><span>{d.props.size}</span>
                  </div>
                )}
                {items.map((node) => {
                  const name = displayName(node, lang)
                  const dirLike = isDirLike(nodes, node)
                  const size = view === 'list' && !dirLike ? formatSize(sizeOf(nodes, resolveTarget(nodes, node.id), lang), d.locale) : null
                  return (
                    <div
                      key={node.id}
                      role="option"
                      aria-selected={selected.has(node.id)}
                      tabIndex={node.id === current ? 0 : -1}
                      className={view === 'list' ? 'fm-row fm-item' : 'fm-item'}
                      data-item={node.id}
                      data-over={over === node.id || undefined}
                      title={pathOf(nodes, node.id)}
                      onFocus={() => setFocusId(node.id)}
                      onClick={(e) => select(node.id, e)}
                      onDoubleClick={() => onOpen(node.id)}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!selected.has(node.id)) setSelection([node.id])
                        onContextMenu({ id: node.id, x: e.clientX, y: e.clientY, returnFocus: e.currentTarget, dir: cwd })
                      }}
                      {...dragProps(node.id)}
                      {...(dirLike ? dropProps(node.id) : {})}
                    >
                      <FileIcon nodes={nodes} node={node} size={view === 'list' ? 22 : 44} />
                      {renaming === node.id
                        ? <RenameField initial={node.name} onDone={(value) => { onRename(node.id, value); focusItem(node.id) }} />
                        : <span className="fm-name">{name}</span>}
                      {view === 'list' && (
                        <>
                          <span className="fm-meta">{dirLike ? d.types.dir : d.types[nodes[resolveTarget(nodes, node.id)]?.type] || d.types.link}</span>
                          <span className="fm-meta fm-size">{dirLike ? d.props.items(children(nodes, resolveTarget(nodes, node.id)).length) : size || '—'}</span>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {preview && <aside className="fm-preview" aria-label={d.files.preview}>{preview}</aside>}
        </div>
      </div>
      <p className="sr-only" role="status">{isInTrash(nodes, cwd) || inTrash ? '' : d.files.count(items.length)}</p>
    </div>
  )
}
