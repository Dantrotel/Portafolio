// Lector de Markdown mínimo para los documentos del escritorio: títulos, párrafos, listas,
// **negrita**, `código` y [enlaces](url). Solo lectura; el contenido sale de src/data/fs.js.
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g

function Inline({ text }) {
  return text.split(INLINE).map((part, i) => {
    if (i % 2 === 0) return part
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    const href = link ? link[2] : part.includes('@') && !part.startsWith('http') ? `mailto:${part}` : part
    const external = href.startsWith('http')
    return (
      <a key={i} href={href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
        {link ? link[1] : part}
      </a>
    )
  })
}

function blocks(text) {
  const out = []
  for (const chunk of text.split(/\n{2,}/)) {
    const lines = chunk.split('\n')
    const heading = chunk.match(/^(#{1,3}) (.*)$/)
    if (heading && lines.length === 1) out.push({ type: 'h', level: heading[1].length, text: heading[2] })
    else if (lines.every((l) => /^- /.test(l))) out.push({ type: 'ul', items: lines.map((l) => l.slice(2)) })
    else if (lines.every((l) => /^\d+\. /.test(l))) out.push({ type: 'ol', items: lines.map((l) => l.replace(/^\d+\. /, '')) })
    else out.push({ type: 'p', text: chunk })
  }
  return out
}

// `offset` baja el nivel de los títulos para que encajen bajo el título de la ventana (h2)
export default function Markdown({ text, offset = 2 }) {
  return (
    <div className="md">
      {blocks(text).map((block, i) => {
        if (block.type === 'h') {
          const Tag = `h${Math.min(6, block.level + offset)}`
          return <Tag key={i} className={`md-h md-h${block.level}`}><Inline text={block.text} /></Tag>
        }
        if (block.type === 'ul') return <ul key={i}>{block.items.map((it, j) => <li key={j}><Inline text={it} /></li>)}</ul>
        if (block.type === 'ol') return <ol key={i}>{block.items.map((it, j) => <li key={j}><Inline text={it} /></li>)}</ol>
        return <p key={i}>{block.text.split('\n').map((line, j) => <span key={j}>{j > 0 && <br />}<Inline text={line} /></span>)}</p>
      })}
    </div>
  )
}

// Texto plano: respeta los saltos de línea y vuelve clicables correos y URLs
export function PlainText({ text }) {
  return (
    <pre className="txt">
      {text.split('\n').map((line, i) => <span key={i}>{i > 0 && '\n'}<Inline text={line} /></span>)}
    </pre>
  )
}
