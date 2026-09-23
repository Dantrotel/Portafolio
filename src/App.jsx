import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import { STRINGS } from './i18n'
import { motion, AnimatePresence } from 'framer-motion'

const VALID_SECTIONS = ['sobre-mi', 'habilidades', 'proyectos', 'estudios', 'experiencia', 'contacto']

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })
  const [lang, setLang] = useState('es')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('sobre-mi')
  const t = STRINGS[lang]

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : ''
  }, [darkMode])

  // Sync state with URL hash on mount and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && VALID_SECTIONS.includes(hash)) {
        setActiveSection(hash)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange() // initial check
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const handleSectionChange = (id) => {
    setActiveSection(id)
    setSidebarOpen(false)
    window.history.pushState(null, '', `#${id}`)
  }

  const sections = {
    'sobre-mi':    <About t={t} />,
    'habilidades': <Skills t={t} />,
    'proyectos':   <Projects t={t} />,
    'estudios':    <Education t={t} />,
    'experiencia': <Experience t={t} />,
    'contacto':    <Contact t={t} />,
  }

  return (
    <div className="app-layout">
      <Navbar
        t={t}
        darkMode={darkMode}
        onThemeToggle={() => setDarkMode(d => !d)}
        lang={lang}
        onLangChange={setLang}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpen={() => setSidebarOpen(true)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <main className="main-content">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeSection}
            className="section-panel motion-gpu"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {sections[activeSection]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
