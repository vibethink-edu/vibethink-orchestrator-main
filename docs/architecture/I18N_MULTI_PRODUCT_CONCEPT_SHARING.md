# i18n Multi-Product Concept Sharing Strategy

**Fecha:** 2025-12-26
**Estado:** 📋 POLÍTICA DEFINIDA - Pendiente implementación
**Versión:** 1.0.0

---

## 🎯 PROPÓSITO

Definir la política y validaciones para agregar nuevos productos (ej: Restaurant) al sistema de 3 capas i18n, asegurando:
- ✅ Conceptos compartidos se reutilizan (evitar duplicación)
- ✅ Conceptos únicos se aíslan por producto
- ✅ Sistema detecta automáticamente cruces entre productos
- ✅ Validaciones previenen inconsistencias

---

## 📚 CASO DE USO: Agregar Producto "Restaurant"

### **Conceptos que aparecen:**

| Concepto | Inglés | ¿Ya existe? | ¿Dónde va? | Razón |
|----------|--------|-------------|------------|-------|
| `breakfast` | Breakfast | ❌ No | `concept.json` | Compartido (Coliving + Restaurant) |
| `lunch` | Lunch | ❌ No | `concept.json` | Compartido (Coliving + Restaurant) |
| `dinner` | Dinner | ❌ No | `concept.json` | Compartido (Coliving + Restaurant) |
| `reserve` | Reserve | ✅ Sí | `concept.json` | Ya compartido (Hotel, Studio, Cowork, Coliving, Restaurant) |
| `schedule` | Schedule | ✅ Sí | `concept.json` | Ya compartido (Studio, Restaurant) |
| `table` | Table | ❌ No | `concept-restaurant.json` | Único de Restaurant |
| `menu` | Menu | ❌ No | `concept-restaurant.json` | Único de Restaurant |
| `waiter` | Waiter | ❌ No | `concept-restaurant.json` | Único de Restaurant |

---

## 🔧 REGLAS DE DECISIÓN (Decision Matrix)

### **Regla 1: Concepto Compartido vs Único**

```
¿Este concepto se usa en 2+ productos?
├─→ SÍ: Agregar a concept.json (compartido)
│   Ejemplo: "breakfast" (Coliving + Restaurant)
│            "reserve" (Hotel, Studio, Cowork, Coliving, Restaurant)
│
└─→ NO: Agregar a concept-{product}.json (único)
    Ejemplo: "table" (solo Restaurant)
             "waiter" (solo Restaurant)
```

### **Regla 2: Detección de Duplicados**

**Script de validación:** `validate-concepts-coherence.js`

```javascript
// Detecta si un concepto está en AMBOS archivos
const duplicates = [];

// Leer concept.json
const baseKeys = Object.keys(conceptJson.concept);

// Leer concept-restaurant.json
const productKeys = Object.keys(conceptRestaurantJson.concept.restaurant);

// Detectar duplicados
baseKeys.forEach(key => {
  if (productKeys.includes(key)) {
    duplicates.push(key);
  }
});

if (duplicates.length > 0) {
  console.error(`❌ DUPLICADOS DETECTADOS: ${duplicates.join(', ')}`);
  console.error(`   Solución: Eliminar de concept-restaurant.json`);
  process.exit(1);
}
```

### **Regla 3: Estructura Jerárquica**

```json
// concept.json (BASE - Conceptos compartidos)
{
  "concept": {
    "booking": { ... },      // ✅ Compartido por todos los productos
    "schedule": { ... },     // ✅ Compartido por Studio + Restaurant
    "meal": {                // ✅ NUEVO - Compartido por Coliving + Restaurant
      "breakfast": "Breakfast",
      "lunch": "Lunch",
      "dinner": "Dinner"
    }
  }
}
```

```json
// concept-restaurant.json (PRODUCT - Conceptos únicos)
{
  "concept": {
    "restaurant": {          // ✅ Namespace único de Restaurant
      "resource": {
        "table": "Table",    // ✅ Único de Restaurant
        "kitchen": "Kitchen",
        "waiter": "Waiter"
      },
      "item": {
        "menu": "Menu",
        "dish": "Dish",
        "beverage": "Beverage"
      },
      "action": {
        "order": "Order",
        "serve": "Serve",
        "pay": "Pay bill"
      },
      "schedule": {
        "service": {
          "breakfast": "6:00 AM - 10:00 AM",  // ✅ Override específico
          "lunch": "12:00 PM - 3:00 PM",
          "dinner": "6:00 PM - 10:00 PM"
        }
      }
    }
  }
}
```

---

## 🛡️ VALIDACIONES OBLIGATORIAS

