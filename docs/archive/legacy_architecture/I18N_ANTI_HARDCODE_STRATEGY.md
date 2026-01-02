# Estrategia Anti-Hardcode para i18n

**Objetivo:** Eliminar completamente texto hardcodeado en componentes React/Next.js

---

## 🚨 Regla Fundamental

**NUNCA escribir texto visible al usuario directamente en componentes. SIEMPRE usar `t()` del hook `useTranslation`.**

---

## ✅ Patrón Correcto (SIEMPRE seguir este)

### Componente Cliente (use client)

```typescript
'use client'

import { useTranslation } from '@/lib/i18n'

export function MyComponent() {
  const { t } = useTranslation('mi-modulo') // ← Namespace del módulo
  
  return (
    <div>
      <h1>{t('header.title')}</h1>  {/* ✅ CORRECTO */}
      <p>{t('description')}</p>     {/* ✅ CORRECTO */}
      <button>{t('actions.save')}</button>  {/* ✅ CORRECTO */}
    </div>
  )
}
```

### Componente Servidor (Server Component)

```typescript
// ❌ NO usar Server Component para texto visible
// ✅ Crear wrapper Client Component

// page.tsx (Server)
import MyPageClient from './page-client'

export default async function Page() {
  const data = await getData()
  return <MyPageClient data={data} />
}

// page-client.tsx (Client)
'use client'
import { useTranslation } from '@/lib/i18n'

export default function MyPageClient({ data }) {
  const { t } = useTranslation('mi-modulo')
  return <div>{t('header.title')}</div>
}
```

---

## ❌ Anti-Patrones (NUNCA hacer esto)

```typescript
// ❌ INCORRECTO - Texto hardcodeado
<h1>Welcome to Dashboard</h1>
<p>Manage your settings here</p>
<button>Save Changes</button>

// ❌ INCORRECTO - Template literals con texto
<h1>{`Welcome, ${user.name}`}</h1>

// ❌ INCORRECTO - Concatenación
<p>Showing {count} results</p>

// ❌ INCORRECTO - Condicionales con texto
{isLoading ? 'Loading...' : 'Ready'}
```

---

## ✅ Soluciones Correctas

### Template literals con traducciones

```typescript
// ❌ MAL
<h1>Welcome, {user.name}</h1>

// ✅ BIEN
<h1>{t('header.welcome', { name: user.name })}</h1>

// JSON: { "header": { "welcome": "Welcome, {{name}}" } }
```

### Condicionales

```typescript
// ❌ MAL
{isLoading ? 'Loading...' : 'Ready'}

// ✅ BIEN
{t(isLoading ? 'states.loading' : 'states.ready')}

// O mejor:
{isLoading && <span>{t('states.loading')}</span>}
{!isLoading && <span>{t('states.ready')}</span>}
```

### Pluralización

```typescript
// ❌ MAL
<p>Showing {count} results</p>

// ✅ BIEN
<p>{t('results.count', { count })}</p>

// JSON: { "results": { "count": "Showing {{count}} results" } }
```

---

## 📋 Checklist Pre-Commit

Antes de hacer commit, verificar:

- [ ] ¿Hay strings entre comillas `"..."` o `'...'` en JSX?
  - Si SÍ → Convertir a `t('key')`
- [ ] ¿Hay texto entre tags JSX `>{texto}<`?
  - Si SÍ → Convertir a `>{t('key')}<`
- [ ] ¿Hay `placeholder="..."`, `title="..."`, `aria-label="..."`?
  - Si SÍ → Convertir a `placeholder={t('key')}`
- [ ] ¿Hay template literals con texto visible?
  - Si SÍ → Mover texto a traducción, usar params
- [ ] ¿Hay condicionales con strings?
  - Si SÍ → Convertir keys a traducciones

---

## 🔍 Scripts de Detección

### 1. Auditoría Manual (antes de commit)

```bash
node scripts/audit-hardcoded-text.js
```

Busca automáticamente:
- Strings entre comillas
- Texto en JSX
- Atributos con texto
- Template literals

### 2. Validación de Keys

```bash
node scripts/validate-i18n-keys.js
```

Verifica que todas las keys usadas existan en todos los idiomas.

### 3. Detección por Componente

```bash
node scripts/detect-hardcoded-strings-by-component.js [ruta]
```

---

## 📐 Estructura de Traducciones

### Organización por Namespace

