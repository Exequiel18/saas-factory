# ✅ SOLUCIÓN INMEDIATA - WEBHOOK

> **Configurá el webhook ahora mismo sin esperar**

---

## 🚀 SOLUCIÓN RÁPIDA

**Agregué la configuración de webhook directamente en la página de deploy.**

**Entrá a:**
```
https://saas-factory-antigravity.vercel.app/dashboard/deploy
```

**O si no estás logueado:**
```
https://saas-factory-antigravity.vercel.app
```
(Luego andá a Dashboard → Deploy)

---

## 📋 QUÉ HACER (3 MINUTOS)

### 1. URL del Webhook
```
https://saas-factory-antigravity.vercel.app/api/mercadopago/webhook
```
**Copiá esta URL**

### 2. Configurar en Mercado Pago
1. Ve a: https://www.mercadopago.com.ar/developers/panel
2. Webhooks → Crear
3. Pegá la URL de arriba
4. Eventos: `payment.created`, `payment.updated`
5. Crear
6. **Copiá el secret** (aparece después de crear)

### 3. Agregar a Vercel
1. Ve a: https://vercel.com/dashboard
2. Click en: `saas-factory-antigravity`
3. Settings → Environment Variables
4. Add New
5. Key: `MERCADO_PAGO_WEBHOOK_SECRET`
6. Value: (el secret que copiaste)
7. Seleccioná: Production, Preview, Development
8. Save

---

## ✅ LISTO

**Después de eso:**
- ✅ Webhook configurado
- ✅ Pagos se confirmarán automáticamente
- ✅ SaaS 100% funcional

---

**Entrá a `/dashboard/deploy` y seguí los pasos. Todo está ahí. 🚀**

