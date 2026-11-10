# Música del reproductor

La carpeta `public/music/` guarda las pistas del reproductor del escritorio. Viene vacía a propósito (solo con un `.gitkeep`): agrega solo música propia o con una licencia que permita publicarla (por ejemplo CC BY, citando al autor).

## Formato

- **MP3** (o OGG/Opus si prefieres), estéreo, 128–192 kbps. Con eso cada pista pesa unos 3–5 MB.
- Nombres en minúsculas, sin espacios ni tildes: `mi-tema.mp3`.
- Las pistas no se descargan al abrir la página (`preload="none"`): solo cuando alguien aprieta play.

## Cómo agregar una pista

1. Copia el archivo aquí: `public/music/mi-tema.mp3`.
2. Regístrala en `src/data/tracks.js`:

```js
export const tracks = [
  { title: 'Mi tema', artist: 'Daniel Aguayo', src: 'music/mi-tema.mp3' },
]
```

El orden del arreglo es el orden de reproducción. Con la lista vacía, el reproductor muestra «Sin pistas».
