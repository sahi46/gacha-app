import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '../public')
mkdirSync(publicDir, { recursive: true })

function makeSvg(size) {
  const r = Math.round(size * 0.2)
  const emoji = size >= 256 ? '320' : '110'
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
  <text x="${size / 2}" y="${size * 0.72}" font-size="${Math.floor(size * 0.62)}"
    text-anchor="middle" font-family="serif">🎰</text>
</svg>`
}

async function generate(size, filename) {
  const svg = Buffer.from(makeSvg(size))
  await sharp(svg).png().toFile(resolve(publicDir, filename))
  console.log(`✓ public/${filename}`)
}

await generate(192, 'icon-192.png')
await generate(512, 'icon-512.png')
console.log('Done!')
