import { FaMobileAlt } from 'react-icons/fa'
import { SiCplusplus, SiPython } from 'react-icons/si'

export const projectsData = [
  {
    title: 'Seguimiento de Tesistas',
    category: 'Frontend',
    description:
      'Aplicación web para gestionar el proceso de titulación universitaria. Incluye roles diferenciados (estudiante, profesor, jefatura, secretaria), asignación de guías, agenda de reuniones, entregas y evaluación por comisión.',
    live: null,
    code: 'https://github.com/Dantrotel/AcTitUBB',
    tags: ['Angular', 'Node.js', 'MySQL'],
    image: 'projects/comision.png',
  },
  {
    title: 'E-Commerce Mobile App',
    category: 'Móvil',
    description:
      'Aplicación móvil para comercio electrónico desarrollada en React Native. Integración con pasarelas de pago, autenticación de usuarios mediante Firebase y carrito de compras persistente.',
    live: null,
    code: 'https://github.com/Dantrotel',
    tags: ['React Native', 'Firebase', 'Redux'],
    image: null,
    icon: FaMobileAlt,
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  },
  {
    title: 'Simulación de Carrera Multihilo',
    category: 'Backend',
    description:
      'Simulación de carrera de autos con multithreading: cada auto avanza concurrentemente con pausas aleatorias hasta la meta. Muestra el podio final de ganadores.',
    live: null,
    code: 'https://github.com/Dantrotel/Race_SSOO',
    tags: ['C++'],
    image: null,
    icon: SiCplusplus,
    gradient: 'linear-gradient(135deg, #00599C 0%, #002d50 100%)',
  },
  {
    title: 'Clasificador de Géneros Musicales',
    category: 'IA / ML',
    description:
      'Clasificador entrenado sobre el dataset GTZAN usando deep learning y extracción de features de audio (MFCC, espectrogramas) para predecir el género musical.',
    live: null,
    code: 'https://github.com/Dantrotel/Clasificacion_generos_musicales',
    tags: ['Python', 'Deep Learning'],
    image: null,
    icon: SiPython,
    gradient: 'linear-gradient(135deg, #3776AB 0%, #1e4b70 100%)',
  },
]
