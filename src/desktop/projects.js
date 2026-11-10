import { projectsData } from '../data/projectsData'

// Los borradores no aparecen en ninguna parte del escritorio
export const visibleProjects = projectsData.filter((project) => !project.draft)

// Elige el campo en inglés cuando existe y el idioma es inglés
export function pick(project, field, isEn) {
  return (isEn && project[`${field}En`]) || project[field]
}

export function findProject(name) {
  const key = name.toLowerCase()
  return visibleProjects.find((p) => p.slug === key || p.aliases?.includes(key)) || null
}
