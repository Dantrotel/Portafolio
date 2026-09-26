import './WhoamiCard.css'

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
  const w = t.about.whoami

  const entries = [
    ['name',     'Daniel Aguayo'],
    ['handle',   'dantrottel'],
    ['role',     t.hero.role],
    ['focus',    w.focus],
    ['stack',    ['Node.js', 'Express', 'FastAPI', 'MySQL', 'Docker']],
    ['location', 'Concepción, Chile'],
    ['status',   'open_to_work'],
    ['offline',  w.offline],
  ]

  return (
    <figure className="whoami-card" aria-label={w.label}>
      <div className="whoami-titlebar" aria-hidden="true">
        <span className="whoami-dot" />
        <span className="whoami-dot" />
        <span className="whoami-dot" />
        <span className="whoami-title">dantrottel@portfolio: ~</span>
      </div>

      <pre className="whoami-body">
        <code>
          <span className="json-prompt">$</span> whoami --json{'\n'}
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
          <span className="json-punct">{'}'}</span>{'\n'}
          <span className="json-prompt">$</span> <span className="whoami-cursor" aria-hidden="true" />
        </code>
      </pre>
    </figure>
  )
}
