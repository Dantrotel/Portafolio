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
  SiPostgresql,
  SiSass,
  SiExpress,
  SiMysql,
  SiFastapi,
  SiSocketdotio,
  SiTailwindcss,
  SiScikitlearn,
  SiLangchain,
  SiPandas,
} from 'react-icons/si'
import { FaDatabase, FaAws } from 'react-icons/fa'
import { FiActivity } from 'react-icons/fi'

export const skillCategories = [
  {
    key: 'backend',
    skills: [
      { name: 'Node.js', Icon: SiNodedotjs },
      { name: 'Express', Icon: SiExpress },
      { name: 'FastAPI', Icon: SiFastapi },
      { name: 'Socket.io', Icon: SiSocketdotio },
      { name: 'AWS EC2', Icon: FaAws },
    ]
  },
  {
    key: 'languages',
    skills: [
      { name: 'JavaScript', Icon: SiJavascript },
      { name: 'TypeScript', Icon: SiTypescript },
      { name: 'Python', Icon: SiPython },
      { name: 'C++', Icon: SiCplusplus },
      { name: 'SQL', Icon: FaDatabase },
      { name: 'MySQL', Icon: SiMysql },
      { name: 'PostgreSQL', Icon: SiPostgresql },
      { name: 'Firebase', Icon: SiFirebase },
    ]
  },
  {
    key: 'ai',
    skills: [
      { name: 'scikit-learn', Icon: SiScikitlearn },
      { name: 'LangChain', Icon: SiLangchain },
      // librosa no tiene ícono propio: se usa una forma de onda genérica
      { name: 'librosa', Icon: FiActivity },
      { name: 'pandas', Icon: SiPandas },
    ]
  },
  {
    key: 'frontend',
    skills: [
      { name: 'React', Icon: SiReact },
      { name: 'Angular', Icon: SiAngular },
      { name: 'HTML5', Icon: SiHtml5 },
      { name: 'Tailwind CSS', Icon: SiTailwindcss },
      { name: 'Sass / SCSS', Icon: SiSass },
      { name: 'Vite', Icon: SiVite },
    ]
  },
  {
    key: 'mobile',
    skills: [
      { name: 'React Native', Icon: SiReact },
      { name: 'Expo', Icon: SiExpo },
    ]
  },
  {
    key: 'tools',
    skills: [
      { name: 'Git', Icon: SiGit },
      { name: 'GitHub', Icon: SiGithub },
      { name: 'Docker', Icon: SiDocker },
    ]
  },
]
