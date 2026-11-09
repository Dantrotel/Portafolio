import { skillCategories } from '../data/skillsData'
import SectionHeader from './SectionHeader'
import './Skills.css'

export default function Skills({ t }) {
  return (
    <section className="section" id="habilidades">
      <div className="container">
        <SectionHeader index="02" title={t.skills.title} subtitle={t.skills.subtitle} />

        <div className="skills-table">
          {skillCategories.map((category) => (
            <div key={category.key} className="skills-row">
              <h3 className="skills-category">{t.skills[category.key]}</h3>
              <ul className="skills-list">
                {category.skills.map(({ name, Icon }) => (
                  <li key={name} className="skills-item">
                    <Icon className="skills-icon" aria-hidden="true" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
