# Imágenes de Referencia – Organización por Módulo

Este directorio contiene imágenes de referencia, mockups no funcionales, capturas de inspiración y benchmarking de otros sistemas, organizadas por módulos funcionales y administrativos del sistema. Utiliza estas carpetas para almacenar y consultar ejemplos visuales relevantes para cada área de la plataforma.

## Estructura de subcarpetas por módulo

- `admin-dashboard/` — Paneles de administración, métricas, gestión de usuarios, auditoría, logs, permisos, etc.
- `superadmin/` — Pantallas y paneles exclusivos de superadministrador (planes, límites globales, configuración avanzada).
- `parametrizacion/` — Configuración, reglas, flujos, personalización y ajustes generales.
- `login/` — Pantallas de acceso, onboarding, recuperación de contraseña.
- `helpdesk/` — Flujos de soporte, tickets, chat, timeline de casos, agentes IA de soporte.
- `crm/` — Gestión de clientes, cuentas, oportunidades, historial, segmentación.
- `pqrs/` — Peticiones, quejas, reclamos, sugerencias, formularios y seguimiento.
- `eventos/` — Calendarios, notificaciones, actividades, logs de eventos.
- `usuarios/` — Perfiles, roles, permisos, gestión de cuentas y departamentos.
- `marketing/` — Publicación en redes sociales, campañas, gestión de contenidos, inspiración de apps tipo Postiz/Mixpost.
- `integraciones/` — Integración con terceros, paneles de conexión, administración de bases de datos vectoriales, conectores externos.
- `analytics/` — Paneles de analítica, reporting, métricas, dashboards de datos.
- `billing/` — Facturación, gestión de planes, suscripciones, pagos.
- `compliance/` — Cumplimiento normativo, privacidad, auditoría de datos.
- `contabilidad/` — Asistentes contables, integración con software financiero, flujos de conciliación.
- `testing/` — QA, validación, flujos de pruebas, utilidades de testing.
- `layout/` — Ejemplos de navegación, headers, sidebars, footers, estructura visual general.
- `universal-assistant/` — Asistentes IA transversales, widgets, chatbots, paneles de orquestación.
- `operational-repositories/` — Administración de repositorios operativos, flujos de datos, almacenamiento.

> **Nota:** Si surge un nuevo módulo relevante, crea la subcarpeta correspondiente siguiendo este estándar. No uses una carpeta genérica "otros"; cada imagen debe estar asociada a un área funcional clara.

## Buenas prácticas
- Nombra las imágenes de forma descriptiva (ej: `dashboard-metricas-invgate.png`).
- Incluye una breve descripción en un README.md dentro de cada subcarpeta si es necesario.
- Mantén solo imágenes de referencia, no assets de producción.
- Actualiza y limpia periódicamente para evitar desorden.

---

Esta organización facilita la inspiración, benchmarking y alineación visual en el desarrollo de la plataforma. Si tienes dudas sobre dónde ubicar una imagen, consulta con el equipo o revisa la documentación de arquitectura.

# 🖼️ Imágenes de Referencia - CRM

## ✅ **IMÁGENES COMPLETADAS (Attio Reference)**

### 🎯 CRM Dashboard
- [x] `attio-dashboard.png` - Dashboard principal de Attio
- [x] `attio-companies-overview.png` - Vista general de compañías
- [x] `attio-companies-detail.png` - Vista detallada de compañías

### 🔧 Objetos Personalizables
- [x] `attio-objects-editor.png` - Editor de objetos personalizables
- [x] `attio-applications.png` - Gestión de aplicaciones/módulos

### ⚙️ Configuración y Administración
- [x] `attio-configuration.png` - Configuración general del sistema
- [x] `attio-account-settings.png` - Configuración de cuenta/perfil
- [x] `attio-security-settings.png` - Configuración de seguridad
- [x] `attio-email-system.png` - Sistema de email
- [x] `attio-development-tools.png` - Herramientas de desarrollo
- [x] `attio-deals-page-config.png` - **Configurador de la página de registros para "Deals"**
- [x] `attio-people-page-config.png` - **Configurador de la página de registros para "People"**

### 🔄 Procesos del Sistema
- [x] `attio-migration-process.png` - Proceso de migración
- [x] `attio-requirements.png` - Requisitos del sistema
- [x] `attio-template-editor.png` - Editor de plantillas de creación
- [x] `attio-notification-creator.png` - Creador de notificaciones por evento
- [x] `attio-lists-overview.png` - Vista general de listas de registros
- [x] `attio-lists-config.png` - Configuración de una lista específica
- [x] `attio-dashboards-overview.png` - Vista general de dashboards
- [x] `attio-report-view.png` - Visualizador de reportes
- [x] `attio-report-creator.png` - Creador de nuevos reportes
- [x] `attio-workflow-editor.png` - Editor de flujos de automatización (Workflows)

---

## 📋 **IMÁGENES PENDIENTES PARA CRM ESPECÍFICO**

### 📝 PQRS Especializado
- [ ] `pqrs-form-create.png` - Formulario de creación PQRS
- [ ] `pqrs-list-view.png` - Vista de lista PQRS
- [ ] `pqrs-detail-view.png` - Vista detallada PQRS
- [ ] `pqrs-timeline.png` - Línea de tiempo PQRS

### 👥 Gestión de Clientes
- [ ] `customer-list.png` - Lista de clientes
- [ ] `customer-detail.png` - Detalle de cliente
- [ ] `customer-form.png` - Formulario de cliente
- [ ] `customer-pipeline.png` - Pipeline de ventas

### 📊 Tablas y Listas
- [ ] `data-table-basic.png` - Tabla básica
- [ ] `data-table-advanced.png` - Tabla con filtros
- [ ] `data-table-virtualized.png` - Tabla virtualizada
- [ ] `data-table-actions.png` - Tabla con acciones

### 🎨 Componentes UI
- [ ] `form-fields.png` - Campos de formulario
- [ ] `navigation-sidebar.png` - Navegación lateral
- [ ] `search-filters.png` - Búsqueda y filtros
- [ ] `modal-dialogs.png` - Ventanas modales

---

## 📤 Instrucciones para Subir
1. **Renombrar** archivos siguiendo la convención kebab-case
2. **Verificar** que la imagen sea clara y de buena calidad
3. **Documentar** el propósito en el nombre del archivo
4. **Marcar como completado** en esta lista

---

## 🎯 **REFERENCIAS DE ATTIO**

Las imágenes de Attio sirven como **referencia principal** para:
- **Arquitectura visual** del sistema
- **Patrones de diseño** y UX
- **Estructura de navegación**
- **Gestión de objetos personalizables**
- **Configuración y administración**

---
*Lista actualizada: 22 de junio de 2025* 