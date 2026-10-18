import { SiCplusplus, SiMongodb, SiPython, SiTensorflow } from 'react-icons/si'

// category = project type (drives the filter); context = where it came from (badge on the card)

export const projectsData = [
  {
    title: 'AcTitUBB — Seguimiento de Tesistas',
    category: 'fullstack',
    context: { kind: 'thesis', team: null, period: '2025 – 2026' },
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
    title: 'Perrines UBB — Gestión de Perros Comunitarios',
    titleEn: 'Perrines UBB — Community Dog Management',
    category: 'fullstack',
    context: { kind: 'academic', team: 4, period: '2024' },
    problem:
      'Llevar el registro de los perros comunitarios de la universidad (ficha, alimentación y atención veterinaria) y mantener informadas a las personas que los cuidan.',
    problemEn:
      'Keeping records of the university’s community dogs (profile, feeding and veterinary care) and keeping their caretakers informed.',
    description:
      'Proyecto de Ingeniería de Software en equipo de cuatro. API REST en Node.js/Express con MongoDB y frontend en React + Vite, organizada en capas routes → controllers → services → models.',
    descriptionEn:
      'Software Engineering course project built by a team of four. REST API in Node.js/Express with MongoDB and a React + Vite frontend, organized in routes → controllers → services → models layers.',
    role:
      'Desarrollé el módulo de citas veterinarias de punta a punta: modelo, validación, servicio, controlador y rutas en el backend, y las vistas para listar, filtrar por perro y editar citas en React.',
    roleEn:
      'I built the veterinary appointments module end to end: model, validation, service, controller and routes in the backend, plus the React views to list, filter by dog and edit appointments.',
    decisions: [
      'Validación del body con Joi: formato de fecha, largos mínimos y máximos, y un filtro de palabras ofensivas en el motivo.',
      'Reglas de negocio en el controlador: no se aceptan fechas pasadas ni dos citas para el mismo perro en la misma fecha.',
      'Estados de la cita (por confirmar, confirmada, cancelada) con un correo automático vía Resend en cada cambio.',
      'La actualización de una cita corre dentro de una transacción de MongoDB, para no dejarla a medio guardar si algo falla.',
    ],
    decisionsEn: [
      'Request body validation with Joi: date format, minimum and maximum lengths, and an offensive-word filter on the reason field.',
      'Business rules in the controller: past dates are rejected, as are two appointments for the same dog on the same date.',
      'Appointment states (pending, confirmed, cancelled) with an automatic email via Resend on every change.',
      'Updating an appointment runs inside a MongoDB transaction, so it is never left half-saved if something fails.',
    ],
    live: null,
    code: 'https://github.com/B4yr0ndg/PERRINES-UBB-',
    tags: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'Joi', 'React', 'Vite'],
    image: null,
    icon: SiMongodb,
  },
  {
    title: 'MusicClassifier',
    category: 'ai',
    context: { kind: 'personal', team: null, period: '2026' },
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
    title: 'Clasificador de Géneros con Deep Learning',
    titleEn: 'Deep Learning Genre Classifier',
    category: 'ai',
    context: { kind: 'personal', team: null, period: '2024 – 2026' },
    problem:
      'Entrenar una red neuronal que reconozca 10 géneros musicales con un dataset chico (1.000 pistas) sin que se sobreajuste.',
    problemEn:
      'Training a neural network to recognize 10 music genres from a small dataset (1,000 tracks) without overfitting.',
    description:
      'Red neuronal densa (MLP) en TensorFlow/Keras entrenada sobre GTZAN, con 34 features de audio por fragmento extraídas con librosa (MFCC, chroma, contraste espectral, zero crossing rate y tempo). Analiza archivos locales o canciones desde una URL de YouTube. 93% de accuracy en validación sobre fragmentos de 3 segundos.',
    descriptionEn:
      'Dense neural network (MLP) in TensorFlow/Keras trained on GTZAN, with 34 audio features per segment extracted with librosa (MFCC, chroma, spectral contrast, zero crossing rate and tempo). Analyzes local files or songs from a YouTube URL. 93% validation accuracy on 3-second segments.',
    decisions: [
      'Cada pista de 30 s se divide en 10 fragmentos de 3 s: el dataset pasa de 1.000 a cerca de 10.000 muestras.',
      'El StandardScaler se ajusta solo con el set de entrenamiento, después del split, para no filtrar información de validación.',
      'BatchNormalization, Dropout decreciente (0,4 a 0,2) y EarlyStopping para controlar el sobreajuste.',
      'El género de una canción completa se decide por votación entre sus fragmentos; en YouTube se saltan los primeros 30 s para evitar intros.',
    ],
    decisionsEn: [
      'Each 30 s track is split into ten 3 s segments, growing the dataset from 1,000 to about 10,000 samples.',
      'The StandardScaler is fitted only on the training set, after the split, so no validation information leaks in.',
      'BatchNormalization, decreasing Dropout (0.4 to 0.2) and EarlyStopping to keep overfitting under control.',
      'A full song’s genre is decided by majority vote across its segments; for YouTube the first 30 s are skipped to avoid intros.',
    ],
    live: null,
    code: 'https://github.com/Dantrotel/Clasificacion_generos_musicales',
    tags: ['Python', 'TensorFlow', 'Keras', 'librosa', 'scikit-learn', 'yt-dlp'],
    image: null,
    icon: SiTensorflow,
  },
  {
    title: 'Simulación de Carrera Multihilo',
    titleEn: 'Multithreaded Race Simulation',
    category: 'systems',
    context: { kind: 'academic', team: 2, period: '2024' },
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
