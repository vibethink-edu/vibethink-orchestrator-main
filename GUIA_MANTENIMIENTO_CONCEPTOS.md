# 🔧 GUÍA DE MANTENIMIENTO DE CONCEPTOS - Sistema de 3 Capas

**Versión:** 1.0.0
**Fecha:** 2025-12-26
**Autor:** Claude
**Propósito:** Explicar cómo mantener coherencia al agregar nuevos dominios

---

## 🎯 TU PREGUNTA RESPONDIDA

> **Pregunta:** "¿Cómo creo un nuevo SET (ej: Restaurant) sin romper los 9 idiomas?"

**Respuesta:** Usando este sistema de 3 niveles + scripts de validación.

---

## 📊 ARQUITECTURA DE 3 NIVELES

### **NIVEL 1: Conceptos BASE (Compartidos)**

**Archivo:** `concept.json` (en cada idioma)

**Contiene:** Conceptos usados por **2 o más productos**

```json
// apps/dashboard/src/lib/i18n/translations/en/concept.json
{
  "concept.booking.action.reserve": "Reserve",     // ← Hotel Y Restaurant lo usan
  "concept.booking.action.confirm": "Confirm",     // ← Hotel Y Restaurant lo usan
  "concept.booking.status.pending": "Pending",     // ← TODOS lo usan
  "concept.common.time.hour": "Hour",              // ← Studio Y Restaurant lo usan
  "concept.common.time.night": "Night"             // ← Hotel lo usa (solo 1, pero común)
}
```

**Regla:** Si **2+ productos** usan el mismo concepto → va en `concept.json`

---

### **NIVEL 2: Conceptos ESPECÍFICOS por Producto**

**Archivos:** `concept-{producto}.json` (en cada idioma)

**Contiene:** Conceptos ÚNICOS de ese producto

```json
// concept-hotel.json
{
  "concept.hotel.resource.suite": "Suite",         // ← Solo Hotel
  "concept.hotel.amenity.pool": "Pool"             // ← Solo Hotel
}

// concept-restaurant.json (NUEVO)
{
  "concept.restaurant.resource.table": "Table",    // ← Solo Restaurant
  "concept.restaurant.item.menu": "Menu",          // ← Solo Restaurant
  "concept.restaurant.item.dish": "Dish"           // ← Solo Restaurant
}
```

**Regla:** Si **solo 1 producto** usa el concepto → va en `concept-{producto}.json`

---

### **NIVEL 3: Resolución JERÁRQUICA**

El sistema resuelve en este orden:

```
User context: restaurant, locale: es

term('concept.booking.action.reserve')
  ↓
1. Busca en: concept-restaurant.json (ES)
   → NO existe
  ↓
2. Busca en: concept.json (ES)
   → ✅ "Reservar"
  ↓
3. Retorna: "Reservar"
```

```
term('concept.restaurant.resource.table')
  ↓
1. Busca en: concept-restaurant.json (ES)
   → ✅ "Mesa"
  ↓
2. Retorna: "Mesa"
```

---

## 🚀 PROCESO: Agregar Nuevo Dominio (Restaurant)

### **PASO 1: Análisis de Conceptos**

**Matriz de decisión:**

| Concepto | Hotel | Restaurant | Coliving | ¿Dónde va? |
|----------|-------|------------|----------|------------|
| reserve (action) | ✅ | ✅ | ✅ | `concept.json` (BASE - usado por 3) |
| confirm (action) | ✅ | ✅ | ✅ | `concept.json` (BASE - usado por 3) |
| table (resource) | ❌ | ✅ | ❌ | `concept-restaurant.json` (único) |
| menu (item) | ❌ | ✅ | ❌ | `concept-restaurant.json` (único) |
| meal (service) | ❌ | ✅ | ✅ | `concept.json` (BASE - usado por 2) |
| dish (item) | ❌ | ✅ | ❌ | `concept-restaurant.json` (único) |
| chef (person) | ❌ | ✅ | ❌ | `concept-restaurant.json` (único) |
| order (action) | ❌ | ✅ | ❌ | `concept-restaurant.json` (único) |

**Decisión:**
- **concept.json (BASE):** reserve, confirm, meal
- **concept-restaurant.json:** table, menu, dish, chef, order

---

### **PASO 2: Crear Archivos en 9 Idiomas**

#### **2.1. Crear archivos**

```bash
# Crear archivo en inglés (master)
touch apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json
```

**Contenido inicial (EN):**
```json
{
  "concept": {
    "restaurant": {
      "resource": {
        "table": "Table",
        "kitchen": "Kitchen",
        "bar": "Bar"
      },
      "item": {
        "menu": "Menu",
        "dish": "Dish",
        "drink": "Drink"
      },
      "person": {
        "chef": "Chef",
        "waiter": "Waiter",
        "host": "Host"
      },
      "action": {
        "order": "Order",
        "serve": "Serve",
        "prepare": "Prepare"
      },
      "status": {
        "preparing": "Preparing",
        "ready": "Ready",
        "served": "Served"
      }
    }
  }
}
```

