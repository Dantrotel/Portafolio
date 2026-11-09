---
name: dantrottel — Portafolio
description: Hoja técnica de un desarrollador backend; papel cálido, tinta y un solo acento óxido.
colors:
  rust: "#B8410E"
  rust-deep: "#9A360B"
  rust-wash: "rgba(184, 65, 14, 0.08)"
  warm-paper: "#F3F1EC"
  paper-sheet: "#FBFAF7"
  paper-shade: "#E9E6DF"
  ink: "#15171C"
  graphite: "#545861"
  rule: "#DAD5CA"
  rule-strong: "#C2BCAE"
  on-rust: "#FFFFFF"
  status-ok: "#2F9E6A"
  night-status-ok: "#45B884"
  night-ink: "#101215"
  night-sheet: "#171A1F"
  night-shade: "#1F2329"
  bone: "#ECE9E2"
  ash: "#A1A39F"
  ember: "#F2894F"
  ember-light: "#F6A272"
  night-rule: "#262A31"
  night-rule-strong: "#363B44"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7.5vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  body-lead:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.55
  subtitle:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body-compact:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.925rem"
    fontWeight: 400
    lineHeight: 1.6
  label-lg:
    fontFamily: "IBM Plex Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.04em"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.04em"
  code:
    fontFamily: "IBM Plex Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.75
rounded:
  sm: "4px"
  md: "8px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  container: "1200px"
  nav-height: "64px"
  section: "6rem"
  section-compact: "4.5rem"
  section-header: "3.5rem"
  touch-target: "44px"
components:
  button-primary:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.on-rust}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 1.25rem"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.rust-deep}"
    textColor: "{colors.on-rust}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 1.25rem"
    height: "44px"
  button-secondary-hover:
    textColor: "{colors.rust}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.graphite}"
    rounded: "{rounded.sm}"
    size: "44px"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.2rem 0.55rem"
  skill-chip:
    backgroundColor: "{colors.paper-sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.45rem 0.85rem"
  card-featured:
    backgroundColor: "{colors.paper-sheet}"
    rounded: "{rounded.md}"
    padding: "2.5rem"
  nav-link:
    textColor: "{colors.graphite}"
    padding: "0 0.8rem"
    height: "44px"
  nav-link-active:
    textColor: "{colors.ink}"
---

# Design System: dantrottel — Portafolio

## Overview

**Creative North Star: "La Hoja Técnica"**

El portafolio se lee como una ficha de ingeniería impresa: papel cálido, tinta casi negra, reglas finas de 1px que ordenan cada bloque y un único acento óxido que marca lo que importa. La información manda; la decoración solo existe cuando cumple una función (numerar, separar, indicar estado). La voz técnica aparece en los detalles mono: índices `01`, etiquetas en mayúsculas, la tarjeta `GET /proyectos/actitubb` que resume el proyecto destacado como una respuesta de API.

La densidad es media y el ritmo es de documento: secciones separadas por una regla superior, encabezados con índice mono y una línea que se extiende hasta el borde, contenido en filas tabulares (habilidades, proyectos, trayectoria, contacto) en lugar de rejillas de tarjetas iguales. Solo el proyecto destacado vive en una superficie elevada.

El sistema rechaza explícitamente el look "dev oscuro neón" (negros con gradientes morado/cian, glow, glassmorphism), la plantilla genérica de portafolio (foto centrada, tarjetas con sombra idénticas, barras de porcentaje) y los efectos decorativos sin función.

**Key Characteristics:**
- Papel cálido y tinta, con un solo acento óxido (ámbar en modo oscuro).
- Reglas de 1px como estructura principal; sombra en un solo lugar.
- Grotesca para leer, Plex Mono para etiquetar, numerar y mostrar datos.
- Esquinas casi rectas (4px), 8px solo para superficies.
- Movimiento mínimo y funcional; nada con `prefers-reduced-motion`.

## Colors

Paleta de papel y tinta con un acento óxido escaso; el modo oscuro invierte a tinta nocturna con un acento ámbar, conservando los mismos roles. Contrastes de texto verificados ≥ 4.5:1 sobre fondo y superficie en ambos temas.

