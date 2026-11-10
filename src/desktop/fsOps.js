// Operaciones sobre el árbol de src/data/fs.js. Todas son puras: reciben el mapa de nodos
// y devuelven uno nuevo, o { error } con un código que la interfaz traduce.
import { buildBaseTree, HOME_ID, TRASH_ID, DESKTOP_ID } from '../data/fs'

export { HOME_ID, TRASH_ID, DESKTOP_ID }
export const HOME_PATH = '/home/daniel'

const FS_KEY = 'desk-fs-v1'

// ---------- lectura ----------

export function displayName(node, lang) {
  return node.label?.[lang] || node.name
}

export function children(nodes, dirId) {
  return Object.values(nodes).filter((n) => n.parent === dirId)
}

// Carpetas primero, luego por nombre (como un explorador); `byOrder` respeta el orden de origen
export function sortedChildren(nodes, dirId, { byOrder = false, showHidden = true } = {}) {
  const list = children(nodes, dirId).filter((n) => showHidden || !n.name.startsWith('.'))
  if (byOrder) return list.sort((a, b) => a.order - b.order)
  return list.sort((a, b) => {
    const da = isDirLike(nodes, a) ? 0 : 1
    const db = isDirLike(nodes, b) ? 0 : 1
    return da - db || a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
  })
}

// Un acceso directo lleva a su destino; lo demás se resuelve a sí mismo
export function resolveTarget(nodes, id) {
  const node = nodes[id]
  if (node?.kind === 'link' && node.target) return nodes[node.target] ? node.target : null
  return node ? id : null
}

export function isDirLike(nodes, node) {
  if (!node) return false
  if (node.kind === 'dir') return true
  return node.kind === 'link' && nodes[node.target]?.kind === 'dir'
}

export function isInTrash(nodes, id) {
  for (let n = nodes[id]; n; n = nodes[n.parent]) {
    if (n.parent === TRASH_ID) return true
  }
  return false
}

export function isAncestor(nodes, ancestorId, id) {
  for (let n = nodes[id]; n; n = nodes[n.parent]) {
    if (n.id === ancestorId) return true
  }
  return false
}

export function pathOf(nodes, id) {
  const parts = []
  for (let n = nodes[id]; n && n.id !== 'root'; n = nodes[n.parent]) parts.unshift(n.name)
  return `/${parts.join('/')}`
}

// Ruta corta con ~ para la carpeta personal (prompt, barras de título)
export function shortPath(nodes, id) {
  const full = pathOf(nodes, id)
  if (full === HOME_PATH) return '~'
  if (full.startsWith(`${HOME_PATH}/`)) return `~${full.slice(HOME_PATH.length)}`
  return full
}

const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Busca un hijo por nombre: exacto primero; si no, sin mayúsculas ni tildes (si hay uno solo)
export function findChild(nodes, dirId, name) {
  const list = children(nodes, dirId)
  const exact = list.find((n) => n.name === name)
  if (exact) return exact
  const loose = list.filter((n) => fold(n.name) === fold(name))
  return loose.length === 1 ? loose[0] : null
}

// Resuelve una ruta de terminal (absoluta, relativa, ~, ., ..). Los accesos a carpetas se atraviesan.
export function resolvePath(nodes, cwdId, path) {
  if (!path) return cwdId
  let current = cwdId
  let rest = path
  if (rest.startsWith('/')) {
    current = 'root'
  } else if (rest === '~' || rest.startsWith('~/')) {
    current = HOME_ID
    rest = rest.slice(1)
  }
  for (const part of rest.split('/').filter(Boolean)) {
    if (part === '.') continue
    if (part === '..') {
      current = nodes[current]?.parent || current
      continue
    }
    const dirId = resolveTarget(nodes, current)
    if (!dirId || nodes[dirId].kind !== 'dir') return null
    const next = findChild(nodes, dirId, part)
    if (!next) return null
    current = next.id
  }
  return current
}

// Tamaño aproximado en bytes del texto que genera cada archivo; null si no se conoce (PDF, audio)
export function sizeOf(nodes, id, lang) {
  const node = nodes[id]
  if (!node) return null
  if (node.kind === 'dir') {
    return children(nodes, id).reduce((sum, child) => sum + (sizeOf(nodes, child.id, lang) || 0), 0)
  }
  if (node.content) return new TextEncoder().encode(node.content(lang)).length
  return null
}

