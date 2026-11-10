export default function Commands({ d, examples, onRun }) {
  return (
    <div className="pane commands">
      <p className="pane-lead">{d.commands.intro}</p>
      <ul className="commands-list">
        {examples.map(([cmd, key]) => (
          <li key={cmd}>
            <button type="button" className="command" onClick={() => onRun(cmd)}>
              <code className="command-name">{cmd}</code>
              <span className="command-desc">{d.help[key]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
