import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { projectsData } from '../data/projectsData'
import SectionHeader from './SectionHeader'
import './Projects.css'

// Los borradores no se muestran; se filtran antes para que la numeración siga correlativa
const visibleProjects = projectsData.filter((project) => !project.draft)

// Elige el campo en inglés cuando existe y el idioma es inglés
function pick(project, field, isEn) {
  return (isEn && project[`${field}En`]) || project[field]
}

// codePrimary: en el destacado el código es la acción principal (la demo pasa a secundaria)
function ProjectLinks({ project, t, codePrimary = false }) {
  if (!project.live && !project.code) return null

  return (
    <div className="project-links">
      {project.live && (
        <a
          className={`btn ${codePrimary ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiExternalLink size={14} aria-hidden="true" />
          {t.projects.viewDemo}
        </a>
      )}
      {project.code && (
        <a
          className={`btn ${codePrimary ? 'btn-primary' : 'btn-secondary btn-sm'}`}
          href={project.code}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiGithub size={14} aria-hidden="true" />
          {t.projects.viewCode}
        </a>
      )}
    </div>
  )
}

function ProjectProblem({ project, t, isEn }) {
  if (!project.problem) return null

  return (
    <p className="project-problem">
      <span className="project-label">{t.projects.problem}</span>
      {pick(project, 'problem', isEn)}
    </p>
  )
}

// Identificadores como SHA-256 no se cortan en el guion
function KeepTogether({ text }) {
  return text.split(/(\b[A-Z]+-\d+\b)/).map((part, i) =>
    i % 2 ? <span key={i} className="project-nowrap">{part}</span> : part
  )
}

// "Decisión: razón" → la decisión en tinta y la razón como texto corrido
function Decision({ text }) {
  const cut = text.indexOf(': ')
  if (cut === -1) return <span><KeepTogether text={text} /></span>

  return (
    <span>
      <strong className="project-decision-lead">{text.slice(0, cut)}:</strong>{' '}
      <KeepTogether text={text.slice(cut + 2)} />
    </span>
  )
}

function ProjectTags({ tags }) {
  return (
    <ul className="tag-list project-tags">
      {tags.map((tag) => (
        <li key={tag} className="tag">{tag}</li>
      ))}
    </ul>
  )
}

function FeaturedProject({ project, index, t, isEn }) {
  const title = pick(project, 'title', isEn)
  const decisions = pick(project, 'decisions', isEn)

  return (
    <article className="project-featured">
      <div className="project-featured-top">
        <div className="project-featured-text">
          <p className="project-index">{String(index + 1).padStart(2, '0')} · {t.projects.featured}</p>
          <h3 className="project-title project-title--featured">{title}</h3>
          <ProjectProblem project={project} t={t} isEn={isEn} />
          <p className="project-desc">{pick(project, 'description', isEn)}</p>
        </div>

        {project.image && (
          <div className="project-frame">
            <div className="project-frame-bar" aria-hidden="true">
              <span className="project-frame-dots"><span /><span /><span /></span>
              <span className="project-frame-address">{pick(project, 'frameLabel', isEn)}</span>
            </div>
            <img
              src={`${import.meta.env.BASE_URL}${project.image}`}
              alt={pick(project, 'imageAlt', isEn) || `${t.projects.screenshotOf} ${title}`}
              loading="lazy"
              width="1866"
              height="939"
            />
          </div>
        )}
      </div>

      {decisions && (
        <div className="project-decisions project-decisions--featured">
          <span className="project-label">{t.projects.decisions}</span>
          <ol>
            {decisions.map((decision) => (
              <li key={decision}><Decision text={decision} /></li>
            ))}
          </ol>
        </div>
      )}

      {/* El código va después de las decisiones: se lee la afirmación y enseguida se puede comprobar */}
      <div className="project-featured-footer">
        <ProjectLinks project={project} t={t} codePrimary />
        <ProjectTags tags={project.tags} />
      </div>
    </article>
  )
}

function ProjectRow({ project, index, t, isEn }) {
  const decisions = pick(project, 'decisions', isEn)

  return (
    <article className="project-row">
      <p className="project-index">{String(index + 1).padStart(2, '0')}</p>

      <div className="project-row-main">
        <h3 className="project-title">{pick(project, 'title', isEn)}</h3>
        <p className="project-desc">{pick(project, 'description', isEn)}</p>
        <ProjectProblem project={project} t={t} isEn={isEn} />

        {decisions && (
          <div className="project-decisions">
            <span className="project-label">{t.projects.decisions}</span>
            <ul>
              {decisions.map((decision) => (
                <li key={decision}>{decision}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="project-row-aside">
        <ProjectTags tags={project.tags} />
        <ProjectLinks project={project} t={t} />
      </div>
    </article>
  )
}

export default function Projects({ t, lang }) {
  const isEn = lang === 'en'

  return (
    <section className="section" id="proyectos">
      <div className="container">
        <SectionHeader index="01" title={t.projects.title} subtitle={t.projects.subtitle} />

        <div className="projects-list">
          {visibleProjects.map((project, i) =>
            project.featured ? (
              <FeaturedProject key={project.title} project={project} index={i} t={t} isEn={isEn} />
            ) : (
              <ProjectRow key={project.title} project={project} index={i} t={t} isEn={isEn} />
            )
          )}
        </div>
      </div>
    </section>
  )
}
