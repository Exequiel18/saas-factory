# 🚀 DEPLOY A PRODUCCIÓN - GUÍA COMPLETA

> **Sacá tu SaaS online HOY. Paso a paso, sin complicaciones.**

---

## ✅ PRE-DEPLOY CHECKLIST

### 1. Variables de Entorno

Crea `.env.local` con:

```env
# Base de datos (OBLIGATORIO)
DATABASE_URL=postgresql://usuario:password@host:puerto/database

# Autenticación (OBLIGATORIO)
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=tu-secret-generado

# Mercado Pago (OBLIGATORIO para pagos)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-tu-public-key
MERCADOPAGO_ALIAS=tu-alias.mp
MERCADO_PAGO_WEBHOOK_SECRET=tu-webhook-secret

# Email (Opcional)
SENDGRID_API_KEY=tu-key
EMAIL_FROM=noreply@tudominio.com
```

**Generar NEXTAUTH_SECRET:**
```bash
node scripts/generate-secret.js
```

---

## 🚀 DEPLOY EN VERCEL (Recomendado)

### Paso 1: Preparar Repositorio

```bash
# Asegurate de tener todo commiteado
git add .
git commit -m "Ready for production"
git push
```

### Paso 2: Conectar con Vercel

1. Ve a https://vercel.com
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub/GitLab
4. Vercel detecta Next.js automáticamente

### Paso 3: Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:

Agrega TODAS las variables de `.env.local`:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (se auto-completa, pero verifica)
- `MERCADOPAGO_ACCESS_TOKEN`
- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
- `MERCADOPAGO_ALIAS`
- `MERCADO_PAGO_WEBHOOK_SECRET`
- Y todas las demás que necesites

### Paso 4: Configurar Base de Datos

**Opción A: Vercel Postgres (Más fácil)**
1. Vercel Dashboard → Storage → Create Postgres
2. Se conecta automáticamente
3. Copia `DATABASE_URL` a variables de entorno

**Opción B: Railway (Gratis)**
1. Ve a https://railway.app
2. New Project → PostgreSQL
3. Copia connection string → `DATABASE_URL`

### Paso 5: Deploy

1. Click "Deploy" en Vercel
2. Esperá 2-3 minutos
3. Tu sitio estará en `tu-proyecto.vercel.app`

### Paso 6: Aplicar Schema de Base de Datos

```bash
# Opción 1: Desde tu máquina local (conectado a la DB de producción)
npm run db:push

# Opción 2: Desde Vercel CLI
vercel env pull .env.local
npm run db:push
```

---

## 🔗 CONFIGURAR MERCADO PAGO WEBHOOK

**CRÍTICO:** Sin esto, los pagos no se procesan.

1. Ve a https://www.mercadopago.com.ar/developers/panel
2. Webhooks → Crear nuevo
3. URL: `https://tu-dominio.vercel.app/api/mercadopago/webhook`
4. Eventos:
   - ✅ `payment.created`
   - ✅ `payment.updated`
5. Copia el secret → `MERCADO_PAGO_WEBHOOK_SECRET`

---

## ✅ POST-DEPLOY VERIFICACIÓN

### 1. Verificar que el sitio carga
```
https://tu-dominio.vercel.app
```

### 2. Verificar Chequeo Real
```
https://tu-dominio.vercel.app/chequeo-real
```
- Debe cargar sin errores
- Las preguntas deben funcionar

### 3. Verificar Command Center
```
https://tu-dominio.vercel.app/dashboard/command-center
```
- Debe mostrar sistemas conectados
- Debe actualizar en tiempo real

### 4. Verificar API de Status
```bash
curl https://tu-dominio.vercel.app/api/central-command/status
```
- Debe devolver JSON con sistemas

### 5. Probar Pago (con tarjeta de prueba)
```
https://tu-dominio.vercel.app/chequeo-real
```
- Completar chequeo
- Click en "Quiero que me ayudes"
- Usar tarjeta de prueba MP

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Build failed"
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel

### Error: "Database connection failed"
- Verifica `DATABASE_URL` en variables de entorno
- Asegurate de que la DB esté activa

### Error: "NEXTAUTH_SECRET is missing"
- Genera secret: `node scripts/generate-secret.js`
- Agrégalo a variables de entorno en Vercel

### Pagos no funcionan
- Verifica webhook configurado en Mercado Pago
- Verifica `MERCADO_PAGO_WEBHOOK_SECRET`
- Revisa logs en Vercel → Functions

---

## 📊 MONITOREO POST-DEPLOY

### Vercel Analytics (Opcional)
1. Vercel Dashboard → Analytics
2. Activa Analytics (gratis hasta cierto límite)
3. Ve tráfico, conversiones, etc.

### Command Center
- Abrí `/dashboard/command-center`
- Monitoreá sistemas en tiempo real
- Ve eventos automáticamente

---

## 🎯 PRIMEROS PASOS DESPUÉS DEL DEPLOY

1. **Probar el chequeo completo**
   - Completar las 6 preguntas
   - Ver diagnóstico
   - Probar pago (con tarjeta de prueba)

2. **Compartir el link**
   - Compartí `/chequeo-real` en grupos
   - "Estoy probando esto, si querés lo probás"

3. **Monitorear en Command Center**
   - Ve quién completa chequeos
   - Ve eventos en tiempo real
   - Ajustá según lo que veas

---

## ✅ CHECKLIST FINAL

- [ ] Repositorio en Git
- [ ] Variables de entorno configuradas en Vercel
- [ ] Base de datos Postgres creada
- [ ] Schema aplicado (`npm run db:push`)
- [ ] Deploy exitoso en Vercel
- [ ] Webhook de Mercado Pago configurado
- [ ] Chequeo Real funciona
- [ ] Command Center funciona
- [ ] Prueba de pago realizada

---

**¡Tu SaaS está online! 🚀**

**URL:** `https://tu-dominio.vercel.app`

**Chequeo Real:** `https://tu-dominio.vercel.app/chequeo-real`

**Command Center:** `https://tu-dominio.vercel.app/dashboard/command-center`

