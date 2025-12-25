# Lista de Namespaces de Traducción Faltantes - 2025-12-20

**Basado en:** Auditoría de textos hardcoded (2,515 strings encontrados)

---

## 📊 Resumen Ejecutivo

### Namespaces Existentes ✅

| Namespace | Estado EN | Estado ES | Módulos |
|-----------|-----------|-----------|---------|
| `common` | ✅ Completo | ✅ Completo | Botones, labels, mensajes comunes |
| `navigation` | ✅ Completo | ✅ Completo | Nombres de módulos y rutas |
| `theme` | ✅ Completo | ✅ Completo | Theme customizer |
| `crm` | ✅ Completo | ✅ Completo | CRM, CRM V2 |
| `ecommerce` | ✅ Completo | ✅ Completo | E-commerce |
| `sales` | ✅ Completo | ✅ Completo | Sales |
| `errors` | ✅ Completo | ✅ Completo | Mensajes de error |
| `validation` | ✅ Completo | ✅ Completo | Validaciones de formularios |
| `ai-chat` | ✅ Completo | ✅ Completo | AI Chat, AI Chat V2 |
| `crypto` | ✅ Completo | ✅ Completo | Crypto, Crypto V2 |
| `finance` | ✅ Completo | ✅ Completo | Finance, Finance V2 |

**Total existentes:** 11 namespaces

---

## ❌ Namespaces Faltantes (Por Prioridad)

### 🔴 Prioridad Alta (Módulos Activos y Usados)

| Namespace | Módulos Afectados | Strings Estimados | Prioridad |
|-----------|-------------------|-------------------|-----------|
| `academy` | Academy/School | ~50 | 🔴 Alta |
| `analytics` | Website Analytics | ~80 | 🔴 Alta |
| `calendar` | Calendar | ~100 | 🔴 Alta |
| `chat` | Chats (no AI) | ~120 | 🔴 Alta |
| `file-manager` | File Manager | ~60 | 🔴 Alta |
| `kanban` | Kanban | ~40 | 🔴 Alta |
| `mail` | Mail | ~150 | 🔴 Alta |
| `notes` | Notes | ~80 | 🔴 Alta |
| `projects` | Project Management, Projects | ~90 | 🔴 Alta |
| `settings` | Settings pages | ~100 | 🔴 Alta |
| `tasks` | Tasks | ~70 | 🔴 Alta |

### 🟡 Prioridad Media (Módulos Especializados)

| Namespace | Módulos Afectados | Strings Estimados | Prioridad |
|-----------|-------------------|-------------------|-----------|
| `ai-image-generator` | AI Image Generator | ~80 | 🟡 Media |
| `api-keys` | API Keys | ~40 | 🟡 Media |
| `hospital` | Hospital Management | ~60 | 🟡 Media |
| `hotel` | Hotel Dashboard | ~30 | 🟡 Media |
| `payment` | Payment Dashboard | ~50 | 🟡 Media |
| `pos-system` | POS System | ~70 | 🟡 Media |
| `social-media` | Social Media | ~40 | 🟡 Media |
| `todo-list` | Todo List App | ~50 | 🟡 Media |

### 🟢 Prioridad Baja (Módulos Menos Usados)

| Namespace | Módulos Afectados | Strings Estimados | Prioridad |
|-----------|-------------------|-------------------|-----------|
| `empty-states` | Empty States pages | ~30 | 🟢 Baja |
| `onboarding` | Onboarding Flow | ~60 | 🟢 Baja |
| `pricing` | Pricing pages | ~40 | 🟢 Baja |
| `products` | Products pages | ~80 | 🟢 Baja |
| `profile` | Profile, User Profile | ~50 | 🟢 Baja |
| `users` | Users List | ~30 | 🟢 Baja |
| `widgets` | Widgets (Fitness, Analytics, E-commerce) | ~60 | 🟢 Baja |

---

## 📋 Detalle por Módulo

### 1. Academy 🔴 Alta Prioridad

**Ubicación:** `apps/dashboard/app/dashboard-bundui/academy/`

**Textos encontrados:**
- Course names (Introduction to React, Machine Learning Basics, etc.)
- Categories (Web Development, Data Science, etc.)
- Search placeholder: "Search courses"
- Labels: "Course name"

**Namespace sugerido:** `academy.json`

---

### 2. Analytics 🔴 Alta Prioridad

**Ubicación:** `apps/dashboard/app/dashboard-bundui/analytics/`

**Componentes:**
- AnalyticsHeader
- AverageDailySales
- EarningReportsCard
- MonthlyCampaignState
- SalesByCountriesCard
- TicketsCard
- TotalEarningCard
- WebsiteAnalyticsCard

**Namespace sugerido:** `analytics.json`

---

### 3. Calendar 🔴 Alta Prioridad

