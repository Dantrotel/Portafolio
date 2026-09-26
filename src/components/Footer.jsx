import { FiArrowUp } from 'react-icons/fi'
import './Footer.css'

export default function Footer({ t }) {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-brand">
          dantrottel<span className="footer-brand-accent">_</span>
        </p>
        <p className="footer-copy">
          &copy; {year} &middot; {t.footer.rights}
        </p>
        <a href="#inicio" className="footer-top">
          {t.footer.backToTop}
          <FiArrowUp size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
