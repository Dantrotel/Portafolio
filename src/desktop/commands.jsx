/* eslint-disable react-refresh/only-export-components -- módulo de lógica de la terminal: devuelve JSX pero no es un componente, Fast Refresh no aplica */
import { Fragment } from 'react'
import { skillCategories } from '../data/skillsData'
import { experienceData } from '../data/experienceData'
import { educationData } from '../data/educationData'
import { visibleProjects, findProject } from './projects'
import { EMAIL, PROFILES } from '../data/contactData'
import { Cmd, Rich, ExternalLink, Neofetch } from './TermParts'
import {
  HOME_ID, TRASH_ID, children, displayName, findChild, formatSize, isDirLike, isInTrash, makeDir,
  move, moveToTrash, pathOf, resolvePath, resolveTarget, restore, shortPath, sizeOf, sortedChildren,
} from './fsOps'

// Nombre interno de cada app → nombres que acepta `open`. El primero de cada idioma es el que muestra `ls`.
export const APP_NAMES = {
  terminal: { es: ['terminal'], en: ['terminal'], extra: ['term'] },
  files: { es: ['archivos'], en: ['files'], extra: ['explorador'] },
  projects: { es: ['proyectos'], en: ['projects'], extra: [] },
  about: { es: ['acerca'], en: ['about'], extra: ['acerca-de', 'perfil'] },
  skills: { es: ['habilidades'], en: ['skills'], extra: [] },
  contact: { es: ['contacto'], en: ['contact'], extra: [] },
  music: { es: ['musica'], en: ['music'], extra: ['música', 'reproductor', 'player'] },
  commands: { es: ['comandos'], en: ['commands'], extra: [] },
  settings: { es: ['ajustes'], en: ['settings'], extra: ['configuracion', 'configuración'] },
  editor: { es: ['editor'], en: ['editor'], extra: [] },
  viewer: { es: ['visor'], en: ['viewer'], extra: [] },
}

export const APP_IDS = Object.keys(APP_NAMES)

function findApp(name) {
  const key = name.toLowerCase()
  return APP_IDS.find((id) => {
    const n = APP_NAMES[id]
    return [...n.es, ...n.en, ...n.extra].includes(key)
  }) || null
}

// Comando principal (inglés) + alias en español.
// args: opciones fijas para Tab; path: el argumento es una ruta del sistema de archivos.
export const COMMANDS = [
  { name: 'help', aliases: ['ayuda'] },
  { name: 'whoami', aliases: [] },
  { name: 'about', aliases: ['acerca'] },
  { name: 'pwd', aliases: [] },
  { name: 'cd', aliases: [], usage: 'cd [ruta]', path: 'dir' },
  { name: 'ls', aliases: [], usage: 'ls [-l] [-a] [ruta]', path: 'any' },
  { name: 'tree', aliases: ['arbol'], usage: 'tree [ruta]', path: 'dir' },
  { name: 'cat', aliases: [], usage: 'cat <archivo|proyecto>', path: 'any', args: () => visibleProjects.map((p) => p.slug) },
  {
    name: 'open', aliases: ['abrir'], usage: 'open <ruta|app|proyecto>', path: 'any',
    args: () => [...APP_IDS.flatMap((id) => [...APP_NAMES[id].es, ...APP_NAMES[id].en]), ...visibleProjects.map((p) => p.slug)],
  },
  { name: 'rm', aliases: [], usage: 'rm [-r] <ruta>…', path: 'any' },
  { name: 'mkdir', aliases: [], usage: 'mkdir <carpeta>', path: 'dir' },
  { name: 'mv', aliases: [], usage: 'mv <origen> <destino>', path: 'any' },
  { name: 'trash', aliases: ['papelera'] },
  { name: 'restore', aliases: ['restaurar'], usage: 'restore <nombre>', path: 'trash' },
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

function resolveCommand(word) {
  const key = word.toLowerCase()
  return COMMANDS.find((c) => c.name === key || c.aliases.includes(key)) || null
}

// ---------- análisis de la línea ----------

// Separa en palabras respetando comillas y espacios escapados con barra invertida
export function tokenize(input) {
  const out = []
  let current = ''
  let quote = null
  let started = false
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (quote) {
      if (ch === quote) quote = null
      else current += ch
    } else if (ch === '"' || ch === "'") {
      quote = ch
      started = true
    } else if (ch === '\\' && i + 1 < input.length) {
      current += input[++i]
      started = true
    } else if (/\s/.test(ch)) {
      if (started) out.push(current)
      current = ''
      started = false
    } else {
      current += ch
      started = true
    }
  }
  if (started) out.push(current)
  return out
}

