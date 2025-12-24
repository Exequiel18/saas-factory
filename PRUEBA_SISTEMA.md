# 🧪 PRUEBA DEL SISTEMA - GUÍA RÁPIDA

> **Todo está listo. Probemos que funcione.**

---

## ✅ CHECKLIST PRE-PRUEBA

### 1. Variables de Entorno
```bash
# Verifica que tengas .env.local con:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- MERCADOPAGO_ACCESS_TOKEN (opcional para prueba)
```

### 2. Base de Datos
```bash
npm run db:push
```

### 3. Dependencias
```bash
npm install
```

---

## 🚀 PRUEBA PASO A PASO

### Paso 1: Iniciar el Servidor

```bash
npm run dev
```

**Esperado:** Servidor corriendo en `http://localhost:3000`

---

### Paso 2: Probar el Chequeo Real

1. **Abrir:** `http://localhost:3000/chequeo-real`

2. **Completar las 6 preguntas:**
   - ¿Cuánto entró de plata? → Ej: 500000
   - ¿Cuánto salió de plata? → Ej: 450000
   - ¿Cuántas horas laburaste? → Ej: 160
   - ¿Cómo te sentís? → Seleccionar opción
   - ¿Hace cuántos meses? → Ej: 6
   - ¿Laburás solo? → Seleccionar opción

3. **Ver el diagnóstico:**
   - Deberías ver: frase fuerte, problema, acción
   - Deberías ver: elemento distintivo "🤝 Sin Chamuyo"
   - Deberías ver: botón de pago

**✅ Si ves esto, el chequeo funciona.**

---

### Paso 3: Probar el Command Center

1. **Abrir:** `http://localhost:3000/dashboard/command-center`

2. **Verificar que muestre:**
   - Sistemas conectados (Chequeo, Marketing, Referidos, Pagos, Alertas)
   - Estadísticas generales
   - Eventos en tiempo real (si hay)

**✅ Si ves el dashboard, el Command Center funciona.**

---

### Paso 4: Probar Marketing Autónomo

1. **Abrir:** `http://localhost:3000/dashboard/autonomous-marketing`

2. **Verificar que muestre:**
   - Plan semanal generado
   - Recomendaciones del sistema
   - Acciones listas para aprobar

**✅ Si ves el plan, el Marketing Autónomo funciona.**

---

### Paso 5: Probar API del Command Center

```bash
# En otra terminal o Postman
curl http://localhost:3000/api/central-command/status
```

**Esperado:** JSON con sistemas, stats y eventos

**✅ Si devuelve JSON, la API funciona.**

---

### Paso 6: Probar Registro de Eventos

1. **Completar un chequeo** (Paso 2)

2. **Abrir Command Center** (Paso 3)

3. **Verificar que aparezca evento:**
   - "Chequeo completado: Score X, Status Y"

**✅ Si aparece el evento, el registro funciona.**

---

## 🎯 PRUEBAS ESPECÍFICAS

### Prueba de Traducción Humana

**Input:**
- Revenue: 500000
- Costs: 450000
- Hours: 160
- Feeling: "Cansado y sin plata"
- Alone: "Solo"

**Esperado:**
- Headline: "Laburás todo el día y no te queda nada"
- Problema: Menciona horas y tasa horaria
- Acción: "Si querés, te ayudo a revisar tus precios"

**✅ Si ves esto, la traducción funciona.**

---

### Prueba de Upsell Automático

**Input:**
- Score < 40 (margen bajo)

**Esperado:**
- Mensaje: "No estás mal vos. Con estos números, lo raro sería que te vaya bien solo."
- Botón: "Ver Plan Mensual para Ordenar el Negocio"

**✅ Si aparece, el upsell funciona.**

---

### Prueba de Compartir

**Input:**
- Score < 40
- Click en "Compartir"

**Esperado:**
- Opción de compartir nativo o copiar link
- Evento registrado en Command Center

**✅ Si funciona, el sistema de referidos está conectado.**

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot find module"
```bash
npm install
npm run postinstall
```

### Error: "Database connection failed"
```bash
# Verifica DATABASE_URL en .env.local
npm run db:push
```

### Error: "Command Center no muestra eventos"
- Esperá 5 segundos (polling automático)
- O refrescá la página

### Error: "Marketing plan vacío"
- Es normal si no hay datos históricos
- El sistema generará contenido igual

---

## ✅ SISTEMA LISTO SI:

- ✅ Chequeo carga y muestra preguntas
- ✅ Diagnóstico se genera correctamente
- ✅ Command Center muestra sistemas
- ✅ Marketing genera plan semanal
- ✅ Eventos se registran automáticamente

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE LA PRUEBA

1. **Configurar variables de entorno reales** (Mercado Pago, etc.)
2. **Probar flujo de pago completo** (con tarjeta de prueba)
3. **Dejar el sistema corriendo** y ver eventos en tiempo real
4. **Compartir el chequeo** y ver cómo funciona el sistema de referidos

---

**¡Todo listo para probar! 🚀**

