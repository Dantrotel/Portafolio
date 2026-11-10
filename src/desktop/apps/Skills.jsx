import { skillCategories } from '../../data/skillsData'

export default function Skills({ t }) {
  return (
    <div className="pane">
      <p className="pane-lead">{t.skills.subtitle}</p>
      <div className="skills">
        {skillCategories.map((category) => (
          <div key={category.key} className="skills-group">
            <h3 className="skills-name">{t.skills[category.key]}</h3>
            <ul className="skills-chips">
              {category.skills.map(({ name, Icon }) => (
                <li key={name} className="chip">
                  <Icon className="chip-icon" aria-hidden="true" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
