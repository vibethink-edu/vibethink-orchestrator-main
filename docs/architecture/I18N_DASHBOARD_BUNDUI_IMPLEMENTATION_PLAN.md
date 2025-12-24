# Plan de Implementación i18n para dashboard-bundui

**Fecha:** 2025-12-24  
**Referencia:** `projects-v2` (completamente configurado para 7 idiomas)  
**Objetivo:** Aplicar el mismo patrón de i18n a todos los módulos de `dashboard-bundui`

---

## 📋 Estado Actual

### ✅ Módulos con i18n Completo (7 idiomas)
- **`projects-v2`** ⭐ - **REFERENCIA COMPLETA**
  - Namespace: `projects`
  - 7 idiomas: en, es, fr, pt, de, ar, zh
  - Secciones: header, tabs, actions, timeline, sidepanel, v2.*, summary
  - LanguageSwitcher implementado
  - Preload configurado

### ✅ Módulos con i18n Parcial
- **`default`** - Usa `useTranslation('default')` - ✅ Tiene traducciones
- **`analytics`** - Usa `useTranslation('analytics')` - ✅ Tiene traducciones
- **`ecommerce`** - Usa `useTranslation('ecommerce')` - ✅ Tiene traducciones
- **`hotel`** - Usa `useTranslation('hotel')` - ✅ Tiene traducciones
- **`calendar`** - Usa `useTranslation('calendar')` - ✅ Tiene traducciones
- **`mail`** - Usa `useTranslation('mail')` - ✅ Tiene traducciones
- **`chat`** - Usa `useTranslation('chat')` - ✅ Tiene traducciones
- **`ai-chat`** - Usa `useTranslation('ai-chat')` - ✅ Tiene traducciones
- **`tasks`** - Usa `useTranslation('tasks')` - ✅ Tiene traducciones
- **`crm`** - Usa `useTranslation('crm')` - ✅ Tiene traducciones
- **`sales`** - Usa `useTranslation('sales')` - ✅ Tiene traducciones
- **`finance`** - Usa `useTranslation('finance')` - ✅ Tiene traducciones
- **`crypto`** - Usa `useTranslation('crypto')` - ✅ Tiene traducciones
- **`file-manager`** - Usa `useTranslation('file-manager')` - ✅ Tiene traducciones

### ⚠️ Módulos que Necesitan Verificación/Completar
- **`academy`** - Verificar si usa i18n
- **`crm-v2`** - Verificar si usa i18n
- **`crm-v2-ai`** - Verificar si usa i18n
- **`crypto-v2`** - Verificar si usa i18n
- **`finance-v2`** - Verificar si usa i18n
- **`notes`** - Verificar si usa i18n
- **`pos-system`** - Verificar si usa i18n
- **`payment`** - Verificar si usa i18n
- **`project-list`** - Verificar si usa i18n
- **`project-management`** - Verificar si usa i18n
- **`projects`** (v1) - Verificar si usa i18n
- **`social-media`** - Verificar si usa i18n
- **`todo-list-app`** - Verificar si usa i18n
- **`widgets`** - Verificar si usa i18n
- **`api-keys`** - Verificar si usa i18n
- **`ai-image-generator`** - Verificar si usa i18n
- **`ai-chat-v2`** - Verificar si usa i18n
- **`hospital-management`** - Verificar si usa i18n
- **`kanban`** - Verificar si usa i18n

---

## 🎯 Patrón de Referencia: `projects-v2`

### Estructura de Traducciones (7 idiomas)

```json
{
  "header": {
    "title": "...",
    "searchPlaceholder": "..."
  },
  "tabs": {
    "overview": "...",
    "reports": "...",
    "activities": "..."
  },
  "actions": {
    "consult_ai": "...",
    "open_panel": "...",
    "close_panel": "..."
  },
  "summary": {
    "fromLastMonth": "..."
  },
  "v2": {
    "summaryCards": { ... },
    "overview": { ... },
    "efficiency": { ... },
    "achievement": { ... },
    "reminders": { ... },
    "successMetrics": { ... },
    "reports": { ... },
    "table": { ... }
  },
  "timeline": {
    "events": { ... }
  },
  "sidepanel": {
    "agent_title": "...",
    "history_title": "...",
    "verified": "...",
    "close": "...",
    "context": "...",
    "input_placeholder": "...",
    "tabs": { ... }
  }
}
```

### Componentes con i18n

