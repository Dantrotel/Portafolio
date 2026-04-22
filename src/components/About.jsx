import { FaCode, FaPaintBrush, FaUsers } from 'react-icons/fa'
import './About.css'

export default function About({ t }) {
  const icons = [FaCode, FaPaintBrush, FaUsers]

  return (
    <section className="about section" id="sobre-mi">
      <h2>{t?.about?.title || 'Sobre mí'}</h2>
      
      <p className="about-intro">
        {t?.about?.intro ||
          'Soy desarrollador Full Stack con experiencia en aplicaciones web y móviles.'}
      </p>

      <div className="about-cards">
        {t?.about?.cards?.map((card, index) => {
          const Icon = icons[index % icons.length]
          return (
            <div key={index} className="about-card">
              <div className="about-icon-wrapper">
                <Icon className="about-icon" />
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
