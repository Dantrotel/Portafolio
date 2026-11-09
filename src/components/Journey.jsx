import { FiMapPin, FiAward } from 'react-icons/fi'
import { experienceData } from '../data/experienceData'
import { educationData } from '../data/educationData'
import SectionHeader from './SectionHeader'
import './Journey.css'

function Entry({ period, title, org, meta, description, tags }) {
  return (
    <article className="journey-entry">
      <p className="journey-period">{period}</p>
      <h4 className="journey-title">{title}</h4>
      <p className="journey-org">{org}</p>
      <ul className="journey-meta">
        {meta.map(({ Icon, text }) => (
          <li key={text}><Icon size={13} aria-hidden="true" /> {text}</li>
        ))}
      </ul>
      <p className="journey-desc">{description}</p>
      {tags && (
        <ul className="tag-list journey-tags">
          {tags.map((tag) => (
            <li key={tag} className="tag">{tag}</li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default function Journey({ t, lang }) {
  const isEn = lang === 'en'

  return (
    <section className="section" id="trayectoria">
      <div className="container">
        <SectionHeader index="03" title={t.journey.title} />

        <div className="journey-grid">
          <div className="journey-column" id="experiencia">
            <h3 className="journey-heading">{t.journey.experience}</h3>
            {experienceData.map((exp) => (
              <Entry
                key={exp.id}
                period={isEn ? exp.periodEn : exp.period}
                title={isEn ? exp.positionEn : exp.position}
                org={exp.company}
                meta={[{ Icon: FiMapPin, text: isEn ? exp.locationEn : exp.location }]}
                description={isEn ? exp.descriptionEn : exp.description}
                tags={(isEn && exp.technologiesEn) || exp.technologies}
              />
            ))}
          </div>

          <div className="journey-column" id="estudios">
            <h3 className="journey-heading">{t.journey.education}</h3>
            {educationData.map((item) => (
              <Entry
                key={item.id}
                period={item.period}
                title={isEn ? item.degreeEn : item.degree}
                org={item.institution}
                meta={[
                  { Icon: FiMapPin, text: item.location },
                  { Icon: FiAward, text: isEn ? item.statusEn : item.status },
                ]}
                description={isEn ? item.descriptionEn : item.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
