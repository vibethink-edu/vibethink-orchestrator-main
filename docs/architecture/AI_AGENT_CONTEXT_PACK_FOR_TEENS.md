# Agent Context Pack - Explicación para Adolescentes

**Versión:** 1.0.0
**Fecha:** 2025-12-25
**Audiencia:** Tu yo de 15 años (o cualquier desarrollador que empieza)

---

## 🎯 ¿Qué Problema Resuelve?

### El Problema (Antes):

Imagina que tienes un asistente de IA que ayuda a tus clientes. El problema es:

**Ejemplo 1: Hotel**
```
Usuario: "¿Tienes espacio disponible?"
IA: "Sí, tenemos 5 cuartos libres"  ❌

Problema: Dijo "cuartos" cuando debería decir "habitaciones"
```

**Ejemplo 2: Estudio de Grabación**
```
Usuario: "¿Tienes espacio disponible?"
IA: "Sí, tenemos 5 habitaciones libres"  ❌

Problema: Dijo "habitaciones" cuando debería decir "salas"
```

**Ejemplo 3: Cliente Español**
```
Usuario: "¿Cuánto cuesta?"
IA: "Cuesta $1,234.56"  ❌

Problema: Usó formato americano (coma para miles, punto para decimales)
Debería ser: "$1.234,56" (punto para miles, coma para decimales)
```

### La Solución (Ahora):

Un "Context Pack" es como una **hoja de trucos automática** que le das al agente ANTES de que responda.

Le dice:
- ✅ "Estás en un hotel, di 'habitación' no 'sala'"
- ✅ "El cliente habla español, usa formato español"
- ✅ "El símbolo de moneda va ANTES del número"

---

## 🧩 ¿Cómo Funciona? (Analogía Simple)

### Analogía: El Asistente de McDonald's

Imagina que trabajas en McDonald's y llega un cliente:

**Sin Context Pack:**
```
Tú: "¿Qué quieres?"  ← No sabes si es para comer aquí o llevar
Cliente: "Una hamburguesa"
Tú: "¿De qué tamaño?"  ← Tienes que preguntar todo
Cliente: "Grande"
Tú: "¿Con papas?"  ← Más preguntas...
```

**Con Context Pack:**
```
[Context Pack te dice ANTES de hablar]
- Cliente: Regular (viene seguido)
- Preferencia: Para llevar
- Idioma: Español
- Alérgico: Nada
- Última orden: Big Mac + Papas grandes + Coca-Cola

Tú: "¡Hola Juan! ¿Lo mismo de siempre? Big Mac, papas grandes, coca?"
Cliente: "¡Perfecto!"
```

El Context Pack te dio **toda la información** que necesitas para ser más eficiente.

---

## 📝 Casos de Uso Reales

### Caso 1: Chatbot de Hotel

**Código SIN Context Pack (MAL):**

```typescript
// ❌ Agente sin contexto
async function responderCliente(mensaje: string) {
  const respuesta = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'Eres un asistente de hotel' },
      { role: 'user', content: mensaje }
    ]
  });

  return respuesta.choices[0].message.content;
}

// Problemas:
// - No sabe en qué idioma responder
// - No sabe si decir "habitación", "cuarto", "suite"
// - No sabe cómo formatear precios
```

**Código CON Context Pack (BIEN):**

```typescript
// ✅ Agente con contexto
import { executeAgent } from '@/lib/ai';

async function responderCliente(mensaje: string, clienteId: string) {
  const respuesta = await executeAgent({
    tenantId: 'hotel-playa-bonita',      // Tu hotel
    userId: clienteId,                    // El cliente
    route: '/dashboard-bundui/hotel/bookings',  // Detecta "hotel"
    locale: 'es',                         // Español
    userMessage: mensaje,
    conceptIds: [
      'concept.resource.room',            // "habitación"
      'concept.unit.night',               // "noche"
      'concept.status.available'          // "disponible"
    ]
  });

  return respuesta.message;
}

// Resultado:
// Usuario: "¿Hay espacio disponible?"
// IA: "Tenemos 15 habitaciones disponibles desde $125,50 por noche"
//     ✅ Dice "habitaciones" (no "cuartos" ni "salas")
//     ✅ Formato español: $125,50 (no $125.50)
//     ✅ Habla en español
```

---

### Caso 2: Estudio de Grabación

**Código CON Context Pack:**

```typescript
import { executeAgent } from '@/lib/ai';

async function responderCliente(mensaje: string, clienteId: string) {
  const respuesta = await executeAgent({
    tenantId: 'studio-sound-lab',         // Tu estudio
    userId: clienteId,
    route: '/dashboard-bundui/studio/bookings',  // Detecta "studio"
    locale: 'es',
    userMessage: mensaje,
    conceptIds: [
      'concept.resource.room',            // Ahora será "sala"
      'concept.unit.hour'                 // "hora"
    ]
  });

  return respuesta.message;
}

// Resultado:
// Usuario: "¿Hay espacio disponible?"
// IA: "Tenemos 3 salas disponibles desde $50 por hora"
//     ✅ Dice "salas" (no "habitaciones")
//     ✅ Dice "por hora" (no "por noche")
//     ✅ Mismo código, diferente contexto = diferentes términos
```

