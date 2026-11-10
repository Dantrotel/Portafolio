import { useEffect, useRef } from 'react'
import { FiMinus, FiSquare, FiX, FiCopy } from 'react-icons/fi'

export const TOP_BAR = 32
// Al arrastrar, siempre queda a la vista un trozo de la barra de título para poder recuperarla
const GRAB_MARGIN = 96

// Ventana no modal: role="dialog" con nombre accesible, Escape la cierra.
// La posición se aplica con transform; durante el arrastre se escribe directo en el DOM
// y solo al soltar se guarda en el estado.
export default function Window({
  id, title, path, rect, z, state, maximized, focusToken, d,
  onActivate, onClose, onMinimize, onMaximize, onMove, children,
}) {
  const ref = useRef(null)
  const drag = useRef(null)
  const titleId = `win-${id}-title`

  // Al abrir o restaurar, el foco entra a la ventana: al primer [data-autofocus] o al diálogo
  useEffect(() => {
    if (!focusToken) return
    const el = ref.current
    const target = el?.querySelector('[data-autofocus]') || el
    target?.focus({ preventScroll: true })
  }, [focusToken])

  const onPointerDown = (e) => {
    if (e.button !== 0 || maximized || e.target.closest('button')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { px: e.clientX, py: e.clientY, x: rect.x, y: rect.y, nx: rect.x, ny: rect.y }
    ref.current.dataset.dragging = 'true'
  }

  const onPointerMove = (e) => {
    const g = drag.current
    if (!g) return
    const maxX = window.innerWidth - GRAB_MARGIN
    const maxY = window.innerHeight - 48
    g.nx = Math.min(maxX, Math.max(GRAB_MARGIN - rect.w, g.x + e.clientX - g.px))
    g.ny = Math.min(maxY, Math.max(TOP_BAR, g.y + e.clientY - g.py))
    ref.current.style.transform = `translate3d(${g.nx}px, ${g.ny}px, 0)`
  }

  const endDrag = () => {
    const g = drag.current
    if (!g) return
    drag.current = null
    delete ref.current.dataset.dragging
    if (g.nx !== g.x || g.ny !== g.y) onMove(id, g.nx, g.ny)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      // Acción de teclado: se cierra sin animación
      onClose(id, { instant: true })
    }
  }

  const style = maximized
    ? { zIndex: z }
    : { zIndex: z, width: rect.w, height: rect.h, transform: `translate3d(${rect.x}px, ${rect.y}px, 0)` }

  return (
    <section
      ref={ref}
      className="window"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      tabIndex={-1}
      data-state={state}
      data-maximized={maximized || undefined}
      hidden={state === 'minimized'}
      style={style}
      onPointerDownCapture={() => onActivate(id)}
      onFocus={() => onActivate(id)}
      onKeyDown={onKeyDown}
    >
      <header
        className="window-bar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={(e) => { if (!e.target.closest('button')) onMaximize(id) }}
      >
        <h2 className="window-title" id={titleId}>
          <span className="window-name">{title}</span>
          <span className="window-path" aria-hidden="true">{path}</span>
        </h2>
        <div className="window-controls">
          <button type="button" className="window-btn" onClick={() => onMinimize(id)} aria-label={`${d.minimize} ${title}`}>
            <FiMinus size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="window-btn"
            onClick={() => onMaximize(id)}
            aria-label={`${maximized ? d.restore : d.maximize} ${title}`}
          >
            {maximized ? <FiCopy size={12} aria-hidden="true" /> : <FiSquare size={12} aria-hidden="true" />}
          </button>
          <button type="button" className="window-btn window-btn--close" onClick={() => onClose(id)} aria-label={`${d.close} ${title}`}>
            <FiX size={15} aria-hidden="true" />
          </button>
        </div>
      </header>
      <div className="window-body">{children}</div>
    </section>
  )
}
