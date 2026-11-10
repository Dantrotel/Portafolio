// Sistema de archivos virtual del escritorio, generado desde los datos del sitio.
// Escritorio, Archivos, terminal y papelera leen y modifican este mismo árbol
// (src/desktop/fsOps.js guarda los cambios de la sesión como una capa encima).
//
// Nodo: { id, name, parent, kind: 'dir' | 'file' | 'link', type, system, label, target, href, app, project, track, content }
//   type:    md | txt | pdf | jsx | audio | url | app (define el ícono y con qué se abre)
//   system:  no se puede renombrar, mover ni mandar a la papelera
//   label:   nombre visible por idioma ({ es, en }); al renombrar se usa `name`
//   target:  id al que apunta un acceso directo (kind 'link')
//   content: (lang) => texto del archivo
import { projectsData } from './projectsData'
import { experienceData } from './experienceData'
import { educationData } from './educationData'
import { skillCategories } from './skillsData'
import { tracks } from './tracks'
import { EMAIL, PROFILES } from './contactData'
import { STRINGS } from '../i18n'

export const HOME_ID = 'home'
export const TRASH_ID = 'trash'
export const DESKTOP_ID = 'desktop'

const pick = (item, field, lang) => (lang === 'en' && item[`${field}En`]) || item[field]

// ---------- contenido de los archivos ----------

function projectReadme(p) {
  return (lang) => {
    const t = STRINGS[lang]
    const parts = [`# ${pick(p, 'title', lang)}`]
    if (p.problem) parts.push(`**${t.projects.problem}:** ${pick(p, 'problem', lang)}`)
    parts.push(pick(p, 'description', lang))
    parts.push(`**Stack:** ${p.tags.join(', ')}`)
    if (p.code) parts.push(`[${t.projects.viewCode}](${p.code})`)
    return parts.join('\n\n')
  }
}

function projectDecisions(p) {
  return (lang) => {
    const items = pick(p, 'decisions', lang).map((text, i) => {
      const cut = text.indexOf(': ')
      return cut === -1 ? `${i + 1}. ${text}` : `${i + 1}. **${text.slice(0, cut)}:** ${text.slice(cut + 2)}`
    })
    return [`# ${STRINGS[lang].projects.decisions}`, items.join('\n')].join('\n\n')
  }
}

function aboutMe(lang) {
  const { hero } = STRINGS[lang]
  return [`# Daniel Aguayo`, `${hero.role} · ${hero.location}`, hero.tagline, hero.intro].join('\n\n')
}

function journey(lang) {
  const t = STRINGS[lang]
  const isEn = lang === 'en'
  const out = [`# ${t.journey.title}`, `## ${t.journey.experience}`]
  for (const e of experienceData) {
    out.push(`### ${isEn ? e.positionEn : e.position}`)
    out.push(`${e.company} · ${isEn ? e.locationEn : e.location} · ${isEn ? e.periodEn : e.period}`)
    out.push(isEn ? e.descriptionEn : e.description)
    out.push(`**Stack:** ${((isEn && e.technologiesEn) || e.technologies).join(', ')}`)
  }
  out.push(`## ${t.journey.education}`)
  for (const s of educationData) {
    out.push(`### ${isEn ? s.degreeEn : s.degree}`)
    out.push(`${s.institution} · ${s.location} · ${s.period} · ${isEn ? s.statusEn : s.status}`)
    out.push(isEn ? s.descriptionEn : s.description)
  }
  return out.join('\n\n')
}

function skills(lang) {
  const t = STRINGS[lang]
  const out = [`# ${t.skills.title}`, t.skills.subtitle]
  for (const c of skillCategories) {
    out.push(`## ${t.skills[c.key]}`)
    out.push(c.skills.map((s) => `- ${s.name}`).join('\n'))
  }
  return out.join('\n\n')
}

function contact(lang) {
  const t = STRINGS[lang]
  return [
    `${t.contact.email}: ${EMAIL}`,
    ...PROFILES.map((p) => `${p.label}: ${p.href}`),
    `${t.contact.cv}: ~/Documentos/CV.pdf`,
  ].join('\n') + '\n'
}

// Papelera: lo que de verdad se sacó del sitio, con su motivo
const NAVY_NOTE = {
  es: '# portafolio-azul-marino\n\nVersión anterior del sitio (sep–nov 2026): azul marino, la ficha whoami en la portada y varias animaciones con framer-motion. La reemplacé por la hoja técnica porque se parecía demasiado a cualquier portafolio de desarrollador y tenía movimiento que no aportaba nada. Ahora el movimiento queda solo donde cumple una función.',
  en: '# portafolio-azul-marino\n\nPrevious version of the site (Sep–Nov 2026): navy blue, the whoami card on the hero and several framer-motion animations. I replaced it with the technical-sheet design because it looked too much like every other developer portfolio and had motion that added nothing. Now motion is used only where it has a purpose.',
}

const REMOVED_EFFECTS = [
  {
    name: 'DotGrid.jsx',
    es: 'Fondo de puntos animado en canvas detrás de la portada: decoración sin función. Se cambió por una cuadrícula CSS estática.',
    en: 'Animated canvas dot background behind the hero: decoration with no purpose. Replaced by a static CSS grid.',
  },
  {
    name: 'BlurText.jsx',
    es: 'El nombre aparecía desenfocándose por partes: texto que entra por pedazos y retrasa la lectura.',
    en: 'The name faded in from a blur piece by piece: text that arrives in chunks and delays reading.',
  },
  {
    name: 'TiltedCard.jsx',
    es: 'Tarjeta que se inclinaba siguiendo el mouse: efecto sin función que no existe en pantallas táctiles.',
    en: "A card that tilted to follow the mouse: an effect with no purpose that doesn't exist on touch screens.",
  },
  {
    name: 'ScrollVelocity.jsx',
    es: 'Cinta infinita de tecnologías: se reemplazó por la tabla de habilidades, que sí se puede leer.',
    en: 'An endless ticker of technologies: replaced by the skills table, which can actually be read.',
  },
]

