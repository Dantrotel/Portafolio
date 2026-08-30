import './index.css'
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Exp from './components/Exp'
import Skills from './components/Skills'
import Education from './components/Education'
import { STRINGS } from './i18n'
import { motion, AnimatePresence } from 'framer-motion'

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

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const sections = {
    'sobre-mi':    <About t={t} />,
    'habilidades': <Skills t={t} />,
    'proyectos':   <Projects t={t} />,
    'estudios':    <Education t={t} />,
    'experiencia': <Exp t={t} />,
    'contacto':    <Contact t={t} />,
  }

  return (
    <div className="app-layout">
      <Sidebar
        t={t}
        darkMode={darkMode}
        onThemeToggle={() => setDarkMode(d => !d)}
        lang={lang}
        onLangChange={setLang}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpen={() => setSidebarOpen(true)}
        activeSection={activeSection}
        onSectionChange={(id) => {
          setActiveSection(id)
          setSidebarOpen(false)
        }}
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
