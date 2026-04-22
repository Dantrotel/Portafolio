import { FaGithub, FaLinkedin, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa'
import profilePic from '/profile.jpg'
import './Sidebar.css'

const navLinks = [
  { id: 'sobre-mi',    labelKey: 'about',     label: 'Sobre mí'    },
  { id: 'habilidades', labelKey: 'skills',    label: 'Habilidades' },
  { id: 'proyectos',   labelKey: 'projects',  label: 'Proyectos'   },
  { id: 'estudios',    labelKey: 'education', label: 'Estudios'    },
  { id: 'experiencia', labelKey: 'exp',       label: 'Experiencia' },
  { id: 'contacto',    labelKey: 'contact',   label: 'Contacto'    },
]

export default function Sidebar({
  t, darkMode, onThemeToggle, lang, onLangChange,
  isOpen, onClose, onOpen, activeSection, onSectionChange,
}) {
  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <span className="mobile-logo">Daniel Aguayo</span>
        <button
          className="hamburger"
          onClick={isOpen ? onClose : onOpen}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Navegación lateral">
        {/* Close button (mobile) */}
        <button className="sidebar-close" onClick={onClose} aria-label="Cerrar menú">
          <FaTimes />
        </button>

        {/* Profile */}
        <div className="sidebar-profile">
          <img
            src={profilePic}
            alt="Foto de perfil de Daniel Aguayo"
            className="sidebar-avatar"
            width="88"
            height="88"
            loading="eager"
            decoding="async"
          />
          <h1 className="sidebar-name">Daniel Aguayo</h1>
          <p className="sidebar-role">{t?.hero?.role || 'Desarrollador Full Stack'}</p>
          <span className="availability-badge">
            <span className="availability-dot" aria-hidden="true" />
            {t?.hero?.available || 'Disponible para trabajar'}
          </span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav" aria-label="Navegación principal">
          {navLinks.map(({ id, labelKey, label }) => (
            <button
              key={id}
              className={`sidebar-link${activeSection === id ? ' active' : ''}`}
              onClick={() => onSectionChange(id)}
            >
              {t?.nav?.[labelKey] || label}
            </button>
          ))}
        </nav>

        {/* CV button */}
        <div className="sidebar-cta">
          <a
            className="btn primary"
            href={`${import.meta.env.BASE_URL}CV.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {t?.hero?.ctaCv || 'Descargar CV'}
          </a>
        </div>

        {/* Controls */}
        <div className="sidebar-controls">
          <button
            className="theme-btn"
            onClick={onThemeToggle}
            aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <span>{darkMode ? '🌙' : '☀️'}</span>
            <span>{darkMode ? 'Modo oscuro' : 'Modo claro'}</span>
          </button>

          <div className="lang-toggle" role="group" aria-label="Cambiar idioma">
            <button
              className={lang === 'es' ? 'active' : ''}
              onClick={() => onLangChange('es')}
            >
              ES
            </button>
            <button
              className={lang === 'en' ? 'active' : ''}
              onClick={() => onLangChange('en')}
            >
              EN
            </button>
          </div>
        </div>

        {/* Social */}
        <div className="sidebar-social">
          <a href="https://github.com/Dantrotel" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/dantrottel/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="mailto:dantrottel@gmail.com" aria-label="Email">
            <FaEnvelope />
          </a>
        </div>
      </aside>
    </>
  )
}
