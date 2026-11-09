import './ApiResponseCard.css'

// Números sin comillas, como en JSON real; cada línea cabe sin cortarse a 375 px
function JsonValue({ value }) {
  if (typeof value === 'number') {
    return <span className="json-number">{value}</span>
  }
  return <span className="json-string">"{value}"</span>
}

export default function ApiResponseCard({ t }) {
  const c = t.apiCard
  const k = c.keys

  const entries = [
    [k.tables,   64],
    [k.views,    6],
    [k.roles,    4],
    [k.auth,     c.auth],
    [k.realtime, 'Socket.io'],
    [k.deploy,   'Docker · Nginx · EC2'],
  ]

  return (
    <figure className="api-card" aria-label={c.label}>
      <div className="api-card-bar">
        <span className="api-card-method">GET</span>
        <span className="api-card-path">{c.path}</span>
        <span className="api-card-status">200 OK</span>
      </div>

      <pre className="api-card-body">
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
