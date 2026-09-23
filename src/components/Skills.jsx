import { getSkillCategories } from '../data/skillsData'
import { motion } from 'framer-motion'
import './Skills.css'

export default function Skills({ t }) {
  const skillCategories = getSkillCategories(t);

  return (
    <section className="section skills-section" id="habilidades">
      <h2>{t?.skills?.title || 'Habilidades'}</h2>
      <p className="skills-subtitle">
        {t?.skills?.subtitle || 'Tecnologías y herramientas con las que trabajo'}
      </p>

      <div className="skills-container">
        {skillCategories.map((category) => (
          <motion.div 
            key={category.title} 
            className="skill-category"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "linear" }}
          >
            <h3 className="category-title">{category.title}</h3>
            <div className="tech-grid">
              {category.skills.map(({ name, Icon, color }) => (
                <motion.div 
                  key={name} 
                  className="tech-item"
                  whileHover={{ 
                    y: -4,
                    backgroundColor: "var(--bg-elevated)",
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Icon
                    className="tech-icon"
                    style={color ? { color } : undefined}
                    aria-hidden="true"
                  />
                  <span className="tech-name">{name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
