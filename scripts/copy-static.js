import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dist = path.resolve(root, 'dist')

// Copy manifest
fs.copyFileSync(
  path.resolve(root, 'manifest.json'),
  path.resolve(dist, 'manifest.json')
)

// Copy public folder if exists
const publicDir = path.resolve(root, 'public')
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, dist, { recursive: true })
}

console.log('Static files copied to dist')