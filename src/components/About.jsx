import { FiServer, FiCheckCircle, FiTrendingUp } from 'react-icons/fi'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'
import './About.css'

const icons = [FiServer, FiCheckCircle, FiTrendingUp]

export default function About({ t }) {
  return (
    <section className="section" id="sobre-mi">
      <div className="container">
        <SectionHeader index="01" title={t.about.title} />

        <div className="about-grid">
          <Reveal className="about-intro-wrap">
            <p className="about-intro">{t.about.intro}</p>
          </Reveal>

          <ol className="about-points">
            {t.about.cards.map((card, i) => {
              const Icon = icons[i % icons.length]
              return (
                <Reveal as="li" key={card.title} className="about-point" delay={0.1 * i}>
                  <span className="about-point-icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3 className="about-point-title">{card.title}</h3>
                    <p className="about-point-body">{card.body}</p>
                  </div>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
