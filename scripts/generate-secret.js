// Genera NEXTAUTH_SECRET seguro para producción
const crypto = require('crypto')
const secret = crypto.randomBytes(32).toString('base64')
console.log('\n✅ NEXTAUTH_SECRET generado:')
console.log(secret)
console.log('\n📋 Copia esto a tu .env.local o variables de entorno de Vercel\n')






