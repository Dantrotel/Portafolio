import { FiMapPin, FiAward } from 'react-icons/fi'
import { educationData } from '../data/educationData'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'

export default function Education({ t, lang }) {
  const isEn = lang === 'en'

  return (
    <section className="section" id="estudios">
      <div className="container">
        <SectionHeader index="05" title={t.education.title} />

        <ol className="timeline">
          {educationData.map((item, i) => (
            <Reveal as="li" key={item.id} className="timeline-item" delay={0.1 * i}>
              <article className="timeline-card">
                <span className="timeline-period">{item.period}</span>
                <h3 className="timeline-title">{isEn ? item.degreeEn : item.degree}</h3>
                <p className="timeline-org">{item.institution}</p>
                <div className="timeline-meta">
                  <span><FiMapPin size={13} aria-hidden="true" /> {item.location}</span>
                  <span><FiAward size={13} aria-hidden="true" /> {isEn ? item.statusEn : item.status}</span>
                </div>
                <p className="timeline-desc">{isEn ? item.descriptionEn : item.description}</p>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
