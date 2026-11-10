import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore } from 'react'
import {
  FiTerminal, FiFolder, FiFile, FiMusic, FiList, FiFileText, FiSun, FiMoon, FiArrowLeft, FiArrowRight, FiSliders,
} from 'react-icons/fi'
import { STRINGS } from '../i18n'
import { tracks } from '../data/tracks'
import { DESKTOP_STRINGS } from './strings'
import { APP_IDS, runCommand, commandExamples, complete } from './commands'
import { visibleProjects, pick } from './projects'
import { usePlayer } from './usePlayer'
import { Rich } from './TermParts'
import Window, { TOP_BAR } from './Window'
import Terminal from './apps/Terminal'
import Files from './apps/Files'
import Editor from './apps/Editor'
import Viewer from './apps/Viewer'
import Music from './apps/Music'
import Commands from './apps/Commands'
import DesktopIcons from './DesktopIcons'
import Menu from './Menu'
import Panel from './Panel'
import Dialog from './Dialog'
import Properties from './Properties'
import Settings from './apps/Settings'
import { WALLPAPERS } from './wallpapers'
import {
  loadFs, saveFs, resetFs, sortedChildren, children, resolveTarget, rename, move as moveNode, isDirLike, displayName,
  moveToTrash, emptyTrash, makeDir, newFolderName, shortPath, restore, resolvePath, isInTrash, DESKTOP_ID, TRASH_ID, HOME_ID,
} from './fsOps'
import {
  CELL_W, ICONS_RIGHT, gridRows, layoutIcons, moveIcons, columnsUsed, loadIconPositions, saveIconPositions, clearIconPositions,
} from './iconLayout'

const base = import.meta.env.BASE_URL
const SIMPLE_URL = `${base}simple/`

const APPS = {
  terminal: { Icon: FiTerminal, w: 560, h: 420 },
  files: { Icon: FiFolder, w: 820, h: 580 },
  editor: { Icon: FiFileText, w: 660, h: 580 },
  viewer: { Icon: FiFile, w: 720, h: 600 },
  music: { Icon: FiMusic, w: 380, h: 470 },
  commands: { Icon: FiList, w: 380, h: 540 },
  settings: { Icon: FiSliders, w: 520, h: 560 },
}

// Espacio que dejan libre la barra superior y el lanzador
const EDGE = 24
const AREA_TOP = TOP_BAR + 12
const LAUNCHER_SPACE = 96
const LEAVE_MS = 140

// Las ventanas de documentos se llaman "editor:<id>" y "viewer:<id>": una por archivo
const appKind = (id) => id.split(':')[0]

// Nombres viejos que siguen funcionando (comandos, grilla del celular): ahora son archivos
const ALIASES = { about: 'editor:doc-about', skills: 'editor:doc-skills', contact: 'editor:contact', projects: 'files' }

// Favoritas del lanzador
const DOCK_APPS = ['terminal', 'files', 'music', 'commands', 'settings']

// ---------- utilidades ----------

function readStorage(key) {
  try { return localStorage.getItem(key) } catch { return null }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, value) } catch { /* almacenamiento no disponible */ }
}

function initialLang() {
  const saved = readStorage('lang')
  if (saved === 'es' || saved === 'en') return saved
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

const MOBILE_QUERY = '(max-width: 767.98px)'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

function useMedia(query) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
  )
}

function area() {
  return { vw: window.innerWidth, vh: window.innerHeight, bottom: window.innerHeight - LAUNCHER_SPACE }
}

function clampRect(rect) {
  const { vw, bottom } = area()
  const w = Math.min(rect.w, vw - EDGE * 2)
  const h = Math.min(rect.h, bottom - AREA_TOP)
  const x = Math.min(Math.max(rect.x, EDGE), vw - EDGE - w)
  const y = Math.min(Math.max(rect.y, AREA_TOP), bottom - h)
  return { x, y, w, h }
}

// Ancho que ocupan los íconos del escritorio a la derecha (las ventanas iniciales no los tapan)
function iconsReserve(nodes) {
  const ids = sortedChildren(nodes, DESKTOP_ID, { byOrder: true }).map((n) => n.id)
  const layout = layoutIcons(ids, loadIconPositions(), gridRows(window.innerHeight))
  return columnsUsed(layout) * CELL_W + ICONS_RIGHT
}

// Al cargar: terminal y Proyectos en el espacio que dejan libre los íconos, sin taparse entre ellas
function initialWindows(reserve) {
  const { vw, vh, bottom } = area()
  const right = vw - reserve - 16
  const width = right - EDGE
  const height = bottom - AREA_TOP
  if (width >= 760) {
    const tw = Math.min(440, Math.max(300, Math.round(width * 0.38)))
    return {
      terminal: { x: EDGE, y: AREA_TOP, w: tw, h: Math.min(420, height) },
      projects: { x: EDGE + tw + 16, y: AREA_TOP, w: width - tw - 16, h: height },
    }
  }
  if (vh >= 820 && width >= 420) {
    const th = 260
    return {
      terminal: { x: EDGE, y: AREA_TOP, w: width, h: th },
      projects: { x: EDGE, y: AREA_TOP + th + 12, w: width, h: height - th - 12 },
    }
  }
  const pw = Math.min(680, vw - EDGE * 2)
  return {
    terminal: clampRect({ x: EDGE, y: AREA_TOP, w: 520, h: 380 }),
    projects: clampRect({ x: vw - EDGE - pw, y: AREA_TOP + 72, w: pw, h: height - 72 }),
  }
}

