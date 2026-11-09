# dantrottel — Portafolio de Daniel Aguayo

Portafolio personal como Desarrollador Full Stack. Página única con secciones de presentación, habilidades, proyectos, experiencia, estudios y contacto.

**[Ver en vivo](https://dantrotel.github.io/Portafolio/)**

## Stack

- **React 19** + **Vite**
- Animaciones en CSS, sin librerías de animación
- **React Icons** — iconografía
- Soporte bilingüe (ES / EN) con detección del idioma del navegador
- Tema claro / oscuro con paleta azul marino, persistido y sin flash al cargar
- Respeta `prefers-reduced-motion`
- Deploy automático a GitHub Pages

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

## Deploy

El deploy a GitHub Pages se ejecuta automáticamente al hacer push a `main` via GitHub Actions.

Para deploy manual:

```bash
npm run deploy
```

## Estructura del proyecto

```
src/
├── components/     # Secciones y piezas de UI (.jsx + .css por componente)
├── hooks/          # useActiveSection: sección visible para el navbar
├── data/           # Datos estáticos (proyectos, skills, educación, experiencia)
├── i18n.js         # Traducciones ES/EN
├── index.css       # Design tokens, estilos base y utilidades compartidas
├── App.jsx         # Página única con scroll, tema e idioma
└── main.jsx        # Entry point
```

## Licencia

MIT

## Capturas de proyectos

Las capturas se publican como WebP en dos tamaños (1200 y 640 px) para el `srcset`. El PNG original va en `capturas/`, que no se publica.

```bash
# Requiere ffmpeg con libwebp en el PATH
npm run capturas -- capturas/comision.png
# → public/projects/comision-1200.webp y public/projects/comision-640.webp
```

Luego, en `src/data/projectsData.js`, apunta `image` e `imageSmall` a los archivos nuevos y actualiza `imageWidth` / `imageHeight` con el tamaño que imprime el script (cambian si la captura nueva tiene otra proporción).
