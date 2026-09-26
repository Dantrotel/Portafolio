import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { FiArrowUpRight, FiGithub, FiLinkedin, FiSend } from 'react-icons/fi'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'
import './Contact.css'

const EMAIL = 'dantrottel@gmail.com'

const socials = [
  { href: 'https://www.linkedin.com/in/dantrottel/', label: 'LinkedIn', Icon: FiLinkedin },
  { href: 'https://github.com/Dantrotel', label: 'GitHub', Icon: FiGithub },
]

const emptyForm = { name: '', email: '', message: '' }

export default function Contact({ t }) {
  const [form, setForm] = useState(emptyForm)
  // idle | sending | sent | errorServer | errorNetwork
  const [status, setStatus] = useState('idle')

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    const endpoint = import.meta.env.VITE_CONTACT_FORM_URL

    if (!endpoint) {
      const body = `Nombre: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Contacto desde Portafolio')}&body=${encodeURIComponent(body)}`
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ Nombre: form.name, Email: form.email, Mensaje: form.message }),
      })

      if (response.ok) {
        setForm(emptyForm)
        setStatus('sent')
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('errorServer')
      }
    } catch {
      setStatus('errorNetwork')
    }
  }

  const feedback = status === 'sent' || status.startsWith('error') ? status : null

  return (
    <section className="section" id="contacto">
      <div className="container">
        <SectionHeader index="06" title={t.contact.title} />

        <div className="contact-grid">
          <Reveal className="contact-info">
            <h3 className="contact-heading">{t.contact.heading}</h3>
            <p className="contact-intro">{t.contact.intro}</p>

            <p className="contact-label">{t.contact.emailLabel}</p>
            <a href={`mailto:${EMAIL}`} className="contact-email">
              {EMAIL}
              <FiArrowUpRight aria-hidden="true" />
            </a>

            <p className="contact-label">{t.contact.social}</p>
            <ul className="contact-socials">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="contact-social">
                    <Icon size={16} aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="contact-form-wrap" delay={0.15}>
            <form onSubmit={handleSubmit} className="contact-form">
              <label className="form-field">
                <span>{t.contact.name}</span>
                <input
                  required
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder={t.contact.namePlaceholder}
                  value={form.name}
                  onChange={update('name')}
                />
              </label>
              <label className="form-field">
                <span>{t.contact.email}</span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t.contact.emailPlaceholder}
                  value={form.email}
                  onChange={update('email')}
                />
              </label>
              <label className="form-field">
                <span>{t.contact.message}</span>
                <textarea
                  required
                  name="message"
                  rows="5"
                  placeholder={t.contact.messagePlaceholder}
                  value={form.message}
                  onChange={update('message')}
                />
              </label>

              <button className="btn btn-primary contact-submit" type="submit" disabled={status === 'sending'}>
                <FiSend size={15} aria-hidden="true" />
                {status === 'sending' ? t.contact.sending : t.contact.send}
              </button>

              <AnimatePresence>
                {feedback && (
                  <m.p
                    key={feedback}
                    role={feedback === 'sent' ? 'status' : 'alert'}
                    className={`form-feedback ${feedback === 'sent' ? 'is-success' : 'is-error'}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {feedback === 'sent' ? t.contact.thankYou : t.contact[feedback]}
                  </m.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
