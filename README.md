# Daniel Aguayo — Portafolio

Portafolio personal como Desarrollador Full Stack. Incluye secciones de presentación, habilidades, proyectos, estudios, experiencia laboral y formulario de contacto.

🔗 **[Ver en vivo](https://dantrotel.github.io/Portafolio/)**

## Stack

- **React 19** + **Vite**
- **Framer Motion** — animaciones y transiciones
- **React Icons** — iconografía
- Soporte bilingüe (ES / EN)
- Tema claro / oscuro
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
├── components/     # Componentes de React (.jsx + .css)
├── data/           # Datos estáticos (proyectos, skills, educación, experiencia)
├── i18n.js         # Traducciones ES/EN
├── index.css       # Estilos globales y design tokens
├── App.jsx         # Componente raíz con routing por hash
└── main.jsx        # Entry point
```

## Licencia

MIT
