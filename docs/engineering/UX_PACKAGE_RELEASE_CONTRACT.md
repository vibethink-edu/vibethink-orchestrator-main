# ENG — UX Package Compatibility & Release Contract (Monorepo Standard)

**Versión:** 1.0.0  
**Estado:** 🔒 SEALED (Enforceable · Non-Canonical)  
**Fecha:** 2026-01-06  
**Fecha de Sellado:** 2026-01-06  
**Autoridad:** Monorepo Architect / Release Governance  
**Relación:** Complemento operativo al `UI i18n & UX Translation Contract`.

## 🔒 CONTEXTO SELLADO (NO TOCAR)

- Canon Core SELLADO  
- Runtime Layer Canon SELLADO  
- Arquitectura AI-First (Memory → Reasoning → UX) SELLADA  
- UI i18n & UX Translation Contract SELLADO (ENFORCEABLE)  
- XTP v4.6 declarado LEGACY / DEPRECATED  

---

## 📄 Executive Summary

Este contrato elimina el riesgo de "breaking updates" al actualizar paquetes de UX compartidos (ej. `bundui Premium`, design systems) permitiendo una integración continua sin regresiones. Establece reglas estrictas de **SemVer**, define qué constituye la **Public API** y dicta el flujo de **Release** para garantizar que los consumidores del monorepo (apps) operen sobre bases estables.

---

## 🏗️ 1. UX Package Compatibility Contract

### 🎯 Scope (Alcance)
Se considera **UX Package** a cualquier paquete interno (`packages/*`) o externo (`node_modules` adaptado) que exporte componentes React, tokens de estilo (Tailwind config), hooks de UI o assets visuales compartidos por más de un consumidor en el monorepo.

### 🔌 Public API Definition
La estabilidad se garantiza únicamente sobre la **Public API**, definida como:
- **Exports:** Todo lo exportado en el `index.ts/js` raíz del paquete o sus sub-entradas documentadas.
- **Props:** El nombre, tipo y obligatoriedad de las props de los componentes.
- **Variants/Slots:** Los nombres de variantes de estilo (ej. cva patterns) y slots de contenido.
- **Tailwind Tokens:** Nombres de colores, espaciados y fuentes en configuraciones extendidas compartidas.

### 🔢 Versioning (SemVer Real)
- **PATCH (0.0.x):** Fixes visuales, corrección de bugs lógicos sin cambio en firmas, optimización de performance. *Safe to auto-update.*
- **MINOR (0.x.0):** Nuevos componentes, nuevas props opcionales, nuevas variantes. *Backward compatible.*
- **MAJOR (x.0.0):** Eliminación de props, cambio de nombres de componentes, cambio de tipos de datos en props existentes, requerir nuevas dependencias.

### 🚫 Deprecation Policy
- **Ventana Mínima:** Cualquier elemento marcado como `@deprecated` debe permanecer funcional durante al menos **dos versiones MINOR completas o 60 días (lo que ocurra primero)** antes de ser eliminado en el siguiente MAJOR.
- **Reemplazo:** Un mensaje de deprecación **MUST** indicar el nuevo componente o prop que reemplaza al legado.

---

## 🔄 2. Release & Patch Flow (Monorepo)

### A. Cambios Normales (Standard)
1. **Sync check:** El cambio no debe violar el `UI i18n & UX Translation Contract`.
2. **Drafting:** Creación del changeset indicando impacto (Major/Minor/Patch).
3. **Audit:** Verificación de que los consumidores existentes no requieren refactor manual (si es Minor/Patch).

### B. Hotfix Flow
- Se permite el bypass de auditoría extendida solo para **regresiones críticas en producción** (ej. UI rota en Safari, crash en render).
- **Post-Audit:** Un hotfix requiere una revisión de gobernanza a las 24hs para asegurar que no se introdujo deuda técnica (XTP-style).

### C. Rollback Expectations
Todo UX Package debe ser capaz de revertirse a la versión previa de manera atómica sin dejar el monorepo en estado inconsistente (fuera de sync con los assets).

---

## ⚖️ 3. Enforcement Rules

| Regla | Severidad | Acción ante Incumplimiento |
| :--- | :---: | :--- |
| **Backward Compatibility en Minor/Patch** | **MUST** | **BLOCK RELEASE.** Prohibido taggear si rompe un consumidor. |
| **i18n Compliance (9 langs)** | **MUST** | **BLOCK RELEASE.** Ver contrato de i18n. |
| **Versioning SemVer Estricto** | **MUST** | **FAIL AUDIT.** Re-versionado obligatorio. |
| **Documentación de Breaking Changes** | **SHOULD** | **WARNING.** Requiere revisión manual del Architect. |
| **Experimental/Draft Flags** | **MAY** | **PERMITIDO.** Para features en desarrollo no estables. |

---

## 🧩 4. Perfiles de Aplicación

### Perfil A: bundui Premium / Design System
- **Estabilidad:** Máxima.
- **Regla:** Ningún cambio en `bundui-premium` puede romper los dashboards existentes. Los cambios de diseño significativos deben entrar como **nuevos componentes** (v2) conviviendo con v1 hasta el próximo ciclo de migración.

### Perfil B: shadcn-based Shared Packages
- **Contexto:** Componentes `shadcn` que han sido movidos a un paquete común para ser usados por varias apps.
- **Regla:** Se rigen por este contrato. Pierden la libertad de "copiar y pegar" para ganar consistencia monorepo.

### Perfil C: shadcn Copy-Paste (Out of Scope)
- **Contexto:** Componentes en `apps/[app]/components/ui/*`.
- **Regla:** **FUERA DE CONTRATO.** El desarrollador es dueño absoluto del código. Este nivel no ofrece seguridad de release cruzado.

---

## ✅ 5. Adoption Checklist

- [ ] ¿El paquete tiene definidos sus `exports` en el `package.json`?
- [ ] ¿Se ha identificado la Public API (props/types)?
- [ ] ¿Existe un historial de versiones (CHANGELOG) vinculado a SemVer?
- [ ] ¿Los componentes consumen las traducciones vía el contrato de i18n?
- [ ] ¿Se han eliminado todas las referencias a metodologías legacy (XTP)?

---

## 🛡️ 6. Non-Goals

- **NO** introducir scripts de validación automática (CI) en esta fase.
- **NO** forzar el rediseño de componentes funcionales actuales.
- **NO** implementar herramientas de control de paquetes (Nx/Turbo tags) adicionales a las existentes.
- **NO** duplicar las reglas de traducción ya definidas en el contrato de i18n.

---

## 🎙️ Cierre Operativo

Este contrato no busca burocratizar el desarrollo, sino **eliminar el miedo al update**. Al cumplir con las reglas de **Public API y SemVer**, garantizamos que el `vibethink-orchestrator` pueda evolucionar visualmente sin los traumas de regresión comunes en monorepos de escala media-alta. Si un componente cambia su firma de props sin subir de MAJOR, el release es **INVÁLIDO**.

---
**Firmado:**  
*Monorepo Governance Team*
