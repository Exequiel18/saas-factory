# 🤝 Chequeo Real de Negocio

> **La verdad incómoda que tu negocio necesita escuchar**

El producto no es el SaaS. El producto es **claridad, diagnóstico honesto, prioridad correcta y alivio mental**.

En 3 minutos, le decimos a cualquier negocio si está bien armado o solo se sostiene. Sin humo, sin promesas. Solo la verdad.

**Si laburás solo, esto es para vos.**

---

## ✨ El Producto Real

### 🎯 Chequeo Real (MVP que Cobra)
- **6-8 preguntas simples**: El usuario responde sobre su negocio
- **Cálculo automático**: El sistema evalúa internamente (score, margen, tendencias)
- **Traducción humana**: Convierte números técnicos en verdades que conectan
  - 1 frase fuerte que resume la situación
  - 1 problema principal en lenguaje claro
  - 1 acción concreta y ejecutable
- **Pago único**: $3.000 ARS por diagnóstico completo
- **Upsell inteligente**: Si score < 40, muestra mensaje: "No estás mal vos. Con este diagnóstico, lo raro sería que te vaya bien solo."

### 💰 Cómo Hace Plata
1. **Chequeo Real** (`/chequeo-real`): Pago único de $3.000 ARS
2. **Plan Mensual** (`/pricing`): $4.900 ARS/mes para seguimiento continuo
3. **Upsell automático**: Se activa cuando el diagnóstico muestra riesgo

### 🧠 Sistema Autónomo
- **Alertas Automáticas**: Genera alertas cuando detecta riesgos u oportunidades
- **Ritmo Emocional**: Controla estímulos (máx 1 estímulo fuerte por sesión)
- **Defensa de Score**: Evita inflación y scores planos
- **Clasificación de Usuarios**: Sistema en sombra para análisis futuro

### 📊 Dashboard Completo
- **Métricas en Tiempo Real**: Visualización de KPIs críticos
- **War Room**: Vista completa del imperio de negocios
- **Gestión de Organizaciones**: Multi-tenant completo
- **Sistema de Referidos**: Programa de referidos con créditos

---

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 (React 18), Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL (producción) / SQLite (desarrollo)
- **Autenticación**: NextAuth.js con Credentials Provider
- **Pagos**: Mercado Pago (Checkout Pro)
- **Email**: SendGrid / Resend / Nodemailer
- **Deploy**: Vercel (recomendado)

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- PostgreSQL (para producción)
- Cuenta de Mercado Pago

### Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd SAAS-FACTORY
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env.local
```

Completa todas las variables en `.env.local` (ver sección de configuración)

4. **Configurar base de datos**
```bash
npm run db:push
```

5. **Generar Prisma Client**
```bash
npm run postinstall
```

6. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## ⚙️ Configuración

### Variables de Entorno Requeridas

Copia `env.example` a `.env.local` y completa las siguientes variables:

#### 🔐 Autenticación
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-generado
```

**Generar NEXTAUTH_SECRET:**
```bash
node scripts/generate-secret.js
```

#### 💳 Mercado Pago
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-tu-public-key
MERCADOPAGO_ALIAS=tu-alias.mp
MERCADO_PAGO_WEBHOOK_SECRET=tu-webhook-secret
```

**Obtener credenciales:**
1. Ve a https://www.mercadopago.com.ar/developers/panel
2. Copia Access Token y Public Key
3. Usa credenciales de **PRODUCCIÓN** (no test)

#### 🗄️ Base de Datos
```env
DATABASE_URL=postgresql://usuario:password@host:puerto/database
```

**Opciones de base de datos:**
- **Vercel Postgres** (recomendado): Se conecta automáticamente
- **Railway**: https://railway.app (gratis)
- **PlanetScale**: https://planetscale.com (gratis)

#### 📧 Email (Opcional)
```env
SENDGRID_API_KEY=tu-sendgrid-key
EMAIL_FROM=noreply@tudominio.com
# O usar Resend
RESEND_API_KEY=tu-resend-key
```

#### 🔔 Webhooks y APIs (Opcional)
```env
OUTBOUND_WEBHOOK_URL=https://tu-webhook-url.com
EMAIL_API_KEY=tu-email-api-key
ALERT_API_KEY=tu-alert-api-key
EMPIRE_SECRET=tu-empire-secret
CURRENCY=ARS
```

---

## 📁 Estructura del Proyecto

```
SAAS-FACTORY/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── mercadopago/   # Integración Mercado Pago
│   │   ├── business/      # Evaluación de negocios
│   │   ├── alerts/        # Sistema de alertas
│   │   └── metrics/       # Métricas críticas
│   ├── dashboard/         # Dashboard principal
│   ├── auth/              # Páginas de autenticación
│   ├── calculator/        # Calculadora de negocio
│   ├── pricing/           # Página de precios
│   └── page.tsx           # Landing page
├── components/            # Componentes React
│   ├── ui/               # Componentes UI base
│   ├── business-score-card.tsx
│   └── ...
├── lib/                   # Utilidades y lógica de negocio
│   ├── prisma.ts         # Cliente Prisma
│   ├── auth.ts           # Configuración NextAuth
│   ├── business-evaluator.ts
│   ├── alert-system.ts
│   └── mercadopago/      # Integración MP
├── prisma/
│   └── schema.prisma     # Schema de base de datos
├── scripts/              # Scripts de utilidad
│   ├── generate-secret.js
│   ├── deploy-production.ps1
│   └── ...
└── public/               # Archivos estáticos
```

---

## 🚢 Deploy a Producción

### Opción 1: Vercel (Recomendado)

1. **Conectar repositorio**
   - Ve a https://vercel.com
   - Importa tu repositorio Git

2. **Configurar variables de entorno**
   - En el dashboard de Vercel, ve a Settings → Environment Variables
   - Agrega todas las variables de `.env.local`

3. **Configurar base de datos**
   - Vercel Dashboard → Storage → Create Postgres
   - Se conecta automáticamente a tu proyecto

4. **Deploy**
   - Vercel detecta cambios automáticamente
   - O usa: `vercel --prod`

### Opción 2: Script Automático

```bash
.\scripts\deploy-production.ps1
```

O en Windows:
```bash
.\scripts\LAUNCH_NOW.ps1
```

### ⚠️ Configuración Post-Deploy

**CRÍTICO: Configurar Webhook de Mercado Pago**

1. Ve a https://www.mercadopago.com.ar/developers/panel
2. Webhooks → Crear nuevo
3. URL: `https://tu-dominio.com/api/mercadopago/webhook`
4. Eventos:
   - ✅ `payment.created`
   - ✅ `payment.updated`
