# 🚀 SOLUCIÓN PARA DEPLOY EN VERCEL

> **Tu cuenta alcanzó el límite. Acá está la solución más rápida.**

---

## ✅ LO QUE YA ESTÁ LISTO

- ✅ Repositorio en GitHub: https://github.com/Exequiel18/saas-factory
- ✅ Código subido
- ✅ Todo preparado

---

## 🎯 SOLUCIÓN RÁPIDA (5 minutos)

### Opción 1: Usar Proyecto Existente (Más rápido)

1. **Ve a:** https://vercel.com/dashboard
2. **Elegí un proyecto** que no uses (o uno que puedas reemplazar)
3. **Click en el proyecto**
4. **Settings → General**
5. **"Connect Git Repository"** o **"Change Git Repository"**
6. **Conectá:** `https://github.com/Exequiel18/saas-factory`
7. **Settings → Environment Variables**
8. **Agregá las variables** (ver abajo)
9. **Deployments → Redeploy** o esperá el auto-deploy

### Opción 2: Eliminar Proyectos Viejos

1. Ve a https://vercel.com/dashboard
2. Eliminá proyectos que no uses
3. Luego creá el nuevo proyecto normalmente

---

## 📋 VARIABLES PARA CONFIGURAR

En Vercel → Settings → Environment Variables, agregá:

**NEXTAUTH_URL**
```
https://[nombre-del-proyecto].vercel.app
```

**NEXTAUTH_SECRET**
```
[Está en tu .env.local - copiá el valor]
```

**DATABASE_URL**
```
postgresql://postgres.phcfmhxlixdogveondji:Exequiel54..@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**NEXT_PUBLIC_SUPABASE_URL**
```
https://phcfmhxlixdogveondji.supabase.co
```

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ZtaHhsaXhkb2d2ZW9uZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODYwNzcsImV4cCI6MjA4MDE2MjA3N30.YMHYRA16QOt2pBRpx09EpfIEw5uCKdLA7RqAbrASmy8
```

**SUPABASE_SERVICE_ROLE_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ZtaHhsaXhkb2d2ZW9uZGppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDU4NjA3NywiZXhwIjoyMDgwMTYyMDc3fQ.xYKb_yoQEqozQzHv0uwTUSJEp5Q4YAjWwKw3QMKI7Hk
```

---

## ✅ DESPUÉS DEL DEPLOY

1. **Aplicar schema:**
   ```bash
   npm run db:push
   ```

2. **Probar:**
   - Abrí la URL del proyecto
   - Probá `/chequeo-real`
   - Verificá `/dashboard/command-center`

---

## 🎯 RESUMEN

**✅ Completado:**
- Repositorio en GitHub
- Código subido
- Todo preparado

**⏳ Pendiente:**
- Conectar repo a proyecto existente en Vercel (5 min)
- Configurar variables
- Deploy

---

**Tu código está en GitHub. Solo falta conectarlo a un proyecto en Vercel. 🚀**

**Ve a https://vercel.com/dashboard y conectá el repo a un proyecto existente.**

