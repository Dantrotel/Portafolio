// Cada objeto es una tarjeta, en este orden. Para agregar un proyecto basta sumar un objeto.
// Obligatorios: title, description, descriptionEn, tags.
// Opcionales: titleEn, featured, problem/problemEn, decisions/decisionsEn,
//             code (sin él no se muestra "Ver código"), live,
//             image + imageSmall + imageWidth/imageHeight (WebP de 1200 y 640 px: npm run capturas -- capturas/<archivo>.png),
//             imageAlt/imageAltEn (qué muestra la captura; sin él se usa "Captura de <título>"),
//             frameLabel/frameLabelEn (texto del marco de navegador del destacado),
//             draft (true = no se renderiza hasta tener contenido real),
//             slug + aliases (nombre de la carpeta en ~/Proyectos y alias que acepta la terminal).
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
      'Proyecto de título aprobado. API REST en Node.js/Express, frontend en Angular + TypeScript y una base MySQL de 62 tablas y 7 vistas, con flujos para estudiante, profesor, jefe de carrera y superadmin. Desplegada en AWS EC2 durante el proyecto.',
    descriptionEn:
      'Approved capstone project. REST API in Node.js/Express, Angular + TypeScript frontend and a MySQL database with 62 tables and 7 views, with flows for students, advisors, program heads and a superadmin. Deployed on AWS EC2 during the project.',
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
    slug: 'bot-dj',
    aliases: ['djbot', 'aguayando'],
    titleEn: 'DJ Bot for Discord',
    problem:
      'Escuchar música en grupo en Discord sin cortes ni silencios entre canciones, y que la sesión siga sola cuando se acaba la cola.',
    problemEn:
      'Listening to music together on Discord without cuts or silences between tracks, and keeping the session going on its own when the queue runs out.',
    description:
      'Bot de música en Node.js con discord.js v14: 22 comandos, cola por servidor, playlists, favoritos y un modo DJ que mezcla las canciones con cruces y empareja su BPM. La cola y la posición sobreviven a un reinicio.',
    descriptionEn:
      'Music bot in Node.js with discord.js v14: 22 commands, per-server queues, playlists, favorites and a DJ mode that blends tracks with crossfades and matches their BPM. The queue and playback position survive a restart.',
    decisions: [
      'Cruces sin cortar la canción actual: un mezclador recibe el PCM de las dos pistas a la vez, así la saliente no pierde ni un frame. Si algo falla, se degrada a corte seco.',
      'BPM propio: lo detecta con FFT y autocorrelación, lo guarda en caché por URL y ajusta el tempo de la entrante para que calce con la saliente.',
      'Opus directo: el audio de YouTube llega a Discord sin transcodificar; FFmpeg solo entra para volumen, seek o formatos que no son Opus.',
      'Persistencia segura: solo un módulo escribe en disco, con escrituras atómicas (archivo temporal + rename) agrupadas, y al arrancar reanuda la cola donde quedó.',
      'Responsabilidades aisladas: yt-dlp y FFmpeg se lanzan desde un único módulo, y cada comando declara sus permisos (rol DJ, uso fuera del canal de voz).',
    ],
    decisionsEn: [
      'Crossfades without cutting the current track: a mixer takes both tracks’ PCM at once, so the outgoing one never drops a frame. If anything fails it falls back to a hard cut.',
      'Its own BPM detection: FFT plus autocorrelation, cached per URL, then the incoming track’s tempo is adjusted to match the outgoing one.',
      'Direct Opus: YouTube audio reaches Discord without transcoding; FFmpeg only steps in for volume, seeking or non-Opus formats.',
      'Safe persistence: a single module writes to disk, with batched atomic writes (temp file + rename), and on startup the queue resumes where it left off.',
      'Isolated responsibilities: yt-dlp and FFmpeg are launched from one module only, and each command declares its own permissions (DJ role, use outside a voice channel).',
    ],
    code: 'https://github.com/Dantrotel/Aguayando',
    tags: ['Node.js', 'discord.js', 'yt-dlp', 'FFmpeg', 'DSP'],
  },
  {
    title: 'Calculadora de costos',
    slug: 'calculadora',
    titleEn: 'Cost calculator',
    problem:
      'Saber cuánto cuesta realmente producir algo (insumos, merma, trabajo y costos fijos) y a qué precio venderlo, con y sin IVA, sin depender de planillas.',
    problemEn:
      'Knowing what something really costs to make (ingredients, waste, labor and fixed costs) and what to sell it for, with and without VAT, without relying on spreadsheets.',
    description:
      'App móvil en Expo + TypeScript estricto que calcula el costo de un producto desde sus insumos y entrega el precio de venta. Funciona 100 % offline con SQLite y Drizzle ORM, y tiene 40 archivos de tests con Jest.',
    descriptionEn:
      'Mobile app in Expo + strict TypeScript that costs a product from its ingredients and gives its sale price. Works 100% offline with SQLite and Drizzle ORM, with 40 Jest test files.',
    decisions: [
      'Nunca float para dinero: los montos se guardan en enteros (centésimas de peso) y las cantidades en milésimas; las fracciones se calculan con BigInt y una sola división por paso.',
      'Sin totales en la base: el costo de un producto se calcula al leerlo, así que al cambiar el precio de un insumo todos los productos se actualizan solos.',
      'Lógica de cálculo pura: las fórmulas viven en un módulo sin React, sin base de datos y sin Expo, y cada una tiene tests.',
      'Capas de costo como en una ficha técnica: materia prima, condimentos, mano de obra y costos indirectos, repartidos por porcentaje o por horas de producción.',
    ],
    decisionsEn: [
      'Never floats for money: amounts are stored as integers (hundredths of a peso) and quantities in thousandths; fractions use BigInt with a single division per step.',
      'No stored totals: a product’s cost is computed when read, so changing an ingredient’s price updates every product automatically.',
      'Pure calculation logic: formulas live in a module with no React, no database and no Expo, and every one of them is tested.',
      'Cost layers like a recipe costing sheet: raw materials, seasonings, labor and overhead, allocated by percentage or by production hours.',
    ],
    tags: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Drizzle ORM', 'Zustand', 'Jest'],
  },
  {
    title: 'La Pirámide Online',
    slug: 'la-piramide',
    aliases: ['piramide'],
    problem:
      'Jugar en tiempo real un juego de cartas por turnos con amigos que no están en el mismo lugar, sin que nadie pueda hacer trampa desde el navegador.',
    problemEn:
      'Playing a turn-based card game in real time with friends who aren’t in the same place, without anyone being able to cheat from the browser.',
    description:
      'Versión multijugador del juego de cartas La Pirámide. Monorepo con cliente en React 19 + Tailwind v4 y servidor en Node.js/Express con Socket.io: se crea una sala, se comparte el código y el estado se sincroniza al instante.',
    descriptionEn:
      'Multiplayer version of the card game La Pirámide. Monorepo with a React 19 + Tailwind v4 client and a Node.js/Express server with Socket.io: create a room, share the code and the game state syncs instantly.',
    decisions: [
      'El servidor manda: el mazo, la pirámide y los turnos viven en el servidor y el cliente solo muestra lo que recibe, así nadie puede ver ni alterar cartas desde el navegador.',
      'Entradas validadas: cada evento de Socket.io valida el código de sala, sanea los nombres y revisa que las cantidades sean enteros positivos antes de tocar el estado.',
      'Límite de eventos por conexión: un rate limiter propio corta a quien envíe más de 10 eventos por segundo.',
      'Salas que se recuperan y se limpian: un jugador que se reconecta vuelve a su lugar, y las salas inactivas se borran solas para no acumular memoria.',
    ],
    decisionsEn: [
      'The server is the authority: the deck, the pyramid and the turns live on the server and the client only renders what it receives, so nobody can peek at or change cards from the browser.',
      'Validated input: every Socket.io event checks the room code, sanitizes names and verifies amounts are positive integers before touching state.',
      'Per-connection event limit: a custom rate limiter cuts off anyone sending more than 10 events per second.',
      'Rooms that recover and clean up: a player who reconnects gets their seat back, and idle rooms are removed automatically so memory doesn’t pile up.',
    ],
    tags: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'Socket.io'],
  },
  {
    title: 'Simulación de Carrera Multihilo',
    slug: 'carrera-multihilo',
    aliases: ['carrera', 'race'],
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
