# 📋 Plan de Validación i18n Consolidados (3-Lang)

**Estado:** ACTIVO
**Fecha:** 25/12/2025
**Estrategia:** Validación de 3 idiomas (EN, ES, AR) y RTL básico.

---

## 🎯 Objetivo Inmediato

Validar módulo por módulo que:
1.  Existan las claves en `src/locales/{en,es,ar}.json`.
2.  No haya texto hardcodeado en la UI.
3.  La aplicación no crashee al cambiar de idioma.
4.  Se usen propiedades lógicas CSS para soporte RTL básico.

## 📊 Módulos Pendientes de Validación

### Prioridad Alta (Core)
- [x] **Analytics** (`apps/dashboard/app/dashboard-bundui/analytics`)
  - [x] Traducciones verificadas
  - [x] RTL Crash Fix (SalesByCountriesCard)
- [ ] **Projects** (`apps/dashboard/app/dashboard-bundui/projects`)
- [ ] **Mail** (`apps/dashboard/app/dashboard-bundui/mail`)

### Prioridad Media (Business)
- [ ] **E-commerce**
- [ ] **CRM**
- [ ] **Finance**

---

## 🛠️ Cómo Validar

1.  **Navegar** a la página del módulo.
2.  **Cambiar Idioma:** EN -> ES -> AR.
3.  **Observar:**
    - ¿Se traduce el texto?
    - ¿El layout RTL se aplica (aunque no sea perfecto)?
    - ¿Hay crashes?
4.  **Si falla:**
    - Extraer string faltante.
    - Agregar a `src/locales/*.json`.
    - Arreglar componente.

---
**Nota:** Este plan reemplaza al antiguo `PLAN_I18N_PENDIENTE.md`.
