import { SiCplusplus, SiPython } from 'react-icons/si'

export const projectsData = [
  {
    title: 'AcTitUBB — Seguimiento de Tesistas',
    category: 'fullstack',
    featured: true,
    description:
      'Proyecto de título aprobado: plataforma full stack que centraliza el proceso de titulación de Informática en la Universidad del Bío-Bío. Base de datos MySQL de 62 tablas relacionales y 7 vistas SQL, API REST en Node.js/Express con autenticación JWT y flujos diferenciados para 3 perfiles (estudiante, profesor guía y jefe de carrera): propuestas, hitos, entregas de archivos, evaluación por comisión y calendario académico. Frontend en Angular + TypeScript, orquestado con Docker Compose y desplegado en AWS EC2.',
    descriptionEn:
      'Approved capstone project: a full stack platform that centralizes the degree-completion process for Computer Science at Universidad del Bío-Bío. MySQL database with 62 relational tables and 7 SQL views, REST API in Node.js/Express with JWT authentication and dedicated workflows for 3 profiles (student, thesis advisor and program coordinator): proposals, milestones, file submissions, committee review and academic calendar. Angular + TypeScript frontend, orchestrated with Docker Compose and deployed on AWS EC2.',
    live: null,
    code: 'https://github.com/Dantrotel/AcTitUBB',
    tags: ['Angular', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'JWT', 'Docker', 'AWS EC2'],
    image: 'projects/comision.png',
  },
  {
    title: 'MusicClassifier',
    category: 'ai',
    description:
      'Clasificador de géneros musicales con API en FastAPI y frontend en React + Tailwind. Modelo SVM entrenado sobre FMA Small (8.000 tracks, 8 géneros) con features de audio extraídas con librosa: 58% de accuracy, 4,6 veces sobre el azar (12,5%). Una capa RAG con LangChain, Gemini y ChromaDB explica cada predicción, responde preguntas sobre géneros y genera recomendaciones.',
    descriptionEn:
      'Music genre classifier with a FastAPI backend and a React + Tailwind frontend. SVM model trained on FMA Small (8,000 tracks, 8 genres) using audio features extracted with librosa: 58% accuracy, 4.6x above random chance (12.5%). A RAG layer built with LangChain, Gemini and ChromaDB explains each prediction, answers questions about genres and generates recommendations.',
    live: null,
    code: 'https://github.com/Dantrotel/MusicClassifier',
    tags: ['Python', 'FastAPI', 'React', 'scikit-learn', 'LangChain', 'RAG'],
    image: null,
    icon: SiPython,
  },
  {
    title: 'Simulación de Carrera Multihilo',
    titleEn: 'Multithreaded Race Simulation',
    category: 'academic',
    description:
      'Simulación de carrera de autos en C++ con programación concurrente, desarrollada en equipo de dos: cada auto corre en su propia hebra (std::thread), con pausas aleatorias, acceso a recursos compartidos controlado con mutex y salida sincronizada en consola sobre Linux. Proyecto de Sistemas Operativos.',
    descriptionEn:
      'Car race simulation in C++ using concurrent programming, built by a two-person team: each car runs on its own thread (std::thread), with random pauses, mutex-guarded access to shared resources and synchronized console output on Linux. Operating Systems course project.',
    live: null,
    code: 'https://github.com/Dantrotel/Race_SSOO',
    tags: ['C++', 'std::thread', 'Mutex', 'Linux'],
    image: null,
    icon: SiCplusplus,
  },
]
