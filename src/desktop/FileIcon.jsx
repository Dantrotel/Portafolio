import { TRASH_ID, children, resolveTarget } from './fsOps'

// Íconos propios en SVG (48×48, trazo 1.5). Los colores salen de --icon-paper, --icon-ink y --accent.
const FOLDER_GLYPH = {
  home: 'M18.5 31.5 24 27l5.5 4.5V37h-11z',
  projects: 'M21 28.5 17.5 32l3.5 3.5M27 28.5l3.5 3.5-3.5 3.5',
  documents: 'M18 28.5h12M18 32h12M18 35.5h8',
  music: 'M22.5 35.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 0V27l7-2v8.5m0 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
}

function Folder({ glyph }) {
  return (
    <>
      <path className="ic-paper" d="M5.5 12.5a2 2 0 0 1 2-2h10.4l3.6 3.6h19a2 2 0 0 1 2 2v23.4a2 2 0 0 1-2 2h-33a2 2 0 0 1-2-2z" />
      <path className="ic-line" d="M5.5 20.5h37" />
      {glyph && <path className="ic-glyph" d={FOLDER_GLYPH[glyph]} />}
    </>
  )
}

function Trash({ full }) {
  return (
    <>
      {full && (
        <>
          <path className="ic-paper" d="M15.5 16.5 17 9.5l5 2.5 3-4.5 4 4 3.5-1.5.5 6.5z" />
          <path className="ic-accent-line" d="M21 12.5l2.5 2M27.5 11.5l-1 3" />
        </>
      )}
      <path className="ic-paper" d="M13.5 17h21l-2 22.5a2 2 0 0 1-2 1.8H17.5a2 2 0 0 1-2-1.8z" />
      <path className="ic-line" d="M10.5 17h27M20 17v-2.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1V17M20.5 22v14M27.5 22v14" />
    </>
  )
}

function Page({ badge, accent, children: inner }) {
  return (
    <>
      <path className="ic-paper" d="M12 5.5h16.5l8.5 8.5v28a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 12 5.5z" />
      <path className="ic-line" d="M28.5 5.5V14H37" />
      {badge && (
        <>
          <rect className={accent ? 'ic-badge ic-badge--accent' : 'ic-badge'} x="7" y="29" width={badge.length * 5.6 + 6} height="10" rx="1.5" />
          <text className="ic-badge-text" x="10" y="36.6">{badge}</text>
        </>
      )}
      {inner}
    </>
  )
}

function TerminalApp() {
  return (
    <>
      <rect className="ic-term" x="5.5" y="9.5" width="37" height="29" rx="3" />
      <path className="ic-term-prompt" d="M13 19l5 4-5 4M21.5 28.5h9" />
    </>
  )
}

const BADGES = { md: 'MD', txt: 'TXT', pdf: 'PDF', jsx: 'JSX' }

// Dibujo según lo que el nodo es de verdad: un acceso directo toma el ícono de su destino
function iconKind(nodes, node) {
  if (node.kind === 'link' && node.type === 'app') return { shape: 'app' }
  const targetId = resolveTarget(nodes, node.id)
  const target = nodes[targetId] || node
  if (targetId === TRASH_ID) return { shape: 'trash', full: children(nodes, TRASH_ID).length > 0 }
  if (target.kind === 'dir') {
    const glyph = { home: 'home', projects: 'projects', documents: 'documents', music: 'music' }[targetId]
    return { shape: 'folder', glyph }
  }
  return { shape: 'file', type: target.type }
}

export default function FileIcon({ nodes, node, size = 48 }) {
  const kind = iconKind(nodes, node)
  // La flechita de acceso directo va solo en los accesos a archivos (no en los del sistema)
  const shortcut = node.kind === 'link' && !node.system && node.type !== 'url'

  let body
  if (kind.shape === 'app') body = <TerminalApp />
  else if (kind.shape === 'trash') body = <Trash full={kind.full} />
  else if (kind.shape === 'folder') body = <Folder glyph={kind.glyph} />
  else if (kind.type === 'audio') {
    body = <Page><path className="ic-glyph" d={FOLDER_GLYPH.music.replace(/^M22\.5 35\.5/, 'M22.5 34.5')} /></Page>
  } else if (kind.type === 'url') {
    body = <Page><path className="ic-glyph" d="M18.5 32.5l9-9M21 23.5h6.5V30" /></Page>
  } else {
    body = <Page badge={BADGES[kind.type] || 'TXT'} accent={kind.type === 'pdf'} />
  }

  return (
    <svg className="file-icon" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" data-shape={kind.shape}>
      {body}
      {shortcut && (
        <g className="ic-shortcut">
          <rect x="31" y="33" width="12" height="12" rx="2" />
          <path d="M34.5 41.5l5-5M36 36.5h3.5V40" />
        </g>
      )}
    </svg>
  )
}
