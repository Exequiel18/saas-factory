# 🚀 INSTRUCCIONES RÁPIDAS - DEPLOY CON SUPABASE

> **Pasá tu DATABASE_URL de Supabase y te configuro todo automáticamente.**

---

## 🎯 OPCIÓN 1: Si tenés un archivo con las credenciales

1. Asegurate de que el archivo tenga:
   ```
   DATABASE_URL=postgresql://usuario:password@host:puerto/database
   ```

2. Ejecutá:
   ```bash
   npm run deploy:supabase
   ```

---

## 🎯 OPCIÓN 2: Pasá la URL directamente

```bash
node scripts/deploy-completo-supabase.js "postgresql://usuario:password@host:puerto/database"
```

---

## 🎯 OPCIÓN 3: Manual

1. Abrí `.env.local`
2. Buscá `DATABASE_URL=`
3. Reemplazá con tu URL de Supabase:
   ```
   DATABASE_URL=postgresql://usuario:password@host:puerto/database
   ```

---

## 📋 DESPUÉS DE CONFIGURAR

1. **Subir a Git:**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push
   ```

2. **Deploy en Vercel:**
   - Ve a https://vercel.com
   - Importá tu repo
   - Configurá variables (el script te dice cuáles)
   - Deploy

3. **Aplicar schema:**
   ```bash
   npm run db:push
   ```

---

## ✅ LISTO

**El script configura todo automáticamente. Solo necesitás pasar la URL de Supabase.**

**¿Tenés la URL de Supabase? Pasámela y te configuro todo ahora mismo. 🚀**

