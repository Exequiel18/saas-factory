const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno manualmente
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const prisma = new PrismaClient();

async function testConnection() {
    console.log('--- TEST CONEXIÓN BASE DE DATOS ---');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'DEFINIDA' : 'FALTA');

    try {
        await prisma.$connect();
        console.log('✅ CONEXIÓN EXITOSA A LA BASE DE DATOS');

        // Intentar una consulta simple
        const userCount = await prisma.user.count();
        console.log('📊 Usuarios en la base de datos:', userCount);

    } catch (error) {
        console.error('❌ ERROR DE CONEXIÓN:', error.message);
        if (error.code === 'P1001') {
            console.error('CONSEJO: Verifica que la base de datos esté encendida y la URL sea correcta.');
        }
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
