import { FaCode, FaPaintBrush, FaUsers } from 'react-icons/fa'
import { motion } from 'framer-motion'
import './About.css'

export default function About({ t }) {
  const icons = [FaCode, FaPaintBrush, FaUsers]

  return (
    <section className="about section" id="sobre-mi">
      <motion.div 
        className="about-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="about-header-content">
          <h2 className="headline-thesis">
            {t?.about?.title || 'Arquitectura Digital & Código.'}
          </h2>
          <p className="about-intro">
            {t?.about?.intro ||
              'Diseño y construyo sistemas web de alto rendimiento. Menos fricción, más impacto visual y técnico.'}
          </p>
        </div>
        
        <div className="about-dj-illustration">
          <img src="/dj-rave.png" alt="DJ Mixing at Rave" className="dj-img" />
        </div>
      </motion.div>

      <motion.div 
        className="about-cards"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.2
            }
          }
        }}
      >
        {t?.about?.cards?.map((card, index) => {
          const Icon = icons[index % icons.length]
          return (
            <motion.div 
              key={index} 
              className="about-card"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.4, ease: "easeOut" }
                }
              }}
            >
              <div className="about-icon-wrapper">
                <Icon className="about-icon" />
              </div>
              <div className="about-card-content">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
