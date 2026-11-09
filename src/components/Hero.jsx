import { m } from 'framer-motion'
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import ApiResponseCard from './ApiResponseCard'
import './Hero.css'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const socials = [
  { href: 'https://github.com/Dantrotel', label: 'GitHub', Icon: FiGithub, external: true },
  { href: 'https://www.linkedin.com/in/dantrottel/', label: 'LinkedIn', Icon: FiLinkedin, external: true },
  { href: 'mailto:dantrottel@gmail.com', label: 'Email', Icon: FiMail },
]

export default function Hero({ t }) {
  return (
    <section className="hero" id="inicio">
      <div className="container hero-inner">
        <m.div className="hero-content" variants={container} initial="hidden" animate="visible">
          <m.p className="hero-kicker" variants={item}>{t.hero.location}</m.p>

          <m.h1 className="hero-title" variants={item}>
            <span className="hero-name">Daniel Aguayo<span className="hero-name-dot" aria-hidden="true">.</span></span>
            <span className="hero-role">{t.hero.role}</span>
          </m.h1>

          <m.p className="hero-tagline" variants={item}>{t.hero.tagline}</m.p>

          <m.p className="hero-intro" variants={item}>{t.hero.intro}</m.p>

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

          <m.ul className="hero-socials" variants={item} aria-label={t.hero.socials}>
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
          </m.ul>
        </m.div>

        <m.div
          className="hero-visual"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ApiResponseCard t={t} />
        </m.div>
      </div>
    </section>
  )
}
