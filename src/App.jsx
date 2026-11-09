import { useState, useEffect } from 'react'
import { LazyMotion, MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Journey from './components/Journey'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { STRINGS } from './i18n'

const loadMotionFeatures = () => import('./motionFeatures').then((mod) => mod.default)

function readStorage(key) {
  try { return localStorage.getItem(key) } catch { return null }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, value) } catch { /* almacenamiento no disponible */ }
}

function initialLang() {
  const saved = readStorage('lang')
  if (saved === 'es' || saved === 'en') return saved
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

function App() {
  // El script inline de index.html ya resolvió el tema antes del primer render
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [lang, setLang] = useState(initialLang)
  const t = STRINGS[lang]

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    writeStorage('theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
    writeStorage('lang', lang)
  }, [lang])

  return (
    <LazyMotion features={loadMotionFeatures}>
      <MotionConfig reducedMotion="user">
        <a href="#main" className="skip-link">{t.nav.skip}</a>

        <Navbar
          t={t}
          theme={theme}
          onThemeToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          lang={lang}
          onLangChange={setLang}
        />

        <main id="main">
          <Hero t={t} />
          <Projects t={t} lang={lang} />
          <Skills t={t} />
          <Journey t={t} lang={lang} />
          <Contact t={t} />
        </main>

        <Footer t={t} />
      </MotionConfig>
    </LazyMotion>
  )
}

export default App