function cascadeRect(id, count) {
  const { vw, bottom } = area()
  const { w, h } = APPS[appKind(id)]
  const offset = (count % 5) * 28
  return clampRect({ x: (vw - w) / 2 + offset - 56, y: AREA_TOP + 24 + offset, w, h: Math.min(h, bottom - AREA_TOP - 24) })
}

// ---------- gestor de ventanas ----------

function raise(order, id) {
  return [...order.filter((x) => x !== id), id]
}

function wmReducer(wm, action) {
  const { id } = action
  const win = wm.wins[id]
  switch (action.type) {
    case 'open': {
      const next = win
        ? { ...win, state: 'open' }
        : { rect: action.rect, state: 'open', maximized: false, focusToken: 0 }
      if (action.focus) next.focusToken = (win?.focusToken || 0) + 1
      return { wins: { ...wm.wins, [id]: next }, order: raise(wm.order, id) }
    }
    case 'activate':
      if (!win || wm.order[wm.order.length - 1] === id) return wm
      return { ...wm, order: raise(wm.order, id) }
    case 'move':
      return { ...wm, wins: { ...wm.wins, [id]: { ...win, rect: { ...win.rect, x: action.x, y: action.y } } } }
    case 'maximize':
      return { ...wm, wins: { ...wm.wins, [id]: { ...win, maximized: !win.maximized } } }
    case 'leave':
      if (!win || win.state !== 'open') return wm
      return { ...wm, wins: { ...wm.wins, [id]: { ...win, state: action.kind } } }
    case 'finish': {
      if (!win) return wm
      if (win.state === 'closing') {
        const wins = { ...wm.wins }
        delete wins[id]
        return { wins, order: wm.order.filter((x) => x !== id) }
      }
      if (win.state === 'minimizing') return { ...wm, wins: { ...wm.wins, [id]: { ...win, state: 'minimized' } } }
      return wm
    }
    case 'clamp': {
      const wins = {}
      for (const [key, value] of Object.entries(wm.wins)) wins[key] = { ...value, rect: clampRect(value.rect) }
      return { ...wm, wins }
    }
    default:
      return wm
  }
}

function initialWm() {
  if (window.matchMedia(MOBILE_QUERY).matches) return { wins: {}, order: [] }
  const rects = initialWindows(iconsReserve(loadFs()))
  return {
    wins: {
      terminal: { rect: rects.terminal, state: 'open', maximized: false, focusToken: 1 },
      files: { rect: rects.projects, state: 'open', maximized: false, focusToken: 0 },
    },
    order: ['files', 'terminal'],
  }
}

// ---------- piezas de la interfaz ----------

