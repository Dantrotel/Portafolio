import { useEffect, useId, useRef } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

// Diálogo modal: foco atrapado mientras está abierto, Escape cierra y el foco vuelve a donde estaba.
export default function Dialog({ title, children, actions, onClose, wide = false }) {
  const ref = useRef(null)
  const previous = useRef(document.activeElement)
  const titleId = useId()

  useEffect(() => {
    const el = ref.current
    const target = el.querySelector('[data-autofocus]') || el.querySelector(FOCUSABLE) || el
    target.focus({ preventScroll: true })
    const back = previous.current
    return () => { if (back?.isConnected) back.focus({ preventScroll: true }) }
  }, [])

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab') return
    const list = [...ref.current.querySelectorAll(FOCUSABLE)]
    if (!list.length) return
    const first = list[0]
    const last = list[list.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="dialog-backdrop" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div
        ref={ref}
        className={wide ? 'dialog dialog--wide' : 'dialog'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <h2 className="dialog-title" id={titleId}>{title}</h2>
        <div className="dialog-body">{children}</div>
        {actions && <div className="dialog-actions">{actions}</div>}
      </div>
    </div>
  )
}
