import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// Menú contextual: role="menu", flechas/Home/End para moverse, Enter o Espacio activa,
// Escape o Tab cierran y el foco vuelve a quien lo abrió. En el celular se muestra como hoja inferior.
export default function Menu({ items, x, y, label, onClose, returnFocus, sheet = false }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ left: x, top: y })

  const close = () => {
    onClose()
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true })
  }

  const buttons = () => [...ref.current.querySelectorAll('[role^="menuitem"]:not([aria-disabled="true"])')]

  // Se ajusta para no salirse de la pantalla y enfoca la primera opción disponible
  useLayoutEffect(() => {
    const el = ref.current
    if (!sheet) {
      const rect = el.getBoundingClientRect()
      setPos({
        left: Math.max(8, Math.min(x, window.innerWidth - rect.width - 8)),
        top: Math.max(8, Math.min(y, window.innerHeight - rect.height - 8)),
      })
    }
    buttons()[0]?.focus({ preventScroll: true })
  }, [x, y, sheet])

  // Un clic fuera del menú lo cierra
  useEffect(() => {
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) onClose()
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [onClose])

  const onKeyDown = (e) => {
    const list = buttons()
    const index = list.indexOf(document.activeElement)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const step = e.key === 'ArrowDown' ? 1 : -1
      list[(index + step + list.length) % list.length]?.focus()
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      list[e.key === 'Home' ? 0 : list.length - 1]?.focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      close()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      close()
    }
  }

  const activate = (item) => {
    if (item.disabled) return
    close()
    item.onSelect()
  }

  const menu = (
    <div
      ref={ref}
      className={sheet ? 'menu menu--sheet' : 'menu'}
      role="menu"
      aria-label={label}
      style={sheet ? undefined : pos}
      onKeyDown={onKeyDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      {sheet && <p className="menu-title" aria-hidden="true">{label}</p>}
      {items.map((item, i) => (item.separator
        ? <div key={`sep-${i}`} role="separator" className="menu-sep" />
        : (
          <button
            key={item.label}
            type="button"
            role={item.checked === undefined ? 'menuitem' : 'menuitemradio'}
            aria-checked={item.checked}
            aria-disabled={item.disabled || undefined}
            tabIndex={-1}
            className={item.danger ? 'menu-item menu-item--danger' : 'menu-item'}
            onClick={() => activate(item)}
          >
            <span>{item.label}</span>
            {item.hint && <kbd className="menu-hint">{item.hint}</kbd>}
          </button>
        )))}
    </div>
  )

  if (!sheet) return menu
  return (
    <div className="menu-backdrop" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      {menu}
    </div>
  )
}
