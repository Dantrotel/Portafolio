import { visibleProjects, pick } from './projects'

// Un comando dentro de la salida es un botón: quien no quiere escribir puede hacer clic
export function Cmd({ children, run }) {
  return (
    <button type="button" className="t-cmd" onClick={() => run(children)}>
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

function decisionParts(text) {
  const cut = text.indexOf(': ')
  if (cut === -1) return [null, text]
  return [text.slice(0, cut), text.slice(cut + 2)]
}

export function ProjectPrint({ project, ctx }) {
  const { t, d, isEn } = ctx
  const decisions = pick(project, 'decisions', isEn)
  return (
    <div className="t-block">
      <p className="t-strong">{pick(project, 'title', isEn)}</p>
      {project.problem && (
        <p><span className="t-key">{t.projects.problem}:</span> {pick(project, 'problem', isEn)}</p>
      )}
      <p>{pick(project, 'description', isEn)}</p>
      {decisions && (
        <>
          <p className="t-key">{t.projects.decisions}:</p>
          <ol className="t-list">
            {decisions.map((text, i) => {
              const [lead, rest] = decisionParts(text)
              return (
                <li key={text}>
                  <span className="t-accent">{String(i + 1).padStart(2, '0')}</span>{' '}
                  {lead && <span className="t-strong">{lead}:</span>} {rest}
                </li>
              )
            })}
          </ol>
        </>
      )}
      <p className="t-muted">{project.tags.join(' · ')}</p>
      {project.code
        ? <p><span className="t-key">{d.term.code}:</span> <ExternalLink href={project.code} t={t}>{project.code.replace('https://', '')}</ExternalLink></p>
        : <p className="t-muted">{d.files.noCode}</p>}
      <p className="t-muted">{d.term.openHint(`open ${project.slug}`)}</p>
    </div>
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
        <p><span className="t-accent">dantrottel</span>@<span className="t-accent">mesa</span></p>
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
