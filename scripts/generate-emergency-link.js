const fs = require('fs');
const path = require('path');

// Cargar variables de entorno manualmente si es necesario
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

async function generateEmergencyLink() {
    console.log('\n🚨 GENERADOR DE ENLACE DE PAGO DE EMERGENCIA');
    console.log('==========================================\n');

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!token || token.includes('MOCK')) {
        console.warn('⚠️ MODO SIMULACIÓN ACTIVO: Generando enlace de prueba');
        const mockLink = 'http://localhost:3000/membership?status=success&simulated=true';
        console.log('✅ ENLACE DE PRUEBA GENERADO (Elite Vison):');
        console.log('\n🔗 ' + mockLink + '\n');
        console.log('Usa este link para demostrar el flujo de pago sin esperar al token real.');
        return;
    }

    try {
        // Usar fetch directo si la librería falla
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: [
                    {
                        title: "Acceso Elite Digital Double",
                        quantity: 1,
                        unit_price: 29.99,
                        currency_id: "USD"
                    }
                ],
                back_urls: {
                    success: "https://google.com",
                    failure: "https://google.com",
                    pending: "https://google.com"
                },
                auto_return: "approved"
            })
        });

        const data = await response.json();

        if (data.init_point) {
            console.log('✅ ENLACE GENERADO CON ÉXITO:');
            console.log('\n🔗 ' + data.init_point + '\n');
            console.log('Copia este link y envíalo a tu cliente para cobrar AHORA.');
        } else {
            console.error('❌ Error de Mercado Pago:', data);
        }
    } catch (error) {
        console.error('❌ Error inesperado:', error.message);
    }
}

generateEmergencyLink();
