import { SiCplusplus, SiPython } from 'react-icons/si'

export const projectsData = [
  {
    title: 'AcTitUBB — Seguimiento de Tesistas',
    category: 'fullstack',
    description:
      'Plataforma full stack para gestionar el proceso de titulación de Informática en la Universidad del Bío-Bío. API REST en Node.js/Express con autenticación JWT y 4 roles (estudiante, profesor, jefatura, secretaria): propuestas de tesis, hitos, entregas de archivos, evaluación por comisión, calendario académico y notificaciones por email. Frontend en Angular + TypeScript, todo orquestado con Docker Compose.',
    live: null,
    code: 'https://github.com/Dantrotel/AcTitUBB',
    tags: ['Angular', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'JWT', 'Docker'],
    image: 'projects/comision.png',
  },
  {
    title: 'MusicClassifier',
    category: 'ai',
    description:
      'Clasificador de géneros musicales con una API en FastAPI y frontend en React. Modelo SVM entrenado sobre FMA Small (8.000 tracks, 8 géneros) con features de audio extraídas con librosa, más una capa RAG (LangChain + Gemini + ChromaDB) que explica las predicciones, responde preguntas sobre géneros y genera recomendaciones.',
    live: null,
    code: 'https://github.com/Dantrotel/MusicClassifier',
    tags: ['Python', 'FastAPI', 'React', 'scikit-learn', 'LangChain', 'RAG'],
    image: null,
    icon: SiPython,
    gradient: 'linear-gradient(135deg, #3776AB 0%, #1e4b70 100%)',
  },
  {
    title: 'Simulación de Carrera Multihilo',
    category: 'academic',
    description:
      'Simulación de carrera de autos con programación concurrente: cada auto corre en su propia hebra, con pausas aleatorias y sincronización mediante mutex hasta la meta. Muestra el podio final. Proyecto de Sistemas Operativos.',
    live: null,
    code: 'https://github.com/Dantrotel/Race_SSOO',
    tags: ['C++', 'Threads', 'Mutex'],
    image: null,
    icon: SiCplusplus,
    gradient: 'linear-gradient(135deg, #00599C 0%, #002d50 100%)',
  },
]
