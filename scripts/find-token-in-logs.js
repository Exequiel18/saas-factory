const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findToken() {
    console.log('🔍 Buscando token en SystemLog...');
    try {
        const logs = await prisma.systemLog.findMany({
            where: {
                OR: [
                    { message: { contains: 'MERCADOPAGO' } },
                    { metadata: { contains: 'APP_USR-' } },
                    { metadata: { contains: 'MERCADOPAGO' } }
                ]
            }
        });

        if (logs.length > 0) {
            console.log(`✅ Se encontraron ${logs.length} logs potenciales.`);
            logs.forEach(log => {
                console.log('---');
                console.log(`[${log.createdAt}] ${log.message}`);
                console.log(`Metadata: ${log.metadata}`);
            });
        } else {
            console.log('❌ No se encontraron rastros del token en los logs.');
        }
    } catch (error) {
        console.error('❌ Error al consultar la base de datos:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

findToken();
