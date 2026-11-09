import { useEffect, useRef, useState } from 'react'
import { FiMenu, FiX, FiSun, FiMoon, FiDownload } from 'react-icons/fi'
import { useActiveSection } from '../hooks/useActiveSection'
import './Navbar.css'

const navLinks = [
  { id: 'proyectos',   labelKey: 'projects' },
  { id: 'habilidades', labelKey: 'skills' },
  { id: 'trayectoria', labelKey: 'journey' },
  { id: 'contacto',    labelKey: 'contact' },
]

// El hero también se observa: al volver arriba ningún link queda activo
const sectionIds = ['inicio', ...navLinks.map((link) => link.id)]

// Igual que la duración de menuOut en Navbar.css: el menú se desmonta al terminar la salida
const MENU_EXIT_MS = 220

export default function Navbar({ t, theme, onThemeToggle, lang, onLangChange }) {
  const [open, setOpen] = useState(false)
  // closing: el menú ya está cerrado pero sigue montado mientras corre la animación de salida
  const [closing, setClosing] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)
  const toggleRef = useRef(null)
  const active = useActiveSection(sectionIds)
  const cvUrl = `${import.meta.env.BASE_URL}CV.pdf`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!closing || open) return
    const id = setTimeout(() => setClosing(false), MENU_EXIT_MS)
    return () => clearTimeout(id)
  }, [closing, open])

  useEffect(() => {
    if (!open) return

    // Con el menú abierto, lo que queda detrás no recibe foco ni clics
    const behind = [
      document.querySelector('.skip-link'),
      document.getElementById('main'),
      document.querySelector('.footer'),
    ].filter(Boolean)
    behind.forEach((el) => { el.inert = true })
    document.body.style.overflow = 'hidden'
    menuRef.current?.querySelector('a')?.focus()

    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      setClosing(true)
      toggleRef.current?.focus()
    }
    // Si la ventana pasa a escritorio el menú se oculta por CSS: se cierra también aquí
    const desktop = window.matchMedia('(min-width: 53.8125em)')
    const onDesktop = (e) => {
      if (!e.matches) return
      setOpen(false)
      setClosing(true)
    }

    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onDesktop)
    return () => {
      behind.forEach((el) => { el.inert = false })
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onDesktop)
    }
  }, [open])

  const closeMenu = () => {
    if (!open) return
    setOpen(false)
    setClosing(true)
  }

  const themeLabel = theme === 'dark' ? t.nav.toLight : t.nav.toDark

  return (
    <header className={`navbar ${scrolled || open ? 'is-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <a href="#inicio" className="navbar-brand" onClick={closeMenu}>
          dantrottel
          <span className="navbar-brand-cursor" aria-hidden="true">_</span>
        </a>

        <nav className="navbar-links" aria-label={t.nav.main}>
          {navLinks.map(({ id, labelKey }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`navbar-link ${active === id ? 'is-active' : ''}`}
              aria-current={active === id ? 'true' : undefined}
            >
              {t.nav[labelKey]}
            </a>
          ))}
        </nav>

        <div className="navbar-controls">
          <div className="lang-switch" role="group" aria-label={t.nav.language}>
            {['es', 'en'].map((code) => (
              <button
                key={code}
                type="button"
                className={lang === code ? 'is-active' : ''}
                aria-pressed={lang === code}
                onClick={() => onLangChange(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="icon-btn theme-toggle"
            onClick={onThemeToggle}
            aria-label={themeLabel}
            title={themeLabel}
          >
            {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>

          <a href={cvUrl} download="Daniel_Aguayo_CV.pdf" className="btn btn-primary btn-sm navbar-cv">
            <FiDownload size={14} aria-hidden="true" />
            CV
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="icon-btn navbar-toggle"
            onClick={() => (open ? closeMenu() : setOpen(true))}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {(open || closing) && (
        <nav
          ref={menuRef}
          id="mobile-menu"
          className="mobile-menu"
          data-state={open ? 'open' : 'closing'}
          inert={!open}
          aria-label={t.nav.main}
        >
          <div className="container mobile-menu-inner">
            {navLinks.map(({ id, labelKey }, i) => (
              <a
                key={id}
                href={`#${id}`}
                className={`mobile-menu-link ${active === id ? 'is-active' : ''}`}
                aria-current={active === id ? 'true' : undefined}
                onClick={closeMenu}
              >
                <span className="mobile-menu-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                {t.nav[labelKey]}
              </a>
            ))}
            <a href={cvUrl} download="Daniel_Aguayo_CV.pdf" className="btn btn-primary mobile-menu-cv">
              <FiDownload size={15} aria-hidden="true" />
              {t.hero.ctaCv}
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
