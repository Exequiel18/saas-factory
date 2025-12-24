# 📤 CREAR REPO Y SUBIR A GITHUB

> **Pasos rápidos para subir tu código a GitHub**

---

## 🚀 PASO 1: CREAR REPOSITORIO EN GITHUB

1. Ve a https://github.com/new
2. Nombre del repositorio: `saas-factory` (o el que prefieras)
3. Descripción: "Chequeo Real de Negocio - SaaS completo"
4. Público o Privado (tu elección)
5. **NO marques** "Initialize with README" (ya tenés código)
6. Click "Create repository"

---

## 🚀 PASO 2: COPIAR LA URL

Después de crear el repo, GitHub te muestra la URL. Copiala:
- Ejemplo: `https://github.com/tu-usuario/saas-factory.git`

---

## 🚀 PASO 3: EJECUTAR COMANDOS

Ejecutá estos comandos en tu terminal (reemplazá la URL):

```bash
git remote add origin https://github.com/tu-usuario/saas-factory.git
git push -u origin main
```

**Si tu rama se llama "master" en lugar de "main":**
```bash
git remote add origin https://github.com/tu-usuario/saas-factory.git
git push -u origin master
```

---

## ✅ VERIFICACIÓN

Si todo salió bien, verás:
```
Enumerating objects: ...
Counting objects: ...
Writing objects: ...
```

Y tu código estará en GitHub.

---

## 🎯 PRÓXIMO PASO

Después de subir a GitHub:
1. Ve a https://vercel.com
2. Importá tu repositorio
3. Configurá variables de entorno
4. Deploy

---

**¿Ya creaste el repo? Pasame la URL y te ayudo a subirlo. 🚀**

