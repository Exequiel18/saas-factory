# 🚀 DEPLOY AHORA - PASO A PASO

> **Guía super clara para sacar tu SaaS online en 30 minutos**

---

## ✅ PASO 1: PREPARAR (5 minutos)

### 1.1 Generar NEXTAUTH_SECRET

```bash
node scripts/generate-secret.js
```

**Copiá el secret que aparece.** Lo vas a necesitar.

---

### 1.2 Verificar que tengas Git

```bash
git status
```

Si no tenés repo, crealo:

```bash
git init
git add .
git commit -m "Initial commit - Ready for production"
```

**Si ya tenés repo, asegurate de tener todo commiteado:**

```bash
git add .
git commit -m "Ready for production"
git push
```

---

## ✅ PASO 2: VERCEL (10 minutos)

### 2.1 Crear cuenta en Vercel

1. Ve a https://vercel.com
2. Click en "Sign Up"
3. Conectá con GitHub/GitLab (más fácil)

### 2.2 Importar proyecto

1. En Vercel Dashboard → "Add New Project"
2. Seleccioná tu repositorio
3. Vercel detecta Next.js automáticamente
4. **NO hagas deploy todavía**

### 2.3 Configurar variables de entorno

Antes de deploy, configura estas variables:

**En Vercel → Settings → Environment Variables, agregá:**

```
DATABASE_URL = (lo vas a crear después)
NEXTAUTH_URL = https://tu-proyecto.vercel.app
NEXTAUTH_SECRET = (el que generaste en paso 1.1)
```

**Por ahora solo estas 3. Las demás las agregás después.**

---

## ✅ PASO 3: BASE DE DATOS (5 minutos)

### Opción A: Vercel Postgres (Más fácil)

1. En Vercel Dashboard → Storage
2. Click "Create Database" → PostgreSQL
3. Seleccioná tu proyecto
4. Copiá el `DATABASE_URL` que te da
5. Agregalo a Environment Variables en Vercel

### Opción B: Railway (Gratis)

1. Ve a https://railway.app
2. Sign Up (con GitHub)
3. New Project → Add PostgreSQL
4. Click en la DB → Variables → `DATABASE_URL`
5. Copiá el connection string
6. Agregalo a Environment Variables en Vercel

---

## ✅ PASO 4: DEPLOY (2 minutos)

1. En Vercel → Deploy
2. Esperá 2-3 minutos
3. Tu sitio estará en `tu-proyecto.vercel.app`

**✅ Si ves tu landing page, el deploy funcionó.**

---

## ✅ PASO 5: APLICAR SCHEMA (3 minutos)

```bash
# Conectá tu .env.local a la DB de producción
# (copia el DATABASE_URL de Vercel a tu .env.local)

npm run db:push
```

**✅ Si dice "Database synchronized", está listo.**

---

## ✅ PASO 6: PROBAR (5 minutos)

### 6.1 Probar Landing

Abrí: `https://tu-proyecto.vercel.app`

**Deberías ver:**
- Landing page mejorada
- "Si laburás solo, esto es para vos"
- Botón "Hacer Chequeo Gratis"

### 6.2 Probar Chequeo

Abrí: `https://tu-proyecto.vercel.app/chequeo-real`

**Deberías poder:**
- Ver las 6 preguntas
- Completar el chequeo
- Ver el diagnóstico

### 6.3 Probar Command Center

Abrí: `https://tu-proyecto.vercel.app/dashboard/command-center`

**Deberías ver:**
- Sistemas conectados
- Estadísticas
- Eventos (si hay)

---

## ✅ PASO 7: CONFIGURAR MERCADO PAGO (Opcional - 5 minutos)

**Solo si querés probar pagos ahora:**

1. Ve a https://www.mercadopago.com.ar/developers/panel
2. Crea una aplicación
3. Copiá Access Token y Public Key
4. Agregalos a Vercel Environment Variables:
   - `MERCADOPAGO_ACCESS_TOKEN`
   - `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
5. Configurá webhook:
   - URL: `https://tu-proyecto.vercel.app/api/mercadopago/webhook`
   - Eventos: `payment.created`, `payment.updated`

**Si no querés probar pagos ahora, lo hacés después.**

---

## ✅ VERIFICACIÓN FINAL

### Checklist:

- [ ] Landing page carga
- [ ] Chequeo funciona
- [ ] Command Center muestra sistemas
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en Vercel logs

**Si todo esto está OK, tu SaaS está online. 🎉**

---

## 🎯 PRÓXIMOS PASOS

### Hoy:
1. Compartí el link en 2-3 grupos de Facebook
2. Mensaje: "Estoy probando esto, si querés lo probás: [link]"

### Esta semana:
1. Monitoreá en Command Center
2. Ve quién completa chequeos
3. Ajustá según lo que veas

### Próxima semana:
1. Si alguien pagó → Pedir permiso para caso de éxito
2. Compartir caso de éxito
3. Seguir compartiendo 1-2 veces por semana

---

## 🆘 SI ALGO FALLA

### Error en build:
- Revisá logs en Vercel
- Verifica que todas las dependencias estén en `package.json`

### Error de base de datos:
- Verifica `DATABASE_URL` en Vercel
- Asegurate de que la DB esté activa
- Reintentá `npm run db:push`

### Error 404:
- Verifica que el deploy haya terminado
- Esperá 1-2 minutos más
- Refrescá la página

---

## ✅ LISTO

**Tu SaaS está online en:**
`https://tu-proyecto.vercel.app`

**Chequeo Real:**
`https://tu-proyecto.vercel.app/chequeo-real`

**Command Center:**
`https://tu-proyecto.vercel.app/dashboard/command-center`

---

**¡Ahora compartí el link y empezá a generar ingresos! 🚀💰**

