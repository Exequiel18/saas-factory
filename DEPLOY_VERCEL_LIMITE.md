# ⚠️ LÍMITE DE PROYECTOS EN VERCEL

> **Tu cuenta alcanzó el límite de 200 proyectos. Opciones para deployar.**

---

## ✅ LO QUE YA ESTÁ LISTO

- ✅ Repositorio en GitHub: https://github.com/Exequiel18/saas-factory
- ✅ Código subido
- ✅ Todo preparado

---

## 🎯 OPCIONES PARA DEPLOYAR

### Opción 1: Usar Proyecto Existente (Recomendado)

1. Ve a https://vercel.com/dashboard
2. Buscá un proyecto que no uses
3. Click en el proyecto
4. Settings → General → Connect Git Repository
5. Conectá: https://github.com/Exequiel18/saas-factory
6. Configurá las variables (ver abajo)
7. Deploy

### Opción 2: Eliminar Proyectos Viejos

1. Ve a https://vercel.com/dashboard
2. Eliminá proyectos que no uses
3. Luego creá el nuevo proyecto

### Opción 3: Deploy Manual

1. Ve a https://vercel.com
2. Click "Add New Project"
3. Si te dice que alcanzaste el límite:
   - Eliminá proyectos viejos, O
   - Usá un proyecto existente

---

## 📋 VARIABLES PARA CONFIGURAR

Cuando tengas el proyecto listo, configurá estas variables:

**NEXTAUTH_URL**
```
https://tu-proyecto.vercel.app
```

**NEXTAUTH_SECRET**
```
[Está en tu .env.local]
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
   - Abrí la URL de tu proyecto
   - Probá `/chequeo-real`
   - Verificá `/dashboard/command-center`

---

**Tu código está en GitHub. Solo falta configurar el proyecto en Vercel. 🚀**

