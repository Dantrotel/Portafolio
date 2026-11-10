// Cada objeto es una tarjeta, en este orden. Para agregar un proyecto basta sumar un objeto.
// Obligatorios: title, description, descriptionEn, tags.
// Opcionales: titleEn, featured, problem/problemEn, decisions/decisionsEn,
//             code (sin él no se muestra "Ver código"), live,
//             image + imageSmall + imageWidth/imageHeight (WebP de 1200 y 640 px: npm run capturas -- capturas/<archivo>.png),
//             imageAlt/imageAltEn (qué muestra la captura; sin él se usa "Captura de <título>"),
//             frameLabel/frameLabelEn (texto del marco de navegador del destacado),
//             draft (true = no se renderiza hasta tener contenido real),
//             slug + aliases (nombre de la carpeta en el escritorio y en la terminal: cat <slug>).
export const projectsData = [
  {
    title: 'AcTitUBB — Seguimiento de Tesistas',
    slug: 'actitubb',
    titleEn: 'AcTitUBB — Thesis Tracking',
    featured: true,
    problem:
      'Coordinar a la vez la titulación de muchos estudiantes (propuestas, profesores guía, comisiones y plazos) con cuatro roles que necesitan permisos distintos.',
    problemEn:
      'Coordinating many students’ thesis processes at once (proposals, advisors, committees and deadlines) across four roles with different permissions.',
    description:
      'Proyecto de título aprobado. API REST en Node.js/Express, frontend en Angular + TypeScript y una base MySQL de 64 tablas y 6 vistas, con flujos para estudiante, profesor, jefe de carrera y superadmin. Desplegada en AWS EC2 durante el proyecto.',
    descriptionEn:
      'Approved capstone project. REST API in Node.js/Express, Angular + TypeScript frontend and a MySQL database with 64 tables and 6 views, with flows for students, advisors, program heads and a superadmin. Deployed on AWS EC2 during the project.',
    // Formato "decisión: razón"; el destacado resalta lo que va antes de los dos puntos
    decisions: [
      'Sesiones revocables: el JWT viaja en cookies HttpOnly, así que el JavaScript de la página no puede leerlo. Al cerrar sesión, su hash SHA-256 entra a una blacklist en MySQL: un token robado deja de servir aunque no haya expirado.',
      'Acceso por rol y por proyecto: el rol no basta, porque un estudiante no debe ver los documentos de otro. Cada ruta valida el rol y además que el usuario pertenezca a ese proyecto; los guards de Angular solo deciden qué pantalla mostrar.',
      'Archivos acotados: al descargar, la ruta se resuelve y se rechaza si sale de la carpeta de subidas (path traversal). Multer valida tipo y tamaño al subir.',
      'Tiempo real con la misma autenticación: Socket.io usa el JWT de la API y separa salas por usuario, rol y proyecto, así el chat y los avisos llegan solo a quien corresponde.',
      'Un solo docker compose up: Nginx, Angular, la API y MySQL se levantan igual en local y en el servidor, y el despliegue en EC2 es un comando.',
    ],
    decisionsEn: [
      'Revocable sessions: the JWT travels in HttpOnly cookies, so page JavaScript can’t read it. On logout its SHA-256 hash goes into a MySQL blacklist, so a stolen token stops working before it expires.',
      'Access by role and by project: role alone isn’t enough, since a student must not see another student’s documents. Each route checks the role and that the user belongs to that project; Angular guards only decide which screen to show.',
      'Contained file access: download paths are resolved and rejected if they leave the uploads folder (path traversal). Multer validates type and size on upload.',
      'Real time with the same auth: Socket.io reuses the API’s JWT and splits rooms by user, role and project, so chat and notifications only reach the right people.',
      'One docker compose up: Nginx, Angular, the API and MySQL run the same locally and on the server, and deploying to EC2 is one command.',
    ],
    code: 'https://github.com/Dantrotel/AcTitUBB',
    tags: ['Angular', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'JWT', 'Socket.io', 'Docker', 'AWS EC2'],
    image: 'projects/comision-1200.webp',
    imageSmall: 'projects/comision-640.webp',
    imageWidth: 1200,
    imageHeight: 604,
    imageAlt:
      'Vista de administración de AcTitUBB: lista de proyectos con el estado de su comisión y, al lado, la comisión de titulación de un proyecto con su profesor guía y su profesor informante asignados.',
    imageAltEn:
      'AcTitUBB admin view: a list of projects with the status of each review committee and, beside it, one project’s committee with its thesis advisor and second reader assigned.',
    frameLabel: 'AcTitUBB · plataforma',
    frameLabelEn: 'AcTitUBB · platform',
  },
  {
    title: 'MusicClassifier',
    slug: 'musicclassifier',
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
    code: 'https://github.com/Dantrotel/MusicClassifier',
    tags: ['Python', 'FastAPI', 'React', 'scikit-learn', 'LangChain', 'RAG'],
  },
  {
    title: 'Bot DJ para Discord',
    slug: 'djbot',
    aliases: ['bot-dj'],
    titleEn: 'DJ Bot for Discord',
    description:
      'Bot de música para Discord con mezcla tipo DJ: transiciones entre canciones, beatmatching y cambio de tempo sin alterar el tono.',
    descriptionEn:
      'Music bot for Discord with DJ-style mixing: transitions between tracks, beatmatching and tempo changes without altering pitch.',
    tags: ['discord.js', 'Node.js'],
  },
  {
    title: 'La Pirámide',
    slug: 'la-piramide',
    draft: true,
    description: '[DESCRIPCIÓN PENDIENTE]',
    descriptionEn: '[DESCRIPCIÓN PENDIENTE]',
    tags: ['[STACK]'],
  },
  {
    title: 'Calculadora de costos',
    slug: 'calculadora',
    titleEn: 'Cost calculator',
    draft: true,
    description: '[DESCRIPCIÓN PENDIENTE]',
    descriptionEn: '[DESCRIPCIÓN PENDIENTE]',
    tags: ['[STACK]'],
  },
  {
    title: 'Simulación de Carrera Multihilo',
    slug: 'carrera',
    aliases: ['race'],
    titleEn: 'Multithreaded Race Simulation',
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
    code: 'https://github.com/Dantrotel/Race_SSOO',
    tags: ['C++', 'std::thread', 'Mutex', 'Linux'],
  },
]