#### **2.2. Copiar a otros idiomas**

```bash
# Copiar archivo EN a todos los idiomas
for locale in es fr pt de it ko ar zh; do
  cp apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json \
     apps/dashboard/src/lib/i18n/translations/$locale/
done
```

---

### **PASO 3: Ejecutar Scripts de Mantenimiento**

#### **3.1. Validar coherencia**

```bash
node scripts/validate-concepts-coherence.js
```

**Salida esperada:**
```
✅ concept-restaurant.json existe en todos los idiomas
✅ concept-restaurant.json (es): Keys coherentes con EN
✅ concept-restaurant.json (fr): Keys coherentes con EN
...
✅ No hay duplicados entre base y productos
✅ Todas las traducciones tienen contenido
```

#### **3.2. Si hay errores, arreglar automáticamente**

```bash
node scripts/fix-concepts-coherence.js
```

**Esto arregla:**
- ✅ Sincroniza keys entre idiomas (EN es master)
- ✅ Elimina duplicados entre base y productos
- ✅ Preserva traducciones existentes

#### **3.3. Validar nuevamente**

```bash
node scripts/validate-concepts-coherence.js
```

**Debe pasar todas las validaciones.**

---

### **PASO 4: Traducir Manualmente**

**Ahora todos los idiomas tienen el archivo, pero en INGLÉS.**

Necesitas traducir manualmente:

```bash
# Editar cada idioma
nano apps/dashboard/src/lib/i18n/translations/es/concept-restaurant.json
nano apps/dashboard/src/lib/i18n/translations/fr/concept-restaurant.json
# ... etc
```

**O usar herramienta de traducción:**
- Google Translate API
- DeepL API
- Traductor profesional

---

## 🔄 CRUCE DE CONCEPTOS COMPARTIDOS

### **Ejemplo: "meal" en Coliving Y Restaurant**

**Problema:** Ambos productos usan "meal" pero con significados ligeramente diferentes.

**Solución 1: Concepto compartido** (Recomendada)

```json
// concept.json (BASE)
{
  "concept.common.service.meal": "Meal"
}

// concept-restaurant.json
{
  // NO incluir "meal" aquí
}

// concept-coliving.json
{
  // NO incluir "meal" aquí
}
```

**Ambos productos usan el mismo término:** "Meal" / "Comida"

**Solución 2: Conceptos diferentes con override**

Si necesitas términos DIFERENTES en cada producto:

```json
// concept.json (BASE)
{
  "concept.common.service.meal": "Meal"  // Término genérico
}

// concept-restaurant.json
{
  "concept.restaurant.service.meal": "Course"  // ← Override para restaurant
}

// concept-coliving.json
{
  "concept.coliving.service.meal": "Meal Plan"  // ← Override para coliving
}
```

**Uso:**
```typescript
// En Restaurant
term('concept.restaurant.service.meal')  // → "Course"

// En Coliving
term('concept.coliving.service.meal')   // → "Meal Plan"

// En otro contexto
term('concept.common.service.meal')     // → "Meal"
```

---

## 🛡️ GARANTÍAS DEL SISTEMA

### **1. No se rompen idiomas** ✅

**Gracias a:**
- Script de validación detecta keys faltantes
- Script de arreglo sincroniza automáticamente
- Fallback a inglés si falta traducción

### **2. No quedan idiomas desactualizados** ✅

**Gracias a:**
- EN es siempre master (fuente de verdad)
- Script sincroniza todos los idiomas con EN
- Validación falla si hay keys extra o faltantes

### **3. No hay duplicados** ✅

**Gracias a:**
- Script detecta duplicados entre base y productos
- Script elimina automáticamente duplicados
- Validación falla si hay duplicados

### **4. Coherencia garantizada** ✅

**Gracias a:**
- Estructura jerárquica clara (base vs producto)
- Scripts automáticos de mantenimiento
- CI/CD puede ejecutar validación en cada commit

---

## 🤖 AUTOMATIZACIÓN COMPLETA

### **Workflow Recomendado:**

```bash
# 1. Crear nuevo dominio (Restaurant)
mkdir -p apps/dashboard/src/lib/i18n/translations/en
touch apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json

# 2. Editar EN (master)
nano apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json

# 3. Copiar a todos los idiomas
for locale in es fr pt de it ko ar zh; do
  cp apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json \
     apps/dashboard/src/lib/i18n/translations/$locale/
done

# 4. Validar
node scripts/validate-concepts-coherence.js

# 5. Si hay errores, arreglar
node scripts/fix-concepts-coherence.js

# 6. Validar nuevamente
node scripts/validate-concepts-coherence.js

# 7. Traducir manualmente o con API
# (Aquí puedes usar DeepL API, Google Translate, etc.)

# 8. Validar final
node scripts/validate-concepts-coherence.js

# 9. Commit
git add apps/dashboard/src/lib/i18n/translations/*/concept-restaurant.json
git commit -m "feat(i18n): Add restaurant concepts (9 locales)"
```

