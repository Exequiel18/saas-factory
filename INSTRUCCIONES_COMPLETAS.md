# 📋 INSTRUCCIONES COMPLETAS PARA INICIAR EL SERVIDOR

> **Guía paso a paso para solucionar el error -102**

---

## 🔍 PROBLEMA

El error -102 significa que el servidor no está corriendo. Esto puede ser porque:

1. ❌ Node.js no está instalado
2. ❌ npm no está en el PATH
3. ❌ Las dependencias no están instaladas

---

## ✅ SOLUCIÓN COMPLETA

### Opción 1: Si Node.js NO está instalado

1. **Descargá Node.js:**
   - Ve a: https://nodejs.org/
   - Descargá la versión LTS (recomendada)
   - Instalá con todas las opciones por defecto

2. **Reiniciá la computadora**

3. **Abrí PowerShell o CMD**

4. **Navegá a la carpeta del proyecto:**
   ```powershell
   cd "C:\Users\Exequiel rogers\Desktop\SAAS-FACTORY"
   ```

5. **Instalá dependencias:**
   ```powershell
   npm install
   ```

6. **Iniciá el servidor:**
   ```powershell
   npm run dev
   ```

7. **Esperá a ver:**
   ```
   ✓ Ready in X.Xs
   ○ Local: http://localhost:3000
   ```

8. **Abrí en el navegador:**
   ```
   http://localhost:3000
   ```

---

### Opción 2: Si Node.js SÍ está instalado

1. **Abrí PowerShell o CMD**

2. **Verificá que funcione:**
   ```powershell
   node --version
   npm --version
   ```

3. **Si ambos funcionan, navegá a la carpeta:**
   ```powershell
   cd "C:\Users\Exequiel rogers\Desktop\SAAS-FACTORY"
   ```

4. **Instalá dependencias (si no lo hiciste antes):**
   ```powershell
   npm install
   ```

5. **Iniciá el servidor:**
   ```powershell
   npm run dev
   ```

---

### Opción 3: Usar el Script .bat

1. **Doble click en:**
   ```
   INICIAR_AHORA_FACIL.bat
   ```

2. **El script buscará npm automáticamente**

3. **Si encuentra npm, iniciará el servidor**

4. **Si no encuentra npm, te dirá que instalés Node.js**

---

## 🎯 VERIFICACIÓN

Una vez que el servidor esté corriendo, deberías ver en el terminal:

```
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

Y en el navegador (`http://localhost:3000`) deberías ver:
- ✅ Landing page con diseño moderno
- ✅ Fondo negro con gradientes
- ✅ "Chequeo Real de Negocio"

---

## ❌ SI SIGUE SIN FUNCIONAR

1. **Verificá que Node.js esté instalado:**
   - Abrí PowerShell
   - Escribí: `node --version`
   - Si dice "no se reconoce", instalá Node.js

2. **Verificá las dependencias:**
   - Asegurate de estar en la carpeta del proyecto
   - Escribí: `npm install`
   - Esperá a que termine

3. **Verificá errores:**
   - Cuando ejecutás `npm run dev`, ¿qué error ves?
   - Copiá el error completo y decime

---

**Seguí estos pasos en orden. El problema más común es que Node.js no está instalado. 🚀**

