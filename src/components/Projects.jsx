import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { projectsData } from '../data/projectsData'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'
import './Projects.css'

function ProjectMedia({ project, alt }) {
  if (project.image) {
    return (
      <div className="project-media">
        <img
          src={`${import.meta.env.BASE_URL}${project.image}`}
          alt={alt}
          loading="lazy"
        />
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
              <m.article
                key={project.title}
                layout
                className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectMedia project={project} alt={`${t.projects.screenshotOf} ${project.title}`} />

                <div className="project-body">
                  {project.featured && (
                    <span className="project-featured">{t.projects.featured}</span>
                  )}
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
                </div>
              </m.article>
            ))}
          </AnimatePresence>
        </m.div>
      </div>
    </section>
  )
}
