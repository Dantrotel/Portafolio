import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiReact,
  SiAngular,
  SiHtml5,
  SiVite,
  SiExpo,
  SiNodedotjs,
  SiFirebase,
  SiGit,
  SiGithub,
  SiDocker,
  SiFigma,
  SiGooglecloud,
  SiAmazonec2,
  SiPostgresql,
  SiSass,
} from 'react-icons/si'
import { FaDatabase } from 'react-icons/fa'
import './Skills.css'

export default function Skills({ t }) {
  const skillCategories = [
    {
      title: t?.skills?.frontend || 'Frontend',
      skills: [
        { name: 'React', Icon: SiReact, color: '#61DAFB' },
        { name: 'Angular', Icon: SiAngular, color: '#DD0031' },
        { name: 'HTML5', Icon: SiHtml5, color: '#E34F26' },
        { name: 'Sass / SCSS', Icon: SiSass, color: '#CC6699' },
        { name: 'Vite', Icon: SiVite, color: '#646CFF' },
      ]
    },
    {
      title: t?.skills?.backend || 'Backend & Nube',
      skills: [
        { name: 'Node.js', Icon: SiNodedotjs, color: '#339933' },
        { name: 'Google Cloud', Icon: SiGooglecloud, color: '#FFCA28' },
        { name: 'AWS EC2', Icon: SiAmazonec2, color: '#FF9900' },
      ]
    },
    {
      title: t?.skills?.languages || 'Lenguajes & BD',
      skills: [
        { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
        { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
        { name: 'Python', Icon: SiPython, color: '#3776AB' },
        { name: 'C++', Icon: SiCplusplus, color: '#00599C' },
        { name: 'SQL', Icon: FaDatabase, color: '#4479A1' },
        { name: 'PostgreSQL', Icon: SiPostgresql, color: '#4479A1' },
        { name: 'Firebase', Icon: SiFirebase, color: '#FFCA28' },
      ]
    },
    {
      title: t?.skills?.mobile || 'Móvil',
      skills: [
        { name: 'React Native', Icon: SiReact, color: '#61DAFB' },
        { name: 'Expo', Icon: SiExpo, color: null },
      ]
    },
    {
      title: t?.skills?.tools || 'Herramientas',
      skills: [
        { name: 'Git', Icon: SiGit, color: '#F05032' },
        { name: 'GitHub', Icon: SiGithub, color: null },
        { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
        { name: 'Figma', Icon: SiFigma, color: '#F24E1E' },
      ]
    }
  ]

  return (
    <section className="section skills-section" id="habilidades">
      <h2>{t?.skills?.title || 'Habilidades'}</h2>
      <p className="skills-subtitle">
        {t?.skills?.subtitle || 'Tecnologías y herramientas con las que trabajo'}
      </p>

      <div className="skills-container">
        {skillCategories.map((category) => (
          <div key={category.title} className="skill-category">
            <h3 className="category-title">{category.title}</h3>
            <div className="tech-grid">
              {category.skills.map(({ name, Icon, color }) => (
                <div key={name} className="tech-item">
                  <Icon
                    className="tech-icon"
                    style={color ? { color } : undefined}
                    aria-hidden="true"
                  />
                  <span className="tech-name">{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
