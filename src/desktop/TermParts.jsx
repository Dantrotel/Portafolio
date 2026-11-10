import { visibleProjects } from './projects'

// Un comando dentro de la salida es un botón: quien no quiere escribir puede hacer clic.
// Sin `cmd`, ejecuta su propio texto; con `cmd`, muestra un nombre y ejecuta otra cosa (ls → cd/open).
export function Cmd({ children, run, cmd, className }) {
  return (
    <button type="button" className={className ? `t-cmd ${className}` : 't-cmd'} onClick={() => run(cmd || children)}>
      {children}
    </button>
  )
}

// [texto, comando, texto]: los elementos impares siempre son comandos
export function Rich({ parts, run }) {
  return parts.map((part, i) => (i % 2 ? <Cmd key={i} run={run}>{part}</Cmd> : part))
}

export function ExternalLink({ href, children, t }) {
  return (
    <a className="t-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}<span className="sr-only"> {t.a11y.newTab}</span>
    </a>
  )
}

const MONOGRAM = [
  '      ██        ',
  '      ██        ',
  '  ██████        ',
  ' ██   ██        ',
  ' ██   ██        ',
  '  ██████ ██████ ',
]

export function Neofetch({ ctx }) {
  const { t, d, theme } = ctx
  const n = d.term.neofetch
  const rows = [
    [n.name, 'Daniel Aguayo'],
    [n.role, t.hero.role],
    [n.location, t.hero.location],
    [n.studies, n.studiesValue],
    [n.experience, n.experienceValue],
    [n.stack, 'Node.js, Express, MySQL, Angular, Docker'],
    [n.projects, String(visibleProjects.length)],
    [n.languages, n.languagesValue],
    [n.theme, d.term.themeNames[theme]],
  ]
  return (
    <div className="t-neofetch">
      <pre className="t-monogram" aria-hidden="true">{MONOGRAM.join('\n')}</pre>
      <div>
        <p><span className="t-accent">daniel</span>@<span className="t-accent">dantrottel</span></p>
        <p className="t-muted" aria-hidden="true">────────────────</p>
        <dl className="t-dl">
          {rows.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </div>
    </div>
  )
}