// Para mostrar o completar un nombre con espacios: "Carpeta personal" → Carpeta\ personal
const escapeName = (name) => name.replace(/([\s"'\\])/g, '\\$1')

function splitFlags(args) {
  const flags = new Set()
  const rest = []
  for (const a of args) {
    if (/^-[a-zA-Z]+$/.test(a)) for (const f of a.slice(1)) flags.add(f)
    else rest.push(a)
  }
  return { flags, rest }
}

function parentAndName(path) {
  const clean = path.replace(/\/+$/, '')
  const cut = clean.lastIndexOf('/')
  if (cut === -1) return ['', clean]
  return [clean.slice(0, cut) || '/', clean.slice(cut + 1)]
}

// ---------- piezas de salida ----------

const lines = (...nodes) => ({ output: nodes.map((node, i) => <Fragment key={i}>{node}</Fragment>) })
const err = (text) => <p className="t-err">{text}</p>

// Un nombre de la salida de ls: carpeta → cd, archivo → open
function Entry({ nodes, node, lang, base, run }) {
  const dir = isDirLike(nodes, node)
  const name = node.name
  const path = base ? `${base.replace(/\/$/, '')}/${name}` : name
  const suffix = dir ? '/' : node.kind === 'link' ? '@' : ''
  return (
    <Cmd run={run} cmd={`${dir ? 'cd' : 'open'} ${escapeName(path)}`} className={dir ? 't-dir' : node.kind === 'link' ? 't-linkname' : undefined}>
      {name}{suffix}
      {node.label && node.label[lang] !== node.name && <span className="sr-only"> ({displayName(node, lang)})</span>}
    </Cmd>
  )
}

const PERMS = { dir: 'drwxr-xr-x', link: 'lrwxrwxrwx', file: '-rw-r--r--' }

function Tree({ nodes, rootId, ctx }) {
  const rows = []
  let dirs = 0
  let files = 0
  const walk = (id, prefix) => {
    const list = sortedChildren(nodes, id, { showHidden: false })
    list.forEach((child, i) => {
      const last = i === list.length - 1
      const dir = child.kind === 'dir'
      if (dir) dirs++
      else files++
      rows.push(
        <span key={child.id}>
          <span className="t-muted">{prefix}{last ? '└── ' : '├── '}</span>
          <span className={dir ? 't-dir' : child.kind === 'link' ? 't-linkname' : undefined}>{child.name}{dir ? '/' : child.kind === 'link' ? '@' : ''}</span>
          {'\n'}
        </span>,
      )
      if (dir) walk(child.id, `${prefix}${last ? '    ' : '│   '}`)
    })
  }
  walk(rootId, '')
  return (
    <>
      <pre className="t-pre"><span className="t-dir">{shortPath(nodes, rootId)}</span>{'\n'}{rows}</pre>
      <p className="t-muted">{ctx.d.term.treeCount(dirs, files)}</p>
    </>
  )
}

// ---------- ejecución ----------

export function runCommand(input, ctx) {
  const { t, d, isEn, lang, run, nodes, cwd } = ctx
  const [word, ...args] = tokenize(input)
  if (!word) return { output: null }
  const cmd = resolveCommand(word)
  const arg = args.join(' ')
  const T = d.term
  const at = (path) => resolvePath(nodes, cwd, path)

  if (!cmd) return lines(<p><Rich parts={T.unknown(word)} run={run} /></p>)

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
        </dl>,
        <p className="t-muted">{T.helpTab}</p>,
      )

    case 'whoami':
      return lines(<p>Daniel Aguayo <span className="t-muted">(dantrottel)</span> — {t.hero.role}, {t.hero.location}.</p>)

    case 'about':
      return lines(
        <p className="t-strong">{t.hero.tagline}</p>,
        <p>{t.hero.intro}</p>,
        <p className="t-muted">{T.openHint('open ~/Documentos/sobre-mi.md')}</p>,
      )

    case 'pwd':
      return lines(<p>{pathOf(nodes, cwd)}</p>)

    case 'cd': {
      if (!arg || arg === '~') return { output: null, cwd: HOME_ID }
      const id = at(arg)
      if (!id) return lines(err(T.notFound('cd', arg)))
      const dirId = resolveTarget(nodes, id)
      if (nodes[dirId]?.kind !== 'dir') return lines(err(T.notDir('cd', arg)))
      return { output: null, cwd: dirId }
    }

    case 'ls': {
      const { flags, rest } = splitFlags(args)
      const target = rest.join(' ')
      // Compatibilidad: "ls proyectos" sigue funcionando aunque la carpeta se llame Proyectos
      const id = target ? at(target) || (/^projects?\/?$/i.test(target) ? 'projects' : null) : cwd
      if (!id) return lines(err(T.notFound('ls', target)))
      const dirId = resolveTarget(nodes, id)
      const base = target || ''
      if (nodes[dirId]?.kind !== 'dir') {
        return lines(<p className="t-cols"><Entry nodes={nodes} node={nodes[id]} lang={lang} base="" run={run} /></p>)
      }
      const list = sortedChildren(nodes, dirId, { showHidden: flags.has('a') })
      if (!list.length) return lines(<p className="t-muted">{T.emptyDir}</p>)
      if (flags.has('l')) {
        return lines(
          <div className="t-ls-l">
            {list.map((n) => {
              const size = formatSize(sizeOf(nodes, resolveTarget(nodes, n.id) || n.id, lang), d.locale)
              return (
                <Fragment key={n.id}>
                  <span className="t-muted">{n.kind === 'dir' ? PERMS.dir : n.kind === 'link' ? PERMS.link : PERMS.file}</span>
                  <span className="t-muted t-size">{isDirLike(nodes, n) ? T.items(children(nodes, resolveTarget(nodes, n.id)).length) : size || '—'}</span>
                  <span>
                    <Entry nodes={nodes} node={n} lang={lang} base={base} run={run} />
                    {n.kind === 'link' && <span className="t-muted"> → {n.href || shortPath(nodes, n.target)}</span>}
                  </span>
                </Fragment>
              )
            })}
          </div>,
        )
      }
      return lines(<p className="t-cols">{list.map((n) => <Entry key={n.id} nodes={nodes} node={n} lang={lang} base={base} run={run} />)}</p>)
    }

    case 'tree': {
      const id = arg ? at(arg) : cwd
      const dirId = id && resolveTarget(nodes, id)
      if (!dirId) return lines(err(T.notFound('tree', arg)))
      if (nodes[dirId].kind !== 'dir') return lines(err(T.notDir('tree', arg)))
      return lines(<Tree nodes={nodes} rootId={dirId} ctx={ctx} />)
    }

    case 'cat': {
      if (!arg) return lines(<p><span className="t-key">{T.usage}</span> {cmd.usage}</p>)
      let id = at(arg)
      // `cat actitubb` (el nombre de un proyecto) imprime su README
      if (!id && findProject(arg)) id = `p:${findProject(arg).slug}/readme`
      if (!id || !nodes[id]) return lines(err(T.notFound('cat', arg)))
      const targetId = resolveTarget(nodes, id)
      const node = nodes[targetId]
      if (!node) return lines(err(T.notFound('cat', arg)))
      if (node.kind === 'dir') {
        if (node.project) {
          const readme = `${targetId}/readme`
          return lines(<pre className="t-pre">{nodes[readme].content(lang)}</pre>)
        }
        return lines(err(T.isDir('cat', arg)))
      }
      if (node.type === 'url') return lines(<p><ExternalLink href={node.href} t={t}>{node.href}</ExternalLink></p>)
      if (!node.content) return lines(err(T.binary(arg, `open ${escapeName(arg)}`)))
      return lines(<pre className="t-pre">{node.content(lang)}</pre>)
    }

    case 'open': {
      if (!arg) return lines(<p><span className="t-key">{T.usage}</span> {cmd.usage}</p>)
      const app = findApp(arg)
      if (app) {
        ctx.openApp(app)
        return lines(<p className="t-muted">{T.opened(d.apps[app] || d.panel.appNames[app] || arg)}</p>)
      }
      const project = findProject(arg)
      const id = at(arg) || (project ? `p:${project.slug}` : null)
      if (!id || !nodes[id]) return lines(err(T.notFound('open', arg)))
      ctx.openNode(id)
      return lines(<p className="t-muted">{T.opened(displayName(nodes[id], lang))}</p>)
    }

    case 'rm': {
      const { flags, rest } = splitFlags(args)
      if (!rest.length) return lines(<p><span className="t-key">{T.usage}</span> {cmd.usage}</p>)
      let next = nodes
      const out = []
      for (const path of rest) {
        const id = resolvePath(next, cwd, path)
        const node = next[id]
        if (!node) { out.push(err(T.notFound('rm', path))); continue }
        if (node.system) { out.push(err(T.protected('rm', path))); continue }
        if (isInTrash(next, id)) { out.push(err(T.alreadyTrash(path))); continue }
        if (node.kind === 'dir' && !flags.has('r')) { out.push(err(T.isDirRm(path))); continue }
        const result = moveToTrash(next, id)
        next = result.nodes
        out.push(<p>{T.trashed(node.name, `restore ${escapeName(next[id].name)}`)}</p>)
      }
      return { output: lines(...out).output, nodes: next !== nodes ? next : undefined }
    }

    case 'mkdir': {
      if (!arg) return lines(<p><span className="t-key">{T.usage}</span> {cmd.usage}</p>)
      const [parentPath, name] = parentAndName(arg)
      const parentId = parentPath ? at(parentPath) : cwd
      if (!parentId) return lines(err(T.notFound('mkdir', parentPath)))
      if (resolveTarget(nodes, parentId) === TRASH_ID) return lines(err(T.protected('mkdir', parentPath)))
      const result = makeDir(nodes, parentId, name)
      if (result.error === 'exists') return lines(err(T.exists('mkdir', arg)))
      if (result.error) return lines(err(T.invalid('mkdir', arg)))
      return { output: null, nodes: result.nodes }
    }

    case 'mv': {
      if (args.length !== 2) return lines(<p><span className="t-key">{T.usage}</span> {cmd.usage}</p>)
      const [from, to] = args
      const srcId = at(from)
      if (!srcId) return lines(err(T.notFound('mv', from)))
      const destId = at(to)
      let result
      if (destId && isDirLike(nodes, nodes[destId])) {
        result = move(nodes, srcId, destId)
      } else {
        const [parentPath, name] = parentAndName(to)
        const parentId = parentPath ? at(parentPath) : cwd
        if (!parentId) return lines(err(T.notFound('mv', parentPath)))
        result = move(nodes, srcId, parentId, name)
      }
      if (result.error === 'protected') return lines(err(T.protected('mv', from)))
      if (result.error === 'exists') return lines(err(T.exists('mv', to)))
      if (result.error === 'intoself') return lines(err(T.intoSelf(from)))
      if (result.error) return lines(err(T.invalid('mv', to)))
      return { output: null, nodes: result.nodes }
    }

    case 'trash': {
      const list = sortedChildren(nodes, TRASH_ID)
      if (!list.length) return lines(<p className="t-muted">{T.trashEmpty}</p>)
      return lines(
        <div className="t-ls-l t-ls-trash">
          {list.map((n) => (
            <Fragment key={n.id}>
              <Cmd run={run} cmd={`restore ${escapeName(n.name)}`} className={n.kind === 'dir' ? 't-dir' : undefined}>
                {n.name}{n.kind === 'dir' ? '/' : ''}
              </Cmd>
              <span className="t-muted">{T.from(shortPath(nodes, nodes[n.trashedFrom] ? n.trashedFrom : HOME_ID))}</span>
            </Fragment>
          ))}
        </div>,
        <p className="t-muted">{T.restoreHint}</p>,
      )
    }

    case 'restore': {
      if (!arg) return lines(<p><span className="t-key">{T.usage}</span> {cmd.usage}</p>)
      const node = findChild(nodes, TRASH_ID, arg.replace(/\/$/, ''))
      if (!node) return lines(err(T.notInTrash(arg)))
      const result = restore(nodes, node.id)
      return { output: lines(<p>{T.restored(node.name, shortPath(result.nodes, result.to))}</p>).output, nodes: result.nodes }
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
        </dl>,
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
        )),
      )

    case 'contact':
      return lines(
        <dl className="t-help">
          <div><dt className="t-key">{T.email}</dt><dd><a className="t-link" href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
          {PROFILES.map((p) => (
            <div key={p.label}><dt className="t-key">{p.label}</dt><dd><ExternalLink href={p.href} t={t}>{p.text}</ExternalLink></dd></div>
          ))}
        </dl>,
      )

    case 'cv':
      ctx.downloadCv()
      return lines(<p className="t-muted">{T.cv}</p>)

    case 'play': {
      const { player } = ctx
      if (!player.track) return lines(<p>{T.noTracks}</p>)
      player.play()
      return lines(<p>{T.playing(player.track.title, player.track.artist)}</p>)
    }

    case 'pause':
      if (!ctx.player.track) return lines(<p>{T.noTracks}</p>)
      ctx.player.pause()
      return lines(<p className="t-muted">{T.paused}</p>)

    case 'next':
    case 'prev': {
      const track = cmd.name === 'next' ? ctx.player.next() : ctx.player.prev()
      if (!track) return lines(<p>{T.noTracks}</p>)
      return lines(<p>{T.playing(track.title, track.artist)}</p>)
    }

    case 'theme': {
      const value = { claro: 'light', light: 'light', oscuro: 'dark', dark: 'dark' }[arg.toLowerCase()]
      if (!value) return lines(<p><span className="t-key">{T.usage}</span> {isEn ? 'theme light|dark' : cmd.usage}</p>)
      ctx.setTheme(value)
      return lines(<p className="t-muted">{T.themeSet(T.themeNames[value])}</p>)
    }

    case 'lang': {
      const value = arg.toLowerCase()
      if (value !== 'es' && value !== 'en') return lines(<p><span className="t-key">{T.usage}</span> {cmd.usage}</p>)
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
      return lines(<p className="t-muted">{T.simple}</p>)

    default:
      return lines(<p><Rich parts={T.unknown(word)} run={run} /></p>)
  }
}

