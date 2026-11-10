import { useEffect, useState } from 'react'
import Dialog from './Dialog'
import FileIcon from './FileIcon'
import { projectsData } from '../data/projectsData'
import { children, displayName, formatSize, resolveTarget, shortPath, sizeOf } from './fsOps'

const base = import.meta.env.BASE_URL

function typeLabel(nodes, node, d) {
  if (node.type === 'app') return d.types.app
  if (node.kind === 'link' && node.type !== 'url') {
    const target = nodes[resolveTarget(nodes, node.id)]
    return `${d.types.link} · ${target ? typeLabel(nodes, target, d) : '—'}`
  }
  if (node.kind === 'dir') return d.types.dir
  return d.types[node.type] || d.types.txt
}

// Solo datos que salen del árbol: nombre, tipo, ruta, tamaño aproximado y, en proyectos, stack y repositorio
export default function Properties({ nodes, id, lang, d, onClose }) {
  const node = nodes[id]
  const targetId = resolveTarget(nodes, id)
  const target = nodes[targetId]
  const [remoteSize, setRemoteSize] = useState(null)

  // El PDF es un archivo real: su tamaño lo da el servidor
  const pdfHref = target?.type === 'pdf' ? `${base}${target.href}` : null
  useEffect(() => {
    if (!pdfHref) return
    let alive = true
    fetch(pdfHref, { method: 'HEAD' })
      .then((r) => Number(r.headers.get('content-length')) || null)
      .then((bytes) => { if (alive) setRemoteSize(bytes) })
      .catch(() => {})
    return () => { alive = false }
  }, [pdfHref])

  if (!node) return null
  const name = displayName(node, lang)
  const project = target?.project && projectsData.find((p) => p.slug === target.project)
  const bytes = pdfHref ? remoteSize : sizeOf(nodes, targetId, lang)
  const size = formatSize(bytes, d.locale)
  const count = target?.kind === 'dir' ? children(nodes, targetId).length : null

  const rows = [
    [d.props.name, name],
    [d.props.type, typeLabel(nodes, node, d)],
    [d.props.location, shortPath(nodes, node.parent)],
  ]
  if (node.kind === 'link' && target && node.type !== 'url') rows.push([d.props.target, shortPath(nodes, targetId)])
  if (count !== null) rows.push([d.props.contents, d.props.items(count)])
  if (size) rows.push([d.props.size, `${size} (${d.props.approx})`])
  if (project) rows.push([d.props.stack, project.tags.join(', ')])

  return (
    <Dialog
      title={d.props.title(name)}
      onClose={onClose}
      actions={<button type="button" className="btn btn-secondary btn-sm" onClick={onClose} data-autofocus>{d.dialog.close}</button>}
    >
      <div className="props-head">
        <FileIcon nodes={nodes} node={node} />
        <p className="props-name">{name}</p>
      </div>
      <dl className="props-list">
        {rows.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
        {(project?.code || node.type === 'url') && (
          <div>
            <dt>{d.props.repo}</dt>
            <dd>
              <a className="props-link" href={project?.code || node.href} target="_blank" rel="noopener noreferrer">
                {(project?.code || node.href).replace('https://', '')}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </Dialog>
  )
}