### Primary
- **Óxido** (rust): acción primaria, índices mono, eyebrows de sección, línea activa del navbar, strings del JSON, selección de texto y anillo de foco.
- **Óxido Profundo** (rust-deep): hover de la acción primaria.
- **Lavado Óxido** (rust-wash): fondo tenue del acento.
- **Ámbar Brasa** (ember) / **Ámbar Claro** (ember-light): el mismo rol que Óxido y su hover en modo oscuro; el texto sobre ellos es Tinta Nocturna.

### Neutral
- **Papel Cálido** (warm-paper): fondo de página y del navbar en reposo.
- **Hoja** (paper-sheet): superficies que se apoyan sobre el papel: proyecto destacado, tarjeta de respuesta API, chips de habilidad.
- **Papel Sombreado** (paper-shade): fondos hundidos: marco de captura, barra de dirección, opción activa del selector de idioma.
- **Tinta** (ink): títulos, texto principal y texto de peso (tagline, problema del destacado).
- **Grafito** (graphite): texto de párrafo por defecto, etiquetas y metadatos.
- **Regla** (rule) / **Regla Fuerte** (rule-strong): divisores de 1px; la fuerte abre tablas (habilidades, contacto, encabezados de trayectoria) y bordea el botón secundario.
- Modo oscuro: **Tinta Nocturna** (night-ink), **Hoja Nocturna** (night-sheet), **Sombra Nocturna** (night-shade), **Hueso** (bone), **Ceniza** (ash), **Regla Nocturna** (night-rule / night-rule-strong) toman los mismos roles.

### Semantic
- **Verde Estado** (status-ok / night-status-ok): token `--status-ok`, solo el punto de "200 OK" en la tarjeta de respuesta API. No es un segundo acento.

### Named Rules
**La Regla del Acento Único.** Óxido es el único color con saturación en la página. Marca índices, la acción primaria y el estado activo; nunca rellena áreas grandes ni aparece como gradiente.

**La Regla de los Roles Gemelos.** Todo token claro tiene su par oscuro con el mismo rol. No se introduce un color en un tema sin su contraparte en el otro.

## Typography

**Display Font:** Schibsted Grotesk (con system-ui, sans-serif)
**Body Font:** Schibsted Grotesk (con system-ui, sans-serif)
**Label/Mono Font:** IBM Plex Mono (con ui-monospace, Consolas, monospace)

**Character:** Una grotesca de prensa, apretada y segura en los títulos, acompañada de una mono técnica que hace de rotulador de la ficha: numera, etiqueta y muestra datos.

### Hierarchy
- **Display** (700, clamp(3rem, 7.5vw, 6rem), 0.95): solo el nombre en el hero; el punto final va en Óxido.
- **Headline** (600, clamp(2.25rem, 5vw, 3.5rem), 1.1): títulos de sección; el título de contacto usa una variante de clamp(2rem, 4.5vw, 3.25rem).
- **Title** (600, 1.5rem, 1.1): títulos de proyecto; el destacado sube a clamp(1.75rem, 3vw, 2.4rem) y la trayectoria baja a 1.3rem.
- **Body Lead** (400, 1.15rem, 1.55): tagline del hero en Tinta; máximo 34rem de ancho.
- **Subtitle** (400, 1.05rem, 1.6): subtítulo de sección e introducción de contacto.
- **Body** (400, 1rem, 1.6): párrafos en Grafito, `text-wrap: pretty`; descripciones de proyecto a 0.975rem.
- **Body Compact** (400, 0.95rem, 1.6): texto de botones, decisiones del destacado, descripciones de trayectoria y problema de proyecto.
- **Body Small** (400, 0.925rem, 1.6): links del navbar, chips de habilidad y decisiones de las filas de proyecto.
- **Label Large** (Plex Mono 400–500, 0.8rem, tracking 0.04em): eyebrows de sección, kicker del hero, categorías de habilidades, encabezados de trayectoria, barra de la tarjeta de respuesta API.
- **Label** (Plex Mono 400–500, 0.72–0.78rem, tracking 0.04–0.06em, mayúsculas en rótulos): índices, períodos, tags, rótulos de tabla.

**Escala de cuerpo:** 1.15 · 1.05 · 1 · 0.95 · 0.925rem en Grotesk; 0.8 · 0.75rem en Plex Mono. Un tamaño nuevo entra a la escala solo si se repite en más de un componente.
- **Code** (Plex Mono 400, 0.875rem, 1.75): el cuerpo JSON de la tarjeta de respuesta API, con `white-space: pre`.

