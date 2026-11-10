import { FiAward, FiDownload, FiMapPin } from 'react-icons/fi'
import { experienceData } from '../../data/experienceData'
import { educationData } from '../../data/educationData'

const base = import.meta.env.BASE_URL

function Entry({ period, title, org, meta, description, tags }) {
  return (
    <li className="entry">
      <p className="entry-period">{period}</p>
      <h6 className="entry-title">{title}</h6>
      <p className="entry-org">{org}</p>
      <ul className="entry-meta">
        {meta.map(({ Icon, text }) => (
          <li key={text}><Icon size={13} aria-hidden="true" /> {text}</li>
        ))}
      </ul>
      <p className="entry-desc">{description}</p>
      {tags && (
        <ul className="tag-list">
          {tags.map((tag) => <li key={tag} className="tag">{tag}</li>)}
        </ul>
      )}
    </li>
  )
}

export default function About({ t, d, isEn }) {
  return (
    <div className="pane about">
      <div className="about-head">
        <img
          className="about-photo"
          src={`${base}profile.webp`}
          alt={d.about.photoAlt}
          width="88"
          height="88"
          loading="lazy"
          decoding="async"
        />
        <div>
          <h3 className="about-name">Daniel Aguayo</h3>
          <p className="about-role">{t.hero.role} · {t.hero.location}</p>
        </div>
      </div>

      <p className="about-tagline">{t.hero.tagline}</p>
      <p className="about-intro">{t.hero.intro}</p>

      <a className="btn btn-primary about-cv" href={`${base}CV.pdf`} download="Daniel_Aguayo_CV.pdf">
        <FiDownload size={15} aria-hidden="true" />
        {t.hero.ctaCv}
      </a>

      <section className="about-journey" aria-labelledby="about-journey">
        <h4 className="pane-heading" id="about-journey">{t.journey.title}</h4>

        <h5 className="pane-subheading">{t.journey.experience}</h5>
        <ul className="entries">
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
        </ul>

        <h5 className="pane-subheading">{t.journey.education}</h5>
        <ul className="entries">
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
        </ul>
      </section>
    </div>
  )
}
