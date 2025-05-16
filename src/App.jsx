import './index.css'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import About from './components/About'
import Projects from './components/projects'
import Contact from './components/Contact'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : ''
  }, [darkMode])

  return (
    <>
      <div className="theme-switch-wrapper">
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider">
            <span className="icon">{darkMode ? '🌙' : '☀️'}</span>
          </span>
        </label>
      </div>

      <Header />
      <About />
      <Projects />
      <Contact />
    </>
  )
}

export default App
