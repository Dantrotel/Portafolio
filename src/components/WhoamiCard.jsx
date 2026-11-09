import DecryptedText from './reactbits/DecryptedText'
import './WhoamiCard.css'

// Los arreglos van en una sola línea: cada línea del JSON cabe sin cortarse a 320 px
function JsonValue({ value }) {
  if (Array.isArray(value)) {
    return (
      <>
        <span className="json-punct">[</span>
        {value.map((item, i) => (
          <span key={item}>
            <span className="json-string">"{item}"</span>
            {i < value.length - 1 && <span className="json-punct">, </span>}
          </span>
        ))}
        <span className="json-punct">]</span>
      </>
    )
  }
  return <span className="json-string">"{value}"</span>
}

export default function WhoamiCard({ t }) {
  const w = t.whoami

  const entries = [
    ['name',     'Daniel Aguayo'],
    ['handle',   'dantrottel'],
    ['role',     t.hero.role],
    ['focus',    w.focus],
    ['stack',    ['Node.js', 'MySQL', 'Docker']],
    ['location', 'Concepción, Chile'],
    ['offline',  w.offline],
  ]

  return (
    <figure className="whoami-card" aria-label={w.label}>
      <div className="whoami-bar">
        <span className="whoami-method">GET</span>
        <span className="whoami-path">
          <DecryptedText text="/whoami" speed={40} maxIterations={10} animateOn="view" />
        </span>
        <span className="whoami-status">200 OK</span>
      </div>

      <pre className="whoami-body">
        <code>
          <span className="json-header">content-type: application/json</span>
          {'\n\n'}
          <span className="json-punct">{'{'}</span>{'\n'}
          {entries.map(([key, value], i) => (
            <span key={key}>
              {'  '}<span className="json-key">"{key}"</span>
              <span className="json-punct">: </span>
              <JsonValue value={value} />
              {i < entries.length - 1 && <span className="json-punct">,</span>}
              {'\n'}
            </span>
          ))}
          <span className="json-punct">{'}'}</span>
        </code>
      </pre>
    </figure>
  )
}
