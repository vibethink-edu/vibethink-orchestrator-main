# Decisiones y Definiciones de Conversaciones

## 📋 Resumen de Decisiones Tomadas

Este documento captura todas las decisiones importantes tomadas durante las conversaciones de desarrollo del proyecto.

## 🏗️ Arquitectura y Stack Tecnológico

### Stack Principal Confirmado
- **Frontend**: React + TypeScript + Tailwind + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions + Auth + Storage)
- **Real-time**: Supabase Real-time subscriptions
- **Secrets**: Supabase Vault para seguridad
- **Monedas**: Sistema de cambio en tiempo real con API externa

### Servicios Externos Integrados
- **Firecrawl**: $20/mes - Web scraping inteligente (500 páginas)
- **OpenAI**: Pay-per-use - Whisper + GPT-4o-mini + GPT-4o
- **Resend**: $20/mes - Email transaccional profesional
- **Currency API**: exchangerate-api.com para tasas de cambio en tiempo real

## 🔧 Decisiones de Arquitectura Recientes

### Rechazo de Prisma ORM - Enero 2025 ⭐ NUEVO
**Decisión fundamentada de mantener stack Supabase nativo**

#### Razones del Rechazo
- **Conflicto con RLS**: Prisma puede bypassear políticas Row Level Security críticas para multi-tenancy
- **Duplicación innecesaria**: Supabase client ya provee funcionalidad completa
- **Incompatibilidad con Real-time**: Edge Functions y subscripciones optimizadas para cliente nativo
- **Complejidad de migración**: Riesgo alto de introducir bugs en sistema estable

#### Alternativa Implementada: Mejoras Específicas en DX
1. **Hooks especializados** con mejor type safety
2. **Helpers para queries complejas** recurrentes
3. **Documentación mejorada** de patrones de acceso
4. **Funciones SQL expandidas** para lógica compleja
5. **Templates y snippets** para operaciones comunes
6. **Validadores automáticos** de RLS policies

### Estandarización de Dominio a VibeThink.co ⭐ NUEVO
**Consistencia completa de dominio empresarial**

#### Cambios Implementados
- **SuperAdmin principal**: admin@VibeThink.co (antes .com)
- **Soporte**: support@VibeThink.co
- **Actualización completa**: SimpleLogin y Login interfaces
- **Consistencia**: Toda la plataforma usa .co

## 💰 Sistema de Monedas

### Implementación Decidida
- **Estrategia**: API externa con caché y fallback rates
- **API Principal**: exchangerate-api.com (gratuita)
- **Caché**: 1 hora de duración para optimizar llamadas
- **Moneda Base**: USD para cálculos internos
- **Monedas Soportadas**: USD, EUR, GBP, CAD, AUD, JPY, CHF, SEK, NOK, DKK, **COP**
- **Fallback**: Tasas de respaldo cuando API no disponible
- **UX**: Indicadores visuales de estado (offline, última actualización, refresh manual)

### Justificación
- Reduce costos vs APIs premium
- Mejor experiencia de usuario con datos reales
- Resiliente con sistema de fallback
- Caché optimiza performance

## 📊 Planes de Suscripción

### Planes Definidos (Configurables por Empresa)

#### Starter - $29/mes
- **Usuarios**: 5 máximo
- **Solicitudes IA**: 1,000 mensuales
- **Scraping**: 100 páginas mensuales
- **Almacenamiento**: 5GB
- **Features**: IA básica, soporte email, integraciones básicas, dashboard analítico

#### Professional - $99/mes
- **Usuarios**: 25 máximo
- **Solicitudes IA**: 10,000 mensuales
- **Scraping**: 1,000 páginas mensuales
- **Almacenamiento**: 25GB
- **Features**: IA avanzada, soporte 24/7, todas las integraciones, analytics avanzados, API personalizada, workflows automáticos

