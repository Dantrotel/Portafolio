/* eslint-disable react-refresh/only-export-components -- módulo de lógica de la terminal: devuelve JSX pero no es un componente, Fast Refresh no aplica */
import { Fragment } from 'react'
import { skillCategories } from '../data/skillsData'
import { experienceData } from '../data/experienceData'
import { educationData } from '../data/educationData'
import { visibleProjects, pick, findProject } from './projects'
import { EMAIL, PROFILES } from './contactInfo'
import { Cmd, Rich, ExternalLink, ProjectPrint, Neofetch } from './TermParts'

// Nombre interno de cada app → nombres que acepta `open`. El primero de cada idioma es el que muestra `ls`.
export const APP_NAMES = {
  terminal: { es: ['terminal'], en: ['terminal'], extra: ['term'] },
  projects: { es: ['proyectos'], en: ['projects'], extra: ['archivos', 'files'] },
  about: { es: ['acerca'], en: ['about'], extra: ['acerca-de', 'perfil'] },
  skills: { es: ['habilidades'], en: ['skills'], extra: [] },
  contact: { es: ['contacto'], en: ['contact'], extra: [] },
  music: { es: ['musica'], en: ['music'], extra: ['música', 'reproductor', 'player'] },
  commands: { es: ['comandos'], en: ['commands'], extra: [] },
}

export const APP_IDS = Object.keys(APP_NAMES)

function findApp(name) {
  const key = name.toLowerCase()
  return APP_IDS.find((id) => {
    const n = APP_NAMES[id]
    return [...n.es, ...n.en, ...n.extra].includes(key)
  }) || null
}

// Comando principal (inglés) + alias en español. `args` alimenta el autocompletado.
export const COMMANDS = [
  { name: 'help', aliases: ['ayuda'] },
  { name: 'whoami', aliases: [] },
  { name: 'about', aliases: ['acerca'] },
  { name: 'ls', aliases: [], usage: 'ls [proyectos]', args: () => ['proyectos', 'projects'] },
  { name: 'cat', aliases: [], usage: 'cat <proyecto>', args: () => visibleProjects.map((p) => p.slug) },
  {
    name: 'open', aliases: ['abrir'], usage: 'open <app|proyecto>',
    args: () => [...APP_IDS.flatMap((id) => [...APP_NAMES[id].es, ...APP_NAMES[id].en]), ...visibleProjects.map((p) => p.slug)],
  },
  { name: 'skills', aliases: ['habilidades'] },
  { name: 'experience', aliases: ['experiencia', 'trayectoria'] },
  { name: 'contact', aliases: ['contacto'] },
  { name: 'cv', aliases: [] },
  { name: 'play', aliases: [] },
  { name: 'pause', aliases: ['pausa'] },
  { name: 'next', aliases: ['siguiente'] },
  { name: 'prev', aliases: ['anterior'] },
  { name: 'theme', aliases: ['tema'], usage: 'theme claro|oscuro', args: () => ['claro', 'oscuro', 'light', 'dark'] },
  { name: 'lang', aliases: ['idioma'], usage: 'lang es|en', args: () => ['es', 'en'] },
  { name: 'clear', aliases: ['limpiar'] },
  { name: 'date', aliases: ['fecha'] },
  { name: 'neofetch', aliases: [] },
  { name: 'simple', aliases: [] },
]

function resolve(word) {
  const key = word.toLowerCase()
  return COMMANDS.find((c) => c.name === key || c.aliases.includes(key)) || null
}

// ---------- piezas de salida ----------

// ---------- ejecución ----------

const lines = (...nodes) => ({ output: nodes.map((node, i) => <Fragment key={i}>{node}</Fragment>) })

