# ✅ SOLUCIÓN ERROR -102 DEFINITIVA

> **El servidor no inicia porque npm no está en el PATH**

---

## 🔧 PROBLEMA

El error -102 significa que el navegador no puede conectarse porque el servidor no está corriendo. El problema es que `npm` no está en el PATH del sistema.

---

## ✅ SOLUCIÓN - 3 OPCIONES

### Opción 1: Usar el Script .bat (MÁS FÁCIL)

1. **Doble click en:**
   ```
   INICIAR_SERVIDOR.bat
   ```

2. **El script buscará npm automáticamente y iniciará el servidor**

3. **Esperá a ver:**
   ```
   ✓ Ready in X.Xs
   ○ Local: http://localhost:3000
   ```

4. **Abrí en el navegador:**
   ```
   http://localhost:3000
   ```

---

### Opción 2: Usar PowerShell

1. **Click derecho en:**
   ```
   INICIAR_SERVIDOR.ps1
   ```

2. **Seleccioná: "Ejecutar con PowerShell"**

3. **Si te pide permisos, escribí:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. **Luego ejecutá el script de nuevo**

---

### Opción 3: Agregar Node.js al PATH

1. **Encontrá dónde está Node.js:**
   - Generalmente en: `C:\Program Files\nodejs\`
   - O en: `C:\Users\TuUsuario\AppData\Roaming\npm\`

2. **Agregá al PATH:**
   - Windows + R → `sysdm.cpl`
   - Avanzado → Variables de entorno
   - En "Variables del sistema", editá "Path"
   - Agregá la ruta a Node.js
   - Aceptá todo

3. **Reiniciá la terminal y probá:**
   ```bash
   npm run dev
   ```

---

## 🎯 RECOMENDACIÓN

**Usá la Opción 1 (el .bat)** - Es la más fácil y no requiere configuración.

---

## 📊 DESPUÉS DE INICIAR

Una vez que el servidor esté corriendo, verás:

```
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

Entonces podés abrir:
```
http://localhost:3000
```

---

**Usá el archivo `INICIAR_SERVIDOR.bat` - Es la solución más simple. 🚀**

