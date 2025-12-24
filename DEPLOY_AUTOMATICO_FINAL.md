# 🚀 DEPLOY AUTOMÁTICO - TODO PREPARADO

> **Los scripts están listos. Solo necesitás crear el repo y ejecutar.**

---

## ✅ LO QUE YA ESTÁ HECHO

- ✅ Supabase configurado
- ✅ Variables de entorno listas
- ✅ Git preparado y commiteado
- ✅ Scripts de push creados
- ✅ Documentación completa

---

## 🚀 PASOS FINALES (5 minutos)

### Paso 1: Crear Repo en GitHub (2 min)

1. Ve a https://github.com/new
2. Nombre: `saas-factory`
3. **NO marques** "Initialize with README"
4. Click "Create repository"
5. **NO cierres la página** - vas a necesitar la URL

### Paso 2: Configurar Remote (30 seg)

En la página de GitHub, copiá la URL del repo (ej: `https://github.com/tu-usuario/saas-factory.git`)

Ejecutá este comando (reemplazá la URL):
```bash
git remote add origin https://github.com/tu-usuario/saas-factory.git
```

### Paso 3: Push Automático (30 seg)

Ejecutá el script:
```bash
.\push-to-github.ps1
```

O manualmente:
```bash
git push -u origin master
```

### Paso 4: Deploy en Vercel (2 min)

1. Ve a https://vercel.com
2. Click "Add New Project"
3. Importá tu repositorio
4. Configurá las variables (ver `INSTRUCCIONES_VERCEL.md`)
5. Click "Deploy"

### Paso 5: Aplicar Schema (1 min)

```bash
npm run db:push
```

---

## 📋 VARIABLES PARA VERCEL

Todas están en `INSTRUCCIONES_VERCEL.md`. Copiá estas:

- `NEXTAUTH_URL` = `https://tu-proyecto.vercel.app`
- `NEXTAUTH_SECRET` = [está en .env.local]
- `DATABASE_URL` = `postgresql://postgres.phcfmhxlixdogveondji:Exequiel54..@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
- `NEXT_PUBLIC_SUPABASE_URL` = `https://phcfmhxlixdogveondji.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = [ver INSTRUCCIONES_VERCEL.md]
- `SUPABASE_SERVICE_ROLE_KEY` = [ver INSTRUCCIONES_VERCEL.md]

---

## ✅ LISTO

**En 5 minutos tu SaaS está online. 🚀**

