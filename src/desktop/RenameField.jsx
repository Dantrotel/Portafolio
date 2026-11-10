import { useEffect, useRef } from 'react'

// Nombre a seleccionar al renombrar: sin la extensión, como hacen los exploradores
function stemLength(name) {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? dot : name.length
}

// Campo para renombrar en el lugar: Enter confirma, Escape cancela, al salir del campo se confirma
export default function RenameField({ initial, onDone }) {
  const ref = useRef(null)
  const done = useRef(false)

  useEffect(() => {
    const input = ref.current
    input.focus()
    input.setSelectionRange(0, stemLength(initial))
  }, [initial])

  const finish = (value) => {
    if (done.current) return
    done.current = true
    onDone(value)
  }

  return (
    <input
      ref={ref}
      className="icon-rename"
      defaultValue={initial}
      aria-label={initial}
      onKeyDown={(e) => {
        e.stopPropagation()
        if (e.key === 'Enter') finish(e.currentTarget.value)
        if (e.key === 'Escape') finish(null)
      }}
      onBlur={(e) => finish(e.currentTarget.value)}
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    />
  )
}
