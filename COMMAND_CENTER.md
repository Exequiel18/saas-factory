# 🧠 COMMAND CENTER - Sistema de Control Central

> **El cerebro que controla todo. Monitorea todas las automatizaciones. Muestra qué está pasando en tiempo real. Nunca para.**

---

## 🎯 QUÉ ES

El Command Center es el agente central que:

1. **Monitorea todos los sistemas** en tiempo real
2. **Registra todos los eventos** automáticamente
3. **Muestra qué está pasando** en un dashboard
4. **Nunca para** - funciona 24/7

---

## 📊 SISTEMAS CONECTADOS

### 1. Sistema de Chequeo
- Registra cuando alguien completa el chequeo
- Registra cuando alguien paga
- Muestra métricas en tiempo real

### 2. Sistema de Marketing Autónomo
- Registra cuando se genera contenido
- Registra cuando se programa un post
- Muestra plan semanal

### 3. Sistema de Referidos
- Registra cuando alguien comparte
- Registra cuando alguien viene por referido
- Muestra conversiones

### 4. Sistema de Pagos
- Registra cada pago recibido
- Registra errores de pago
- Muestra revenue en tiempo real

### 5. Sistema de Alertas
- Registra alertas generadas
- Registra alertas resueltas
- Muestra estado del sistema

---

## 🚀 CÓMO USARLO

### Dashboard en Tiempo Real

**Ruta:** `/dashboard/command-center`

**Qué ves:**
- Estado de todos los sistemas
- Eventos en tiempo real (actualización cada 5 segundos)
- Estadísticas generales
- Métricas de cada sistema

**Qué hacés:**
- Nada. Solo mirás.
- El sistema funciona solo.

---

## 📡 REGISTRO DE EVENTOS

### Automático

Todos los sistemas registran eventos automáticamente:

- ✅ Chequeo completado → Evento registrado
- ✅ Pago recibido → Evento registrado
- ✅ Contenido generado → Evento registrado
- ✅ Chequeo compartido → Evento registrado
- ✅ Error del sistema → Evento registrado

### Manual (si necesitás)

```typescript
import { EventRecorder } from '@/lib/event-recorder'

// Registrar evento personalizado
await EventRecorder.systemInfo('mi-sistema', 'Algo pasó', { data: 'extra' })
```

---

## 🔄 ACTUALIZACIÓN EN TIEMPO REAL

El dashboard se actualiza automáticamente cada 5 segundos.

**No necesitás:**
- Refrescar la página
- Hacer nada

**El sistema:**
- Polling automático
- Muestra eventos nuevos
- Actualiza métricas
- Nunca para

---

## 📊 MÉTRICAS QUE VES

### Por Sistema:
- Total de acciones
- Acciones hoy
- Acciones esta semana
- Tasa de éxito

### Generales:
- Sistemas activos
- Acciones totales
- Tasa de éxito promedio
- Última actualización

---

## 🎯 EVENTOS EN TIEMPO REAL

Cada evento muestra:
- **Sistema** que lo generó
- **Tipo** (action, conversion, error, info, warning)
- **Mensaje** descriptivo
- **Timestamp** (hace cuánto pasó)
- **Datos** adicionales (si hay)

---

## ⚙️ CONFIGURACIÓN

### Variables de Entorno

```env
NEXTAUTH_URL=https://tu-dominio.com
```

### Polling Interval

Por defecto: 5 segundos

Para cambiar, edita `app/dashboard/command-center/page.tsx`:

```typescript
const interval = setInterval(() => {
  fetchStatus()
}, 5000) // Cambiar este número (en milisegundos)
```

---

## 🚫 LO QUE NO HACE

- ❌ No ejecuta acciones automáticamente
- ❌ No modifica sistemas
- ❌ No toma decisiones por vos

---

## ✅ LO QUE SÍ HACE

- ✅ Monitorea todo
- ✅ Registra eventos
- ✅ Muestra en tiempo real
- ✅ Nunca para
- ✅ Te da visibilidad total

---

## 🎯 OBJETIVO

**Visibilidad total sin esfuerzo.**

Vos:
- Abrís el dashboard
- Ves qué está pasando
- Listo

El sistema:
- Monitorea todo
- Registra eventos
- Muestra en tiempo real
- Nunca para

---

**El Command Center es tu ventana al sistema. Todo conectado. Todo visible. Todo funcionando.**

