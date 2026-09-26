import { skillCategories } from '../data/skillsData'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'
import './Skills.css'

export default function Skills({ t }) {
  return (
    <section className="section" id="habilidades">
      <div className="container">
        <SectionHeader index="02" title={t.skills.title} subtitle={t.skills.subtitle} />

        <div className="skills-grid">
          {skillCategories.map((category, i) => (
            <Reveal key={category.key} className={`skills-card skills-card--${category.key}`} delay={0.07 * i}>
              <h3 className="skills-card-title">{t.skills[category.key]}</h3>
              <ul className="skills-list">
                {category.skills.map(({ name, Icon }) => (
                  <li key={name} className="skills-item">
                    <Icon className="skills-icon" aria-hidden="true" />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
