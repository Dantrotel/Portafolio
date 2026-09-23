import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'
import './Experience.css'

import { experienceData } from '../data/experienceData'

export default function Experience({ t }) {
  const experiences = experienceData

  return (
    <div className="experience-container section" id="experiencia">
      <h2 className="experience-title">
        <FaBriefcase className="title-icon" /> {t?.exp?.title || 'Experiencia Laboral'}
      </h2>

      <div className="experience-timeline">
        {experiences.map(exp => (
          <div key={exp.id} className="experience-card">
            <div className="experience-header">
              <h3 className="position">{exp.position}</h3>
              <h4 className="company">{exp.company}</h4>
            </div>
            
            <div className="experience-details">
              <p className="location">
                <FaMapMarkerAlt className="detail-icon" /> {exp.location}
              </p>
              <p className="period">
                <FaCalendarAlt className="detail-icon" /> {exp.period}
              </p>
            </div>
            
            <p className="description">{exp.description}</p>
            
            <div className="technologies">
              {exp.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
