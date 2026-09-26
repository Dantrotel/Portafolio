import Reveal from './Reveal'

export default function SectionHeader({ index, title, subtitle }) {
  return (
    <Reveal className="section-header">
      <span className="section-eyebrow">{index}</span>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </Reveal>
  )
}