export function runCommand(input, ctx) {
  const { t, d, isEn, lang, run } = ctx
  const [word, ...rest] = input.trim().split(/\s+/)
  const arg = rest.join(' ')
  const cmd = resolve(word)

  if (!cmd) return lines(<p><Rich parts={d.term.unknown(word)} run={run} /></p>)

  switch (cmd.name) {
    case 'help':
      return lines(
        <dl className="t-help">
          {COMMANDS.map((c) => (
            <div key={c.name}>
              <dt><Cmd run={run}>{c.name}</Cmd></dt>
              <dd>
                {d.help[c.name]}
                {c.aliases.length > 0 && <span className="t-alias"> · alias {c.aliases.join(', ')}</span>}
              </dd>
            </div>
          ))}
        </dl>
      )

    case 'whoami':
      return lines(<p>Daniel Aguayo <span className="t-muted">(dantrottel)</span> — {t.hero.role}, {t.hero.location}.</p>)

    case 'about':
      return lines(
        <p className="t-strong">{t.hero.tagline}</p>,
        <p>{t.hero.intro}</p>,
        <p className="t-muted">{d.term.openHint(isEn ? 'open about' : 'open acerca')}</p>
      )

    case 'ls': {
      const showProjects = /^(proyectos|projects)\/?$/i.test(arg)
      if (!arg || !showProjects) {
        if (arg && !showProjects) return lines(<p>{d.term.noApp(arg)}</p>)
        return lines(
          <p className="t-key">{d.term.appsHeading}</p>,
          <p className="t-cols">{APP_IDS.map((id) => <Cmd key={id} run={run}>{`open ${APP_NAMES[id][lang][0]}`}</Cmd>)}</p>,
          <p className="t-key">{d.term.projectsHeading}</p>,
          <p className="t-cols">{visibleProjects.map((p) => <Cmd key={p.slug} run={run}>{`cat ${p.slug}`}</Cmd>)}</p>
        )
      }
      return lines(
        <dl className="t-help">
          {visibleProjects.map((p) => (
            <div key={p.slug}>
              <dt><Cmd run={run}>{`cat ${p.slug}`}</Cmd></dt>
              <dd>{pick(p, 'title', isEn)}</dd>
            </div>
          ))}
        </dl>
      )
    }

    case 'cat': {
      if (!arg) return lines(<p><span className="t-key">{d.term.usage}</span> {cmd.usage}</p>)
      const project = findProject(arg)
      if (!project) return lines(<p>{d.term.noProject(arg)}</p>)
      return lines(<ProjectPrint project={project} ctx={ctx} />)
    }

    case 'open': {
      if (!arg) return lines(<p><span className="t-key">{d.term.usage}</span> {cmd.usage}</p>)
      const app = findApp(arg)
      if (app) {
        ctx.openApp(app)
        return lines(<p className="t-muted">{d.term.opened(d.apps[app])}</p>)
      }
      const project = findProject(arg)
      if (project) {
        ctx.openProject(project.slug)
        return lines(<p className="t-muted">{d.term.opened(pick(project, 'title', isEn))}</p>)
      }
      return lines(<p>{d.term.noApp(arg)}</p>)
    }

    case 'skills':
      return lines(
        <dl className="t-help t-help--wide">
          {skillCategories.map((c) => (
            <div key={c.key}>
              <dt className="t-key">{t.skills[c.key]}</dt>
              <dd>{c.skills.map((s) => s.name).join(', ')}</dd>
            </div>
          ))}
        </dl>
      )

    case 'experience':
      return lines(
        <p className="t-key">{t.journey.experience}</p>,
        ...experienceData.map((e) => (
          <p key={`e${e.id}`}>
            <span className="t-accent">{isEn ? e.periodEn : e.period}</span>{' '}
            <span className="t-strong">{isEn ? e.positionEn : e.position}</span> — {e.company}
          </p>
        )),
        <p className="t-key">{t.journey.education}</p>,
        ...educationData.map((e) => (
          <p key={`s${e.id}`}>
            <span className="t-accent">{e.period}</span>{' '}
            <span className="t-strong">{isEn ? e.degreeEn : e.degree}</span> — {e.institution} ({isEn ? e.statusEn : e.status})
          </p>
        ))
      )

    case 'contact':
      return lines(
        <dl className="t-help">
          <div><dt className="t-key">{d.term.email}</dt><dd><a className="t-link" href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
          {PROFILES.map((p) => (
            <div key={p.label}><dt className="t-key">{p.label}</dt><dd><ExternalLink href={p.href} t={t}>{p.text}</ExternalLink></dd></div>
          ))}
        </dl>
      )

    case 'cv':
      ctx.downloadCv()
      return lines(<p className="t-muted">{d.term.cv}</p>)

    case 'play': {
      const { player } = ctx
      if (!player.track) return lines(<p>{d.term.noTracks}</p>)
      player.play()
      return lines(<p>{d.term.playing(player.track.title, player.track.artist)}</p>)
    }

    case 'pause':
      if (!ctx.player.track) return lines(<p>{d.term.noTracks}</p>)
      ctx.player.pause()
      return lines(<p className="t-muted">{d.term.paused}</p>)

    case 'next':
    case 'prev': {
      const track = cmd.name === 'next' ? ctx.player.next() : ctx.player.prev()
      if (!track) return lines(<p>{d.term.noTracks}</p>)
      return lines(<p>{d.term.playing(track.title, track.artist)}</p>)
    }

    case 'theme': {
      const value = { claro: 'light', light: 'light', oscuro: 'dark', dark: 'dark' }[arg.toLowerCase()]
      if (!value) return lines(<p><span className="t-key">{d.term.usage}</span> {isEn ? 'theme light|dark' : cmd.usage}</p>)
      ctx.setTheme(value)
      return lines(<p className="t-muted">{d.term.themeSet(d.term.themeNames[value])}</p>)
    }

    case 'lang': {
      const value = arg.toLowerCase()
      if (value !== 'es' && value !== 'en') return lines(<p><span className="t-key">{d.term.usage}</span> {cmd.usage}</p>)
      ctx.setLang(value)
      return lines(<p className="t-muted">{ctx.strings[value].term.langSet}</p>)
    }

    case 'clear':
      return { clear: true }

    case 'date': {
      const now = new Date()
      const text = new Intl.DateTimeFormat(d.locale, { dateStyle: 'full', timeStyle: 'short' }).format(now)
      return lines(<p><time dateTime={now.toISOString()}>{text}</time></p>)
    }

    case 'neofetch':
      return lines(<Neofetch ctx={ctx} />)

    case 'simple':
      ctx.goSimple()
      return lines(<p className="t-muted">{d.term.simple}</p>)

    default:
      return lines(<p><Rich parts={d.term.unknown(word)} run={run} /></p>)
  }
}