#### Enterprise - $299/mes
- **Usuarios**: Ilimitados
- **Solicitudes IA**: Ilimitadas
- **Scraping**: Ilimitado
- **Almacenamiento**: Ilimitado
- **Features**: Suite IA empresarial, gestor dedicado, integraciones custom, seguridad empresarial, SLA garantizado, entrenamiento personalizado, soporte on-premise

### Características Importantes
- **Configurables por empresa**: Los límites se pueden ajustar por empresa
- **Multiidioma**: Español (default) e inglés
- **Features traducidos**: Sistema de traducciones para características

## 🎯 Casos de Uso Prioritarios

### 1. Meeting Processor (Prioridad 1)
- **Objetivo**: Convertir reuniones en actas automáticas
- **Flow**: Audio/Video → Whisper AI → GPT Summary → PDF → Notificaciones
- **Implementación**: Edge Function `meeting-processor`

### 2. Resource Scraper (Prioridad 2)
- **Objetivo**: Investigación y scraping automatizado
- **Flow**: URL + Criterios → Firecrawl → AI Analysis → Database Storage
- **Implementación**: Edge Function `resource-scraper`

### 3. Content Pipeline (Prioridad 3)
- **Objetivo**: Creación y publicación automatizada
- **Flow**: Brief → AI Generation → Review → Approval → Multi-platform Publishing
- **Implementación**: Edge Function `content-pipeline`

## 🗂️ Sistema de Repositorios Operacionales (NUEVO - Enero 2025) ⭐

### Implementación Completada
**Sistema integral para gestión de recursos organizacionales y best practices empresariales**

#### Arquitectura de Base de Datos
- **Tablas principales implementadas**:
  - `operational_repositories`: Contenedores principales por empresa
  - `prompt_templates`: Templates de prompts reutilizables
  - `naming_conventions`: Patrones de nomenclatura validables
  - `folder_structure_templates`: Estructuras de carpetas generables
  - `company_orchestrators`: Sistema de permisos y roles

#### Sistema de Orquestación
- **Roles definidos**: 
  - Primary Orchestrator: Control total del sistema
  - Secondary Orchestrator: Permisos limitados de gestión
  - Usuario regular: Solo lectura y uso
- **Permisos granulares**: Configurables por orquestador
- **Validación por email**: Sistema de autorización basado en email corporativo

#### Features Implementadas

##### 1. Gestor de Templates de Prompts
- **Creación y edición**: Formularios completos con validación
- **Categorización**: Por departamento, industria, categoría
- **Variables dinámicas**: Sistema de placeholders configurables
- **Versionado**: Control de versiones automático
- **Tags y búsqueda**: Sistema de etiquetado y filtros avanzados
- **Métricas de uso**: Tracking de utilización por template

##### 2. Gestor de Convenciones de Nomenclatura
- **Patrones RegEx**: Validación en tiempo real
- **Categorías**: Archivos, carpetas, documentos, proyectos
- **Ejemplos validados**: Sistema de ejemplos con validación
- **Probador integrado**: Testing en vivo de patrones
- **Validación batch**: Prueba múltiples nombres simultáneamente

##### 3. Gestor de Estructuras de Carpetas
- **Definición jerárquica**: Sistema de árbol de carpetas/archivos
- **Generación automática**: Creación de estructuras en sistema local
- **Integración Google Drive**: Sincronización opcional con Drive
- **Templates por industria**: Estructuras predefinidas por sector
- **Elementos requeridos**: Marcado de carpetas/archivos obligatorios

#### Componentes Técnicos Creados
```
src/components/operational-repositories/
├── OperationalRepositoriesManager.tsx (Manager principal)
├── PromptTemplateManager.tsx (Gestor de prompts)
├── NamingConventionManager.tsx (Gestor de nomenclatura)
├── FolderStructureManager.tsx (Gestor de estructuras)
└── forms/
    ├── CreatePromptTemplateForm.tsx
    ├── CreateNamingConventionForm.tsx
    └── CreateFolderStructureForm.tsx
```