// ---------- autocompletado ----------

const fold = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function commonPrefix(words) {
  if (!words.length) return ''
  let prefix = words[0]
  for (const w of words) {
    while (!fold(w).startsWith(fold(prefix))) prefix = prefix.slice(0, -1)
  }
  return prefix
}

// La última palabra, sin las barras de escape, y dónde empieza en la línea
function lastToken(input) {
  let i = input.length
  while (i > 0 && !(/\s/.test(input[i - 1]) && input[i - 2] !== '\\')) i--
  return { start: i, raw: input.slice(i), value: input.slice(i).replace(/\\(.)/g, '$1') }
}

// Completa comandos, rutas (relativas a la carpeta actual) y opciones fijas.
// Devuelve el texto completado y, si hay varias opciones, la lista para mostrarla.
export function complete(input, { nodes, cwd }) {
  const words = tokenize(input)
  const endsWithSpace = /\s$/.test(input) && !/\\\s$/.test(input)
  const { start, value } = lastToken(input)
  const before = input.slice(0, start)

  if (words.length <= 1 && !endsWithSpace) {
    const word = fold(value)
    const options = [...new Set(COMMANDS.flatMap((c) => [c.name, ...c.aliases]))].filter((n) => n.startsWith(word))
    if (options.length === 1) return { value: `${options[0]} `, options: [] }
    return { value: commonPrefix(options) || input, options }
  }

  const cmd = resolveCommand(words[0])
  if (!cmd) return { value: input, options: [] }

  // Restaurar: nombres de la papelera
  if (cmd.path === 'trash') {
    const names = sortedChildren(nodes, TRASH_ID).map((n) => n.name).filter((n) => fold(n).startsWith(fold(value)))
    if (names.length === 1) return { value: `${before}${escapeName(names[0])}`, options: [] }
    const prefix = commonPrefix(names)
    return { value: `${before}${escapeName(prefix || value)}`, options: names.length > 1 ? names : [] }
  }

  const fixed = (cmd.args?.() || []).filter((o) => fold(o).startsWith(fold(value)))
  let candidates = fixed.map((o) => ({ text: o, label: o, final: true }))

  if (cmd.path) {
    const cut = value.lastIndexOf('/')
    const dirPart = cut === -1 ? '' : value.slice(0, cut + 1)
    const prefix = cut === -1 ? value : value.slice(cut + 1)
    const dirId = dirPart ? resolvePath(nodes, cwd, dirPart) : cwd
    const realDir = dirId && resolveTarget(nodes, dirId)
    if (realDir && nodes[realDir].kind === 'dir') {
      const entries = sortedChildren(nodes, realDir, { showHidden: prefix.startsWith('.') })
        .filter((n) => (cmd.path === 'dir' ? isDirLike(nodes, n) : true))
        .filter((n) => fold(n.name).startsWith(fold(prefix)))
      candidates = [
        ...entries.map((n) => {
          const dir = isDirLike(nodes, n)
          return { text: `${dirPart}${n.name}${dir ? '/' : ''}`, label: `${n.name}${dir ? '/' : ''}`, final: !dir }
        }),
        ...candidates.filter((c) => !entries.some((e) => fold(e.name) === fold(c.text))),
      ]
    }
  }

  if (!candidates.length) return { value: input, options: [] }
  if (candidates.length === 1) {
    const [only] = candidates
    return { value: `${before}${escapeName(only.text)}${only.final ? ' ' : ''}`, options: [] }
  }
  const prefix = commonPrefix(candidates.map((c) => c.text))
  return { value: `${before}${escapeName(prefix.length > value.length ? prefix : value)}`, options: candidates.map((c) => c.label) }
}

// Lista clickeable: cada fila ejecuta el comando en la terminal, para quien no quiere escribir
export function commandExamples({ isEn, theme, lang }) {
  return [
    ['help', 'help'],
    ['whoami', 'whoami'],
    ['ls', 'ls'],
    ['ls -l ~/Proyectos', 'ls'],
    ['cd ~/Proyectos', 'cd'],
    ['tree ~/Proyectos', 'tree'],
    ['cat ~/Proyectos/actitubb/README.md', 'cat'],
    ['cat ~/contacto.txt', 'cat'],
    ['open ~/Documentos/CV.pdf', 'open'],
    ['pwd', 'pwd'],
    ['trash', 'trash'],
    [isEn ? 'about' : 'acerca', 'about'],
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