// ---------- autocompletado ----------

function commonPrefix(words) {
  if (!words.length) return ''
  let prefix = words[0]
  for (const w of words) {
    while (!w.startsWith(prefix)) prefix = prefix.slice(0, -1)
  }
  return prefix
}

// Devuelve el texto completado y, si hay varias opciones, la lista para mostrarla
export function complete(input) {
  const parts = input.replace(/^\s+/, '').split(/\s+/)
  if (parts.length <= 1) {
    const word = (parts[0] || '').toLowerCase()
    const options = [...new Set(COMMANDS.flatMap((c) => [c.name, ...c.aliases]))].filter((n) => n.startsWith(word))
    if (options.length === 1) return { value: `${options[0]} `, options: [] }
    return { value: commonPrefix(options) || input, options }
  }

  const cmd = resolve(parts[0])
  if (!cmd?.args || parts.length > 2) return { value: input, options: [] }
  const word = parts[1].toLowerCase()
  const options = [...new Set(cmd.args())].filter((n) => n.startsWith(word))
  if (options.length === 1) return { value: `${parts[0]} ${options[0]}`, options: [] }
  return { value: `${parts[0]} ${commonPrefix(options) || parts[1]}`, options }
}

// Lista clickeable: cada fila ejecuta el comando en la terminal, para quien no quiere escribir
export function commandExamples({ isEn, theme, lang }) {
  return [
    ['help', 'help'],
    ['whoami', 'whoami'],
    [isEn ? 'about' : 'acerca', 'about'],
    ['ls', 'ls'],
    [isEn ? 'ls projects' : 'ls proyectos', 'ls'],
    ['cat actitubb', 'cat'],
    [isEn ? 'open projects' : 'open proyectos', 'open'],
    [isEn ? 'skills' : 'habilidades', 'skills'],
    [isEn ? 'experience' : 'experiencia', 'experience'],
    [isEn ? 'contact' : 'contacto', 'contact'],
    ['cv', 'cv'],
    ['play', 'play'],
    [isEn ? 'pause' : 'pausa', 'pause'],
    [isEn ? 'next' : 'siguiente', 'next'],
    [isEn ? `theme ${theme === 'dark' ? 'light' : 'dark'}` : `tema ${theme === 'dark' ? 'claro' : 'oscuro'}`, 'theme'],
    [`lang ${lang === 'es' ? 'en' : 'es'}`, 'lang'],
    [isEn ? 'date' : 'fecha', 'date'],
    ['neofetch', 'neofetch'],
    [isEn ? 'clear' : 'limpiar', 'clear'],
    ['simple', 'simple'],
  ]
}