function useViewport() {
  const [size, setSize] = useState(() => ({ vw: window.innerWidth, vh: window.innerHeight }))
  useEffect(() => {
    const onResize = () => setSize({ vw: window.innerWidth, vh: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let interval
    // Se alinea al cambio de minuto y desde ahí avanza cada 60 s
    const timeout = setTimeout(() => {
      setNow(new Date())
      interval = setInterval(() => setNow(new Date()), 60000)
    }, 60000 - (Date.now() % 60000))
    return () => { clearTimeout(timeout); clearInterval(interval) }
  }, [])
  return now
}

function Clock({ d, compact }) {
  const now = useNow()
  const date = new Intl.DateTimeFormat(d.locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(now)
  const time = new Intl.DateTimeFormat(d.locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now)
  return (
    <time className="clock" dateTime={now.toISOString()}>
      {!compact && <span className="clock-date">{date.replace(/\./g, '')}</span>}
      <span className="clock-time">{time}</span>
    </time>
  )
}

function SystemControls({ t, d, lang, setLang, theme, setTheme }) {
  return (
    <>
      <div className="lang-switch" role="group" aria-label={t.nav.language}>
        {['es', 'en'].map((code) => (
          <button key={code} type="button" aria-pressed={lang === code} onClick={() => setLang(code)}>
            {code.toUpperCase()}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="bar-btn"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={theme === 'dark' ? t.nav.toLight : t.nav.toDark}
        title={theme === 'dark' ? t.nav.toLight : t.nav.toDark}
      >
        {theme === 'dark' ? <FiSun size={15} aria-hidden="true" /> : <FiMoon size={15} aria-hidden="true" />}
      </button>
      <span className="bar-sep" aria-hidden="true" />
      <Clock d={d} />
    </>
  )
}

function Brand() {
  return <span className="brand">dantrottel<span className="brand-cursor">_</span></span>
}

// ---------- app ----------

export default function DesktopApp() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [lang, setLang] = useState(initialLang)
  const t = STRINGS[lang]
  const d = DESKTOP_STRINGS[lang]
  const isEn = lang === 'en'

  const isMobile = useMedia(MOBILE_QUERY)
  const reducedMotion = useMedia(REDUCED_QUERY)
  const [wm, dispatch] = useReducer(wmReducer, undefined, initialWm)
  const wmRef = useRef(wm)
  const [mobileView, setMobileView] = useState(null)
  // Archivos: historial de navegación, selección y vista. Al cargar: ~/Proyectos con AcTitUBB seleccionado
  const [fm, setFm] = useState(() => ({
    history: ['projects'],
    index: 0,
    selection: visibleProjects[0] ? [`p:${visibleProjects[0].slug}`] : [],
    view: 'icons',
  }))
  const player = usePlayer(tracks)
  const { vw, vh } = useViewport()

  // ----- sistema de archivos y escritorio -----
  const [nodes, setNodes] = useState(loadFs)
  const [iconPos, setIconPos] = useState(loadIconPositions)
  const [selection, setSelection] = useState([])
  const [renaming, setRenaming] = useState(null)
  const [menu, setMenu] = useState(null)
  const [dialog, setDialog] = useState(null)
  const [toast, setToast] = useState(null)
  const [termCwd, setTermCwd] = useState(HOME_ID)
  const [wallpaper, setWallpaper] = useState(() => {
    const saved = readStorage('wallpaper')
    return WALLPAPERS.includes(saved) ? saved : 'dots'
  })

  useEffect(() => { writeStorage('wallpaper', wallpaper) }, [wallpaper])

  // Avisos breves (role="status"): se borran solos
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(id)
  }, [toast])
  const notify = useCallback((text) => setToast({ text, key: Date.now() }), [])

  useEffect(() => { saveFs(nodes) }, [nodes])
  useEffect(() => { saveIconPositions(iconPos) }, [iconPos])

  const desktopIds = sortedChildren(nodes, DESKTOP_ID, { byOrder: true }).map((n) => n.id)
  const fmCwd = nodes[fm.history[fm.index]] && !nodes[fm.history[fm.index]].content ? fm.history[fm.index] : HOME_ID
  const rows = gridRows(vh)
  const iconLayout = layoutIcons(desktopIds, iconPos, rows)

  const [lines, setLines] = useState([{ id: 0, kind: 'welcome' }])
  const [history, setHistory] = useState([])
  const lineId = useRef(1)

  useLayoutEffect(() => { wmRef.current = wm }, [wm])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    writeStorage('theme', theme)
    const bar = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute('content', bar))
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
    writeStorage('lang', lang)
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [lang, t])

  // Al cambiar el tamaño, ninguna ventana queda fuera de la pantalla
  useEffect(() => {
    if (isMobile) return
    const onResize = () => dispatch({ type: 'clamp' })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isMobile])

  // ----- ventanas -----

  const navigateFm = useCallback((dirId, select = []) => {
    setFm((f) => (f.history[f.index] === dirId
      ? { ...f, selection: select }
      : { ...f, history: [...f.history.slice(0, f.index + 1), dirId], index: f.index + 1, selection: select }))
  }, [])

  const openApp = useCallback((rawId, { focus = true } = {}) => {
    // "Proyectos" ya no es una ventana propia: es Archivos en ~/Proyectos
    if (rawId === 'projects') navigateFm('projects')
    const id = ALIASES[rawId] || rawId
    if (window.matchMedia(MOBILE_QUERY).matches) {
      setMobileView(id)
      return
    }
    const current = wmRef.current
    dispatch({ type: 'open', id, focus, rect: current.wins[id] ? undefined : cascadeRect(id, current.order.length) })
  }, [navigateFm])

  // Al cerrar o minimizar, el foco pasa a la ventana de arriba o, si no queda ninguna, al ícono del lanzador
  const leave = useCallback((id, kind, instant = false) => {
    const { wins, order } = wmRef.current
    if (wins[id]?.state !== 'open') return
    dispatch({ type: 'leave', id, kind })
    const nextTop = [...order].reverse().find((x) => x !== id && wins[x].state === 'open')
    const target = nextTop
      ? document.querySelector(`[aria-labelledby="win-${nextTop}-title"]`)
      : document.querySelector(`[data-launch="${id}"]`)
    target?.focus({ preventScroll: true })
    if (instant || reducedMotion) dispatch({ type: 'finish', id })
    else setTimeout(() => dispatch({ type: 'finish', id }), LEAVE_MS)
  }, [reducedMotion])

  const closeApp = useCallback((id, { instant } = {}) => leave(id, 'closing', instant), [leave])
  const minimizeApp = useCallback((id) => leave(id, 'minimizing'), [leave])
  const activate = useCallback((id) => dispatch({ type: 'activate', id }), [])
  const move = useCallback((id, x, y) => dispatch({ type: 'move', id, x, y }), [])
  const maximize = useCallback((id) => dispatch({ type: 'maximize', id }), [])

  const openProject = useCallback((slug) => {
    navigateFm(`p:${slug}`)
    openApp('files')
  }, [openApp, navigateFm])

  // Abrir un nodo del árbol: carpetas, documentos, enlaces y la terminal
  const openNode = useCallback((id) => {
    const node = nodes[id]
    if (!node) return
    if (node.type === 'app') return openApp(node.app)
    const targetId = resolveTarget(nodes, id)
    const target = nodes[targetId]
    if (!target) return
    if (target.type === 'url') return window.open(target.href, '_blank', 'noopener')
    if (target.type === 'pdf') return openApp(`viewer:${targetId}`)
    // Si ya se está navegando dentro de Archivos, el foco se queda donde está
    const fromFiles = !!document.activeElement?.closest('.fm')
    if (target.kind === 'dir') {
      navigateFm(targetId)
      return openApp('files', { focus: !fromFiles })
    }
    if (target.type === 'audio') {
      player.select(target.track)
      return openApp('music')
    }
    // Documentos de texto: una ventana del editor por archivo
    openApp(`editor:${targetId}`)
  }, [nodes, openApp, navigateFm, player])

  // Ruta escrita en la barra de Archivos: relativa a la carpeta actual o a la personal
  const openPath = useCallback((value) => {
    const path = value.trim()
    if (!path) return
    const id = resolvePath(nodes, fmCwd, path) || resolvePath(nodes, HOME_ID, path)
    if (id) openNode(id)
    else notify(d.files.notFound(path))
  }, [nodes, fmCwd, openNode, notify, d])

  const restoreIds = useCallback((ids) => {
    let next = nodes
    let last = null
    for (const id of ids) {
      const result = restore(next, id)
      if (result.nodes) { next = result.nodes; last = [id, result.to] }
    }
    if (!last) return
    setNodes(next)
    setFm((f) => ({ ...f, selection: [] }))
    notify(ids.length === 1 ? d.toast.restored(displayName(next[last[0]], lang), shortPath(next, last[1])) : d.toast.restored(String(ids.length), shortPath(next, last[1])))
  }, [nodes, d, lang, notify])

  // Papelera: nunca borra, mueve. Las carpetas del sistema se quedan donde están y se avisa.
  const trashIds = useCallback((ids) => {
    let next = nodes
    const moved = []
    let blocked = 0
    for (const id of ids) {
      const result = moveToTrash(next, id)
      if (result.nodes) { next = result.nodes; moved.push(id) } else if (result.error === 'protected') blocked++
    }
    if (moved.length) {
      setNodes(next)
      setSelection((s) => s.filter((x) => !moved.includes(x)))
    }
    const parts = []
    if (moved.length) parts.push(d.toast.trashed(moved.length, displayName(nodes[moved[0]], lang)))
    if (blocked) parts.push(d.toast.protected)
    if (parts.length) notify(parts.join(' '))
  }, [nodes, d, lang, notify])

  const moveIntoFolder = useCallback((ids, folderId) => {
    const dirId = resolveTarget(nodes, folderId)
    if (!dirId) return
    if (dirId === TRASH_ID) return trashIds(ids)
    let next = nodes
    let moved = 0
    let error = null
    for (const id of ids) {
      const result = moveNode(next, id, dirId)
      if (result.nodes) { next = result.nodes; moved++ } else error = error || [result.error, id]
    }
    setNodes(next)
    setSelection([])
    if (error?.[0] === 'protected') notify(d.toast.protected)
    else if (error?.[0] === 'exists') notify(d.toast.exists(displayName(nodes[error[1]], lang)))
    else if (error?.[0] === 'intoself') notify(d.toast.intoself)
    else if (moved) notify(d.toast.moved(moved, shortPath(next, dirId)))
  }, [nodes, d, lang, notify, trashIds])

  const renameNode = useCallback((id, value) => {
    setRenaming(null)
    if (value === null) return
    const result = rename(nodes, id, value)
    if (result.nodes) setNodes(result.nodes)
    else if (result.error === 'exists') notify(d.toast.exists(value.trim()))
    else if (result.error === 'invalid') notify(d.toast.invalid)
    else if (result.error === 'protected') notify(d.toast.renameProtected)
  }, [nodes, d, notify])

  const startRename = useCallback((id) => {
    if (nodes[id]?.system) notify(d.toast.renameProtected)
    else setRenaming(id)
  }, [nodes, d, notify])

  const newFolder = useCallback((parentId = DESKTOP_ID) => {
    const result = makeDir(nodes, parentId, newFolderName(nodes, parentId, d.newFolder))
    if (!result.nodes) return
    setNodes(result.nodes)
    setSelection([result.id])
    setFm((f) => ({ ...f, selection: [result.id] }))
    setRenaming(result.id)
  }, [nodes, d])

  // "Abrir terminal aquí" / "Abrir en terminal": la terminal queda en esa carpeta (o en la de ese archivo)
  const openTerminalAt = useCallback((id) => {
    const targetId = resolveTarget(nodes, id) || HOME_ID
    const dir = nodes[targetId]?.kind === 'dir' ? targetId : nodes[targetId]?.parent || HOME_ID
    setTermCwd(dir)
    openApp('terminal')
  }, [nodes, openApp])

  const resetDesktop = useCallback(() => {
    setNodes(resetFs())
    clearIconPositions()
    setIconPos({})
    setWallpaper('dots')
    setSelection([])
    notify(d.toast.reset)
  }, [d, notify])

  const trashCount = children(nodes, TRASH_ID).length

  // Lanzador de "Aplicaciones" del panel
  const launchApp = useCallback((id) => {
    if (id === 'simple') window.location.href = SIMPLE_URL
    else if (id === 'files') { navigateFm(HOME_ID); openApp('files') }
    else if (id === 'editor') openApp('editor:')
    else if (id === 'viewer') openApp('viewer:doc-cv')
    else openApp(id)
  }, [openApp, navigateFm])

  // Menús contextuales: fondo (del escritorio o de una carpeta en Archivos), ícono o papelera
  const openContextMenu = useCallback(({ id, x, y, returnFocus, dir }) => {
    const sheet = window.matchMedia(MOBILE_QUERY).matches
    if (!id && dir) {
      setMenu({
        x, y, returnFocus, sheet, label: displayName(nodes[dir], lang),
        items: dir === TRASH_ID
          ? [{ label: d.menu.emptyTrash, disabled: !trashCount, onSelect: () => setDialog({ kind: 'empty' }) }]
          : [
              { label: d.menu.newFolder, onSelect: () => newFolder(dir) },
              { label: d.menu.openTerminalHere, onSelect: () => openTerminalAt(dir) },
            ],
      })
      return
    }
    if (!id) {
      setMenu({
        x, y, returnFocus, label: d.menu.desktop,
        items: [
          { label: d.menu.openTerminalHere, onSelect: () => openTerminalAt(DESKTOP_ID) },
          { label: d.menu.newFolder, onSelect: () => newFolder(DESKTOP_ID) },
          { label: d.menu.arrange, onSelect: () => setIconPos({}) },
          { separator: true },
          { label: d.menu.wallpaper, onSelect: () => openApp('settings') },
          { label: d.menu.simple, onSelect: () => { window.location.href = SIMPLE_URL } },
          { separator: true },
          { label: d.menu.reset, onSelect: () => setDialog({ kind: 'reset' }) },
        ],
      })
      return
    }
    const node = nodes[id]
    const pool = dir ? fm.selection : selection
    const group = pool.includes(id) && pool.length > 1 ? pool : [id]
    const name = displayName(node, lang)
    if (isInTrash(nodes, id)) {
      setMenu({
        x, y, returnFocus, sheet, label: name,
        items: [
          { label: d.menu.open, onSelect: () => openNode(id) },
          { label: d.menu.restore, disabled: node.parent !== TRASH_ID, onSelect: () => restoreIds(group.filter((g) => nodes[g].parent === TRASH_ID)) },
          { separator: true },
          { label: d.menu.properties, onSelect: () => setDialog({ kind: 'props', id }) },
        ],
      })
      return
    }
    if (resolveTarget(nodes, id) === TRASH_ID) {
      setMenu({
        x, y, returnFocus, sheet, label: name,
        items: [
          { label: d.menu.open, onSelect: () => openNode(id) },
          { label: d.menu.emptyTrash, disabled: !trashCount, onSelect: () => setDialog({ kind: 'empty' }) },
        ],
      })
      return
    }
    setMenu({
      x, y, returnFocus, sheet, label: name,
      items: [
        { label: d.menu.open, hint: 'Enter', onSelect: () => group.forEach(openNode) },
        { label: d.menu.openTerminal, onSelect: () => openTerminalAt(id) },
        { separator: true },
        { label: d.menu.rename, hint: 'F2', disabled: node.system || group.length > 1, onSelect: () => startRename(id) },
        { label: d.menu.trash, hint: d.locale.startsWith('es') ? 'Supr' : 'Del', disabled: group.every((g) => nodes[g].system), onSelect: () => trashIds(group) },
        { separator: true },
        { label: d.menu.properties, onSelect: () => setDialog({ kind: 'props', id }) },
      ],
    })
  }, [nodes, selection, fm.selection, lang, d, trashCount, openNode, openTerminalAt, newFolder, openApp, startRename, trashIds, restoreIds])

  // Shift+F10 o la tecla de menú con el foco en el fondo abren el menú del escritorio
  useEffect(() => {
    if (isMobile) return
    const onKey = (e) => {
      if (!((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu')) return
      const el = document.activeElement
      if (el && el !== document.body && !el.classList.contains('icons-bg')) return
      e.preventDefault()
      openContextMenu({ id: null, x: window.innerWidth / 2, y: window.innerHeight / 2, returnFocus: null })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMobile, openContextMenu])

  // F6 / Shift+F6 recorren las ventanas abiertas
  useEffect(() => {
    if (isMobile) return
    const onKey = (e) => {
      if (e.key !== 'F6') return
      const { wins, order } = wmRef.current
      const visible = order.filter((id) => wins[id].state === 'open')
      if (!visible.length) return
      e.preventDefault()
      const current = visible.findIndex((id) => document.querySelector(`[aria-labelledby="win-${id}-title"]`)?.contains(document.activeElement))
      const nextIndex = current === -1
        ? visible.length - 1
        : (current + (e.shiftKey ? -1 : 1) + visible.length) % visible.length
      document.querySelector(`[aria-labelledby="win-${visible[nextIndex]}-title"]`)?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMobile])

  // ----- terminal -----

  const ctxRef = useRef(null)
  const termPrompt = `daniel@dantrottel:${shortPath(nodes, nodes[termCwd] ? termCwd : HOME_ID)}$`

  const append = useCallback((line) => {
    setLines((prev) => [...prev, { id: lineId.current++, ...line }])
  }, [])

  const print = useCallback((node) => append({ output: node }), [append])

  const run = useCallback((raw, { reveal = false } = {}) => {
    const input = raw.trim()
    if (reveal) {
      const term = wmRef.current.wins.terminal
      if (window.matchMedia(MOBILE_QUERY).matches) setMobileView('terminal')
      else if (!term || term.state !== 'open') openApp('terminal', { focus: false })
    }
    if (!input) {
      append({ input: '' })
      return
    }
    setHistory((h) => [...h, input])
    const ctx = ctxRef.current
    const result = runCommand(input, ctx)
    // Los comandos del sistema de archivos devuelven el árbol nuevo o la carpeta nueva
    if (result.nodes) setNodes(result.nodes)
    if (result.cwd) setTermCwd(result.cwd)
    if (result.clear) setLines([])
    else append({ input, output: result.output, prompt: ctx.prompt })
  }, [append, openApp])

  const runFromPanel = useCallback((cmd) => run(cmd, { reveal: true }), [run])

  useLayoutEffect(() => {
    ctxRef.current = {
      t, d, isEn, lang, theme, player, strings: DESKTOP_STRINGS,
      nodes, cwd: nodes[termCwd] ? termCwd : HOME_ID, prompt: termPrompt, openNode,
      run: (cmd) => run(cmd),
      openApp, openProject, setTheme, setLang,
      downloadCv: () => {
        const a = document.createElement('a')
        a.href = `${base}CV.pdf`
        a.download = 'Daniel_Aguayo_CV.pdf'
        a.click()
      },
      goSimple: () => { window.location.href = SIMPLE_URL },
    }
  }, [t, d, isEn, lang, theme, player, openApp, openProject, run, termCwd, nodes, termPrompt, openNode])

  const shownLines = useMemo(() => lines.map((line) => (
    line.kind === 'welcome'
      ? {
          ...line,
          output: (
            <>
              <p className="t-strong">{d.term.welcome}</p>
              <p><Rich parts={d.term.hint} run={(cmd) => run(cmd)} /></p>
            </>
          ),
        }
      : line
  )), [lines, d, run])

  const examples = commandExamples({ isEn, theme, lang })

  // Título y ruta de cada ventana: las de documentos llevan el nombre y la ruta del archivo
  const windowTitle = (id) => {
    const [kind, fileId] = id.split(':')
    if ((kind === 'editor' || kind === 'viewer') && nodes[fileId]) return displayName(nodes[fileId], lang)
    return kind === 'editor' ? d.panel.appNames.editor : kind === 'viewer' ? d.panel.appNames.viewer : d.apps[kind]
  }
  const windowPath = (id) => {
    const [kind, fileId] = id.split(':')
    if (kind === 'files') return shortPath(nodes, fmCwd)
    if (nodes[fileId]) return shortPath(nodes, fileId)
    return d.paths[kind] || ''
  }

  const renderApp = (rawId, mobile = false) => {
    const id = ALIASES[rawId] || rawId
    const [kind, fileId] = id.split(':')
    if (kind === 'editor') {
      return <Editor nodes={nodes} fileId={fileId} lang={lang} t={t} d={d} onOpen={(docId) => openApp(`editor:${docId}`)} />
    }
    if (kind === 'viewer') return <Viewer node={nodes[fileId]} d={d} mobile={mobile} />
    switch (id) {
      case 'terminal':
        return (
          <Terminal
            d={d}
            lines={shownLines}
            history={history}
            onRun={run}
            onPrint={print}
            onComplete={(value) => complete(value, { nodes, cwd: nodes[termCwd] ? termCwd : HOME_ID })}
            prompt={termPrompt}
            chips={mobile ? examples.slice(0, 12).map(([cmd]) => cmd) : undefined}
          />
        )
      case 'files':
      case 'projects':
        return (
          <Files
            nodes={nodes} lang={lang} t={t} d={d}
            cwd={fmCwd}
            canBack={fm.index > 0}
            canForward={fm.index < fm.history.length - 1}
            onBack={() => setFm((f) => ({ ...f, index: Math.max(0, f.index - 1), selection: [] }))}
            onForward={() => setFm((f) => ({ ...f, index: Math.min(f.history.length - 1, f.index + 1), selection: [] }))}
            onNavigate={(dirId) => navigateFm(dirId)}
            onOpen={openNode}
            onOpenPath={openPath}
            selection={fm.selection}
            setSelection={(sel) => setFm((f) => ({ ...f, selection: sel }))}
            view={fm.view}
            setView={(view) => setFm((f) => ({ ...f, view }))}
            renaming={renaming}
            onRename={renameNode}
            onStartRename={startRename}
            onTrash={trashIds}
            onRestore={restoreIds}
            onEmptyTrash={() => setDialog({ kind: 'empty' })}
            onContextMenu={openContextMenu}
            onDropInto={moveIntoFolder}
            mobile={mobile}
          />
        )
      case 'music':
        return <Music d={d} player={player} />
      case 'commands':
        return <Commands d={d} examples={examples} onRun={runFromPanel} />
      case 'settings':
        return (
          <Settings
            d={d} t={t}
            wallpaper={wallpaper} setWallpaper={setWallpaper}
            theme={theme} setTheme={setTheme}
            lang={lang} setLang={setLang}
            onReset={() => setDialog({ kind: 'reset' })}
          />
        )
      default:
        return null
    }
  }

  const controls = { t, d, lang, setLang, theme, setTheme }

  return (
    <>
      {/* Un solo <audio> para todo el escritorio; preload="none": no descarga nada hasta el primer play */}
      <audio {...player.audioProps} />

      {isMobile ? (
        <MobileShell
          t={t} d={d} isEn={isEn} controls={controls} view={mobileView} setView={setMobileView}
          renderApp={renderApp} openProject={openProject} windowTitle={windowTitle}
        />
      ) : (
        <div className="desk" data-wallpaper={wallpaper}>
          <Panel
            t={t} d={d}
            lang={lang} setLang={setLang}
            theme={theme} setTheme={setTheme}
            player={player}
            onLaunch={launchApp}
            onUserAction={(action) => {
              if (action === 'contact') openNode('contact')
              else if (action === 'cv') ctxRef.current.downloadCv()
              else window.location.href = SIMPLE_URL
            }}
          />

          <main className="desk-surface" aria-label={d.windows}>
            <h1 className="desk-label">
              <span className="desk-label-name">Daniel Aguayo</span>
              <span className="desk-label-role">{t.hero.role} · {t.hero.location}</span>
            </h1>

            <DesktopIcons
              nodes={nodes}
              lang={lang}
              d={d}
              ids={desktopIds}
              layout={iconLayout}
              vw={vw}
              selection={selection.filter((id) => desktopIds.includes(id))}
              setSelection={setSelection}
              renaming={renaming}
              onRename={renameNode}
              onOpen={(ids) => ids.forEach(openNode)}
              onDelete={trashIds}
              onStartRename={startRename}
              onMove={(ids, dCol, dRow) => setIconPos(moveIcons(iconLayout, ids, dCol, dRow, rows))}
              onDropInto={(ids, targetId) => { if (isDirLike(nodes, nodes[targetId])) moveIntoFolder(ids, targetId) }}
              onContextMenu={openContextMenu}
            />

            {Object.entries(wm.wins).map(([id, win]) => (
              <Window
                key={id}
                id={id}
                d={d}
                title={windowTitle(id)}
                path={windowPath(id)}
                rect={win.rect}
                z={10 + wm.order.indexOf(id)}
                state={win.state}
                maximized={win.maximized}
                focusToken={win.focusToken}
                onActivate={activate}
                onClose={closeApp}
                onMinimize={minimizeApp}
                onMaximize={maximize}
                onMove={move}
              >
                {renderApp(id)}
              </Window>
            ))}
          </main>

          <nav className="launcher" aria-label={d.launcher}>
            <ul className="launcher-list">
              {DOCK_APPS.map((id) => {
                const { Icon } = APPS[id]
                const win = wm.wins[id]
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className="launch"
                      data-launch={id}
                      data-open={win ? (win.state === 'minimized' ? 'min' : 'yes') : undefined}
                      onClick={() => openApp(id)}
                    >
                      <span className="launch-icon"><Icon size={19} aria-hidden="true" /></span>
                      <span className="launch-label">{d.apps[id]}</span>
                      {win && <span className="sr-only">, {d.open}</span>}
                    </button>
                  </li>
                )
              })}
              {/* Ventanas abiertas que no son favoritas: documentos y PDF */}
              {Object.keys(wm.wins).filter((id) => !DOCK_APPS.includes(id)).length > 0 && (
                <li className="launcher-divider" aria-hidden="true" />
              )}
              {Object.entries(wm.wins).filter(([id]) => !DOCK_APPS.includes(id)).map(([id, win]) => {
                const { Icon } = APPS[appKind(id)]
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className="launch"
                      data-launch={id}
                      data-open={win.state === 'minimized' ? 'min' : 'yes'}
                      onClick={() => openApp(id)}
                      title={windowPath(id)}
                    >
                      <span className="launch-icon"><Icon size={19} aria-hidden="true" /></span>
                      <span className="launch-label launch-label--doc">{windowTitle(id)}</span>
                      <span className="sr-only">, {d.open}</span>
                    </button>
                  </li>
                )
              })}
              <li className="launcher-divider" aria-hidden="true" />
              <li>
                <a className="launch" href={SIMPLE_URL} title={d.simpleViewHint}>
                  <span className="launch-icon"><FiFileText size={19} aria-hidden="true" /></span>
                  <span className="launch-label">{d.simpleView}</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {menu && <Menu {...menu} onClose={() => setMenu(null)} />}

      {dialog?.kind === 'props' && (
        <Properties nodes={nodes} id={dialog.id} lang={lang} d={d} onClose={() => setDialog(null)} />
      )}
      {dialog?.kind === 'empty' && (
        <Dialog
          title={d.dialog.emptyTitle}
          onClose={() => setDialog(null)}
          actions={(
            <>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDialog(null)} data-autofocus>{d.dialog.cancel}</button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => { setNodes(emptyTrash(nodes).nodes); setDialog(null); notify(d.toast.emptied) }}
              >
                {d.dialog.emptyConfirm}
              </button>
            </>
          )}
        >
          <p>{d.dialog.emptyBody(trashCount)}</p>
        </Dialog>
      )}
      {dialog?.kind === 'reset' && (
        <Dialog
          title={d.dialog.resetTitle}
          onClose={() => setDialog(null)}
          actions={(
            <>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDialog(null)} data-autofocus>{d.dialog.cancel}</button>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { resetDesktop(); setDialog(null) }}>{d.dialog.resetConfirm}</button>
            </>
          )}
        >
          <p>{d.dialog.resetBody}</p>
        </Dialog>
      )}

      <div className="toast" role="status" aria-live="polite" data-visible={toast ? 'true' : undefined}>
        {toast?.text}
      </div>
    </>
  )
}

// ---------- celular ----------

function MobileShell({ t, d, isEn, controls, view, setView, renderApp, openProject, windowTitle }) {
  const returnTo = useRef(null)
  const appRef = useRef(null)

  // Recuerda qué control abrió la app para devolverle el foco (y el scroll) al volver
  const openFrom = (selector, open) => {
    returnTo.current = selector
    open()
  }

  // Al abrir una app el foco entra en ella; al volver, regresa al control que la abrió
  useEffect(() => {
    if (view) {
      const el = appRef.current
      ;(el?.querySelector('[data-autofocus]') || el?.querySelector('.phone-back'))?.focus({ preventScroll: true })
    } else if (returnTo.current) {
      document.querySelector(returnTo.current)?.focus()
    }
  }, [view])

  return (
    <div className="phone">
      <header className="phone-status">
        <Brand />
        <div className="phone-status-right">
          <SystemControls {...controls} />
        </div>
      </header>

      {view ? (
        <section
          ref={appRef}
          className="phone-app"
          role="dialog"
          aria-modal="false"
          aria-labelledby="phone-app-title"
          onKeyDown={(e) => { if (e.key === 'Escape') setView(null) }}
        >
          <div className="phone-appbar">
            <button type="button" className="phone-back" onClick={() => setView(null)}>
              <FiArrowLeft size={18} aria-hidden="true" />
              {d.home}
            </button>
            <h2 className="phone-app-title" id="phone-app-title">{windowTitle(ALIASES[view] || view)}</h2>
          </div>
          <div className="phone-app-body">{renderApp(view, true)}</div>
        </section>
      ) : (
        <main className="phone-home">
          <div className="phone-hello">
            <h1 className="phone-name">
              Daniel Aguayo <span className="phone-role">{t.hero.role}</span>
            </h1>
            <div className="phone-shortcuts" role="group" aria-label={d.mobile.shortcuts}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                data-shortcut="projects"
                onClick={() => openFrom('[data-shortcut="projects"]', () => openProject(visibleProjects[0]?.slug))}
              >
                <FiFolder size={15} aria-hidden="true" />
                {d.apps.projects}
              </button>
              <a className="btn btn-secondary btn-sm" href={SIMPLE_URL}>
                <FiFileText size={15} aria-hidden="true" />
                {d.simpleView}
              </a>
            </div>
          </div>

          <nav aria-label={d.launcher}>
            <ul className="phone-grid">
              {APP_IDS.map((id) => {
                const { Icon } = APPS[id]
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className="phone-icon"
                      data-launch={id}
                      onClick={() => openFrom(`[data-launch="${id}"]`, () => setView(id))}
                    >
                      <span className="phone-icon-tile"><Icon size={24} aria-hidden="true" /></span>
                      <span className="phone-icon-label">{d.apps[id]}</span>
                    </button>
                  </li>
                )
              })}
              <li>
                <a className="phone-icon" href={SIMPLE_URL}>
                  <span className="phone-icon-tile"><FiFileText size={24} aria-hidden="true" /></span>
                  <span className="phone-icon-label">{d.simpleView}</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Los proyectos también viven en la pantalla de inicio: se leen sin abrir ninguna app */}
          <section className="phone-projects" aria-labelledby="phone-projects-title">
            <h2 className="phone-section-title" id="phone-projects-title">{d.apps.projects}</h2>
            <ul className="phone-cards">
              {visibleProjects.map((project) => (
                <li key={project.slug}>
                  <article className="phone-card">
                    <h3 className="phone-card-title">{pick(project, 'title', isEn)}</h3>
                    <p className="phone-card-desc">{pick(project, 'description', isEn)}</p>
                    <button
                      type="button"
                      className="phone-card-link"
                      data-case={project.slug}
                      onClick={() => openFrom(`[data-case="${project.slug}"]`, () => openProject(project.slug))}
                    >
                      {d.mobile.viewCase}
                      <FiArrowRight size={15} aria-hidden="true" />
                      <span className="sr-only">: {pick(project, 'title', isEn)}</span>
                    </button>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        </main>
      )}
    </div>
  )
}