```
apps/dashboard/src/lib/i18n/translations/
├── en/
│   ├── common.json          # Elementos comunes (botones, labels)
│   ├── navigation.json      # Menú de navegación
│   ├── mi-modulo.json       # Módulo específico
│   └── ...
├── es/
│   └── ... (mismo estructura)
└── ... (otros idiomas)
```

### Estructura dentro de JSON

```json
{
  "header": {
    "title": "Page Title",
    "subtitle": "Page subtitle"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "messages": {
    "success": "Operation successful",
    "error": "An error occurred"
  }
}
```

---

## 🎯 Flujo de Trabajo

### Cuando creas un componente nuevo:

1. **Identifica el namespace:**
   - ¿Es parte de un módulo existente? → Usa ese namespace
   - ¿Es nuevo módulo? → Crea namespace nuevo

2. **Crea las traducciones:**
   - Agrega keys en `en/[namespace].json`
   - Agrega traducciones en otros idiomas

3. **Usa `useTranslation`:**
   - Importa el hook
   - Usa `t('key')` para todo texto visible

4. **Verifica:**
   - Ejecuta `validate-i18n-keys.js`
   - Verifica que no haya hardcode en el componente

### Cuando modificas un componente existente:

1. **Identifica texto hardcodeado:**
   - Busca strings entre comillas
   - Busca texto en JSX

2. **Agrega traducciones:**
   - Agrega keys necesarias en JSON
   - Traduce a todos los idiomas (7: en, es, fr, pt, de, ar, zh)

3. **Reemplaza texto:**
   - Reemplaza con `t('key')`

4. **Valida:**
   - Ejecuta scripts de validación

---

## 🛡️ Protección Automática

### ESLint Rule (opcional)

```json
// .eslintrc.js
{
  "rules": {
    "no-hardcoded-text": ["error", {
      "exceptions": ["className", "id", "data-*"]
    }]
  }
}
```

### Pre-commit Hook

```bash
# .husky/pre-commit
npm run audit-hardcoded
npm run validate-i18n-keys
```

---

## 📚 Ejemplos Completos

### Ejemplo 1: Header Simple

```typescript
// ❌ ANTES (hardcodeado)
export function Header() {
  return (
    <header>
      <h1>Dashboard</h1>
      <p>Manage your workspace</p>
      <button>Settings</button>
    </header>
  )
}

// ✅ DESPUÉS (i18n)
'use client'
import { useTranslation } from '@/lib/i18n'

export function Header() {
  const { t } = useTranslation('common')
  
  return (
    <header>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.description')}</p>
      <button>{t('actions.settings')}</button>
    </header>
  )
}
```

### Ejemplo 2: Formulario

```typescript
// ❌ ANTES
<form>
  <label>Email Address</label>
  <input placeholder="Enter your email" />
  <button type="submit">Submit</button>
</form>

// ✅ DESPUÉS
'use client'
import { useTranslation } from '@/lib/i18n'

export function Form() {
  const { t } = useTranslation('common')
  
  return (
    <form>
      <label>{t('form.email.label')}</label>
      <input placeholder={t('form.email.placeholder')} />
      <button type="submit">{t('form.submit')}</button>
    </form>
  )
}
```

---

## ⚠️ Excepciones (Cuándo SÍ está permitido hardcode)

Solo estos casos:

1. **Nombres técnicos:**
   ```typescript
   <div className="container">  {/* ✅ OK - CSS class */}
   <button id="submit-btn">     {/* ✅ OK - ID técnico */}
   ```

2. **Variables de entorno:**
   ```typescript
   const API_URL = process.env.NEXT_PUBLIC_API_URL  {/* ✅ OK */}
   ```

3. **Constantes lógicas:**
   ```typescript
   const STATUS_ACTIVE = 'active'  {/* ✅ OK - No es texto visible */}
   ```

4. **Comentarios:**
   ```typescript
   // This component handles user authentication  {/* ✅ OK */}
   ```

---

## 🎓 Resumen

1. **NUNCA** texto hardcodeado visible al usuario
2. **SIEMPRE** usar `useTranslation` y `t('key')`
3. **SIEMPRE** agregar traducciones en los 9 idiomas (en, es, fr, pt, de, it, ko, ar, zh)
4. **SIEMPRE** ejecutar scripts de validación antes de commit
5. **SIEMPRE** seguir la estructura de namespaces

---

## 📞 ¿Dudas?

Consulta:
- `docs/architecture/I18N_BEST_PRACTICES_AGENTS.md` - Buenas prácticas detalladas
- `docs/architecture/I18N_TEMPLATE_GUIDE.md` - Templates de uso
- `scripts/audit-hardcoded-text.js` - Script de detección

