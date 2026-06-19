/**
 * PNG 아이콘 생성 스크립트
 * 실행: node scripts/generate-icons.mjs
 *
 * sharp 패키지 필요: npm install --save-dev sharp
 * 설치 후 이 스크립트를 실행하면 public/icons/ 에 PNG 파일이 생성됩니다.
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('sharp 패키지가 필요합니다: npm install --save-dev sharp')
  process.exit(1)
}

const svgBuffer = readFileSync(join(root, 'public/icons/icon.svg'))

for (const size of [192, 512]) {
  const output = join(root, `public/icons/icon-${size}x${size}.png`)
  await sharp(svgBuffer).resize(size, size).png().toFile(output)
  console.log(`✅ icon-${size}x${size}.png 생성 완료`)
}
