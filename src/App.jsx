import './index.css'
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Exp from './components/Exp'
import Skills from './components/Skills'
import Education from './components/Education'
import ParticlesBackground from './components/ParticlesBackground'
import { STRINGS } from './i18n'

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
      <ParticlesBackground darkMode={darkMode} />
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
        <div className="section-panel" key={activeSection}>
          {sections[activeSection]}
        </div>
      </main>
    </div>
  )
}

export default App
