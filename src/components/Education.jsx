import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'
import './Education.css'

const educationItems = [
  {
    id: 1,
    degree: 'Ingeniería de Ejecución en Computación e Informática',
    degreeEn: 'Computer Science and Informatics Engineering',
    institution: 'Universidad del Bío-Bío',
    location: 'Concepción, Chile',
    period: '2020 – 2025',
    status: 'Egresado',
    statusEn: 'Graduate',
    description:
      'Formación en desarrollo de software, sistemas operativos, bases de datos, redes, inteligencia artificial y gestión de proyectos tecnológicos.',
    descriptionEn:
      'Training in software development, operating systems, databases, networks, artificial intelligence, and technology project management.',
  },
]

export default function Education({ t }) {
  const isEn = t?.education?.title === 'Education'

  return (
    <section className="section" id="estudios">
      <h2>{t?.education?.title || 'Estudios'}</h2>

      <div className="education-list">
        {educationItems.map((item) => (
          <div key={item.id} className="education-card">
            <div className="education-icon-col">
              <div className="education-icon-wrap">
                <FaGraduationCap />
              </div>
              <div className="education-line" />
            </div>

            <div className="education-body">
              <div className="education-header">
                <div>
                  <h3 className="education-degree">
                    {isEn ? item.degreeEn : item.degree}
                  </h3>
                  <p className="education-institution">{item.institution}</p>
                </div>
                <span className="education-status">
                  {isEn ? item.statusEn : item.status}
                </span>
              </div>

              <div className="education-meta">
                <span>
                  <FaCalendarAlt aria-hidden="true" /> {item.period}
                </span>
                <span>
                  <FaMapMarkerAlt aria-hidden="true" /> {item.location}
                </span>
              </div>

              <p className="education-description">
                {isEn ? item.descriptionEn : item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
