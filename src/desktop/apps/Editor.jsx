import { useEffect, useState } from 'react'
import { FiCheck, FiCopy, FiDownload, FiLock } from 'react-icons/fi'
import Markdown, { PlainText } from '../Markdown'
import FileIcon from '../FileIcon'
import { EMAIL } from '../../data/contactData'
import { displayName, isInTrash, shortPath, sortedChildren, HOME_ID, TRASH_ID } from '../fsOps'

const base = import.meta.env.BASE_URL

function CopyEmail({ t }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
    } catch {
      /* sin permiso de portapapeles: el correo sigue siendo un link mailto */
    }
  }

  return (
    <>
      <button type="button" className="btn btn-primary btn-sm copy-btn editor-copy" data-copied={copied} onClick={copy}>
        <span className="copy-swap" aria-hidden="true">
          <FiCopy className="copy-icon copy-icon--idle" size={15} />
          <FiCheck className="copy-icon copy-icon--done" size={15} />
        </span>
        {copied ? t.contact.copied : t.contact.copy}
      </button>
      <span className="sr-only" role="status">{copied ? t.contact.copied : ''}</span>
    </>
  )
}

// Sin archivo (desde "Aplicaciones"): lista de documentos para abrir
function DocumentPicker({ nodes, lang, d, onOpen }) {
  const docs = []
  const walk = (dirId) => {
    for (const n of sortedChildren(nodes, dirId, { showHidden: false })) {
      if (n.kind === 'dir') walk(n.id)
      else if (n.kind === 'file' && ['md', 'txt'].includes(n.type)) docs.push(n)
    }
  }
  walk(HOME_ID)
  return (
    <div className="pane">
      <p className="pane-lead">{d.editor.pick}</p>
      <ul className="doc-list">
        {docs.map((n) => (
          <li key={n.id}>
            <button type="button" className="doc-item" onClick={() => onOpen(n.id)}>
              <FileIcon nodes={nodes} node={n} size={28} />
              <span className="doc-name">{displayName(n, lang)}</span>
              <span className="doc-path">{shortPath(nodes, n.parent)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Editor de texto en modo lectura: Markdown renderizado y texto plano
export default function Editor({ nodes, fileId, lang, t, d, onOpen }) {
  if (!fileId) return <DocumentPicker nodes={nodes} lang={lang} d={d} onOpen={onOpen} />
  const node = nodes[fileId]
  if (!node) return <p className="pane pane-lead">{d.editor.missing}</p>

  const text = node.content ? node.content(lang) : ''
  return (
    <div className="editor">
      <div className="editor-bar">
        <span className="editor-mode"><FiLock size={12} aria-hidden="true" />{d.editor.readOnly}</span>
        <span className="editor-type">{d.types[node.type] || d.types.txt}</span>
        {isInTrash(nodes, fileId) && <span className="editor-trash">{d.editor.inTrash(displayName(nodes[TRASH_ID], lang))}</span>}
      </div>
      <div className="editor-page">
        {fileId === 'doc-about' && (
          <div className="editor-about">
            <img src={`${base}profile.webp`} alt={d.about.photoAlt} width="88" height="88" loading="lazy" decoding="async" />
            <a className="btn btn-primary btn-sm" href={`${base}CV.pdf`} download="Daniel_Aguayo_CV.pdf">
              <FiDownload size={15} aria-hidden="true" />
              {t.hero.ctaCv}
            </a>
          </div>
        )}
        {fileId === 'contact' && (
          <div className="editor-actions">
            <CopyEmail t={t} />
          </div>
        )}
        {node.type === 'md' ? <Markdown text={text} offset={2} /> : <PlainText text={text} />}
      </div>
    </div>
  )
}
