import React, { useState } from 'react'
import { FaPhone, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'
import './Contact.css'

export default function ContactInfo({ t }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    setSending(true)

    const endpoint = import.meta.env.VITE_CONTACT_FORM_URL
    
    if (!endpoint) {
      alert('⚠️ Para enviar mensajes directamente, necesitas configurar VITE_CONTACT_FORM_URL en tu archivo .env')
      setSending(false)
      return
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Nombre: form.name,
          Email: form.email,
          Mensaje: form.message,
        }),
      })

      if (response.ok) {
        setForm({ name: '', email: '', message: '' })
        setSent(true)
        setTimeout(() => setSent(false), 4000)
      } else {
        alert('Hubo un problema al enviar el mensaje por parte del servidor. Intenta de nuevo.')
      }
    } catch (err) {
      console.error(err)
      alert('Hubo un error de conexión al intentar enviar el mensaje.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="contact-container section" id="contacto">
      <h2 className="contact-title">{t?.contact?.title || 'Contacto'}</h2>

      <div className="contact-item">
        <FaPhone className="contact-icon" aria-hidden="true" />
        <a href="tel:+56998829898" aria-label="Llamar por teléfono">+56 9 9882 9898</a>
      </div>

      <p className="social-title">{t?.contact?.social || 'Redes sociales'}</p>
      <div className="social-icons">
        <a href="https://www.linkedin.com/in/dantrottel/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
        <a href="https://github.com/Dantrotel" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
          <FaGithub />
        </a>
        <a
          href="mailto:dantrottel@gmail.com"
          aria-label="Correo electrónico"
        >
          <FaEnvelope />
        </a>
      </div>

      <h3 className="social-title" style={{ marginTop: 24 }}>
        {t?.contact?.formTitle || 'Envíame un mensaje'}
      </h3>

      {sent && (
        <div className="success-message" role="alert">
          {t?.contact?.thankYou || '¡Mensaje enviado! Te responderé pronto.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form">
        <label className="form-field">
          <span>{t?.contact?.name || 'Nombre'}</span>
          <input
            required
            type="text"
            name="name"
            placeholder="Tu nombre completo"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </label>
        <label className="form-field">
          <span>{t?.contact?.email || 'Correo electrónico'}</span>
          <input
            required
            type="email"
            name="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </label>
        <label className="form-field">
          <span>{t?.contact?.message || 'Mensaje'}</span>
          <textarea
            required
            name="message"
            rows="5"
            placeholder="Cuéntame sobre tu proyecto o consulta..."
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
        </label>
        <button className="btn primary" type="submit" disabled={sending} style={{ width: '100%' }}>
          {sending ? (t?.contact?.sending || 'Enviando...') : (t?.contact?.send || 'Enviar mensaje')}
        </button>
      </form>
    </div>
  )
}
