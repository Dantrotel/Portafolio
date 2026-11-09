import { skillCategories } from '../data/skillsData'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'
import SpotlightCard from './reactbits/SpotlightCard'
import ScrollVelocity from './reactbits/ScrollVelocity'
import './Skills.css'

const marqueeTechs = [
  'Node.js',
  'Express.js',
  'FastAPI',
  'Python',
  'MySQL',
  'PostgreSQL',
  'Docker',
  'React',
  'TypeScript',
  'REST APIs',
  'Linux',
  'Git',
  'Tailwind CSS',
]

export default function Skills({ t }) {
  return (
    <section className="section" id="habilidades">
      <div className="container">
        <SectionHeader index="02" title={t.skills.title} subtitle={t.skills.subtitle} />

        <div className="skills-grid">
          {skillCategories.map((category, i) => (
            <Reveal key={category.key} className={`skills-grid-item skills-card--${category.key}`} delay={0.07 * i}>
              <SpotlightCard
                className="skills-card"
                spotlightColor="rgba(143, 179, 238, 0.15)"
              >
                <h3 className="skills-card-title">{t.skills[category.key]}</h3>
                <ul className="skills-list">
                  {category.skills.map(({ name, Icon }) => (
                    <li key={name} className="skills-item">
                      <Icon className="skills-icon" aria-hidden="true" />
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <ScrollVelocity items={marqueeTechs} speed={28} className="skills-marquee" />
      </div>
    </section>
  )
}
