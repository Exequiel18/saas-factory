# 🔑 GENERAR NEXTAUTH_SECRET - GUÍA RÁPIDA

Si no podés ejecutar `node scripts/generate-secret.js`, usá estas opciones:

## Opción 1: Online (Más fácil)

1. Ve a https://generate-secret.vercel.app/32
2. Copiá el secret que aparece
3. Usalo en Vercel

## Opción 2: PowerShell

```powershell
# En PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Opción 3: Node Online

1. Ve a https://replit.com/languages/nodejs
2. Pegá este código:
```javascript
const crypto = require('crypto')
const secret = crypto.randomBytes(32).toString('base64')
console.log(secret)
```
3. Ejecutá y copiá el resultado

## Opción 4: Python

```python
import secrets
import base64
secret = base64.b64encode(secrets.token_bytes(32)).decode('utf-8')
print(secret)
```

---

**Cualquiera de estas opciones te da un secret válido para NEXTAUTH_SECRET.**