1. **page.tsx** - `useTranslation('projects')`
2. **LanguageSwitcher.tsx** - Selector de 7 idiomas
3. **Todos los componentes** - Usan `t()` para todas las strings

### Configuración

1. **Preload en layout.tsx**: `'projects'` en `preloadNamespaces`
2. **Namespace en types.ts**: `'projects'` en `TranslationNamespace`
3. **Archivos de traducciones**: 7 archivos (en, es, fr, pt, de, ar, zh)

---

## 📝 Plan de Implementación

### Fase 1: Verificación y Auditoría

**Objetivo:** Identificar qué módulos necesitan i18n completo

**Tareas:**
1. [ ] Verificar qué módulos ya tienen `useTranslation()` pero les faltan traducciones
2. [ ] Identificar módulos sin i18n (texto hardcodeado)
3. [ ] Verificar qué namespaces ya existen en traducciones
4. [ ] Crear lista priorizada de módulos a implementar

### Fase 2: Implementación por Módulo

**Patrón a seguir (basado en projects-v2):**

1. **Crear/Actualizar traducciones para 7 idiomas:**
   - `apps/dashboard/src/lib/i18n/translations/{locale}/{namespace}.json`
   - Idiomas: en, es, fr, pt, de, ar, zh

2. **Actualizar componentes:**
   - Reemplazar texto hardcodeado con `t()`
   - Agregar `useTranslation('namespace')` en cada componente
   - Estructurar keys siguiendo el patrón de projects-v2

3. **Agregar LanguageSwitcher (si no existe):**
   - Usar el mismo componente de `projects-v2/components/LanguageSwitcher.tsx`
   - O crear uno compartido si es necesario

4. **Configurar preload:**
   - Agregar namespace a `preloadNamespaces` en `layout.tsx`
   - Agregar namespace a `TranslationNamespace` en `types.ts`

### Fase 3: Validación

**Para cada módulo implementado:**
1. [ ] Verificar que todas las keys existen en los 7 idiomas
2. [ ] Probar cambio de idioma con LanguageSwitcher
3. [ ] Verificar que no hay texto hardcodeado
4. [ ] Validar que preload funciona (sin blink)

---

## 🔄 Orden de Prioridad Sugerido

### Prioridad Alta (Módulos Principales)
1. ✅ **`projects-v2`** - COMPLETO (referencia)
2. ⚠️ **`crm`** - Verificar y completar si falta
3. ⚠️ **`sales`** - Verificar y completar si falta
4. ⚠️ **`analytics`** - Verificar si tiene todas las keys
5. ⚠️ **`ecommerce`** - Verificar si tiene todas las keys

### Prioridad Media
6. `default` - Verificar completitud
7. `hotel` - Verificar completitud
8. `calendar` - Verificar completitud
9. `mail` - Verificar completitud
10. `tasks` - Verificar completitud

### Prioridad Baja (Módulos Secundarios)
11. `academy`
12. `crm-v2`
13. `crypto-v2`
14. `finance-v2`
15. `notes`
16. `pos-system`
17. `payment`
18. `project-list`
19. `project-management`
20. `projects` (v1)
21. `social-media`
22. `todo-list-app`
23. `widgets`
24. `api-keys`
25. `ai-image-generator`
26. `ai-chat-v2`
27. `hospital-management`
28. `kanban`

---

## 📚 Checklist por Módulo

Para cada módulo que se implemente:

- [ ] **Traducciones creadas** para 7 idiomas (en, es, fr, pt, de, ar, zh)
- [ ] **Namespace agregado** a `types.ts` (`TranslationNamespace`)
- [ ] **Preload configurado** en `layout.tsx` (`preloadNamespaces`)
- [ ] **Componentes actualizados** para usar `useTranslation()`
- [ ] **LanguageSwitcher** agregado (si no existe)
- [ ] **Texto hardcodeado eliminado**
- [ ] **Keys validadas** en todos los idiomas
- [ ] **Pruebas realizadas** cambiando entre los 7 idiomas

---

## 🎯 Próximos Pasos

1. **Auditoría completa** de módulos existentes
2. **Priorización** basada en uso/frecuencia
3. **Implementación incremental** siguiendo el patrón de `projects-v2`
4. **Validación continua** después de cada módulo

---

**Última actualización:** 2025-12-24  
**Referencia:** `projects-v2` (completamente funcional para 7 idiomas)

