# AI Agent Safety Protocol

## 🎯 OBJETIVO
Prevenir cambios destructivos por agentes AI (Claude, Gemini, etc.) mediante checkpoints y validaciones.

---

## 🚨 REGLAS CRÍTICAS

### 1. **NO ELIMINAR >50 LÍNEAS SIN APROBACIÓN**
- ❌ Prohibido eliminar código funcional sin confirmación explícita
- ✅ Crear stubs, wrappers o comentar código en su lugar
- ✅ Proponer plan de eliminación y esperar aprobación

### 2. **NO USAR @ts-ignore SIN INVESTIGAR**
- ❌ Prohibido suprimir errores sin entender la causa raíz
- ✅ Investigar en TODO el monorepo antes de concluir "no existe"
- ✅ Usar @ts-expect-error con descripción detallada si es temporal

### 3. **VALIDACIÓN INCREMENTAL OBLIGATORIA**
Después de cada cambio:
```bash
# 1. Type check
pnpm run type-check

# 2. Build check (si aplica)
pnpm run build

# 3. Test check
pnpm test
```

### 4. **COMUNICACIÓN PROACTIVA**
Antes de aplicar cambios que:
- Eliminan >50 líneas
- Modifican APIs públicas
- Cambian configuración de build
- Afectan múltiples archivos

**DEBE:**
1. Proponer el cambio
2. Explicar el razonamiento
3. Esperar aprobación explícita

---

## 📋 CHECKLIST DE AUDITORÍA

Antes de reportar "componente no existe":

- [ ] Busqué en `packages/*/src`
- [ ] Verifiqué exports en `packages/*/src/index.ts`
- [ ] Revisé `node_modules` de packages relacionados
- [ ] Busqué en git history (`git log --all -- *ComponentName*`)
- [ ] Pregunté al usuario si no estoy 100% seguro

Antes de eliminar código:

- [ ] Confirmé que el código NO funciona actualmente
- [ ] Intenté soluciones menos destructivas (stub, wrapper, comentar)
- [ ] Documenté la razón en TECH_DEBT.md
- [ ] Obtuve aprobación explícita del usuario

Antes de usar @ts-ignore:

- [ ] Investigué la causa raíz del error
- [ ] Verifiqué que no hay solución directa
- [ ] Usé @ts-expect-error en lugar de @ts-ignore
- [ ] Agregué descripción detallada (>10 caracteres)
- [ ] Documenté en TECH_DEBT.md si es deuda técnica

---

## 🎯 WORKFLOW RECOMENDADO

### Fase 1: AUDITORÍA (Solo lectura)
```
1. Analizar el problema
2. Investigar exhaustivamente
3. Proponer soluciones (mínimo 2 opciones)
4. Documentar hallazgos
```

### Fase 2: APROBACIÓN (Esperar confirmación)
```
1. Presentar plan al usuario
2. Explicar pros/contras de cada opción
3. Recomendar la mejor opción
4. ESPERAR aprobación explícita
```

### Fase 3: IMPLEMENTACIÓN (Incremental)
```
1. Aplicar cambio más pequeño posible
2. Validar (type-check, build, test)
3. Reportar resultado
4. Repetir para siguiente cambio
```

### Fase 4: VALIDACIÓN (Verificar impacto)
```
1. Full build check
2. Full test suite
3. Documentar cambios en commit message
4. Reportar resumen final
```

---

## 🚫 ANTI-PATTERNS (Prohibidos)

### ❌ "Quick Fix" Syndrome
```typescript
// MAL: Suprimir sin investigar
// @ts-ignore
import Card from "@/shared/components/generic/Card"
```

```typescript
// BIEN: Investigar y documentar
// TODO: Migrate to @vibethink/ui Card component
// See TECH_DEBT.md #DASHBOARD-003
import Card from "@/shared/components/Card"
```

### ❌ "Burn the House" Approach
```typescript
// MAL: Eliminar 659 líneas porque hay errores
export default function DashboardPage() {
  return <div>Under Maintenance</div>;
}
```

```typescript
// BIEN: Crear wrapper temporal
import Card from "@/shared/components/Card" // Wrapper
// Original code preserved, just using compatibility layer
```

### ❌ "Assume and Execute"
```bash
# MAL: Asumir que no existe sin verificar
find apps/dashboard -name "Card.tsx"  # No encontrado
# Conclusión: "No existe" ❌

# BIEN: Búsqueda exhaustiva
find . -name "*Card*"  # Buscar en TODO
grep -r "export.*Card" packages/ui/src/  # Verificar exports
```

---

## 📊 MÉTRICAS DE ÉXITO

Un agente AI está trabajando correctamente si:

- ✅ 0 eliminaciones >50 líneas sin aprobación
- ✅ 0 @ts-ignore sin descripción
- ✅ 100% de cambios validados incrementalmente
- ✅ 0 builds rotos en main
- ✅ Comunicación proactiva en decisiones críticas

---

## 🎓 CASOS DE ESTUDIO

### Caso 1: "Claude Dashboard Disaster" (2026-01-10)

**Problema:**
- Claude eliminó 659 líneas de dashboard funcional
- Asumió que componentes no existían
- No investigó en packages/ui

**Lección:**
- SIEMPRE buscar en TODO el monorepo
- NUNCA eliminar código sin confirmar que crashea
- Crear wrappers > Eliminar código

**Prevención:**
- Pre-commit hook detecta eliminaciones >50 líneas
- ESLint rule previene @ts-ignore sin descripción
- CI valida imports antes de merge

---

**Versión:** 1.0  
**Fecha:** 2026-01-10  
**Autor:** Gemini (Post-Mortem Analysis)  
**Status:** 🟢 ACTIVO