### Named Rules
**La Regla del Rotulador.** La mono nunca lleva párrafos. Se usa para lo que una ficha técnica imprimiría en un rótulo: números, fechas, categorías, tags, endpoints.

**La Regla del Tracking Negativo.** Los títulos se cierran con tracking negativo (−0.02em a −0.045em, más apretado cuanto más grande) y `text-wrap: balance`.

## Layout

Columna central de 1200px con gutter fluido (clamp(16px, 4vw, 40px)). Página única con navbar sticky de 64px y `scroll-padding-top` que deja libre el encabezado al saltar a una sección.

Cada sección tiene 6rem de padding vertical (4.5rem bajo 820px) y una regla superior de 1px. El encabezado de sección es un eyebrow mono con índice (`01`) seguido de una línea que corre hasta el borde, luego el título y un subtítulo de hasta 560px; 3.5rem de separación hasta el contenido (2.5rem en móvil).

El contenido se organiza como tablas de documento: habilidades en filas categoría / lista (260px + resto), proyectos secundarios en filas índice / cuerpo / aside (4rem + 1fr + 300px), trayectoria en dos columnas 1.5fr / 1fr, contacto como lista de definiciones con rótulo de 7.5rem. Hero en dos columnas 1.1fr / 0.9fr con la tarjeta de respuesta API a la derecha.

Puntos de quiebre observados: 980px (hero y destacado a una columna), 860px (navbar a menú móvil), 760px (filas a una columna), 480px (botones del hero a ancho completo). Objetivos táctiles de 44px mínimo en todos los controles.

## Elevation & Depth

El sistema es plano por defecto y construye profundidad con tono y reglas: Hoja sobre Papel Cálido, Papel Sombreado para lo hundido, bordes de 1px para separar. La única sombra (`--shadow`, difusa y desplazada hacia abajo) aparece solo en la tarjeta de respuesta API. El navbar gana un fondo translúcido con desenfoque de 10px únicamente cuando hay scroll.

### Shadow Vocabulary
- **Sombra de Hoja** (`box-shadow: 0 10px 30px -12px rgba(21, 23, 28, 0.18)`; en oscuro `rgba(0, 0, 0, 0.6)`): la hoja que se levanta del papel. Solo la tarjeta de respuesta API.

### Named Rules
**La Regla de la Hoja Plana.** Las superficies descansan planas. La sombra marca solo el único objeto "impreso" del hero; nunca se usa para separar filas o tarjetas en serie, ni para simular que un contenedor es un link.

## Shapes

Formas casi rectas. 4px para todo lo interactivo y lo pequeño (botones, icon buttons, tags, chips, selector de idioma, anillo de foco); 8px solo para superficies contenedoras (destacado, tarjeta de respuesta API, marco de captura). Lo circular se reserva para indicadores: los puntos del marco de navegador y el punto de estado. Las líneas de 1px son el elemento formal dominante: reglas de sección, el remate del eyebrow, el subrayado del link activo y la viñeta corta (6px × 1px) de las listas de decisiones.

## Components

Carácter general: preciso y sobrio. Bordes de 1px, acento solo en la acción primaria, plano en reposo. La respuesta al interactuar es mínima y funcional: una leve elevación al pasar el cursor, una leve presión al hacer clic, y nada con `prefers-reduced-motion` ni en dispositivos sin hover.

### Buttons
- **Shape:** esquinas casi rectas (4px), altura mínima de 44px (40px en la variante pequeña).
- **Primary:** fondo Óxido, texto blanco (Tinta Nocturna en oscuro), Grotesk 500 a 0.95rem, padding 0.7rem × 1.25rem; con icono a 0.55rem de separación.
- **Hover / Focus:** el fondo pasa a Óxido Profundo y el botón sube 1px; al presionar baja 1px y escala a 0.98. Foco: anillo Óxido de 2px con 3px de separación.
- **Secondary:** transparente con borde Regla Fuerte y texto Tinta; al pasar el cursor, texto y borde a Óxido.
- **Icon button:** cuadrado de 44px, borde Regla, icono Grafito; hover a Óxido, presión a escala 0.94.