5. Guardar

**Sin esto, los pagos no se procesan automáticamente.**

---

## 🧪 Testing

### Probar Pagos

**Tarjetas de prueba Mercado Pago:**
- Aprobada: `5031 7557 3453 0604` (CVV: 123)
- Rechazada: `5031 4332 1540 6351` (CVV: 123)

### Endpoints de Salud

```bash
# Verificar estado del sistema
GET /api/health

# Verificar configuración de Mercado Pago
GET /api/mercadopago/status
```

---

## 📚 Documentación Adicional

- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) - Checklist completo de lanzamiento
- [ESTADO_PROYECTO.md](./ESTADO_PROYECTO.md) - Estado actual del proyecto
- [ESTADO_FINAL_SISTEMA.md](./ESTADO_FINAL_SISTEMA.md) - Resumen ejecutivo del sistema
- [MONETIZACION_ACTIVA.md](./MONETIZACION_ACTIVA.md) - Detalles de monetización

---

## 🎯 Flujos de Monetización

### 1. Pago Único (Calculator)
- **Ruta**: `/calculator`
- **Precio**: $3.000 ARS
- **Endpoint**: `POST /api/mercadopago/create-preference`
- **Uso**: Diagnóstico completo de negocio

### 2. Suscripción Mensual
- **Ruta**: `/pricing`
- **Planes**:
  - Pro: $4.900 ARS/mes
  - Premium: $19.000 ARS/mes
- **Endpoint**: `POST /api/mercadopago/checkout`

### 3. Upsell Automático
- Se activa cuando `score < 40`
- Rotación de mensajes automática
- Control de ritmo emocional

---

## 🔒 Seguridad

- ✅ Autenticación con NextAuth.js
- ✅ Passwords hasheados con bcryptjs
- ✅ Validación de webhooks con HMAC
- ✅ Variables de entorno seguras
- ✅ Protección CSRF integrada

---

## 📊 Métricas Críticas

El sistema rastrea 5 métricas críticas:

1. **% de usuarios que vuelven sin email** - Retención orgánica
2. **% de score < 40 que ve upsell** - Visibilidad del upsell
3. **% de upsells que convierten** - Efectividad del upsell
4. **Score promedio por usuario** - Salud general
5. **Tasa de cancelación mensual** - Churn rate

**Endpoint**: `GET /api/metrics/critical`

---

## 🐛 Solución de Problemas

### Error: "MERCADOPAGO_ACCESS_TOKEN is not set"
→ Verifica variables de entorno en Vercel/hosting

### Error: "Webhook not working"
→ Verifica URL pública y eventos configurados en Mercado Pago

### Error: "Database connection failed"
→ Verifica DATABASE_URL y que Postgres esté activo

### Pagos no aparecen en dashboard
→ Revisa webhook y logs de `/api/mercadopago/webhook`

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm run start

# Linting
npm run lint

# Base de datos
npm run db:push

# Generar secret
node scripts/generate-secret.js
```

---

## 🤝 Contribuir

Este es un proyecto privado. Para sugerencias o mejoras, contacta al equipo.

---

## 📄 Licencia

Privado - Todos los derechos reservados

---

## 🎉 Estado del Proyecto

✅ **Sistema Operativo y Listo para Producción**

- ✅ Evaluación automática de negocios
- ✅ Sistema de pagos integrado
- ✅ Alertas automáticas
- ✅ Dashboard completo
- ✅ Sistema de referidos
- ✅ Webhooks configurados
- ✅ Deploy listo

**¡Tu SaaS está vivo y listo para generar ingresos!** 🚀💰

---

*Última actualización: 2025*

