import './Projects.css'

const projects = [
  {
    title: "Seguimiento de Tesistas",
    description: "Este proyecto es una aplicación web diseñada para realizar seguimiento de estudiantes que están en el proyecto final de carrera en la Universidad. La app permite la gestión de roles específicos (estudiante, profesor, jefe de carrera y secretaria), asignación de profesores a estudiantes, agendamiento de reuniones y entrega de avances. Los estudiantes también tienen una comisión evaluadora que otorga una nota final tras la defensa del proyecto.",
    link: "https://github.com/Dantrotel/AcTitUBB"
  },
  {
    title: "Simulación de Carrera de Autos con Multihebras en C++",
    description: "Este programa simula una carrera de autos utilizando programación con múltiples hebras en C++. Cada auto corre en su propia hebra, avanzando en intervalos de distancia y pausas aleatorias hasta completar la distancia total de la carrera. Al final, el programa muestra un podio con los tres primeros autos que terminan la carrera.",
    link: "https://github.com/Dantrotel/Race_SSOO"
  },
  {
    title: "Clasificación de Géneros Musicales con Deep Learning",
    description: "Este proyecto implementa un sistema de clasificación de géneros musicales utilizando técnicas de deep learning. El modelo está entrenado con el dataset GTZAN, que consiste en 1000 archivos de audio de 10 géneros diferentes. El objetivo es clasificar las canciones según su género utilizando características extraídas de las señales de audio.",
    link: "https://github.com/Dantrotel/Clasificacion_generos_musicales"
  },
]

export default function Projects() {
  return (
    <section className="projects section">
      <h2>Proyectos</h2>
      <div className="projects-grid">
        {projects.map((proj, index) => (
          <a key={index} href={proj.link} className="project-card" target="_blank" rel="noopener noreferrer">
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
