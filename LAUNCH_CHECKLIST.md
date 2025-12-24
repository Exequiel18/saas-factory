# 🚀 CHECKLIST DE LANZAMIENTO - SAAS FACTORY

> **OBJETIVO:** Sacar el SaaS a internet y generar ingresos reales HOY

---

## ✅ FASE 1: CONFIGURACIÓN PRE-DEPLOY (15 min)

### Variables de Entorno
- [ ] `MERCADOPAGO_ACCESS_TOKEN` - Token de producción de MP
- [ ] `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` - Public Key de MP
- [ ] `MERCADOPAGO_ALIAS` - Tu alias de MP (ej: aliascomun.mp)
- [ ] `NEXTAUTH_URL` - URL pública (ej: https://tu-saas.vercel.app)
- [ ] `NEXTAUTH_SECRET` - Generar con: `node scripts/generate-secret.js`
- [ ] `DATABASE_URL` - Postgres (NO SQLite para producción)

**Generar NEXTAUTH_SECRET:**
```bash
node scripts/generate-secret.js
```

**Obtener credenciales MP:**
1. Ve a: https://www.mercadopago.com.ar/developers/panel
2. Copia Access Token y Public Key
3. Usa credenciales de PRODUCCIÓN (no test)

---

## ✅ FASE 2: BASE DE DATOS (10 min)

### Opción A: Vercel Postgres (Recomendado - Más fácil)
1. Vercel Dashboard → Storage → Create Postgres
2. Se conecta automáticamente a tu proyecto
3. Copia `DATABASE_URL` a variables de entorno

### Opción B: Railway (Gratis)
1. Ve a: https://railway.app
2. New Project → PostgreSQL
3. Copia connection string → `DATABASE_URL`

### Opción C: PlanetScale (Gratis)
1. Ve a: https://planetscale.com
2. Create database
3. Copia connection string → `DATABASE_URL`

**Aplicar schema:**
```bash
npm run db:push
```

---

## ✅ FASE 3: DEPLOY (5 min)

### Vercel (Recomendado)
1. Ve a: https://vercel.com
2. Import Git Repository
3. Configura variables de entorno (todas las de FASE 1)
4. Deploy

**O usar CLI:**
```bash
npm i -g vercel
vercel --prod
```

### Alternativa: Railway/Render
- Similar proceso, configura variables de entorno

---

## ✅ FASE 4: CONFIGURAR MERCADO PAGO WEBHOOK (5 min)

**CRÍTICO:** Sin esto, los pagos no se procesan automáticamente.

1. Ve a: https://www.mercadopago.com.ar/developers/panel
2. Webhooks → Crear nuevo
3. URL: `https://tu-dominio.com/api/mercadopago/webhook`
4. Eventos:
   - ✅ `payment.created`
   - ✅ `payment.updated`
5. Guardar

**Verificar webhook:**
```bash
curl https://tu-dominio.com/api/mercadopago/webhook
# Debe responder: {"status":"ok","message":"Mercado Pago webhook endpoint"}
```

---

## ✅ FASE 5: PRUEBAS DE PAGO (10 min)

### Test 1: Pago One-Shot (Calculator)
1. Ve a: `https://tu-dominio.com/calculator`
2. Ingresa datos de prueba
3. Click "Desbloquear por $3.000 ARS"
4. Completa pago en Mercado Pago (usa tarjeta de prueba)
5. Verifica que vuelve con `?status=success`
6. Verifica en: `https://tu-dominio.com/dashboard/payments`

### Test 2: Suscripción (Pro Plan)
1. Crea cuenta y organización
2. Ve a: `/dashboard/organizations/[id]`
3. Click "Actualizar a Pro"
4. Completa pago
5. Verifica suscripción activa
6. Verifica pago en dashboard

**Tarjetas de prueba MP:**
- Aprobada: `5031 7557 3453 0604` (CVV: 123)
- Rechazada: `5031 4332 1540 6351` (CVV: 123)

---

## ✅ FASE 6: OPTIMIZACIÓN DE CONVERSIÓN (Opcional)

### Landing Page
- [ ] CTA claro y visible
- [ ] Precios destacados
- [ ] Testimonios sociales
- [ ] Botón de acción prominente

### Pricing Page
- [ ] Precios en ARS (ya corregido)
- [ ] Plan popular destacado
- [ ] Comparación clara de features

### Calculator Page
- [ ] Paywall claro
- [ ] Valor percibido alto
- [ ] Botón de pago destacado

---

## ✅ FASE 7: MONITOREO POST-LANZAMIENTO

### Métricas a Revisar Diariamente
1. **Ingresos:** `/dashboard/payments`
2. **Conversiones:** Usuarios que pagan vs visitantes
3. **Errores:** Logs de Vercel/hosting
4. **Webhooks:** Verificar que se procesan correctamente

### Alertas Críticas
- [ ] Webhook no responde → Revisar URL
- [ ] Pagos no se procesan → Revisar logs
- [ ] Base de datos llena → Escalar plan

---

## 🎯 CHECKLIST RÁPIDO (5 minutos antes de lanzar)

```
[ ] Variables de entorno configuradas
[ ] Base de datos Postgres funcionando
[ ] Webhook de MP configurado
[ ] Deploy en producción exitoso
[ ] Prueba de pago realizada
[ ] Landing page accesible
[ ] Pricing page muestra precios correctos
[ ] Dashboard funciona
```

---

## 💰 GENERAR INGRESOS HOY

### Estrategia Inmediata
1. **Comparte Calculator:** `/calculator` - Pago único $3.000 ARS
2. **Comparte Pricing:** `/pricing` - Suscripciones mensuales
3. **Usa Referidos:** Cada referido te da créditos
4. **Postea en Redes:** LinkedIn, Twitter, grupos de Facebook

### Páginas de Conversión
- `/calculator` → Pago único (más fácil de vender)
- `/pricing` → Suscripciones (más valor a largo plazo)
- `/dashboard/metrics` → Upsell después del primer pago

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "MERCADOPAGO_ACCESS_TOKEN is not set"
→ Verifica variables de entorno en Vercel/hosting

### Error: "Webhook not working"
→ Verifica URL pública y eventos configurados

### Error: "Database connection failed"
→ Verifica DATABASE_URL y que Postgres esté activo

### Pagos no aparecen en dashboard
→ Revisa webhook y logs de `/api/mercadopago/webhook`

---

## ✅ ESTADO FINAL

Cuando completes este checklist:
- ✅ SaaS está en producción
- ✅ Pagos funcionan automáticamente
- ✅ Puedes recibir dinero real
- ✅ Sistema funciona solo

**¡TU SAAS ESTÁ VIVO Y LISTO PARA GENERAR INGRESOS!** 🚀💰

---

*Última actualización: $(Get-Date -Format "yyyy-MM-dd HH:mm")*






