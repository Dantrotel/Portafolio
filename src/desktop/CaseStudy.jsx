import { FiGithub } from 'react-icons/fi'
import { pick } from './projects'

const base = import.meta.env.BASE_URL

// "Decisión: razón" → la decisión en tinta y la razón como texto corrido
function Decision({ text }) {
  const cut = text.indexOf(': ')
  if (cut === -1) return <span>{text}</span>
  return (
    <span>
      <strong className="case-decision-lead">{text.slice(0, cut)}:</strong> {text.slice(cut + 2)}
    </span>
  )
}

// Caso de estudio de un proyecto: el mismo contenido que el destacado de la vista simple.
// Vive en la vista previa de Archivos, así el texto de los proyectos está en el DOM al cargar.
export default function CaseStudy({ project, t, d, isEn }) {
  const title = pick(project, 'title', isEn)
  const decisions = pick(project, 'decisions', isEn)

  return (
    <article className="case" aria-labelledby={`case-${project.slug}`}>
      <h3 className="case-title" id={`case-${project.slug}`}>{title}</h3>

      {project.problem && (
        <div className="case-block">
          <h4 className="case-label">{t.projects.problem}</h4>
          <p className="case-problem">{pick(project, 'problem', isEn)}</p>
        </div>
      )}

      <p className="case-desc">{pick(project, 'description', isEn)}</p>

      {project.image && (
        <figure className="case-shot">
          <figcaption className="case-shot-bar">{pick(project, 'frameLabel', isEn)}</figcaption>
          <img
            src={`${base}${project.image}`}
            srcSet={project.imageSmall && `${base}${project.imageSmall} 640w, ${base}${project.image} 1200w`}
            sizes="(max-width: 767px) 100vw, 560px"
            alt={pick(project, 'imageAlt', isEn) || `${t.projects.screenshotOf} ${title}`}
            loading="lazy"
            decoding="async"
            width={project.imageWidth}
            height={project.imageHeight}
          />
        </figure>
      )}

      {decisions && (
        <div className="case-block">
          <h4 className="case-label">{t.projects.decisions}</h4>
          <ol className="case-decisions">
            {decisions.map((text) => <li key={text}><Decision text={text} /></li>)}
          </ol>
        </div>
      )}

      <div className="case-footer">
        {project.code ? (
          <a className="btn btn-primary" href={project.code} target="_blank" rel="noopener noreferrer">
            <FiGithub size={15} aria-hidden="true" />
            {t.projects.viewCode}
            <span className="sr-only"> {t.a11y.newTab}</span>
          </a>
        ) : (
          <p className="case-nocode">{d.files.noCode}</p>
        )}
        <ul className="tag-list">
          {project.tags.map((tag) => <li key={tag} className="tag">{tag}</li>)}
        </ul>
      </div>
    </article>
  )
}