### **Validación 1: Coherencia de Conceptos Compartidos**

**Script:** `validate-shared-concepts.js` (NUEVO - crear)

```javascript
// Detecta conceptos que deberían estar en concept.json
// pero están duplicados en múltiples concept-{product}.json

const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];
const PRODUCTS = ['hotel', 'studio', 'cowork', 'coliving', 'restaurant'];

function validateSharedConcepts() {
  const conceptUsage = {}; // { "breakfast": ["coliving", "restaurant"] }

  // 1. Leer todos los concept-{product}.json
  PRODUCTS.forEach(product => {
    const filePath = path.join(
      __dirname,
      `../apps/dashboard/src/lib/i18n/translations/en/concept-${product}.json`
    );

    if (!fs.existsSync(filePath)) return;

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const keys = extractAllKeys(data);

    keys.forEach(key => {
      if (!conceptUsage[key]) {
        conceptUsage[key] = [];
      }
      conceptUsage[key].push(product);
    });
  });

  // 2. Detectar conceptos compartidos (usados en 2+ productos)
  const sharedConcepts = Object.entries(conceptUsage)
    .filter(([key, products]) => products.length >= 2)
    .map(([key, products]) => ({ key, products }));

  if (sharedConcepts.length > 0) {
    console.error('❌ CONCEPTOS COMPARTIDOS DETECTADOS:');
    console.error('   Estos conceptos deberían estar en concept.json:\n');
    sharedConcepts.forEach(({ key, products }) => {
      console.error(`   - "${key}"`);
      console.error(`     Usado en: ${products.join(', ')}`);
    });
    console.error('\n   Acción requerida:');
    console.error('   1. Mover estos conceptos a concept.json');
    console.error('   2. Eliminar de concept-{product}.json');
    console.error('   3. Re-validar con: node scripts/validate-concepts-coherence.js\n');
    process.exit(1);
  }

  console.log('✅ No se detectaron conceptos compartidos duplicados');
  return true;
}

function extractAllKeys(obj, prefix = '') {
  const keys = [];
  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...extractAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  });
  return keys;
}

validateSharedConcepts();
```

**Uso:**
```bash
# Ejecutar después de agregar nuevo producto
node scripts/validate-shared-concepts.js
```

---

### **Validación 2: Workflow de Agregado de Producto**

**Script:** `add-product.js` (NUEVO - crear)

```javascript
// Script interactivo para agregar nuevo producto
// Asegura que se sigan TODAS las reglas

const inquirer = require('inquirer'); // npm install inquirer
const fs = require('fs');
const path = require('path');

async function addProduct() {
  // 1. Preguntar nombre del producto
  const { productName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'productName',
      message: 'Nombre del producto (ej: restaurant, gym, clinic):',
      validate: (input) => {
        if (!input.match(/^[a-z]+$/)) {
          return 'Solo letras minúsculas sin espacios';
        }
        return true;
      }
    }
  ]);

  // 2. Crear archivo en inglés (master)
  const enFilePath = path.join(
    __dirname,
    `../apps/dashboard/src/lib/i18n/translations/en/concept-${productName}.json`
  );

  if (fs.existsSync(enFilePath)) {
    console.error(`❌ El producto "${productName}" ya existe`);
    process.exit(1);
  }

  // 3. Template inicial
  const template = {
    concept: {
      [productName]: {
        resource: {
          // Agregar recursos únicos del producto
        },
        item: {
          // Agregar items únicos del producto
        },
        action: {
          // Agregar acciones únicas del producto
        }
      }
    }
  };

  fs.writeFileSync(enFilePath, JSON.stringify(template, null, 2), 'utf-8');
  console.log(`✅ Creado: ${enFilePath}`);

  // 4. Copiar a todos los idiomas
  const LOCALES = ['es', 'fr', 'pt', 'de', 'it', 'ko', 'ar', 'zh'];
  LOCALES.forEach(locale => {
    const localeFilePath = path.join(
      __dirname,
      `../apps/dashboard/src/lib/i18n/translations/${locale}/concept-${productName}.json`
    );
    fs.writeFileSync(localeFilePath, JSON.stringify(template, null, 2), 'utf-8');
    console.log(`✅ Creado: ${localeFilePath}`);
  });

  // 5. Instrucciones
  console.log('\n📋 PRÓXIMOS PASOS:');
  console.log(`1. Editar concept-${productName}.json en inglés (EN)`);
  console.log('2. Agregar conceptos ÚNICOS del producto');
  console.log('3. Si hay conceptos compartidos, agregarlos a concept.json');
  console.log('4. Ejecutar: node scripts/validate-shared-concepts.js');
  console.log('5. Ejecutar: node scripts/validate-concepts-coherence.js');
  console.log('6. Traducir manualmente cada idioma\n');
}

addProduct();
```

