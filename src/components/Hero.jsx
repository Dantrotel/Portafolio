import { m } from 'framer-motion'
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import WhoamiCard from './WhoamiCard'
import './Hero.css'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const socials = [
  { href: 'https://github.com/Dantrotel', label: 'GitHub', Icon: FiGithub, external: true },
  { href: 'https://www.linkedin.com/in/dantrottel/', label: 'LinkedIn', Icon: FiLinkedin, external: true },
  { href: 'mailto:dantrottel@gmail.com', label: 'Email', Icon: FiMail },
]

export default function Hero({ t }) {
  return (
    <section className="hero" id="inicio">
      <div className="hero-backdrop" aria-hidden="true" />

      <div className="container hero-inner">
        <m.div className="hero-content" variants={container} initial="hidden" animate="visible">
          <m.span className="hero-status" variants={item}>
            <span className="hero-status-dot" aria-hidden="true" />
            {t.hero.available}
          </m.span>

          <m.p className="hero-greeting" variants={item}>{t.hero.greeting}</m.p>

          <m.h1 className="hero-name" variants={item}>
            Daniel Aguayo<span className="hero-name-dot">.</span>
          </m.h1>

          <m.p className="hero-role" variants={item}>{t.hero.role}</m.p>

          <m.p className="hero-tagline" variants={item}>{t.hero.tagline}</m.p>

          <m.div className="hero-actions" variants={item}>
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
          </m.div>

          <m.ul className="hero-socials" variants={item}>
            {socials.map(({ href, label, Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  className="icon-btn"
                  aria-label={label}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  <Icon size={17} />
                </a>
              </li>
            ))}
          </m.ul>
        </m.div>

        <m.div
          className="hero-visual"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <WhoamiCard t={t} />
        </m.div>
      </div>
    </section>
  )
}
