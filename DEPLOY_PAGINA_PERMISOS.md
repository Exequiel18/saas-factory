# 🚀 DEPLOY AUTOMÁTICO - PÁGINA DE PERMISOS

> **Ve a la página, dá permisos, y el sistema hace TODO por vos.**

---

## 🎯 CÓMO USAR

### 1. Abrir la Página de Deploy

Ve a: **`/dashboard/deploy`**

O desde el dashboard principal, click en **"🚀 Deploy Automático"**

### 2. Obtener los Tokens

#### GitHub Token:
1. Ve a https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Nombre: "Deploy Agent"
4. Scopes: Marca `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copiá el token** (solo se muestra una vez)

#### Vercel Token:
1. Ve a https://vercel.com/account/tokens
2. Click "Create Token"
3. Nombre: "Deploy Agent"
4. Scope: Full Access
5. Click "Create"
6. **Copiá el token**

### 3. Ingresar Permisos

1. En la página de deploy, pegá los tokens
2. (Opcional) Nombre del repositorio (si no, usa "saas-factory")
3. Click "Guardar Credenciales"

### 4. Deploy Automático

1. Click "Deploy Automático Completo"
2. El sistema hace TODO:
   - ✅ Crea repositorio en GitHub
   - ✅ Sube todo el código
   - ✅ Configura variables en Vercel
   - ✅ Hace el deploy
   - ✅ Te da la URL de tu SaaS online

3. **Ves el progreso en tiempo real**

---

## ✅ LO QUE HACE EL SISTEMA

1. **Crea repo en GitHub** usando tu token
2. **Sube todo el código** automáticamente
3. **Crea proyecto en Vercel** con todas las variables
4. **Hace el deploy** automáticamente
5. **Te da la URL** de tu SaaS online

**Vos solo das permisos. El sistema hace el resto.**

---

## 🎯 DESPUÉS DEL DEPLOY

Una vez que el sistema termine:

1. **Tu SaaS está online** en la URL que te da
2. **Aplicá el schema:**
   ```bash
   npm run db:push
   ```
3. **Probá tu SaaS:**
   - Abrí la URL
   - Probá `/chequeo-real`
   - Verificá `/dashboard/command-center`

---

## 🆘 SI ALGO FALLA

### Error: "GitHub token inválido"
- Verificá que el token tenga el scope `repo`
- Asegurate de que no haya expirado

### Error: "Vercel token inválido"
- Verificá que el token tenga Full Access
- Asegurate de que no haya expirado

### Error: "Repo ya existe"
- El sistema intenta crear un repo con ese nombre
- Si ya existe, cambiá el nombre del repositorio

---

## ✅ VENTAJAS

### Antes (Manual):
- ❌ 30 minutos configurando
- ❌ Múltiples pasos manuales
- ❌ Fácil cometer errores

### Ahora (Automático):
- ✅ 5 minutos dando permisos
- ✅ Un click y listo
- ✅ El sistema no se equivoca
- ✅ Todo visible en tiempo real

---

**Ve a `/dashboard/deploy`, dá permisos, y en 5 minutos tu SaaS está online. 🚀**

