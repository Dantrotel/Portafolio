import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiCheck, FiCopy, FiDownload } from 'react-icons/fi'
import { EMAIL, PROFILES } from '../contactInfo'

const base = import.meta.env.BASE_URL

export default function Contact({ t }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
    } catch {
      /* sin permiso de portapapeles: el link mailto sigue disponible */
    }
  }

  return (
    <div className="pane">
      <h3 className="contact-heading">{t.contact.heading}</h3>
      <p className="pane-lead">{t.contact.intro}</p>

      <dl className="contact-list">
        <div className="contact-row">
          <dt>{t.contact.email}</dt>
          <dd className="contact-email-row">
            <a href={`mailto:${EMAIL}`} className="contact-value">{EMAIL}</a>
            {/* Los dos íconos están siempre montados: el cambio a check es una transición de CSS */}
            <button
              type="button"
              className="icon-btn copy-btn"
              data-copied={copied}
              onClick={copyEmail}
              aria-label={t.contact.copy}
              title={t.contact.copy}
            >
              <FiCopy className="copy-icon copy-icon--idle" size={16} aria-hidden="true" />
              <FiCheck className="copy-icon copy-icon--done" size={16} aria-hidden="true" />
            </button>
            <span className="sr-only" role="status">{copied ? t.contact.copied : ''}</span>
          </dd>
        </div>

        {PROFILES.map(({ label, href, text }) => (
          <div className="contact-row" key={label}>
            <dt>{label}</dt>
            <dd>
              <a href={href} target="_blank" rel="noopener noreferrer" className="contact-value">
                {text}
                <span className="sr-only"> {t.a11y.newTab}</span>
                <FiArrowUpRight size={16} aria-hidden="true" />
              </a>
            </dd>
          </div>
        ))}

        <div className="contact-row">
          <dt>{t.contact.cv}</dt>
          <dd>
            <a href={`${base}CV.pdf`} download="Daniel_Aguayo_CV.pdf" className="contact-value">
              {t.contact.cvAction}
              <FiDownload size={15} aria-hidden="true" />
            </a>
          </dd>
        </div>
      </dl>
    </div>
  )
}
