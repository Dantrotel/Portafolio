// Cuadrícula de íconos del escritorio, anclada a la derecha: la columna 0 es la del borde.
export const CELL_W = 100
export const CELL_H = 94
export const ICONS_TOP = 44
export const ICONS_RIGHT = 12
const BOTTOM_SPACE = 96 // lo que ocupa el lanzador

const POS_KEY = 'desk-icons-v1'

export function gridRows(vh) {
  return Math.max(1, Math.floor((vh - ICONS_TOP - BOTTOM_SPACE) / CELL_H))
}

export function cellToPx(cell, vw) {
  return { x: vw - ICONS_RIGHT - (cell.col + 1) * CELL_W, y: ICONS_TOP + cell.row * CELL_H }
}

export function pxToCell(x, y, vw, rows) {
  const col = Math.max(0, Math.round((vw - ICONS_RIGHT - x) / CELL_W) - 1)
  const row = Math.min(rows - 1, Math.max(0, Math.round((y - ICONS_TOP) / CELL_H)))
  return { col, row }
}

const key = (c) => `${c.col}:${c.row}`

// Primera celda libre recorriendo columna por columna desde la derecha
function nextFree(occupied, rows, near) {
  if (near) {
    // La más cercana a la celda pedida (para soltar sobre un ícono ocupado)
    for (let radius = 1; radius < 40; radius++) {
      for (let dc = -radius; dc <= radius; dc++) {
        for (let dr = -radius; dr <= radius; dr++) {
          const cell = { col: near.col + dc, row: near.row + dr }
          if (cell.col < 0 || cell.row < 0 || cell.row >= rows) continue
          if (!occupied.has(key(cell))) return cell
        }
      }
    }
  }
  for (let col = 0; ; col++) {
    for (let row = 0; row < rows; row++) {
      if (!occupied.has(key({ col, row }))) return { col, row }
    }
  }
}

// Respeta las posiciones guardadas que siguen siendo válidas y acomoda el resto en orden
export function layoutIcons(ids, saved, rows) {
  const occupied = new Set()
  const result = {}
  for (const id of ids) {
    const cell = saved[id]
    if (cell && cell.row < rows && !occupied.has(key(cell))) {
      result[id] = { col: cell.col, row: cell.row }
      occupied.add(key(cell))
    }
  }
  for (const id of ids) {
    if (result[id]) continue
    const cell = nextFree(occupied, rows)
    result[id] = cell
    occupied.add(key(cell))
  }
  return result
}

// Mueve un grupo de íconos según un desplazamiento en celdas; si chocan con otro, buscan la celda libre más cercana
export function moveIcons(layout, ids, dCol, dRow, rows) {
  const moving = new Set(ids)
  const occupied = new Set(Object.entries(layout).filter(([id]) => !moving.has(id)).map(([, c]) => key(c)))
  const next = { ...layout }
  for (const id of ids) {
    const want = {
      col: Math.max(0, layout[id].col + dCol),
      row: Math.min(rows - 1, Math.max(0, layout[id].row + dRow)),
    }
    const cell = occupied.has(key(want)) ? nextFree(occupied, rows, want) : want
    next[id] = cell
    occupied.add(key(cell))
  }
  return next
}

export function columnsUsed(layout) {
  return Object.values(layout).reduce((max, c) => Math.max(max, c.col + 1), 1)
}

export function loadIconPositions() {
  try {
    const parsed = JSON.parse(localStorage.getItem(POS_KEY) || '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function saveIconPositions(positions) {
  try { localStorage.setItem(POS_KEY, JSON.stringify(positions)) } catch { /* vuelven a la cuadrícula en la próxima visita */ }
}

export function clearIconPositions() {
  try { localStorage.removeItem(POS_KEY) } catch { /* nada que borrar */ }
}
