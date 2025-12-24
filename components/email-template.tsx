// Componente para emails (puedes usar con servicios como Resend, SendGrid, etc.)

export function WelcomeEmail({ name }: { name: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a SaaS Factory</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">¡Bienvenido a SaaS Factory!</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hola ${name},</p>
          <p>¡Gracias por unirte a SaaS Factory! Estamos emocionados de tenerte a bordo.</p>
          <p>Tu cuenta ha sido creada exitosamente. Ahora puedes:</p>
          <ul>
            <li>Crear tu primera organización</li>
            <li>Explorar todas las funcionalidades</li>
            <li>Invitar miembros a tu equipo</li>
            <li>Configurar suscripciones</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Ir al Dashboard
            </a>
          </div>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <p>¡Éxito con tu SaaS!</p>
          <p>El equipo de SaaS Factory</p>
        </div>
      </body>
    </html>
  `
}

export function PaymentSuccessEmail({ 
  name, 
  plan, 
  amount 
}: { 
  name: string
  plan: string
  amount: number 
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Pago Exitoso - SaaS Factory</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #10b981; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">¡Pago Exitoso!</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hola ${name},</p>
          <p>Tu pago ha sido procesado exitosamente.</p>
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Monto:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Estado:</strong> Activo</p>
          </div>
          <p>Tu suscripción está ahora activa y puedes disfrutar de todas las funcionalidades premium.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Ver Dashboard
            </a>
          </div>
          <p>Gracias por confiar en nosotros.</p>
          <p>El equipo de SaaS Factory</p>
        </div>
      </body>
    </html>
  `
}






