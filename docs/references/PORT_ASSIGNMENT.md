# Asignación de Puertos - VibeThink Orchestrator 1.0

> **Última actualización:** 2024-12-17  
> **Propósito:** Definir puertos fijos para desarrollo local y referencias de productos  
> **Hereda de:** `_vibethink-dev-kit/knowledge/PORT_ASSIGNMENT_GLOBAL.md`

> **⚠️ IMPORTANTE:** Este documento extiende el estándar global.  
> Para la asignación completa de puertos, consulta primero el documento global.

---

## 📋 Estrategia de Asignación

### Rango 3000-3004: **Aplicaciones Principales**
Puertos reservados para las apps del proyecto VibeThink Orchestrator.

### Rango 3005-3009: **Referencias y Demos Externas**
Puertos fijos para proyectos de referencia y demos de productos externos.

### Rango 3010+: **Testing y Desarrollo Temporal**
Puertos para pruebas temporales y experimentación.

---

## 🎯 Puertos Fijos Asignados

### Aplicaciones Principales (3000-3004)

| Puerto | Aplicación | Script | Estado |
|--------|------------|--------|--------|
| **3000** | Dashboard (dev) | `npm run dev:dashboard` | ✅ Activo |
| **3001** | Dashboard (alternativo) | `npm run dev` | ⚠️ Conflicto con package.json |
| **3005** | Dashboard (producción) | `.\scripts\start-dashboard.ps1` | ✅ Definido |
| **3002** | Admin Panel | `npm run dev:admin` | 📋 Reservado |
| **3003** | Login App | `npm run dev:login` | 📋 Reservado |
| **3004** | Helpdesk App | `npm run dev:helpdesk` | 📋 Reservado |

> **⚠️ Nota:** Hay inconsistencia entre `package.json` (3001) y `start-dashboard.ps1` (3005).  
> **Recomendación:** Unificar en **3005** para producción y **3000** para desarrollo.

---

### Referencias y Demos Externas (3050-3099)

> **📌 ESTÁNDAR GLOBAL:** Estos puertos están definidos en `PORT_ASSIGNMENT_GLOBAL.md`  
> **Migración pendiente:** Los scripts actuales usan puertos antiguos (3006-3008).  
> **Nuevos puertos:** 3050-3052 (ver tabla abajo)

| Puerto | Producto | Tipo | Script | Ubicación | Estado |
|--------|----------|------|--------|-----------|--------|
| **3050** | **Bundui Premium** | Dashboard Kit | `.\scripts\start-bundui-reference.ps1` | `C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard` | ⚠️ Migrar |
| **3051** | **Shadcn UI Oficial** | Component Library | `.\scripts\start-shadcn-reference.ps1` | `C:\IA Marcelo Labs\shadcn-ui\ui\apps\v4` | ⚠️ Migrar |
| **3052** | **React Flow** | Node-based UI | `.\scripts\start-reactflow-reference.ps1` | `C:\IA Marcelo Labs\xyflow\xyflow\examples\react` | ⚠️ Migrar |
| **3053-3099** | **Disponibles** | Futuras referencias | - | - | ✅ Libre |

> **🔒 Puertos Fijos Globales:** Estos puertos están **bloqueados globalmente** para estos productos.  
> **No cambiar** sin actualizar `PORT_ASSIGNMENT_GLOBAL.md` y todos los scripts afectados.

#### Puertos Antiguos (Deprecados)
| Puerto Antiguo | Puerto Nuevo | Producto |
|----------------|--------------|----------|
| 3006 | **3050** | Bundui Premium |
| 3007 | **3051** | Shadcn UI Oficial |
| 3008 | **3052** | React Flow |

---

## 🔄 Estado Actual de Servidores

### Servidores Activos (Verificar con `npm run port-check`)

```powershell
# Verificar puertos en uso
Get-NetTCPConnection -State Listen | Where-Object LocalPort -In 3000..3009 | Select-Object LocalPort, State, OwningProcess | Format-Table
```

### Scripts de Gestión

| Acción | Comando |
|--------|---------|
| **Ver estado** | `npm run port-check` |
| **Verificar todos** | `npm run dev:status` |
| **Limpiar emergencia** | `npm run kill-ports` |

---

## 📝 Convenciones de Nomenclatura

### Scripts de Inicio
- **Formato:** `start-{nombre}-reference.ps1`
- **Ubicación:** `scripts/`
- **Puerto:** Definido como variable `$PORT` al inicio del script

### Scripts de Detención
- **Formato:** `stop-{nombre}-reference.ps1`
- **Ubicación:** `scripts/`
- **Función:** Detener proceso en puerto específico

---

## 🚀 Uso Recomendado

### Para Desarrollo Principal
```powershell
# Dashboard principal (puerto 3005)
.\scripts\start-dashboard.ps1
```

### Para Referencias Visuales
```powershell
# Iniciar todas las referencias
.\scripts\start-bundui-reference.ps1      # Puerto 3006
.\scripts\start-shadcn-reference.ps1       # Puerto 3007
.\scripts\start-reactflow-reference.ps1     # Puerto 3008
```

### Para Testing Temporal
```powershell
# Usar puertos 3010+ para pruebas
npm run dev -- -p 3010
```

---

## ⚠️ Conflictos Conocidos

### 1. Dashboard - Puerto Duplicado
- **Problema:** `package.json` usa 3001, `start-dashboard.ps1` usa 3005
- **Solución:** Unificar en 3005 (producción) y 3000 (dev)

### 2. Puertos Manuales
- **Problema:** Usuario inició Bundui en 3002 y Shadcn en 3003
- **Solución:** Usar scripts oficiales que asignan puertos fijos

---

## 📋 Checklist de Actualización

Cuando agregues una nueva referencia:

- [ ] Asignar puerto en rango 3005-3009
- [ ] Crear script `start-{nombre}-reference.ps1`
- [ ] Crear script `stop-{nombre}-reference.ps1`
- [ ] Actualizar `AGENTS.md` con nuevo puerto
- [ ] Actualizar este documento
- [ ] Verificar que no hay conflictos

---

## 🔗 Referencias Relacionadas

### Global (Dev-Kit)
- `_vibethink-dev-kit/knowledge/PORT_ASSIGNMENT_GLOBAL.md` - **Estándar global de puertos**
- `_vibethink-dev-kit/knowledge/engineering-standards/PORT_MANAGEMENT_STANDARD.md` - Estándar técnico

### Proyecto Específico
- `AGENTS.md` - Reglas de operación del proyecto
- `scripts/*.ps1` - Scripts de gestión
- `package.json` - Scripts npm (revisar inconsistencias)

---

**Mantenedor:** VibeThink Team  
**Versión:** 1.0  
**Última revisión:** 2024-12-17