---

### Caso 3: Multi-Idioma (Mismo Hotel, Diferentes Clientes)

**Cliente Español:**

```typescript
const respuesta = await executeAgent({
  tenantId: 'hotel-playa-bonita',
  userId: 'cliente-es-123',
  route: '/dashboard-bundui/hotel/bookings',
  locale: 'es',  // ← Español
  userMessage: '¿Cuánto cuesta?',
  conceptIds: ['concept.resource.room']
});

// Respuesta: "La habitación cuesta $1.234,56 por noche"
//            ✅ Español
//            ✅ Formato: 1.234,56 (punto miles, coma decimales)
//            ✅ Símbolo $ ANTES
```

**Cliente Inglés:**

```typescript
const respuesta = await executeAgent({
  tenantId: 'hotel-playa-bonita',
  userId: 'cliente-en-456',
  route: '/dashboard-bundui/hotel/bookings',
  locale: 'en',  // ← Inglés
  userMessage: 'How much does it cost?',
  conceptIds: ['concept.resource.room']
});

// Respuesta: "The room costs $1,234.56 per night"
//            ✅ Inglés
//            ✅ Formato: 1,234.56 (coma miles, punto decimales)
//            ✅ Símbolo $ ANTES
```

**Cliente Árabe:**

```typescript
const respuesta = await executeAgent({
  tenantId: 'hotel-playa-bonita',
  userId: 'cliente-ar-789',
  route: '/dashboard-bundui/hotel/bookings',
  locale: 'ar',  // ← Árabe
  userMessage: 'كم يكلف؟',
  conceptIds: ['concept.resource.room']
});

// Respuesta: "الغرفة تكلف ١٬٢٣٤٫٥٦ ر.س لكل ليلة"
//            ✅ Árabe
//            ✅ RTL (right-to-left)
//            ✅ Formato árabe: ١٬٢٣٤٫٥٦
//            ✅ Moneda: ر.س (Saudi Riyal) DESPUÉS
```

---

## 🛠️ Cómo Funciona Por Dentro (Simple)

### Paso 1: Detectar Contexto

```typescript
// El sistema mira la URL y detecta el contexto automáticamente
'/dashboard-bundui/hotel/bookings'   → context = 'hotel'
'/dashboard-bundui/studio/sessions'  → context = 'studio'
'/dashboard-bundui/cowork/spaces'    → context = 'cowork'
```

### Paso 2: Cargar Terminología

```typescript
// Según el contexto, carga diferentes términos
context = 'hotel' → {
  'concept.resource.room': 'Habitación',
  'concept.unit.night': 'Noche'
}

context = 'studio' → {
  'concept.resource.room': 'Sala',
  'concept.unit.hour': 'Hora'
}
```

### Paso 3: Cargar Formatos Regionales

```typescript
// Según el idioma, carga formatos
locale = 'es' → {
  decimalSeparator: ',',      // 1,50
  thousandsSeparator: '.',    // 1.234
  currencySymbol: '$',
  currencyPosition: 'before'  // $100
}

locale = 'ar' → {
  decimalSeparator: '٫',      // ٫ (árabe)
  thousandsSeparator: '٬',    // ٬ (árabe)
  currencySymbol: 'ر.س',
  currencyPosition: 'after'   // 100 ر.س
}
```

### Paso 4: Construir Prompt Automático

```typescript
// El sistema construye esto AUTOMÁTICAMENTE:
`
Eres un asistente de hotel.
Idioma: español
Contexto: hotel

Términos que DEBES usar:
- concept.resource.room = "Habitación"
- concept.unit.night = "Noche"

Formatos que DEBES usar:
- Números: 1.234,56 (punto miles, coma decimales)
- Moneda: $1.234,56 (símbolo antes)
- Fechas: DD/MM/YYYY

NUNCA inventes términos. Usa SOLO los de arriba.
`
```

---

## 💡 ¿Por Qué Esto es Importante?

### 1. **Consistencia**

Sin Context Pack:
```
IA día 1: "Tenemos habitaciones"
IA día 2: "Tenemos cuartos"
IA día 3: "Tenemos suites"
```

Con Context Pack:
```
IA siempre: "Tenemos habitaciones"  ✅
```

### 2. **Internacionalización**

Sin Context Pack:
```
Cliente español: "Cuesta $1,234.56"  ❌ (formato americano)
```

Con Context Pack:
```
Cliente español: "Cuesta $1.234,56"  ✅ (formato español)
```

### 3. **Multi-Tenant (Múltiples Negocios)**

```typescript
// Hotel usa "habitación"
executeAgent({ route: '/hotel', ... })
// → "habitación"

// Studio usa "sala"
executeAgent({ route: '/studio', ... })
// → "sala"

// ¡Mismo código, diferentes resultados!
```

---

## 🎮 Ejercicio Práctico: Crea Tu Propio Chatbot

### Paso 1: Instala las dependencias (ya están)

