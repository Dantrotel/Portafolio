import { useEffect, useId, useRef, useState } from 'react'
import { complete } from '../commands'
import { Cmd } from '../TermParts'

export const PROMPT = 'dantrottel@mesa:~$'

// El historial y las líneas viven fuera (en el escritorio): cerrar la ventana no los borra
export default function Terminal({ d, lines, history, onRun, onPrint, chips }) {
  const [value, setValue] = useState('')
  const [cursor, setCursor] = useState(null)
  const inputRef = useRef(null)
  const outputRef = useRef(null)
  const inputId = useId()

  // Cada línea nueva lleva la vista al final, como una terminal real
  useEffect(() => {
    const out = outputRef.current
    if (out) out.scrollTop = out.scrollHeight
  }, [lines])

  const submit = (e) => {
    e.preventDefault()
    onRun(value)
    setValue('')
    setCursor(null)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1)
      setCursor(next)
      setValue(history[next])
    } else if (e.key === 'ArrowDown' && cursor !== null) {
      e.preventDefault()
      const next = cursor + 1
      if (next >= history.length) {
        setCursor(null)
        setValue('')
      } else {
        setCursor(next)
        setValue(history[next])
      }
    } else if (e.key === 'Tab' && !e.shiftKey && value.trim()) {
      // Tab completa solo si hay algo que completar; si no, el foco sale del input como siempre
      const result = complete(value)
      if (result.value === value && !result.options.length) return
      e.preventDefault()
      setValue(result.value)
      if (result.options.length > 1) {
        onPrint(<p className="t-cols t-muted">{result.options.map((o) => <span key={o}>{o}</span>)}</p>)
      }
    }
  }

  // Un clic en la terminal lleva el foco al input, salvo que se esté seleccionando texto o tocando un control
  const focusInput = (e) => {
    if (e.target.closest('a, button, input')) return
    if (window.getSelection()?.toString()) return
    inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <div className="term" onClick={focusInput}>
      <div className="term-output" ref={outputRef} role="log" aria-live="polite" aria-label={d.term.output} tabIndex={-1}>
        {lines.map((line) => (
          <div key={line.id} className="term-entry">
            {line.input !== undefined && (
              <p className="t-echo"><span className="t-prompt" aria-hidden="true">{PROMPT}</span> {line.input}</p>
            )}
            {line.output}
          </div>
        ))}
      </div>

      {chips && (
        <div className="term-chips" role="group" aria-label={d.apps.commands}>
          {chips.map((c) => <Cmd key={c} run={onRun}>{c}</Cmd>)}
        </div>
      )}

      <form className="term-form" onSubmit={submit}>
        <label htmlFor={inputId} className="sr-only">{d.term.label}</label>
        <span className="t-prompt" aria-hidden="true">{PROMPT}</span>
        <input
          ref={inputRef}
          id={inputId}
          className="term-input"
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setCursor(null) }}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          data-autofocus
        />
      </form>
    </div>
  )
}
