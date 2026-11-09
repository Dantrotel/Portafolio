import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import ApiResponseCard from './ApiResponseCard'
import './Hero.css'

const socials = [
  { href: 'https://github.com/Dantrotel', label: 'GitHub', Icon: FiGithub, external: true },
  { href: 'https://www.linkedin.com/in/dantrottel/', label: 'LinkedIn', Icon: FiLinkedin, external: true },
  { href: 'mailto:dantrottel@gmail.com', label: 'Email', Icon: FiMail },
]

export default function Hero({ t }) {
  return (
    <section className="hero" id="inicio">
      <div className="container hero-inner">
        <div className="hero-content">
          <p className="hero-kicker">{t.hero.location}</p>

          <h1 className="hero-title">
            <span className="hero-name">Daniel Aguayo<span className="hero-name-dot" aria-hidden="true">.</span></span>
            <span className="hero-role">{t.hero.role}</span>
          </h1>

          <p className="hero-tagline">{t.hero.tagline}</p>

          <p className="hero-intro">{t.hero.intro}</p>

          <div className="hero-actions">
            <a href="#proyectos" className="btn btn-primary">
              {t.hero.ctaProjects}
              <FiArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              href={`${import.meta.env.BASE_URL}CV.pdf`}
              download="Daniel_Aguayo_CV.pdf"
              className="btn btn-secondary"
            >
              <FiDownload size={15} aria-hidden="true" />
              {t.hero.ctaCv}
            </a>
          </div>

          <ul className="hero-socials" aria-label={t.hero.socials}>
            {socials.map(({ href, label, Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  className="icon-btn"
                  aria-label={label}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  <Icon size={17} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual">
          <ApiResponseCard t={t} />
        </div>
      </div>
    </section>
  )
}
