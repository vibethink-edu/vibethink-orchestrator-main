# ⚠️ IMPORTANTE: Regla sobre Referencias

**LEER ANTES DE MODIFICAR CUALQUIER ARCHIVO**

## 🚨 REGLA CRÍTICA GENERAL

**TODO LO QUE SEA REFERENCIA NUNCA DEBE SER MODIFICADO**

## 📋 Identificación de Referencias

Una referencia es:
- Directorio fuera del monorepo `vibethink-orchestrator-main/`
- Elemento con `-reference` en su nombre
- Documentado como "reference" en scripts/docs

## ✅ Dónde SÍ hacer cambios

**Solo dentro del monorepo:**
- `apps/dashboard/app/dashboard-bundui/` - Espejo modificable
- `apps/dashboard/src/shared/components/bundui-premium/` - Componentes adaptados
- Cualquier archivo en `vibethink-orchestrator-main/`

## ❌ Dónde NO hacer cambios

**⚠️ REGLA UNIVERSAL: TODO LO QUE SEA REFERENCE (dentro o fuera del monorepo) NO SE MODIFICA**

**Referencias externas (fuera del monorepo):**
- `C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard/` - Bundui Original
- `C:\IA Marcelo Labs\shadcn-ui\ui\apps\v4/` - Shadcn UI Reference
- `C:\IA Marcelo Labs\xyflow\xyflow\examples\react/` - ReactFlow Reference
- Cualquier directorio fuera del monorepo marcado como referencia

**Referencias dentro del monorepo (TAMBIÉN NO MODIFICAR):**
- `apps/bundui-reference/` - Bundui Reference
- `apps/*-reference/` - Cualquier app con `-reference` en nombre
- Cualquier directorio con `-reference` en nombre o propósito

**⚠️ CRÍTICO**: El hecho de estar dentro del monorepo NO significa que puede modificarse si es REFERENCE.

## 📖 Documentación Completa

- `docs/architecture/REFERENCE_RULES.md` - Reglas generales
- `docs/architecture/BUNDUI_REFERENCE_RULE.md` - Específico de Bundui

