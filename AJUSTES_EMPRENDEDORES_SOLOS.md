# 🎯 AJUSTES PARA EMPRENDEDORES SOLOS

> **Target:** Electricistas, fotógrafos, técnicos, community managers, freelancers, monotributistas

---

## ✅ CAMBIOS IMPLEMENTADOS

### 1️⃣ Preguntas del Diagnóstico (Orientadas a Esfuerzo vs Retorno)

**Antes (genérico):**
- ¿Cuánto facturaste el mes pasado?
- ¿Cuánto gastaste en total?
- ¿Cuánto de eso son gastos fijos?
- ¿Cuánto gastaste en cada venta?

**Ahora (emprendedores solos):**
- ✅ ¿Cuánto entró de plata el mes pasado? (más directo)
- ✅ ¿Cuánto salió de plata? (más simple)
- ✅ ¿Cuántas horas laburaste? (enfoca en esfuerzo)
- ✅ ¿Cómo te sentís al final del mes? (emocional, no numérico)
- ✅ ¿Hace cuántos meses viene así? (patrón de cansancio)
- ✅ ¿Laburás solo o con alguien? (contexto de soledad)

**Por qué funciona:**
- Preguntas que sienten el cansancio, no solo números
- Lenguaje directo, sin jerga empresarial
- Enfoque en esfuerzo físico/mental vs retorno

---

### 2️⃣ Frases que Pegan en Cansancio (No en Números)

**Antes:**
- "Hoy tu negocio se esfuerza más de lo que gana"
- "El problema no es vender, es lo que te queda"

**Ahora:**
- ✅ "Laburás todo el día y no te queda nada"
- ✅ "Estás cansado de laburar para no ganar"
- ✅ "Laburás 160 horas y te quedan $500 por hora"
- ✅ "No estás mal vos. Con estos números, lo raro sería que te vaya bien solo."

**Por qué funciona:**
- Habla del esfuerzo físico, no de métricas
- Valida el cansancio, no lo juzga
- Conecta con la soledad del emprendedor

---

### 3️⃣ Landing Page (Lenguaje de "Laburo Solo")

**Antes:**
- "Domina el Espacio Digital"
- "Sistema autónomo de evaluación"

**Ahora:**
- ✅ "Si laburás solo, esto es para vos"
- ✅ "En 3 minutos te decimos si estás bien o solo te estás matando"

**Por qué funciona:**
- Identifica inmediatamente al target
- Habla del cansancio, no de tecnología
- Promesa clara y directa

---

## 🎯 MENSAJES CLAVE

### Para RIESGO (margen negativo o muy bajo):
- **Headline:** "Laburás todo el día y no te queda nada"
- **Problema:** "Laburás 160 horas y te quedan $500 por hora. Estás perdiendo plata. Cada trabajo te cuesta más de lo que cobrás."
- **Acción:** "Revisá tus precios HOY. Estás cobrando menos de lo que te cuesta laburar."

### Para ATENCIÓN (margen bajo pero positivo):
- **Headline:** "Estás cansado de laburar para no ganar"
- **Problema:** "Laburás solo, laburás 160 horas y te quedan $800 por hora. Tu margen es justo. Funciona, pero no sobra nada."
- **Acción:** "Aumentá tu margen en 5 puntos. Eso te da respiro para no estar siempre al límite."

### Upsell (score < 40):
- **Mensaje:** "No estás mal vos. Con estos números, lo raro sería que te vaya bien solo."

---

## 📍 CONTEXTO DE USO

### Cuándo se activa el lenguaje de "laburo solo":
- Si `answers.alone === "Solo"`
- Si hay horas trabajadas y tasa horaria baja
- Si el feeling es "Cansado y sin plata"

### Variables calculadas:
- `hourlyRate`: (revenue - costs) / hours
- Si `hourlyRate < 500` → Mensaje de riesgo
- Si `hourlyRate < 800` → Mensaje de atención

---

## 🚀 PRÓXIMOS PASOS

1. **Probar con emprendedores reales**
   - Electricistas
   - Fotógrafos
   - Técnicos
   - Freelancers

2. **Ajustar frases según feedback**
   - ¿Qué frase "pegó"?
   - ¿Qué no entendieron?
   - ¿Qué los hizo pagar?

3. **Optimizar conversión**
   - A/B test de headlines
   - Ajustar preguntas según abandono
   - Mejorar upsell message

---

**La tecnología está al servicio de la verdad del emprendedor solo, no al revés.**

