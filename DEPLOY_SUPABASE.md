# 🚀 DEPLOY CON SUPABASE - GUÍA COMPLETA

> **Configurá Supabase y sacá tu SaaS online en 10 minutos.**

---

## ✅ LO QUE TENÉS

- ✅ Credenciales de Supabase en la carpeta
- ✅ Sistema completo y verificado
- ✅ Scripts automáticos listos

---

## 🚀 PASO 1: CONFIGURAR SUPABASE (2 minutos)

### Opción A: Si tenés un archivo con las credenciales

1. Asegurate de que el archivo tenga el formato:
   ```
   DATABASE_URL=postgresql://usuario:password@host:puerto/database
   ```

2. Ejecutá:
   ```bash
   node scripts/deploy-completo-supabase.js
   ```

### Opción B: Si querés pasar la URL directamente

```bash
node scripts/deploy-completo-supabase.js "postgresql://usuario:password@host:puerto/database"
```

### Opción C: Manual

1. Abrí `.env.local`
2. Agregá:
   ```
   DATABASE_URL=postgresql://usuario:password@host:puerto/database
   ```

---

## 🚀 PASO 2: SUBIR A GIT (3 minutos)

Si NO tenés repo:
```bash
git add .
git commit -m "Ready for production"
git remote add origin [tu-repo-url]
git push -u origin main
```

Si YA tenés repo:
```bash
git add .
git commit -m "Ready for production"
git push
```

---

## 🚀 PASO 3: DEPLOY EN VERCEL (5 minutos)

1. Ve a https://vercel.com
2. Sign Up / Login
3. Click "Add New Project"
4. Importá tu repositorio
5. Configurá estas variables de entorno:

   **NEXTAUTH_URL**
   - Se auto-completa con tu dominio
   - O manualmente: `https://tu-proyecto.vercel.app`

   **NEXTAUTH_SECRET**
   - Está en tu `.env.local`
   - O ejecutá: `node scripts/generate-secret.js`

   **DATABASE_URL**
   - Tu URL de Supabase
   - Formato: `postgresql://usuario:password@host:puerto/database`

6. Click "Deploy"

---

## 🚀 PASO 4: APLICAR SCHEMA (1 minuto)

Después del deploy:

```bash
# Actualizá .env.local con el DATABASE_URL de producción (si es diferente)
npm run db:push
```

---

## ✅ VERIFICACIÓN

1. Abrí tu dominio: `https://tu-proyecto.vercel.app`
2. Probá el chequeo: `/chequeo-real`
3. Verificá Command Center: `/dashboard/command-center`

---

## 📋 RESUMEN DE VARIABLES PARA VERCEL

```
NEXTAUTH_URL = https://tu-proyecto.vercel.app
NEXTAUTH_SECRET = [está en .env.local]
DATABASE_URL = [tu URL de Supabase]
```

---

## 🆘 SI ALGO FALLA

### Error: "Database connection failed"
- Verificá que el `DATABASE_URL` sea correcto
- Asegurate de que Supabase esté activo
- Verificá que la IP esté permitida en Supabase

### Error: "Build failed"
- Revisá logs en Vercel
- Verificá que todas las dependencias estén en `package.json`

### Error: "Schema not applied"
- Ejecutá `npm run db:push` desde tu máquina
- O desde Vercel CLI: `vercel env pull .env.local && npm run db:push`

---

## ✅ TODO LISTO

**Con Supabase configurado, tu SaaS está listo para:**
- ✅ Deploy en Vercel
- ✅ Base de datos funcionando
- ✅ Generar ingresos

**¡Ejecutá el script y seguí los pasos! 🚀**