export function formatSize(bytes, locale) {
  if (bytes === null || bytes === undefined) return null
  if (bytes < 1024) return `${bytes} B`
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(bytes / 1024)} kB`
}

// ---------- escritura ----------

function validName(name) {
  const clean = name.trim()
  if (!clean || clean === '.' || clean === '..' || clean.includes('/')) return null
  return clean
}

// Si el nombre ya existe en la carpeta, agrega " (2)", " (3)"…
function freeName(nodes, dirId, name, ignoreId) {
  const taken = new Set(children(nodes, dirId).filter((n) => n.id !== ignoreId).map((n) => n.name))
  if (!taken.has(name)) return name
  const dot = name.lastIndexOf('.')
  const [stem, ext] = dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, '']
  for (let i = 2; ; i++) {
    const candidate = `${stem} (${i})${ext}`
    if (!taken.has(candidate)) return candidate
  }
}

export function moveToTrash(nodes, id) {
  const node = nodes[id]
  if (!node) return { error: 'notfound' }
  if (node.system) return { error: 'protected' }
  if (isInTrash(nodes, id)) return { error: 'intrash' }
  const name = freeName(nodes, TRASH_ID, node.name)
  return { nodes: { ...nodes, [id]: { ...node, parent: TRASH_ID, name, trashedFrom: node.parent } } }
}

export function restore(nodes, id) {
  const node = nodes[id]
  if (!node || node.parent !== TRASH_ID) return { error: 'notintrash' }
  const origin = nodes[node.trashedFrom] && !isInTrash(nodes, node.trashedFrom) && node.trashedFrom !== TRASH_ID
    ? node.trashedFrom
    : HOME_ID
  const name = freeName(nodes, origin, node.name)
  const next = { ...node, parent: origin, name }
  delete next.trashedFrom
  return { nodes: { ...nodes, [id]: next }, to: origin }
}

export function emptyTrash(nodes) {
  const next = { ...nodes }
  const drop = (dirId) => {
    for (const child of children(nodes, dirId)) {
      drop(child.id)
      delete next[child.id]
    }
  }
  drop(TRASH_ID)
  return { nodes: next }
}

let seq = 0
const newId = () => `u:${Date.now().toString(36)}${(seq++).toString(36)}`

export function makeDir(nodes, parentId, name) {
  const clean = validName(name)
  if (!clean) return { error: 'invalid' }
  const dirId = resolveTarget(nodes, parentId)
  if (!dirId || nodes[dirId].kind !== 'dir') return { error: 'notdir' }
  if (findChild(nodes, dirId, clean)?.name === clean) return { error: 'exists' }
  const id = newId()
  return { nodes: { ...nodes, [id]: { id, name: clean, parent: dirId, kind: 'dir', order: Date.now() } }, id }
}

// Nombre libre para "Nueva carpeta" (Nueva carpeta, Nueva carpeta (2)…)
export function newFolderName(nodes, parentId, base) {
  return freeName(nodes, resolveTarget(nodes, parentId), base)
}

export function rename(nodes, id, name) {
  const node = nodes[id]
  if (!node) return { error: 'notfound' }
  if (node.system) return { error: 'protected' }
  const clean = validName(name)
  if (!clean) return { error: 'invalid' }
  if (clean === node.name) return { nodes }
  if (children(nodes, node.parent).some((n) => n.id !== id && n.name === clean)) return { error: 'exists' }
  const next = { ...node, name: clean }
  delete next.label
  return { nodes: { ...nodes, [id]: next } }
}

// mv: a una carpeta existente (conserva el nombre) o a una ruta nueva (renombra)
export function move(nodes, id, destDirId, newName) {
  const node = nodes[id]
  if (!node) return { error: 'notfound' }
  if (node.system) return { error: 'protected' }
  const dirId = resolveTarget(nodes, destDirId)
  if (!dirId || nodes[dirId].kind !== 'dir') return { error: 'notdir' }
  if (dirId === TRASH_ID) return moveToTrash(nodes, id)
  if (isAncestor(nodes, id, dirId)) return { error: 'intoself' }
  const name = newName ? validName(newName) : node.name
  if (!name) return { error: 'invalid' }
  if (children(nodes, dirId).some((n) => n.id !== id && n.name === name)) return { error: 'exists' }
  const next = { ...node, parent: dirId, name }
  delete next.trashedFrom
  if (newName) delete next.label
  return { nodes: { ...nodes, [id]: next } }
}

// ---------- sesión: capa de cambios sobre el árbol base ----------

const MUTABLE = ['parent', 'name', 'label', 'trashedFrom']

function overlayOf(nodes) {
  const base = buildBaseTree()
  const changed = {}
  const created = []
  for (const node of Object.values(nodes)) {
    const original = base[node.id]
    if (!original) {
      created.push({ id: node.id, name: node.name, parent: node.parent, kind: node.kind, order: node.order })
      continue
    }
    const diff = {}
    for (const key of MUTABLE) {
      if (JSON.stringify(node[key]) !== JSON.stringify(original[key])) diff[key] = node[key] ?? null
    }
    if (Object.keys(diff).length) changed[node.id] = diff
  }
  const removed = Object.keys(base).filter((id) => !nodes[id])
  return { v: 1, changed, created, removed }
}

function applyOverlay(base, overlay) {
  const nodes = { ...base }
  for (const id of overlay.removed || []) delete nodes[id]
  for (const c of overlay.created || []) {
    if (c.kind === 'dir' && typeof c.name === 'string') nodes[c.id] = { ...c }
  }
  for (const [id, diff] of Object.entries(overlay.changed || {})) {
    if (!nodes[id]) continue
    const next = { ...nodes[id] }
    for (const key of MUTABLE) {
      if (!(key in diff)) continue
      if (diff[key] === null) delete next[key]
      else next[key] = diff[key]
    }
    nodes[id] = next
  }
  // Un nodo cuyo padre ya no existe vuelve a la carpeta personal en vez de quedar huérfano
  for (const node of Object.values(nodes)) {
    if (node.id !== 'root' && !nodes[node.parent]) nodes[node.id] = { ...node, parent: HOME_ID }
  }
  return nodes
}

export function loadFs() {
  const base = buildBaseTree()
  try {
    const raw = localStorage.getItem(FS_KEY)
    return raw ? applyOverlay(base, JSON.parse(raw)) : base
  } catch {
    return base
  }
}

export function saveFs(nodes) {
  try { localStorage.setItem(FS_KEY, JSON.stringify(overlayOf(nodes))) } catch { /* sin almacenamiento: los cambios viven solo en la sesión */ }
}

export function resetFs() {
  try { localStorage.removeItem(FS_KEY) } catch { /* nada que borrar */ }
  return buildBaseTree()
}