// ---------- árbol ----------

export function buildBaseTree() {
  const nodes = {}
  let order = 0
  const add = (node) => { nodes[node.id] = { order: order++, ...node } }

  add({ id: 'root', name: '', parent: null, kind: 'dir', system: true })
  add({ id: 'home-root', name: 'home', parent: 'root', kind: 'dir', system: true })
  add({ id: HOME_ID, name: 'daniel', parent: 'home-root', kind: 'dir', system: true, label: { es: 'Carpeta personal', en: 'Home' } })

  add({ id: DESKTOP_ID, name: 'Escritorio', parent: HOME_ID, kind: 'dir', system: true })
  add({ id: 'projects', name: 'Proyectos', parent: HOME_ID, kind: 'dir', system: true })
  add({ id: 'documents', name: 'Documentos', parent: HOME_ID, kind: 'dir', system: true })
  add({ id: 'music', name: 'Música', parent: HOME_ID, kind: 'dir', system: true })
  add({ id: 'contact', name: 'contacto.txt', parent: HOME_ID, kind: 'file', type: 'txt', content: contact })
  add({ id: TRASH_ID, name: '.papelera', parent: HOME_ID, kind: 'dir', system: true, label: { es: 'Papelera', en: 'Trash' } })

  // Proyectos: los borradores no existen en el árbol
  for (const p of projectsData.filter((x) => !x.draft)) {
    const dir = `p:${p.slug}`
    add({ id: dir, name: p.slug, parent: 'projects', kind: 'dir', project: p.slug })
    add({ id: `${dir}/readme`, name: 'README.md', parent: dir, kind: 'file', type: 'md', project: p.slug, content: projectReadme(p) })
    if (p.decisions) add({ id: `${dir}/decisions`, name: 'decisiones.md', parent: dir, kind: 'file', type: 'md', project: p.slug, content: projectDecisions(p) })
    if (p.code) add({ id: `${dir}/repo`, name: 'repositorio', parent: dir, kind: 'link', type: 'url', href: p.code, project: p.slug })
  }

  add({ id: 'doc-cv', name: 'CV.pdf', parent: 'documents', kind: 'file', type: 'pdf', href: 'CV.pdf' })
  add({ id: 'doc-about', name: 'sobre-mi.md', parent: 'documents', kind: 'file', type: 'md', content: aboutMe })
  add({ id: 'doc-journey', name: 'trayectoria.md', parent: 'documents', kind: 'file', type: 'md', content: journey })
  add({ id: 'doc-skills', name: 'habilidades.md', parent: 'documents', kind: 'file', type: 'md', content: skills })

  tracks.forEach((track, i) => {
    add({ id: `track:${i}`, name: track.src.split('/').pop(), parent: 'music', kind: 'file', type: 'audio', track: i })
  })

  // Escritorio: accesos directos. Contacto y CV quedan a un doble clic desde que carga la página
  add({ id: 'desk-home', name: 'Carpeta personal', label: { es: 'Carpeta personal', en: 'Home' }, parent: DESKTOP_ID, kind: 'link', target: HOME_ID, system: true })
  add({ id: 'desk-projects', name: 'Proyectos', parent: DESKTOP_ID, kind: 'link', target: 'projects', system: true })
  add({ id: 'desk-documents', name: 'Documentos', parent: DESKTOP_ID, kind: 'link', target: 'documents', system: true })
  add({ id: 'desk-music', name: 'Música', parent: DESKTOP_ID, kind: 'link', target: 'music', system: true })
  add({ id: 'desk-terminal', name: 'Terminal', parent: DESKTOP_ID, kind: 'link', type: 'app', app: 'terminal', system: true })
  add({ id: 'desk-cv', name: 'CV.pdf', parent: DESKTOP_ID, kind: 'link', target: 'doc-cv' })
  add({ id: 'desk-about', name: 'sobre-mi.md', parent: DESKTOP_ID, kind: 'link', target: 'doc-about' })
  add({ id: 'desk-contact', name: 'contacto.txt', parent: DESKTOP_ID, kind: 'link', target: 'contact' })
  add({ id: 'desk-trash', name: 'Papelera', label: { es: 'Papelera', en: 'Trash' }, parent: DESKTOP_ID, kind: 'link', target: TRASH_ID, system: true })

  // Papelera inicial: restaurar algo de aquí lo deja en la carpeta personal
  add({ id: 'trash-navy', name: 'portafolio-azul-marino', parent: TRASH_ID, kind: 'dir', trashedFrom: HOME_ID })
  add({ id: 'trash-navy/note', name: 'nota.md', parent: 'trash-navy', kind: 'file', type: 'md', content: (lang) => NAVY_NOTE[lang] })
  for (const fx of REMOVED_EFFECTS) {
    add({
      id: `trash-${fx.name}`,
      name: fx.name,
      parent: TRASH_ID,
      kind: 'file',
      type: 'jsx',
      trashedFrom: HOME_ID,
      content: (lang) => `// ${fx.name}\n// ${fx[lang]}\n`,
    })
  }

  return nodes
}
