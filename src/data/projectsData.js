import { SiCplusplus, SiPython } from 'react-icons/si'

export const projectsData = [
  {
    title: 'AcTitUBB — Seguimiento de Tesistas',
    category: 'fullstack',
    featured: true,
    problem:
      'Coordinar a la vez el proceso de titulación de muchos estudiantes (propuestas, profesores guía, comisiones evaluadoras y plazos) con tres tipos de usuario que necesitan permisos distintos.',
    problemEn:
      'Coordinating the degree-completion process for many students at once (proposals, thesis advisors, review committees and deadlines) across three user types that need different permissions.',
    description:
      'Proyecto de título aprobado. Plataforma full stack con API REST en Node.js/Express, frontend en Angular + TypeScript y una base MySQL de 62 tablas relacionales y 7 vistas SQL, con flujos para estudiante, profesor guía y jefe de carrera. Desplegada en AWS EC2 durante el proyecto.',
    descriptionEn:
      'Approved capstone project. Full stack platform with a REST API in Node.js/Express, an Angular + TypeScript frontend and a MySQL database with 62 relational tables and 7 SQL views, with workflows for students, thesis advisors and the program coordinator. Deployed on AWS EC2 during the project.',
    decisions: [
      'Autenticación JWT con blacklist de tokens: cerrar sesión invalida el token en el servidor, no solo lo borra del navegador.',
      'Permisos por rol en dos capas: middlewares en la API y guards + interceptor HTTP en Angular.',
      '7 vistas SQL que encapsulan las consultas de seguimiento y reportes, para no repetir joins complejos en el backend.',
      'Entregas de archivos con Multer validando tipo y tamaño, y avisos por email con Nodemailer.',
      'Todo el stack (Nginx + Angular, API y MySQL) se levanta con un solo docker compose up.',
    ],
    decisionsEn: [
      'JWT authentication with a token blacklist: logging out invalidates the token on the server, not just in the browser.',
      'Role-based permissions in two layers: API middlewares plus guards and an HTTP interceptor in Angular.',
      '7 SQL views that encapsulate tracking and reporting queries, so complex joins are not repeated in the backend.',
      'File submissions through Multer with type and size validation, plus email notifications with Nodemailer.',
      'The whole stack (Nginx + Angular, API and MySQL) starts with a single docker compose up.',
    ],
    live: null,
    code: 'https://github.com/Dantrotel/AcTitUBB',
    tags: ['Angular', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'JWT', 'Docker', 'AWS EC2'],
    image: 'projects/comision.png',
  },
  {
    title: 'MusicClassifier',
    category: 'ai',
    problem:
      'Clasificar el género de una canción a partir de su audio y, además, explicar la predicción en lenguaje natural en lugar de devolver solo una etiqueta.',
    problemEn:
      'Classifying a song’s genre from its audio and explaining the prediction in natural language instead of returning just a label.',
    description:
      'API en FastAPI con frontend en React + Tailwind. Modelo SVM entrenado sobre FMA Small (8.000 tracks, 8 géneros) con features de audio extraídas con librosa: 58% de accuracy, 4,6 veces sobre el azar (12,5%).',
    descriptionEn:
      'FastAPI backend with a React + Tailwind frontend. SVM model trained on FMA Small (8,000 tracks, 8 genres) using audio features extracted with librosa: 58% accuracy, 4.6x above random chance (12.5%).',
    decisions: [
      'Evalué SVM y XGBoost; el modelo final es SVM (F1 macro 0,57).',
      'Capa RAG con LangChain y ChromaDB que usa Wikipedia como contexto, para que Gemini explique con información verificable.',
      'API separada por responsabilidad: /predict, /explain, /chat y /recommend.',
    ],
    decisionsEn: [
      'Evaluated SVM and XGBoost; the final model is SVM (macro F1 0.57).',
      'RAG layer with LangChain and ChromaDB using Wikipedia as context, so Gemini explains with verifiable information.',
      'API split by responsibility: /predict, /explain, /chat and /recommend.',
    ],
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
    problem:
      'Poner en práctica la programación concurrente: varios hilos compitiendo por recursos compartidos sin condiciones de carrera.',
    problemEn:
      'Putting concurrent programming into practice: several threads competing for shared resources without race conditions.',
    description:
      'Simulación de carrera de autos en C++ sobre Linux, desarrollada en equipo de dos. Proyecto de Sistemas Operativos.',
    descriptionEn:
      'Car race simulation in C++ on Linux, built by a two-person team. Operating Systems course project.',
    decisions: [
      'Un std::thread por auto, con pausas aleatorias para que el orden de llegada no sea determinista.',
      'Mutex sobre los recursos compartidos y la salida por consola, para evitar condiciones de carrera y líneas mezcladas.',
    ],
    decisionsEn: [
      'One std::thread per car, with random pauses so the finishing order is non-deterministic.',
      'Mutexes on shared resources and console output to avoid race conditions and interleaved lines.',
    ],
    live: null,
    code: 'https://github.com/Dantrotel/Race_SSOO',
    tags: ['C++', 'std::thread', 'Mutex', 'Linux'],
    image: null,
    icon: SiCplusplus,
  },
]
