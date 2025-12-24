/**
 * 🔧 FIX API ROUTES - Agregar dynamic = 'force-dynamic' a todas las rutas que lo necesitan
 */

const fs = require('fs')
const path = require('path')

const routesToFix = [
  'app/api/agents/run/route.ts',
  'app/api/metrics/critical/route.ts',
  'app/api/analytics/predictive/route.ts',
  'app/api/alerts/generate/route.ts',
  'app/api/mercadopago/webhook/route.ts',
  'app/api/mercadopago/create-preference/route.ts',
  'app/api/mercadopago/checkout/route.ts',
  'app/api/mercadopago/status/route.ts',
  'app/api/revenue/insights/route.ts',
  'app/api/metrics/route.ts',
  'app/api/organizations/route.ts',
  'app/api/users/classify/route.ts',
  'app/api/referrals/route.ts',
  'app/api/user/profile/route.ts',
  'app/api/notifications/route.ts',
  'app/api/email/send/route.ts',
  'app/api/upsell/check/route.ts',
  'app/api/actions/complete/route.ts',
  'app/api/alerts/unread/route.ts',
  'app/api/email-notifications/send-critical/route.ts',
  'app/api/emotional-rhythm/route.ts',
  'app/api/patterns/log/route.ts',
  'app/api/organizations/[id]/route.ts',
  'app/api/organizations/[id]/members/route.ts',
  'app/api/organizations/[id]/members/[memberId]/route.ts',
  'app/api/organizations/[id]/stats/route.ts',
  'app/api/billing/invoice/[id]/download/route.ts',
  'app/api/billing/subscription/upgrade/route.ts',
  'app/api/billing/subscription/cancel/route.ts',
  'app/api/billing/history/route.ts',
  'app/api/growth/hack/route.ts',
  'app/api/war-room/status/route.ts',
  'app/api/behavior/intent/route.ts',
  'app/api/autonomous-marketing/plan/route.ts',
  'app/api/ai/metrics/route.ts',
  'app/api/ai/actions/route.ts',
  'app/api/central-command/events/route.ts',
  'app/api/central-command/status/route.ts',
]

routesToFix.forEach(routePath => {
  const fullPath = path.join(process.cwd(), routePath)
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8')
    
    // Verificar si ya tiene dynamic
    if (!content.includes("export const dynamic")) {
      // Buscar el primer import o export
      const lines = content.split('\n')
      let insertIndex = 0
      
      // Encontrar dónde insertar (después de los imports)
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('export async function') || lines[i].startsWith('export function')) {
          insertIndex = i
          break
        }
      }
      
      // Si no encontramos export function, buscar después de los imports
      if (insertIndex === 0) {
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === '' && i > 0 && lines[i-1].includes('import')) {
            insertIndex = i
            break
          }
        }
      }
      
      lines.splice(insertIndex, 0, '', "export const dynamic = 'force-dynamic'")
      content = lines.join('\n')
      fs.writeFileSync(fullPath, content, 'utf8')
      console.log(`✅ Fixed: ${routePath}`)
    } else {
      console.log(`⏭️  Already has dynamic: ${routePath}`)
    }
  } else {
    console.log(`⚠️  Not found: ${routePath}`)
  }
})

console.log('\n✅ Done!')

