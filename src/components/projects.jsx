import React from 'react'
import { motion } from 'framer-motion'
import './Projects.css'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { SiCplusplus, SiPython } from 'react-icons/si'

const projects = [
  {
    title: 'Seguimiento de Tesistas',
    description:
      'Aplicación web para gestionar el proceso de titulación universitaria. Incluye roles diferenciados (estudiante, profesor, jefatura, secretaria), asignación de guías, agenda de reuniones, entregas y evaluación por comisión.',
    live: null,
    code: 'https://github.com/Dantrotel/AcTitUBB',
    tags: ['Angular', 'Node.js', 'MySQL'],
    image: 'projects/comision.png',
  },
  {
    title: 'Simulación de Carrera Multihilo en C++',
    description:
      'Simulación de carrera de autos con multithreading: cada auto avanza concurrentemente con pausas aleatorias hasta la meta. Muestra el podio final de ganadores.',
    live: null,
    code: 'https://github.com/Dantrotel/Race_SSOO',
    tags: ['C++'],
    image: null,
    icon: SiCplusplus,
    gradient: 'linear-gradient(135deg, #00599C 0%, #002d50 100%)',
  },
  {
    title: 'Clasificación de Géneros Musicales con Deep Learning',
    description:
      'Clasificador de géneros musicales entrenado sobre el dataset GTZAN usando deep learning y extracción de features de audio (MFCC, espectrogramas).',
    live: null,
    code: 'https://github.com/Dantrotel/Clasificacion_generos_musicales',
    tags: ['Python'],
    image: null,
    icon: SiPython,
    gradient: 'linear-gradient(135deg, #3776AB 0%, #1e4b70 100%)',
  },
]


export default function Projects({ t }) {
  return (
    <section className="projects section" id="proyectos">
      <h2>{t?.projects?.title || 'Proyectos'}</h2>


      <motion.div 
        className="projects-grid"
initial="hidden"
animate="visible"
viewport={{ once: true, amount: 0.1 }}
variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
      >
        {projects.map((proj) => (
          <motion.article 
            key={proj.title} 
            className="project-card"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { duration: 0.35, ease: "linear" }
              }
            }}
            whileHover={{ 
              y: -5, 
              boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
              transition: { duration: 0.2, ease: "easeOut" }
            }}
          >

            {proj.image ? (
              <div className="project-image-container">
                <img 
                  src={`${import.meta.env.BASE_URL}${proj.image.replace(/^\//, '')}`} 
                  alt={`Captura de ${proj.title}`} 
                  className="project-image" 
                />
              </div>
            ) : proj.icon ? (
              <div className="project-image-container fallback-icon" style={{ background: proj.gradient }}>
                <proj.icon size={72} color="rgba(255, 255, 255, 0.9)" className="project-icon-anim" />
              </div>
            ) : null}

            <div className="project-content">
              <h3>{proj.title}</h3>
              <p>{proj.description}</p>

              <div className="project-tags">
                {proj.tags.map((tag) => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>

              <div className="project-links">
                {proj.live && (
                  <a
                    className="btn primary"
                    href={proj.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ver demo de ${proj.title}`}
                  >
                    <FaExternalLinkAlt size={12} />
                    {t?.projects?.viewDemo || 'Ver demo'}
                  </a>
                )}
                <a
                  className="btn ghost"
                  href={proj.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver código de ${proj.title}`}
                >
                  <FaGithub size={14} />
                  {t?.projects?.viewCode || 'Ver código'}
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
