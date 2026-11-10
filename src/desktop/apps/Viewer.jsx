import { FiDownload, FiExternalLink } from 'react-icons/fi'

const base = import.meta.env.BASE_URL

// Visor de PDF: el archivo real embebido. Si el navegador no muestra PDF dentro de la página
// (iOS, muchos Android), se ofrece abrirlo en una pestaña o descargarlo.
export default function Viewer({ node, d, mobile = false }) {
  if (!node) return <p className="pane pane-lead">{d.editor.missing}</p>
  const href = `${base}${node.href}`
  const canEmbed = !mobile && navigator.pdfViewerEnabled !== false

  return (
    <div className="viewer">
      <div className="editor-bar viewer-bar">
        <span className="editor-type">{d.types.pdf}</span>
        <a className="btn btn-secondary btn-sm" href={href} target="_blank" rel="noopener noreferrer">
          <FiExternalLink size={14} aria-hidden="true" />
          {d.viewer.openTab}
        </a>
        <a className="btn btn-primary btn-sm" href={href} download="Daniel_Aguayo_CV.pdf">
          <FiDownload size={14} aria-hidden="true" />
          {d.viewer.download}
        </a>
      </div>
      {canEmbed ? (
        <iframe className="viewer-frame" src={`${href}#view=FitH`} title={node.name} />
      ) : (
        <div className="viewer-fallback">
          <p>{d.viewer.noEmbed}</p>
        </div>
      )}
    </div>
  )
}
