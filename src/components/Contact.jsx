import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiCheck, FiCopy, FiDownload } from 'react-icons/fi'
import SectionHeader from './SectionHeader'
import './Contact.css'

const EMAIL = 'dantrottel@gmail.com'

const profiles = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dantrottel/', text: 'in/dantrottel' },
  { label: 'GitHub', href: 'https://github.com/Dantrotel', text: 'github.com/Dantrotel' },
]

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
    <section className="section" id="contacto">
      <div className="container">
        <SectionHeader index="04" title={t.contact.title} />

        <div className="contact-grid">
          <div className="contact-intro-wrap">
            <p className="contact-heading">{t.contact.heading}</p>
            <p className="contact-intro">{t.contact.intro}</p>
          </div>

          <dl className="contact-list">
            <div className="contact-row">
              <dt>{t.contact.email}</dt>
              <dd className="contact-email-row">
                <a href={`mailto:${EMAIL}`} className="text-link contact-email">{EMAIL}</a>
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

            {profiles.map(({ label, href, text }) => (
              <div className="contact-row" key={label}>
                <dt>{label}</dt>
                <dd>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-link contact-link">
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
                <a href={`${import.meta.env.BASE_URL}CV.pdf`} download="Daniel_Aguayo_CV.pdf" className="text-link contact-link">
                  {t.contact.cvAction}
                  <FiDownload size={15} aria-hidden="true" />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
