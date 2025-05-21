import React from 'react';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import './Exp.css';

export default function ExperienceSection() {
  const experiences = [
    {
      id: 1,
      position: "Desarrollador de aplicaciones para móviles",
      company: "Agartha Marketing Agency",
      location: "Santiago, Chile",
      period: "Abril 2024 - Junio 2024",
      description: "Desarrollo de aplicaciones móviles para Android e iOS. Participación en el diseño y desarrollo de la interfaz de usuario. Colaboración con el equipo de desarrollo para implementar nuevas funcionalidades.",
      technologies: ["React Native", "JavaScript", "CSS", "Git", "Node.js", "Firebase", "API Google", "API Google Maps"]
    },
    {
      id: 2,
      position: "Soporte Técnico",
      company: "Asmar",
      location: "Talcahuano, Chile",
      period: "Junio 2022 - Diciembre 2022",
      description: "Mantenimiento y reparación de equipos informáticos. Instalación y configuración de software y hardware. Soporte técnico a usuarios internos y externos.",
      technologies: ["Windows", "Linux", "Redes", "Hardware"]
    },
  ];

  return (
    <div className="experience-container">
      <h2 className="experience-title">
        <FaBriefcase className="title-icon" /> Experiencia Laboral
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
  );
}