```bash
# Ya está instalado en el proyecto
```

### Paso 2: Crea un archivo `mi-chatbot.ts`

```typescript
import { executeAgent } from '@/lib/ai';

async function miChatbot() {
  const respuesta = await executeAgent({
    tenantId: 'mi-negocio',
    userId: 'usuario-123',
    route: '/dashboard-bundui/hotel/bookings',
    locale: 'es',
    userMessage: '¿Tienes habitaciones disponibles?',
    conceptIds: ['concept.resource.room']
  });

  console.log('IA dice:', respuesta.message);
  console.log('Contexto usado:', respuesta.contextPack.context);
  console.log('Términos:', respuesta.contextPack.terms);
}

miChatbot();
```

### Paso 3: Ejecuta

```bash
npx tsx mi-chatbot.ts
```

### Paso 4: Cambia el contexto

```typescript
// Prueba cambiar:
route: '/dashboard-bundui/studio/bookings'  // Studio en vez de hotel
locale: 'en'                                // Inglés en vez de español

// Y mira cómo cambia la respuesta automáticamente
```

---

## 🧪 Experimentos Para Probar

### Experimento 1: Diferentes Contextos

```typescript
// Hotel
executeAgent({ route: '/hotel', ... })
// Studio
executeAgent({ route: '/studio', ... })
// Cowork
executeAgent({ route: '/cowork', ... })

// Compara las respuestas
```

### Experimento 2: Diferentes Idiomas

```typescript
// Español
executeAgent({ locale: 'es', ... })
// Inglés
executeAgent({ locale: 'en', ... })
// Árabe
executeAgent({ locale: 'ar', ... })
// Japonés
executeAgent({ locale: 'ja', ... })

// Mira los formatos de números
```

### Experimento 3: Formateo Manual

```typescript
import { getAgentContextPackCached, formatCurrency } from '@/lib/ai';

const pack = await getAgentContextPackCached({
  tenantId: 'test',
  userId: 'test',
  route: '/hotel',
  locale: 'es'
});

console.log(formatCurrency(1234.56, pack));
// → $1.234,56 (español)

const packEn = await getAgentContextPackCached({
  ...pack,
  locale: 'en'
});

console.log(formatCurrency(1234.56, packEn));
// → $1,234.56 (inglés)
```

---

## 🚫 Errores Comunes y Cómo Evitarlos

### Error 1: Olvidar el Context Pack

```typescript
// ❌ MAL
const respuesta = await openai.chat({
  messages: [{ role: 'user', content: 'Hola' }]
});

// ✅ BIEN
const respuesta = await executeAgent({
  tenantId: 'hotel-123',
  userId: 'user-456',
  route: '/hotel',
  locale: 'es',
  userMessage: 'Hola'
});
```

### Error 2: Formatear Números Manualmente

```typescript
// ❌ MAL
const precio = `$${(1234.56).toFixed(2)}`;
// → $1234.56 (siempre formato americano)

// ✅ BIEN
const precio = formatCurrency(1234.56, contextPack);
// → $1.234,56 (español) o $1,234.56 (inglés)
```

### Error 3: Inventar Términos

```typescript
// ❌ MAL
const mensaje = `Tenemos cuartos disponibles`;
// "cuartos" no está en la terminología

// ✅ BIEN
const roomTerm = getTerm('concept.resource.room', contextPack);
const mensaje = `Tenemos ${roomTerm} disponibles`;
// Usa el término correcto del contexto
```

---

## 📚 Resumen Para tu Yo de 15 Años

1. **Context Pack = Hoja de Trucos Automática**
   - Le dice al agente cómo hablar según el contexto

2. **Tres Cosas Que Resuelve:**
   - ✅ Terminología correcta (habitación vs sala vs espacio)
   - ✅ Formatos regionales ($1.234,56 vs $1,234.56)
   - ✅ Idiomas (español, inglés, árabe, etc.)

3. **Cómo Usarlo:**
   ```typescript
   import { executeAgent } from '@/lib/ai';

   const respuesta = await executeAgent({
     tenantId: 'tu-negocio',
     userId: 'usuario',
     route: '/hotel',  // ← Detecta contexto automático
     locale: 'es',
     userMessage: '¿Hay habitaciones?'
   });
   ```

4. **Lo Que NO Hacer:**
   - ❌ Llamar al modelo de IA directo sin contexto
   - ❌ Formatear números/monedas manualmente
   - ❌ Inventar términos en vez de usar ConceptIDs

5. **Lo Mejor:**
   - 🎯 Mismo código funciona para hotel, studio, cowork
   - 🌍 Mismo código funciona en 9 idiomas
   - 🚀 Cache automático para velocidad
   - ✅ Tests garantizan que funciona

---

**¿Preguntas? Lee la documentación completa:**
- `AI_AGENT_CONTEXT_PACK_IMPLEMENTATION.md` - Versión técnica
- Este archivo - Versión simple para adolescentes

**Experimento sugerido:** Crea un chatbot que detecte automáticamente si estás en hotel o studio y use los términos correctos. ¡Es más fácil de lo que piensas!
