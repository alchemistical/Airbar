import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('apps/web/src')
const CANDIDATES = [
  'app/router.tsx', 'router.tsx', 'app/routes.tsx', 'routes.tsx', 'App.tsx'
].map(p => path.join(ROOT, p))

const found = CANDIDATES.find(p => fs.existsSync(p))
if (!found) { 
  console.log('Router not found'); 
  process.exit(2) 
}

console.log(`Found router at: ${found}`)

const txt = fs.readFileSync(found, 'utf8')
const re = /from\s+['\"](.+?)['\"]/g
const results = []
let m

while ((m = re.exec(txt))) {
  const spec = m[1]
  if (spec.startsWith('.') || spec.startsWith('/')) {
    const basePath = path.dirname(found)
    let full
    
    if (spec.startsWith('./') || spec.startsWith('../')) {
      full = path.resolve(basePath, spec)
    } else {
      full = path.resolve(ROOT, spec.slice(1)) // Remove leading /
    }
    
    const candidates = [
      full, 
      full + '.tsx', 
      full + '.ts', 
      path.join(full, 'index.tsx'), 
      path.join(full, 'index.ts')
    ]
    
    const exists = candidates.find(f => fs.existsSync(f))
    results.push({ spec, resolved: !!exists, path: exists || null })
  } else {
    results.push({ spec, resolved: true, note: 'alias/pkg' })
  }
}

fs.mkdirSync('docs/_incoming/web_resurrection', { recursive: true })
fs.writeFileSync('docs/_incoming/web_resurrection/route_audit.json', JSON.stringify({ 
  routerFile: found, 
  results 
}, null, 2))

const broken = results.filter(r => !r.resolved)
if (broken.length) { 
  console.log('Broken imports:', broken)
  process.exit(1) 
}

console.log(`Route audit passed - ${results.length} imports checked`)
console.log(`Router file: ${path.relative(process.cwd(), found)}`)