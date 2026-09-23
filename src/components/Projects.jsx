import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { projectsData } from '../data/projectsData'
import './Projects.css'

export default function Projects({ t }) {
  const [filter, setFilter] = useState('Todos')
  const categories = ['Todos', 'Frontend', 'Móvil', 'Backend', 'IA / ML']
  
  const filteredProjects = filter === 'Todos' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter)

  return (
    <section className="projects section" id="proyectos">
      <h2>{t?.projects?.title || 'Proyectos'}</h2>

      <div className="projects-filter">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div 
        className="projects-grid"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((proj) => (
            <motion.article 
              key={proj.title} 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="project-card"
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
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
