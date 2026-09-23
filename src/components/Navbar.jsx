import { FaBars, FaTimes } from 'react-icons/fa'
import { motion } from 'framer-motion'
import './Navbar.css'

const navLinks = [
  { id: 'sobre-mi',    labelKey: 'about',     label: 'Sobre mí'    },
  { id: 'habilidades', labelKey: 'skills',    label: 'Habilidades' },
  { id: 'proyectos',   labelKey: 'projects',  label: 'Proyectos'   },
  { id: 'estudios',    labelKey: 'education', label: 'Estudios'    },
  { id: 'experiencia', labelKey: 'exp',       label: 'Experiencia' },
  { id: 'contacto',    labelKey: 'contact',   label: 'Contacto'    },
]

export default function Navbar({
  t, darkMode, onThemeToggle, lang, onLangChange,
  isOpen, onClose, onOpen, activeSection, onSectionChange,
}) {
  const profilePic = `${import.meta.env.BASE_URL}profile.webp`

  return (
    <motion.header 
      className={`top-nav ${isOpen ? 'mobile-open' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div 
        className="nav-brand"
        onClick={() => onSectionChange('sobre-mi')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSectionChange('sobre-mi') }}
      >
        <div className="avatar-container">
          <img
            src={profilePic}
            alt="Daniel Aguayo"
            className="nav-avatar"
            width="48"
            height="48"
            loading="eager"
          />
          <div className="availability-badge" title="Disponible para trabajar">
            <span className="pulse-dot"></span>
          </div>
        </div>
        <h1 className="nav-name">Daniel Aguayo</h1>
      </div>

      <div className="nav-menu">
        <nav className="nav-links">
          {navLinks.map(({ id, labelKey, label }) => (
            <button
              key={id}
              className={`nav-link ${activeSection === id ? 'active' : ''}`}
              onClick={() => onSectionChange(id)}
            >
              {t?.nav?.[labelKey] || label}
            </button>
          ))}
        </nav>

        <div className="nav-controls">
          <a 
            href={`${import.meta.env.BASE_URL}CV.pdf`} 
            download="Daniel_Aguayo_CV.pdf"
            className="btn-cv-nav"
          >
            {t?.hero?.ctaCv || 'Descargar CV'}
          </a>
          <div className="lang-toggle">
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
          <button
            className="theme-toggle"
            onClick={onThemeToggle}
            aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <button
        className="hamburger"
        onClick={isOpen ? onClose : onOpen}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
    </motion.header>
  )
}
