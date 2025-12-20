# 🎯 Nombre del Proyecto: ViTo

**Última actualización:** 2025-01-16  
**Estado:** ✅ Documentado  
**Aplicable a:** Todo el proyecto VibeThink Orchestrator

---

## 📋 Resumen

**ViTo** es el nombre de desarrollo (codename) para **VibeThink Orchestrator**.

- **Nombre completo:** VibeThink Orchestrator
- **Sigla/Codename:** ViTo
- **Uso:** Desarrollo interno, referencias en código, scripts, documentación técnica

---

## 🔤 Etimología

**ViTo** es la sigla de **V**ibe**T**hink **O**rchestrator:

- **V** = VibeThink
- **T** = Think
- **O** = Orchestrator

---

## ⚖️ Justificación Legal y Práctica

### ✅ Por qué ViTo NO es robo de marca

**ViTo - VibeThink Orchestrator** es un acrónimo interno legítimo y defendible. No es un robo de marca; es un acrónimo interno ligado inequívocamente a VibeThink.

#### 1️⃣ Es un acrónimo, no una marca desnuda

- **ViTo** = **Vi**be**T**hink **O**rchestrator
- El significado **no existe fuera de VibeThink**
- No se usa "ViTo" como signo comercial autónomo

**Patrones similares en la industria:**
- **K8s** → Kubernetes
- **SRE** → Site Reliability Engineering
- **Einstein** (Salesforce) → nombre interno, no marca independiente

#### 2️⃣ Está claramente anclado a VibeThink

El nombre completo siempre deja rastro de origen:

> **ViTo - VibeThink Orchestrator**

Esto elimina:
- Confusión de origen
- Aprovechamiento de reputación ajena
- Intención de engaño

#### 3️⃣ Uso interno / no comercial

**Punto definitivo:**
- No se vende
- No se publicita
- No se registra como producto independiente
- No compite en marketplace

➡️ **El uso interno no constituye infracción**, incluso si existiera una marca similar en otro sector.

#### 4️⃣ No hay "riesgo de confusión"

Para que haya problema real, tendrían que darse **todas** estas cosas:
- Mismo nombre
- Mismo mercado
- Mismo tipo de producto
- Público confundible

Aquí no pasa ninguna:
- Es interno
- Es acrónimo
- Es dependiente de VibeThink
- No se presenta como marca pública

---

## ✅ Buenas Prácticas (Reglas de Uso)

### 1. Siempre el nombre largo en documentos formales

En README, diagramas, onboarding, documentación oficial:

```markdown
**ViTo (VibeThink Orchestrator)** - [descripción]
```

**Ejemplo:**
> **ViTo - VibeThink Orchestrator** es la plataforma de orquestación empresarial de VibeThink.

### 2. "ViTo" solo como apodo interno

**Usar "ViTo" en:**
- ✅ Slack / comunicación interna
- ✅ Reuniones internas
- ✅ Commits de Git
- ✅ Conversaciones técnicas
- ✅ Código y variables

**NUNCA usar "ViTo" como:**
- ❌ Logo independiente
- ❌ Dominio público
- ❌ Producto standalone
- ❌ Marca comercial registrada
- ❌ Marketing externo

### 3. Evita mayúsculas completas

**Usar:**
- ✅ **ViTo** (correcto)
- ❌ **VITO** (evitar - puede confundirse con siglas institucionales)

### 4. Mantén claro el ownership

**Línea fija en documentación:**

> "ViTo is the internal AI orchestration layer of VibeThink."

**En código:**
```typescript
// ViTo = VibeThink Orchestrator (sigla)
// Internal codename for VibeThink Orchestrator
```

---

## 🎯 Veredicto Final

✅ **No es robo**  
✅ **No es copia**  
✅ **No es aprovechamiento indebido**  
✅ **Es un acrónimo interno legítimo**  
✅ **Está bien diseñado**  
✅ **Encaja perfecto con la visión de VibeThink**

**Conclusión:** Puedes avanzar tranquilo. El uso de ViTo como acrónimo interno está completamente justificado y es una práctica común en la industria.

---

## 📍 Dónde se Usa ViTo

### ✅ Uso Interno (Desarrollo)

ViTo se usa en:

1. **Variables de código:**
   ```typescript
   // apps/dashboard/lib/branding.ts
   name: process.env.NEXT_PUBLIC_PRODUCT_NAME || 'ViTo'
   ```

2. **Scripts de desarrollo:**
   ```powershell
   # scripts/start-dashboard.ps1
   Write-Host "🚀 Starting ViTo Dashboard (VibeThink Orchestrator)..."
   ```

3. **Documentación técnica:**
   - Comentarios en código
   - Documentación de desarrollo
   - Guías internas

4. **Rutas de desarrollo:**
   - `app/pana/` (mantener estructura, actualizar contenido)
   - URLs internas de desarrollo

### ❌ NO se Usa en