#### Hook Principal
- **`useOperationalRepositories`**: Hook centralizado para toda la funcionalidad
- **Funciones implementadas**:
  - CRUD completo para todos los tipos de recursos
  - Validación de nomenclatura en tiempo real
  - Generación de estructuras de carpetas
  - Control de permisos por rol
  - Caching y optimización de queries

#### UI/UX Implementada
- **Interfaz tabular**: Navegación por pestañas (Overview, Prompts, Nomenclatura, Estructuras, Orquestación)
- **Dashboard de resumen**: Métricas y estadísticas rápidas
- **Sistema de búsqueda**: Filtros avanzados por categoría, departamento
- **Dialogs modales**: Formularios de creación en overlays
- **Estados de carga**: Indicadores de progreso y loading states
- **Badges informativos**: Estados, versiones, contadores
- **Responsive design**: Adaptación completa a móviles

### Próximas Funcionalidades Pendientes
1. **Edición de recursos existentes** (Edit buttons implementados pero sin funcionalidad)
2. **Eliminación con confirmación** (Delete buttons implementados pero sin funcionalidad)
3. **Sistema de aprobaciones** para cambios críticos
4. **Exportación/importación** de configuraciones
5. **Historial de cambios** y auditoría
6. **Integración completa con Google Drive**
7. **Templates de marketplace** compartidos entre empresas

## 🔮 Roadmap Actualizado

### v0.5.5 - Mejoras Developer Experience (2-3 semanas) ⭐ NUEVO
**Objetivo**: Mejorar DX sin comprometer arquitectura Supabase

#### Features Planificadas
- **Hooks Especializados**
  - useCompanyData con mejor type safety
  - useOperationalQueries para queries complejas
  - useRLSValidation para verificar políticas
  - useBulkOperations para operaciones masivas

- **Helpers y Utilities**
  - QueryBuilder para construcción dinámica de queries
  - TypeGuards específicos para entidades
  - Formatters para datos complejos
  - Validators para inputs

- **Documentación y Templates**
  - Patrones documentados para cada caso de uso
  - Code snippets para VSCode
  - Templates de componentes con datos
  - Guías de mejores prácticas

- **Tooling Mejorado**
  - Script de validación de RLS policies
  - Generador de tipos específicos
  - Linter personalizado para queries
  - Testing helpers para Supabase

### v0.6.0 - Panel de Superadministración y Soporte (4-5 semanas) ⭐ NUEVO
**Objetivo**: Panel completamente aislado para administración de la plataforma AI Pair

#### Features Principales
- **Panel de Superadministración**
  - Dashboard ejecutivo con métricas globales
  - Gestión de todas las empresas/tenants
  - Configuración de planes maestros
  - Control de features por tenant
  - Monitoreo de facturación global

- **Sistema de Soporte**
  - Panel de tickets integrado
  - Chat en vivo con clientes
  - Historial de interacciones
  - Escalamiento automático
  - Base de conocimientos

- **Analytics y Reporting**
  - Métricas de uso por tenant
  - Reportes financieros
  - Análisis de retención
  - Alertas de sistema

#### Características Técnicas
- **Aislamiento completo**: Módulo independiente con su propia autenticación
- **Seguridad avanzada**: Doble autenticación para super admins
- **Multiidioma**: Soporte completo EN/ES
- **Real-time**: Actualizaciones en tiempo real
- **Auditoria**: Log completo de todas las acciones

## 🔐 Decisiones de Seguridad

### Autenticación de Super Admin
- **Emails autorizados**: admin@VibeThink.com, superadmin@VibeThink.com, root@VibeThink.com
- **Rol requerido**: OWNER + company slug 'VibeThink-platform'
- **Hook implementado**: `useSuperAdmin` para verificación

### Control de Acceso
- **RLS**: Row Level Security en todas las tablas
- **API Keys**: Almacenadas en Supabase Vault
- **CORS**: Configurado correctamente en Edge Functions
- **Rate Limiting**: Implementado en Edge Functions

## 📈 Métricas de Éxito Definidas

