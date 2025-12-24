/**
 * 📤 SUBIR A GITHUB
 * 
 * Este script te ayuda a subir el código a GitHub.
 */

const { execSync } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('\n📤 SUBIR CÓDIGO A GITHUB')
  console.log('=========================\n')

  // Verificar si ya tiene remote
  try {
    const existingRemote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim()
    console.log(`✅ Ya tenés un remote configurado: ${existingRemote}\n`)
    
    const pushNow = await question('¿Querés hacer push ahora? (s/n): ')
    if (pushNow.toLowerCase() === 's') {
      console.log('\n📤 Haciendo push...\n')
      try {
        execSync('git push -u origin main', { stdio: 'inherit' })
        console.log('\n✅ Push exitoso!\n')
      } catch (e) {
        console.log('\n⚠️  Error en push. Intentá manualmente:\n')
        console.log('   git push -u origin main\n')
      }
      rl.close()
      return
    }
  } catch {
    // No hay remote, continuar
  }

  console.log('Necesitás la URL de tu repositorio de GitHub.\n')
  console.log('Si NO tenés repo:')
  console.log('1. Ve a https://github.com/new')
  console.log('2. Creá un nuevo repositorio')
  console.log('3. Copiá la URL (ej: https://github.com/tu-usuario/tu-repo.git)\n')
  
  const repoUrl = await question('URL del repositorio: ')

  if (!repoUrl || !repoUrl.includes('github.com')) {
    console.log('\n❌ URL inválida. Debe ser una URL de GitHub.\n')
    rl.close()
    return
  }

  console.log('\n📤 Configurando remote...\n')

  try {
    execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' })
    console.log('✅ Remote agregado\n')
  } catch (e) {
    if (e.message.includes('already exists')) {
      const replace = await question('El remote ya existe. ¿Reemplazarlo? (s/n): ')
      if (replace.toLowerCase() === 's') {
        execSync(`git remote set-url origin ${repoUrl}`, { stdio: 'inherit' })
        console.log('✅ Remote actualizado\n')
      }
    } else {
      console.log('⚠️  Error agregando remote\n')
      rl.close()
      return
    }
  }

  console.log('📤 Haciendo push...\n')

  try {
    execSync('git push -u origin main', { stdio: 'inherit' })
    console.log('\n✅ Push exitoso!\n')
    console.log('🎯 PRÓXIMO PASO: Deploy en Vercel\n')
    console.log('1. Ve a https://vercel.com')
    console.log('2. Importá tu repositorio')
    console.log('3. Configurá las variables de entorno')
    console.log('4. Deploy\n')
  } catch (e) {
    console.log('\n⚠️  Error en push. Posibles causas:\n')
    console.log('1. La rama se llama "master" en lugar de "main"')
    console.log('2. El repositorio no existe o no tenés permisos')
    console.log('3. Necesitás autenticarte\n')
    console.log('Intentá manualmente:')
    console.log(`   git push -u origin main\n`)
    console.log('O si tu rama se llama "master":')
    console.log(`   git push -u origin master\n`)
  }

  rl.close()
}

main().catch(console.error)