### Chips
- **Tag:** borde Regla de 1px, texto Grafito en Plex Mono 0.75rem, sin fondo. Solo informativo.
- **Skill chip:** fondo Hoja, borde Regla, texto Tinta a 0.925rem con icono de 16px en Grafito; al pasar el cursor el borde se refuerza y el icono pasa a Óxido.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** Hoja sobre Papel Cálido.
- **Shadow Strategy:** plana en reposo; ver Elevation & Depth.
- **Border:** 1px Regla.
- **Hover:** ninguno. El destacado no es un link: es una superficie estática, sin elevación, zoom ni brillo.
- **Internal Padding:** 2.5rem (1.5rem bajo 760px).
- Solo el proyecto destacado es una tarjeta. Los demás proyectos son filas separadas por reglas.

### Navigation
- Marca `dantrottel_` en Plex Mono 500 con el guion bajo fijo en Óxido. Sin parpadeo ni texto que se revuelve.
- Links en Grotesk 0.925rem, Grafito; hover y activo en Tinta. El activo se subraya con una línea Óxido de 1px que crece desde la izquierda.
- Selector ES / EN segmentado en mono 0.75rem; la opción activa sobre Papel Sombreado.
- Bajo 860px: menú a pantalla completa con links de 1.75rem, índice mono en Óxido y reglas entre filas.

### Tarjeta de respuesta API (signature)
La evidencia de AcTitUBB en la portada, como respuesta HTTP: barra con método `GET` en pastilla Óxido, ruta `/proyectos/actitubb` (`/projects/actitubb` en EN) y `200 OK` con punto Verde Estado; cuerpo JSON en Plex Mono con claves en Tinta (traducidas en EN), strings y números en Óxido y puntuación en Grafito. Los números van sin comillas, como en JSON real. Solo lleva datos verificables del proyecto, nunca datos de perfil que ya dice el hero. Sobre Hoja, 8px, con Sombra de Hoja. Las líneas nunca se cortan (`white-space: pre`); en pantallas pequeñas la fuente escala para que la línea más larga quepa.

### Proyecto destacado (signature)
Tarjeta con índice mono "01 · Proyecto destacado", título grande, el problema en Tinta y la captura dentro de un marco de navegador mínimo (tres puntos y barra de dirección en mono). Las decisiones técnicas van debajo, tras una regla, en una lista numerada `01`–`05` de dos columnas con números mono en Óxido. Cada decisión sigue el formato "decisión: razón": la decisión en Tinta 600 y la razón en Grafito. Cierra con una fila tras otra regla: "Ver código" como botón primario a la izquierda, justo después de las decisiones que respalda, y los tags del stack alineados a la derecha. Es la única tarjeta donde el código es la acción principal.

## Do's and Don'ts

### Do:
- **Do** usar reglas de 1px (Regla / Regla Fuerte) para estructurar contenido antes de recurrir a una superficie o una sombra.
- **Do** reservar Óxido para índices, la acción primaria y los estados activos.
- **Do** etiquetar con Plex Mono (índices `01`, períodos, categorías, tags) y escribir en Schibsted Grotesk.
- **Do** mantener 4px en lo interactivo y 8px en las superficies, y 44px como objetivo táctil mínimo.
- **Do** definir cada color nuevo en ambos temas con el mismo rol.
- **Do** limitar el movimiento a respuestas de interacción (subir 1px, presión a 0.98) con `cubic-bezier(0.22, 1, 0.36, 1)`, desactivado con `prefers-reduced-motion` y en `hover: none`.

### Don't:
- **Don't** usar el look "dev oscuro neón": fondos negros con gradientes morado/cian, glow ni glassmorphism.
- **Don't** caer en la plantilla genérica de portafolio: hero con foto centrada, rejillas de tarjetas con sombra idénticas ni barras de porcentaje de habilidades.
- **Don't** agregar efectos decorativos sin función: carruseles infinitos de tecnologías, texto que aparece letra por letra, tarjetas que se inclinan con el mouse, partículas o canvas de fondo, ni animaciones al hacer scroll en cada bloque.
- **Don't** introducir un segundo color de acento; el verde de estado vive solo en el indicador "200 OK".
- **Don't** usar la mono para párrafos.
