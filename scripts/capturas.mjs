// Genera las versiones WebP de una captura de proyecto para el srcset.
//
// Uso:   npm run capturas -- capturas/comision.png
// Salida: public/projects/<nombre>-1200.webp y public/projects/<nombre>-640.webp
//
// Requiere ffmpeg con libwebp en el PATH (https://ffmpeg.org/download.html).
// El PNG original vive en capturas/ (fuera de public/, así no se publica).
// Después de generarlas, en src/data/projectsData.js:
//   image: 'projects/<nombre>-1200.webp', imageSmall: 'projects/<nombre>-640.webp'
// y si cambia la proporción, actualiza imageWidth / imageHeight con el tamaño que imprime este script.
import { execFileSync } from 'node:child_process'
import { basename, extname, join } from 'node:path'

const WIDTHS = [1200, 640]
const QUALITY = 82

const source = process.argv[2]
if (!source) {
  console.error('Falta la ruta de la captura. Ejemplo: npm run capturas -- capturas/comision.png')
  process.exit(1)
}

const name = basename(source, extname(source))

for (const width of WIDTHS) {
  const out = join('public', 'projects', `${name}-${width}.webp`)
  execFileSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', source,
    '-vf', `scale=${width}:-2:flags=lanczos`,
    '-c:v', 'libwebp', '-quality', String(QUALITY), '-compression_level', '6',
    out,
  ], { stdio: 'inherit' })

  const size = execFileSync('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'csv=s=x:p=0', out,
  ]).toString().trim()
  console.log(`${out}  ${size}`)
}
