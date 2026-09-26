import { FiMapPin } from 'react-icons/fi'
import { experienceData } from '../data/experienceData'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

export default function Experience({ t, lang }) {
  const isEn = lang === 'en'

  return (
    <section className="section" id="experiencia">
      <div className="container">
        <SectionHeader index="04" title={t.exp.title} />

        <ol className="timeline">
          {experienceData.map((exp, i) => (
            <Reveal as="li" key={exp.id} className="timeline-item" delay={0.1 * i}>
              <article className="timeline-card">
                <span className="timeline-period">{isEn ? exp.periodEn : exp.period}</span>
                <h3 className="timeline-title">{isEn ? exp.positionEn : exp.position}</h3>
                <p className="timeline-org">{exp.company}</p>
                <div className="timeline-meta">
                  <span><FiMapPin size={13} aria-hidden="true" /> {isEn ? exp.locationEn : exp.location}</span>
                </div>
                <p className="timeline-desc">{isEn ? exp.descriptionEn : exp.description}</p>
                <ul className="timeline-tags">
                  {((isEn && exp.technologiesEn) || exp.technologies).map((tech) => (
                    <li key={tech} className="tag">{tech}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
