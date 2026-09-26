import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiX, FiSun, FiMoon, FiDownload } from 'react-icons/fi'
import { useActiveSection } from '../hooks/useActiveSection'
import './Navbar.css'

const navLinks = [
  { id: 'sobre-mi',    labelKey: 'about' },
  { id: 'habilidades', labelKey: 'skills' },
  { id: 'proyectos',   labelKey: 'projects' },
  { id: 'experiencia', labelKey: 'exp' },
  { id: 'estudios',    labelKey: 'education' },
  { id: 'contacto',    labelKey: 'contact' },
]

const sectionIds = navLinks.map((link) => link.id)

export default function Navbar({ t, theme, onThemeToggle, lang, onLangChange }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(sectionIds)
  const cvUrl = `${import.meta.env.BASE_URL}CV.pdf`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const themeLabel = theme === 'dark' ? t.nav.toLight : t.nav.toDark

  return (
    <motion.header
      className={`navbar ${scrolled ? 'is-scrolled' : ''}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container navbar-inner">
        <a href="#inicio" className="navbar-brand" onClick={() => setOpen(false)}>
          dantrottel<span className="navbar-brand-cursor">_</span>
        </a>

        <nav className="navbar-links" aria-label="Principal">
          {navLinks.map(({ id, labelKey }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`navbar-link ${active === id ? 'is-active' : ''}`}
              aria-current={active === id ? 'true' : undefined}
            >
              {t.nav[labelKey]}
              {active === id && (
                <motion.span
                  layoutId="navbar-underline"
                  className="navbar-underline"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
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
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
              </motion.span>
            </AnimatePresence>
          </button>

          <a href={cvUrl} download="Daniel_Aguayo_CV.pdf" className="btn btn-primary btn-sm navbar-cv">
            <FiDownload size={14} aria-hidden="true" />
            CV
          </a>

          <button
            type="button"
            className="icon-btn navbar-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Principal"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container mobile-menu-inner">
              {navLinks.map(({ id, labelKey }, i) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  className={`mobile-menu-link ${active === id ? 'is-active' : ''}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <span className="mobile-menu-index">{String(i + 1).padStart(2, '0')}</span>
                  {t.nav[labelKey]}
                </motion.a>
              ))}
              <a href={cvUrl} download="Daniel_Aguayo_CV.pdf" className="btn btn-primary mobile-menu-cv">
                <FiDownload size={15} aria-hidden="true" />
                {t.hero.ctaCv}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