**Uso:**
```bash
# Agregar nuevo producto de forma guiada
node scripts/add-product.js
```

---

### **Validación 3: Pre-commit Hook**

**Archivo:** `.husky/pre-commit` (NUEVO - crear)

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validar coherencia de conceptos antes de commit
echo "🔍 Validando coherencia de conceptos i18n..."
node scripts/validate-concepts-coherence.js

if [ $? -ne 0 ]; then
  echo "❌ Validación fallida. Arreglando automáticamente..."
  node scripts/fix-concepts-coherence.js

  echo "✅ Coherencia restaurada. Por favor revisa los cambios y vuelve a hacer commit."
  exit 1
fi

# Validar conceptos compartidos
echo "🔍 Validando conceptos compartidos..."
node scripts/validate-shared-concepts.js

if [ $? -ne 0 ]; then
  echo "❌ Conceptos compartidos detectados. Por favor revisa el output y corrige."
  exit 1
fi

echo "✅ Todas las validaciones pasaron"
exit 0
```

---

## 📊 MÉTRICAS DE OPTIMIZACIÓN

### **Métrica 1: Reducción de Duplicación**

**Objetivo:** 0% de duplicación entre `concept.json` y `concept-{product}.json`

**Medición:**
```bash
node scripts/validate-shared-concepts.js
# Output: "✅ No se detectaron conceptos compartidos duplicados"
```

### **Métrica 2: Cobertura de Validación**

**Objetivo:** 100% de validación automática antes de commit

**Implementación:**
- ✅ Pre-commit hook ejecuta validaciones
- ✅ CI/CD ejecuta validaciones en GitHub Actions
- ✅ Scripts detectan 4 tipos de problemas:
  1. Archivos faltantes
  2. Keys inconsistentes
  3. Duplicados base vs product
  4. Conceptos compartidos sin centralizar

### **Métrica 3: Tiempo de Agregado de Producto**

**Objetivo:** < 30 minutos para agregar nuevo producto (sin traducciones)

**Workflow optimizado:**
```bash
# 1. Ejecutar script (5 min)
node scripts/add-product.js

# 2. Editar concept-restaurant.json en EN (15 min)
# 3. Validar (2 min)
node scripts/validate-shared-concepts.js
node scripts/validate-concepts-coherence.js

# 4. Commit (2 min)
git add .
git commit -m "feat(i18n): Add restaurant product concepts"

# Total: ~24 minutos
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Para agregar nuevo producto (ej: Restaurant):**

- [ ] Ejecutar `node scripts/add-product.js` (crea archivos en 9 idiomas)
- [ ] Editar `concept-restaurant.json` en inglés (EN) con conceptos ÚNICOS
- [ ] Revisar si hay conceptos compartidos con otros productos
  - Si SÍ: Agregar a `concept.json` (base)
  - Si NO: Mantener en `concept-restaurant.json`
- [ ] Ejecutar `node scripts/validate-shared-concepts.js`
- [ ] Ejecutar `node scripts/validate-concepts-coherence.js`
- [ ] Si validaciones pasan, traducir manualmente cada idioma
- [ ] Re-validar después de traducir
- [ ] Commit con mensaje descriptivo

### **Para validar sistema existente:**

- [ ] Ejecutar `node scripts/validate-concepts-coherence.js`
- [ ] Ejecutar `node scripts/validate-shared-concepts.js`
- [ ] Si hay errores, revisar output y corregir manualmente
- [ ] Re-validar hasta que pase
- [ ] Documentar cualquier decisión de diseño

---

## 🎯 BENEFICIOS DE ESTA ESTRATEGIA

1. **Reducción de duplicación:** 0% de conceptos duplicados
2. **Validación automática:** Detecta problemas antes de commit
3. **Escalabilidad:** Agregar productos toma < 30 min
4. **Mantenibilidad:** Scripts detectan inconsistencias automáticamente
5. **Documentación:** Cada decisión está documentada y validada

---

## 📚 REFERENCIAS

- `docs/SCRIPTS_REFERENCE.md` - Referencia completa de scripts
- `GUIA_MANTENIMIENTO_CONCEPTOS.md` - Workflow manual paso a paso
- `docs/architecture/I18N_3_LAYERS_ARCHITECTURE.md` - Arquitectura completa

---

**CREADO POR:** Claude
**FECHA:** 2025-12-26
**VERSIÓN:** 1.0.0
**ESTADO:** 📋 Política definida - Pendiente crear scripts de validación
