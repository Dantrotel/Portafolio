import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { projectsData } from '../data/projectsData'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'
import SpotlightCard from './reactbits/SpotlightCard'
import StarBorder from './reactbits/StarBorder'
import ShinyText from './reactbits/ShinyText'
import './Projects.css'

function ProjectMedia({ project, alt }) {
  if (project.image) {
    return (
      <div className={`project-media ${project.featured ? 'project-media--featured' : ''}`}>
        {project.featured ? (
          <div className="project-mockup">
            <div className="project-mockup-bar" aria-hidden="true">
              <div className="mockup-dots">
                <span className="mockup-dot mockup-dot--red" />
                <span className="mockup-dot mockup-dot--yellow" />
                <span className="mockup-dot mockup-dot--green" />
              </div>
              <span className="mockup-address">actitubb.ubiobio.cl &bull; plataforma</span>
            </div>
            <div className="project-mockup-viewport">
              <img
                src={`${import.meta.env.BASE_URL}${project.image}`}
                alt={alt}
                loading="lazy"
              />
            </div>
          </div>
        ) : (
          <img
            src={`${import.meta.env.BASE_URL}${project.image}`}
            alt={alt}
            loading="lazy"
          />
        )}
      </div>
    )
  }

  const Icon = project.icon
  return (
    <div className="project-media project-media--placeholder" aria-hidden="true">
      {Icon && <Icon className="project-media-icon" />}
    </div>
  )
}

export default function Projects({ t, lang }) {
  const isEn = lang === 'en'
  const [filter, setFilter] = useState('all')
  const categories = [
    { id: 'all',       label: t.projects.filterAll },
    { id: 'fullstack', label: t.projects.filterFullstack },
    { id: 'ai',        label: t.projects.filterAI },
    { id: 'academic',  label: t.projects.filterAcademic },
  ]

  const filteredProjects = filter === 'all'
    ? projectsData
    : projectsData.filter((p) => p.category === filter)

  return (
    <section className="section" id="proyectos">
      <div className="container">
        <SectionHeader index="03" title={t.projects.title} subtitle={t.projects.subtitle} />

        <Reveal className="projects-filter" delay={0.1}>
          <div role="group" aria-label={t.projects.filterLabel} className="projects-filter-group">
            {categories.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={`projects-filter-btn ${filter === id ? 'is-active' : ''}`}
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
              >
                {filter === id && (
                  <m.span
                    layoutId="projects-filter-pill"
                    className="projects-filter-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="projects-filter-label">{label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <m.div className="projects-grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <SpotlightCard
                as={m.article}
                key={project.title}
                layout
                className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
                spotlightColor="rgba(143, 179, 238, 0.14)"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectMedia project={project} alt={`${t.projects.screenshotOf} ${project.title}`} />

                <div className="project-body">
                  {project.featured ? (
                    <div className="project-featured-grid">
                      <div className="project-featured-main">
                        <StarBorder className="project-featured-star" speed="5s" color="var(--accent)">
                          <span className="project-featured">
                            <ShinyText text={t.projects.featured} speed={2.5} />
                          </span>
                        </StarBorder>

                        <h3 className="project-title">{(isEn && project.titleEn) || project.title}</h3>

                        <p className="project-problem">
                          <span className="project-label">{t.projects.problem}</span>
                          {isEn ? project.problemEn : project.problem}
                        </p>

                        <p className="project-desc">{isEn ? project.descriptionEn : project.description}</p>

                        <div className="project-links">
                          {project.live && (
                            <a
                              className="btn btn-primary btn-sm"
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FiExternalLink size={14} aria-hidden="true" />
                              {t.projects.viewDemo}
                            </a>
                          )}
                          <a
                            className="btn btn-secondary btn-sm"
                            href={project.code}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FiGithub size={14} aria-hidden="true" />
                            {t.projects.viewCode}
                          </a>
                        </div>
                      </div>

                      <div className="project-featured-aside">
                        <div className="project-decisions">
                          <span className="project-label">{t.projects.decisions}</span>
                          <ul>
                            {(isEn ? project.decisionsEn : project.decisions).map((decision) => (
                              <li key={decision}>{decision}</li>
                            ))}
                          </ul>
                        </div>

                        <ul className="project-tags">
                          {project.tags.map((tag) => (
                            <li key={tag} className="tag">{tag}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="project-title">{(isEn && project.titleEn) || project.title}</h3>

                      <p className="project-problem">
                        <span className="project-label">{t.projects.problem}</span>
                        {isEn ? project.problemEn : project.problem}
                      </p>

                      <p className="project-desc">{isEn ? project.descriptionEn : project.description}</p>

                      <div className="project-decisions">
                        <span className="project-label">{t.projects.decisions}</span>
                        <ul>
                          {(isEn ? project.decisionsEn : project.decisions).map((decision) => (
                            <li key={decision}>{decision}</li>
                          ))}
                        </ul>
                      </div>

                      <ul className="project-tags">
                        {project.tags.map((tag) => (
                          <li key={tag} className="tag">{tag}</li>
                        ))}
                      </ul>

                      <div className="project-links">
                        {project.live && (
                          <a
                            className="btn btn-primary btn-sm"
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FiExternalLink size={14} aria-hidden="true" />
                            {t.projects.viewDemo}
                          </a>
                        )}
                        <a
                          className="btn btn-secondary btn-sm"
                          href={project.code}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FiGithub size={14} aria-hidden="true" />
                          {t.projects.viewCode}
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </SpotlightCard>
            ))}
          </AnimatePresence>
        </m.div>
      </div>
    </section>
  )
}
