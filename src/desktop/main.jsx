import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './desktop.css'
import DesktopApp from './DesktopApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DesktopApp />
  </StrictMode>,
)