**Ubicación:** `apps/dashboard/app/dashboard-bundui/calendar/`

**Componentes:** 13 componentes
- Eventos, fechas, horas
- Navegación de calendario
- Formularios de eventos

**Namespace sugerido:** `calendar.json`

---

### 4. Chat (No AI) 🔴 Alta Prioridad

**Ubicación:** `apps/dashboard/app/dashboard-bundui/chat/`

**Componentes:** 14 componentes
- Mensajes de chat
- Contactos
- Estados de conexión
- Notificaciones

**Namespace sugerido:** `chat.json`

---

### 5. File Manager 🔴 Alta Prioridad

**Ubicación:** `apps/dashboard/app/dashboard-bundui/file-manager/`

**Componentes:** 7 componentes
- Navegación de archivos
- Acciones (upload, download, delete)
- Tipos de archivo
- Estados

**Namespace sugerido:** `file-manager.json`

---

### 6. Kanban 🔴 Alta Prioridad

**Ubicación:** `apps/dashboard/app/dashboard-bundui/kanban/`

**Componentes:** 2 componentes
- Columnas (To Do, In Progress, Done)
- Tarjetas
- Drag & drop

**Namespace sugerido:** `kanban.json`

---

### 7. Mail 🔴 Alta Prioridad

**Ubicación:** `apps/dashboard/app/dashboard-bundui/mail/`

**Componentes:** 6 componentes
- Lista de correos
- Vista de correo
- Componer
- Filtros (Inbox, Sent, Drafts, etc.)
- Acciones (Reply, Forward, Delete)

**Namespace sugerido:** `mail.json`

---

### 8. Notes 🔴 Alta Prioridad

**Ubicación:** `apps/dashboard/app/dashboard-bundui/notes/`

**Componentes:**
- Lista de notas
- Editor de notas
- Etiquetas
- Búsqueda

**Namespace sugerido:** `notes.json`

---

### 9. Projects 🔴 Alta Prioridad

**Ubicación:** `apps/dashboard/app/dashboard-bundui/projects/`, `project-management/`, `project-list/`

**Componentes:** 11+ componentes
- Lista de proyectos
- Detalles de proyecto
- Tareas
- Estados (Active, Completed, On Hold)
- Métricas

**Namespace sugerido:** `projects.json`

---

### 10. Settings 🔴 Alta Prioridad

**Ubicación:** `apps/dashboard/app/dashboard-bundui/pages/settings/`

**Páginas:**
- Profile
- Account
- Billing
- Appearance
- Notifications
- Display

**Namespace sugerido:** `settings.json`

---

### 11. Tasks 🔴 Alta Prioridad

**Ubicación:** `apps/dashboard/app/dashboard-bundui/tasks/`

**Componentes:** 9 componentes
- Lista de tareas
- Filtros
- Estados
- Prioridades

**Namespace sugerido:** `tasks.json`

---

## 🎯 Plan de Implementación Recomendado

### Fase 1: Prioridad Alta (11 namespaces)
1. `academy`
2. `analytics`
3. `calendar`
4. `chat`
5. `file-manager`
6. `kanban`
7. `mail`
8. `notes`
9. `projects`
10. `settings`
11. `tasks`

**Estimado:** ~900 strings a traducir

### Fase 2: Prioridad Media (8 namespaces)
1. `ai-image-generator`
2. `api-keys`
3. `hospital`
4. `hotel`
5. `payment`
6. `pos-system`
7. `social-media`
8. `todo-list`

**Estimado:** ~400 strings a traducir

### Fase 3: Prioridad Baja (7 namespaces)
1. `empty-states`
2. `onboarding`
3. `pricing`
4. `products`
5. `profile`
6. `users`
7. `widgets`

**Estimado:** ~350 strings a traducir

---

## 📊 Estadísticas Totales

| Categoría | Cantidad | Strings Estimados |
|-----------|----------|-------------------|
| **Existentes** | 11 | ~500 |
| **Faltantes Alta** | 11 | ~900 |
| **Faltantes Media** | 8 | ~400 |
| **Faltantes Baja** | 7 | ~350 |
| **TOTAL** | **37** | **~2,150** |

**Nota:** Los strings estimados son aproximados basados en la auditoría. El total real puede variar.

---

## 🔄 Próximos Pasos

1. ✅ **Completado:** Crear namespaces para módulos V2 (ai-chat, crypto, finance)
2. ⏳ **Pendiente:** Crear namespaces de Prioridad Alta (11 módulos)
3. ⏳ **Pendiente:** Migrar componentes a usar `t()` en lugar de strings hardcoded
4. ⏳ **Pendiente:** Validar que todas las traducciones funcionan correctamente

---

**Última actualización:** 2025-12-20
**Estado:** Lista completa de namespaces faltantes identificados