---

## 🔧 SCRIPTS DISPONIBLES

### **1. validate-concepts-coherence.js**

**Qué hace:**
- ✅ Valida que todos los idiomas tengan los mismos archivos
- ✅ Valida que todos los archivos tengan las mismas keys
- ✅ Detecta duplicados entre base y productos
- ✅ Detecta traducciones vacías

**Cuándo usar:** Antes de commit, en CI/CD

### **2. fix-concepts-coherence.js**

**Qué hace:**
- ✅ Sincroniza keys entre idiomas (EN es master)
- ✅ Elimina duplicados
- ✅ Preserva traducciones existentes

**Cuándo usar:** Después de agregar/modificar conceptos

### **3. copy-missing-translation-files.js**

**Qué hace:**
- ✅ Detecta archivos faltantes
- ✅ Copia desde EN a otros idiomas

**Cuándo usar:** Después de crear nuevo dominio

---

## 📋 CHECKLIST: Agregar Nuevo Dominio

- [ ] **Paso 1:** Analizar conceptos (¿base o producto?)
- [ ] **Paso 2:** Crear `concept-{producto}.json` en EN
- [ ] **Paso 3:** Copiar a 9 idiomas
- [ ] **Paso 4:** Ejecutar `validate-concepts-coherence.js`
- [ ] **Paso 5:** Si falla, ejecutar `fix-concepts-coherence.js`
- [ ] **Paso 6:** Traducir manualmente
- [ ] **Paso 7:** Validar nuevamente
- [ ] **Paso 8:** Commit

---

## 🎯 EJEMPLO COMPLETO: Restaurant

```bash
# 1. Crear archivo EN
cat > apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json << 'EOF'
{
  "concept": {
    "restaurant": {
      "resource": { "table": "Table", "kitchen": "Kitchen" },
      "item": { "menu": "Menu", "dish": "Dish" },
      "action": { "order": "Order", "serve": "Serve" }
    }
  }
}
EOF

# 2. Copiar a todos
for locale in es fr pt de it ko ar zh; do
  cp apps/dashboard/src/lib/i18n/translations/en/concept-restaurant.json \
     apps/dashboard/src/lib/i18n/translations/$locale/
done

# 3. Validar
node scripts/validate-concepts-coherence.js
# ✅ Debe pasar (todos tienen mismas keys, aunque en inglés)

# 4. Traducir ES manualmente
cat > apps/dashboard/src/lib/i18n/translations/es/concept-restaurant.json << 'EOF'
{
  "concept": {
    "restaurant": {
      "resource": { "table": "Mesa", "kitchen": "Cocina" },
      "item": { "menu": "Menú", "dish": "Plato" },
      "action": { "order": "Ordenar", "serve": "Servir" }
    }
  }
}
EOF

# 5. Validar nuevamente
node scripts/validate-concepts-coherence.js
# ✅ Debe seguir pasando

# 6. Commit
git add apps/dashboard/src/lib/i18n/translations/*/concept-restaurant.json
git commit -m "feat(i18n): Add restaurant concepts (9 locales, ES translated)"
```

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

### **Error 1: Keys diferentes entre idiomas**

```
❌ concept-restaurant.json (es): Faltan 5 keys
```

**Solución:**
```bash
node scripts/fix-concepts-coherence.js
```

### **Error 2: Duplicados entre base y producto**

```
❌ concept-restaurant.json (en): 3 keys duplicadas con base
```

**Solución:**
```bash
node scripts/fix-concepts-coherence.js
```

### **Error 3: Archivo faltante en un idioma**

```
❌ concept-restaurant.json falta en: ko, ar
```

**Solución:**
```bash
node scripts/copy-missing-translation-files.js
```

---

## ✅ VENTAJAS DEL SISTEMA

1. **✅ Coherencia garantizada** - Scripts validan automáticamente
2. **✅ No se rompen idiomas** - Fallback a inglés si falta
3. **✅ Mantenible** - EN es master, otros se sincronizan
4. **✅ Escalable** - Agregar 10 productos más es fácil
5. **✅ Automatizable** - Scripts en CI/CD
6. **✅ Cruce de conceptos** - Base vs Producto bien definido

---

## 📚 PRÓXIMOS PASOS

1. **Lee esta guía completa**
2. **Prueba crear `concept-restaurant.json`** siguiendo los pasos
3. **Ejecuta los scripts de validación**
4. **Decide si quieres automatizar con CI/CD**

---

**DOCUMENTO CREADO POR:** Claude
**FECHA:** 2025-12-26
**VERSIÓN:** 1.0.0
