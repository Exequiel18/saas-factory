# 🚀 INSTRUCCIONES PARA VERCEL

## Variables de Entorno a Configurar:

1. **NEXTAUTH_URL**
   ```
   https://tu-proyecto.vercel.app
   ```
   (Se auto-completa, pero verifica)

2. **NEXTAUTH_SECRET**
   ```
   [Está en tu .env.local]
   ```

3. **DATABASE_URL**
   ```
   postgresql://postgres.phcfmhxlixdogveondji:Exequiel54..@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

4. **NEXT_PUBLIC_SUPABASE_URL**
   ```
   https://phcfmhxlixdogveondji.supabase.co
   ```

5. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ZtaHhsaXhkb2d2ZW9uZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODYwNzcsImV4cCI6MjA4MDE2MjA3N30.YMHYRA16QOt2pBRpx09EpfIEw5uCKdLA7RqAbrASmy8
   ```

6. **SUPABASE_SERVICE_ROLE_KEY**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoY2ZtaHhsaXhkb2d2ZW9uZGppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDU4NjA3NywiZXhwIjoyMDgwMTYyMDc3fQ.xYKb_yoQEqozQzHv0uwTUSJEp5Q4YAjWwKw3QMKI7Hk
   ```

## Pasos:

1. Ve a https://vercel.com
2. Importá tu repositorio de GitHub
3. Configurá las variables de entorno (arriba)
4. Click "Deploy"
5. Después del deploy, ejecutá: `npm run db:push`