- **Producción:** El nombre de producción será diferente (TBD)
- **Marketing:** Materiales públicos usan "VibeThink Orchestrator"
- **Comunicación externa:** Se usa el nombre completo

---

## 🔄 Migración de "Pana" a "ViTo"

### Cambios Realizados

1. **Variables de branding:**
   - `apps/dashboard/src/lib/branding.ts` → `'Pana'` → `'ViTo'`
   - `apps/dashboard/lib/branding.ts` → `'Pana'` → `'ViTo'`

2. **Scripts:**
   - `scripts/start-dashboard.ps1` → "Pana Dashboard" → "ViTo Dashboard (VibeThink Orchestrator)"
   - `scripts/stop-dashboard.ps1` → "Pana Dashboard" → "ViTo Dashboard (VibeThink Orchestrator)"

3. **Layouts:**
   - `app/pana/layout.tsx` → Título actualizado a "ViTo - VibeThink Orchestrator"

4. **Documentación:**
   - `BRANDING.md` → Todas las referencias actualizadas
   - `scripts/README.md` → Referencias actualizadas

### Estructura de Rutas

**Nota:** La estructura de rutas `app/pana/` se mantiene por compatibilidad, pero el contenido y branding ahora usan "ViTo".

---

## 📝 Convenciones de Nomenclatura

### En Código

```typescript
// ✅ CORRECTO
const productName = 'ViTo' // Sigla
const fullName = 'VibeThink Orchestrator' // Nombre completo

// ✅ CORRECTO - Con comentario explicativo
// ViTo = VibeThink Orchestrator (sigla)
name: process.env.NEXT_PUBLIC_PRODUCT_NAME || 'ViTo'
```

### En Documentación

```markdown
<!-- ✅ CORRECTO -->
**ViTo** (VibeThink Orchestrator) es el nombre de desarrollo...

<!-- ✅ CORRECTO - Primera mención -->
**ViTo - VibeThink Orchestrator** es una plataforma...

<!-- ✅ CORRECTO - Referencias posteriores -->
ViTo es una plataforma...
```

### En Scripts

```powershell
# ✅ CORRECTO
Write-Host "🚀 Starting ViTo Dashboard (VibeThink Orchestrator)..." -ForegroundColor Cyan
```

---

## 🎯 Configuración

### Variables de Entorno

```bash
# .env.local (desarrollo)
NEXT_PUBLIC_PRODUCT_NAME=ViTo
NEXT_PUBLIC_PRODUCT_TAGLINE=El amigo que orquesta tu empresa
NEXT_PUBLIC_COMPANY_NAME=VibeThink
```

### Branding Module

```typescript
import { getBranding } from '@/lib/branding'

const branding = getBranding()
// branding.name → "ViTo"
// branding.company → "VibeThink"
```

---

## 📚 Referencias

### Documentación Relacionada

- **[BRANDING.md](../apps/dashboard/BRANDING.md)** - Configuración de branding
- **[AGENTS.md](../AGENTS.md)** - Reglas del proyecto
- **[APPLICATION_TERMINOLOGY.md](./architecture/APPLICATION_TERMINOLOGY.md)** - Terminología del proyecto

### Archivos Clave

- `apps/dashboard/lib/branding.ts` - Configuración centralizada
- `apps/dashboard/src/lib/branding.ts` - Configuración centralizada (alternativa)
- `scripts/start-dashboard.ps1` - Script de inicio
- `scripts/stop-dashboard.ps1` - Script de detención

---

## ✅ Checklist de Uso

Antes de usar "ViTo" o "VibeThink Orchestrator", verifica:

- [ ] **¿Es código interno/desarrollo?** → Usa "ViTo"
- [ ] **¿Es documentación técnica?** → Usa "ViTo - VibeThink Orchestrator" (primera mención), luego "ViTo"
- [ ] **¿Es producción/marketing?** → Usa "VibeThink Orchestrator" (nombre completo)
- [ ] **¿Es comunicación externa?** → Usa "VibeThink Orchestrator" (nombre completo)
- [ ] **¿Está en variables de código?** → Usa `'ViTo'` o variable de entorno

---

## 🔍 Búsqueda y Reemplazo

Para encontrar todas las referencias:

```bash
# Buscar "Pana" (legacy)
grep -r "Pana" apps/ scripts/ docs/

# Buscar "ViTo"
grep -r "ViTo" apps/ scripts/ docs/

# Buscar "VibeThink Orchestrator"
grep -r "VibeThink Orchestrator" apps/ scripts/ docs/
```

---

## 📊 Historial de Cambios

### 2025-01-16: Migración de "Pana" a "ViTo"

- ✅ Variables de branding actualizadas
- ✅ Scripts actualizados
- ✅ Documentación actualizada
- ✅ Layouts actualizados
- ✅ Documentación sobre ViTo creada

**Razón:** Estandarización del nombre de desarrollo para reflejar mejor la identidad del proyecto.

---

**Última revisión:** 2025-01-16  
**Mantenido por:** VibeThink Engineering Team  
**Versión:** 1.0.0

