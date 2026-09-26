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
  SiGooglecloud,
  SiPostgresql,
  SiSass,
  SiExpress,
  SiMysql,
  SiFastapi,
  SiSocketdotio,
  SiMongodb,
  SiTailwindcss,
} from 'react-icons/si'
import { FaDatabase, FaAws, FaJava } from 'react-icons/fa'

export const skillCategories = [
  {
    key: 'backend',
    skills: [
      { name: 'Node.js', Icon: SiNodedotjs },
      { name: 'Express', Icon: SiExpress },
      { name: 'FastAPI', Icon: SiFastapi },
      { name: 'Socket.io', Icon: SiSocketdotio },
      { name: 'Google Cloud', Icon: SiGooglecloud },
      { name: 'AWS EC2', Icon: FaAws },
    ]
  },
  {
    key: 'languages',
    skills: [
      { name: 'JavaScript', Icon: SiJavascript },
      { name: 'TypeScript', Icon: SiTypescript },
      { name: 'Python', Icon: SiPython },
      { name: 'Java', Icon: FaJava },
      { name: 'C++', Icon: SiCplusplus },
      { name: 'SQL', Icon: FaDatabase },
      { name: 'MySQL', Icon: SiMysql },
      { name: 'PostgreSQL', Icon: SiPostgresql },
      { name: 'MongoDB', Icon: SiMongodb },
      { name: 'Firebase', Icon: SiFirebase },
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