### Técnicas
- **Automation Rate**: 80% reducción trabajo manual
- **Processing Speed**: Actas en < 5 minutos
- **Research Efficiency**: 10x más rápido vs manual
- **Uptime**: 99.9%+ disponibilidad
- **Currency Data**: 99.5% uptime, 1-hour cache refresh

### Negocio
- **User Adoption**: Crecimiento mensual MAU
- **Feature Usage**: Workflows más usados
- **Customer Satisfaction**: NPS > 50
- **Support**: Response time < 2 hours

## 🔧 Workflows Engine - Fases Definidas

### FASE 1: Pre-built Workflows (Actual - 2 semanas)
- Workflows hardcodeados para casos específicos
- Edge Functions especializadas
- Interface de monitoreo básica

### FASE 2: Configurable Workflows (Mes 2)
- Parámetros configurables
- Templates personalizables
- Validación de flujos

### FASE 3: Visual Builder (Mes 3-4)
- **React Flow** drag-and-drop editor
- Biblioteca de componentes
- Testing de workflows

### FASE 4: Marketplace (Mes 5+)
- Workflows compartidos
- Community templates
- Analytics avanzados

## 💡 Decisiones de Implementación

### Sistema de Traducción de Features
- **Tabla**: `plan_feature_translations`
- **Idiomas**: Español (default), Inglés
- **Estructura**: feature_key, language, translation
- **Uso**: Features de planes traducidos automáticamente

### Configuración de Límites por Empresa
- **Flexibilidad**: Cada empresa puede tener límites personalizados
- **Override**: Los límites de empresa pueden sobrescribir los del plan
- **Escalabilidad**: Sistema preparado para growth

### Sistema de Repositorios Operacionales
- **Arquitectura modular**: Cada tipo de recurso en su propio gestor
- **Validación en tiempo real**: RegEx patterns para nomenclatura
- **Permisos granulares**: Sistema de orquestadores con roles específicos
- **Integración externa**: Google Drive sync para estructuras de carpetas
- **Reutilización**: Templates compartibles entre departamentos/empresas

### Mejoras Developer Experience sin ORM
- **Estrategia**: Mejoras incrementales manteniendo stack nativo
- **Enfoque**: Hooks especializados, helpers específicos, mejor documentación
- **Herramientas**: Templates, snippets, validadores automáticos
- **Filosofía**: Máximo DX sin comprometer arquitectura o seguridad

## 📝 Notas Importantes

### Cosas que NO se deben perder
1. **No usar Prisma ORM**: Decisión fundamentada para mantener compatibilidad total con Supabase
2. **Panel de Super Admin**: Debe ser completamente aislado del sistema principal
3. **Sistema de monedas**: Debe mantener API real + fallback + caché
4. **Planes configurables**: Los límites se configuran por empresa, no son fijos
5. **Multiidioma**: Todo debe soportar ES/EN desde el inicio
6. **Workflows**: Empezar simple, evolucionar a visual builder
7. **Repositorios Operacionales**: Sistema completo implementado, falta solo edición/eliminación
8. **Dominio .co**: Toda la plataforma debe usar VibeThink.co consistentemente

### Próximos Pasos Críticos
1. ✅ **COMPLETADO**: Estandarización de dominio a VibeThink.co
2. ✅ **COMPLETADO**: Decisión arquitectónica sobre Prisma ORM
3. ✅ **COMPLETADO**: Mejoras Developer Experience
4. 🔄 **EN CURSO**: Implementar mejoras específicas en Developer Experience
5. 📋 **SIGUIENTE**: Crear hooks especializados con mejor type safety
6. 🔨 **DESPUÉS**: Desarrollar helpers para queries complejas
7. 🎯 **FUTURO**: Implementar sistema de workflows básico
8. 🏢 **LARGO PLAZO**: Planificar arquitectura del panel de super admin

---

**Última actualización**: Enero 2025  
**Responsable**: Product Owner + Lead Developer  
**Estado**: Documento vivo - se actualiza con cada decisión importante  
**Frecuencia de revisión**: Cada sprint
