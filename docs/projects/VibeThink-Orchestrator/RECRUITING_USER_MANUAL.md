# Manual de Usuario - Módulo Agentic de Recruiting

## Guía para Recursos Humanos

### Índice
1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Crear un Workflow de Recruiting](#crear-un-workflow-de-recruiting)
4. [Gestionar Candidatos](#gestionar-candidatos)
5. [Revisar Aplicaciones](#revisar-aplicaciones)
6. [Métricas y Reportes](#métricas-y-reportes)
7. [Configuración](#configuración)
8. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

El Módulo Agentic de Recruiting automatiza el proceso de búsqueda y selección de talento utilizando inteligencia artificial. El sistema busca candidatos en múltiples fuentes, envía outreach personalizado y gestiona las aplicaciones de forma inteligente.

### Características Principales

- **Búsqueda Automatizada**: Encuentra candidatos en bases internas, LinkedIn y portales externos
- **Outreach Inteligente**: Envía mensajes personalizados a candidatos
- **Landing Pages Dinámicas**: Genera páginas optimizadas para captar aplicaciones
- **Evaluación Automatizada**: Analiza y puntúa candidatos automáticamente
- **Métricas en Tiempo Real**: Dashboard con KPIs del proceso de hiring

---

## Acceso al Sistema

### 1. Iniciar Sesión

1. Navega a: `https://hr.empresa.com/recruiting`
2. Ingresa tus credenciales corporativas
3. Selecciona tu empresa si tienes acceso a múltiples

### 2. Dashboard Principal

Al acceder verás:

```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard de Recruiting                   │
├─────────────────────────────────────────────────────────────┤
│ 📊 Métricas Generales                                        │
│ • Workflows Activos: 5                                       │
│ • Candidatos Encontrados: 234                                │
│ • Aplicaciones Recibidas: 45                                 │
│ • Contrataciones: 8                                          │
│                                                             │
│ 🚀 Acciones Rápidas                                          │
│ [Nuevo Workflow] [Ver Candidatos] [Revisar Aplicaciones]    │
│                                                             │
│ 📈 Workflows Recientes                                       │
│ • Senior Developer - 23 candidatos - 5 aplicaciones         │
│ • Marketing Manager - 15 candidatos - 3 aplicaciones        │
└─────────────────────────────────────────────────────────────┘
```

---

## Crear un Workflow de Recruiting

### Paso 1: Información del Puesto

1. Haz clic en **"Nuevo Workflow"**
2. Completa la información básica:

```
┌─────────────────────────────────────────────────────────────┐
│                    Información del Puesto                    │
├─────────────────────────────────────────────────────────────┤
│ Título del Puesto: [Senior Software Engineer]               │
│ Departamento: [Engineering]                                  │
│ Ubicación: [Bogotá, Colombia]                               │
│ Tipo de Contrato: [Full-time]                               │
│                                                             │
│ Rango Salarial: [4000-6000 USD]                             │
│ Urgencia: [Normal] [Alta] [Urgente]                         │
└─────────────────────────────────────────────────────────────┘
```

### Paso 2: Requisitos y Skills

```
┌─────────────────────────────────────────────────────────────┐
│                      Requisitos del Puesto                   │
├─────────────────────────────────────────────────────────────┤
│ Skills Técnicos:                                             │
│ ☑ Python ☑ React ☑ AWS ☑ Docker ☑ Kubernetes              │
│                                                             │
│ Años de Experiencia: [3-5 años]                             │
│ Educación: [Ingeniería o afines]                            │
│ Idiomas: ☑ Español ☑ Inglés                                 │
│                                                             │
│ Skills Blandos:                                              │
│ ☑ Trabajo en equipo ☑ Comunicación ☑ Liderazgo             │
└─────────────────────────────────────────────────────────────┘
```

### Paso 3: Estrategia de Búsqueda

```
┌─────────────────────────────────────────────────────────────┐
│                   Estrategia de Búsqueda                     │
├─────────────────────────────────────────────────────────────┤
│ Fuentes de Búsqueda:                                         │
│ ☑ Base de datos interna                                      │
│ ☑ LinkedIn                                                   │
│ ☑ Portales externos (Indeed, Glassdoor)                     │
│                                                             │
│ Canales de Outreach:                                         │
│ ☑ Email personalizado                                        │
│ ☑ Invitación LinkedIn                                        │
│ ☑ Mensaje directo                                            │
│                                                             │
│ Máximo de candidatos: [100]                                 │
└─────────────────────────────────────────────────────────────┘
```

### Paso 4: Configuración Avanzada

```
┌─────────────────────────────────────────────────────────────┐
│                  Configuración Avanzada                      │
├─────────────────────────────────────────────────────────────┤
│ Landing Page:                                                │
│ ☑ Generar automáticamente                                   │
│ Template: [Tech Modern]                                      │
│                                                             │
│ Aprobación Requerida: ☐ No ☑ Sí                             │
│                                                             │
│ Mensaje Personalizado:                                       │
│ [Hola {nombre}, vimos tu perfil y nos gustaría...]          │
└─────────────────────────────────────────────────────────────┘
```

### Paso 5: Revisar y Lanzar

1. Revisa toda la información
2. Haz clic en **"Crear Workflow"**
3. El sistema comenzará automáticamente

---

## Gestionar Candidatos

### Ver Lista de Candidatos

1. Ve a **"Candidatos"** en el menú
2. Filtra por:
   - Workflow específico
   - Estado (encontrado, contactado, respondió)
   - Fuente (LinkedIn, interno, externo)
   - Score (puntuación)

```
┌─────────────────────────────────────────────────────────────┐
│                      Lista de Candidatos                     │
├─────────────────────────────────────────────────────────────┤
│ Filtros: [Workflow: Senior Developer] [Estado: Todos]       │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ María González | Senior Developer | TechCorp | 0.85 ⭐ │ │
│ │ 📧 Contactada | 📅 15/01/2024 | ✅ Respondió           │ │
│ │ [Ver Perfil] [Contactar] [Aplicó]                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Carlos Rodríguez | Full Stack Dev | StartupXYZ | 0.78 ⭐│ │
│ │ 📧 Contactada | 📅 15/01/2024 | ⏳ Sin respuesta        │ │
│ │ [Ver Perfil] [Re-contactar] [Marcar como no interesado]│ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Ver Perfil Detallado

Al hacer clic en **"Ver Perfil"**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Perfil de María González                  │
├─────────────────────────────────────────────────────────────┤
│ 📋 Información Básica                                        │
│ • Nombre: María González                                     │
│ • Título: Senior Software Engineer                           │
│ • Empresa: TechCorp                                          │
│ • Ubicación: Bogotá, Colombia                                │
│ • Años de experiencia: 5                                     │
│                                                             │
│ 🛠️ Skills                                                    │
│ • Python, React, AWS, Docker, Kubernetes                    │
│ • Inglés (Avanzado), Español (Nativo)                       │
│                                                             │
│ 💼 Experiencia Laboral                                       │
│ • TechCorp (2021-Presente) - Senior Developer               │
│ • StartupXYZ (2019-2021) - Full Stack Developer             │
│ • BigCorp (2017-2019) - Junior Developer                    │
│                                                             │
│ 🎓 Educación                                                 │
│ • Ingeniería de Sistemas - Universidad Nacional             │
│ • Certificación AWS Solutions Architect                     │
│                                                             │
│ 📊 Evaluación                                                │
│ • Score: 0.85/1.00                                          │
│ • Fit técnico: 90%                                          │
│ • Fit cultural: 85%                                         │
│                                                             │
│ 📞 Historial de Contacto                                     │
│ • 15/01/2024 - Email enviado                                │
│ • 15/01/2024 - Respondió positivamente                      │
│ • 16/01/2024 - Aplicó al puesto                             │
└─────────────────────────────────────────────────────────────┘
```

### Acciones Disponibles

- **Contactar**: Enviar mensaje personalizado
- **Marcar como interesado**: Candidato responde positivamente
- **Marcar como no interesado**: Candidato no está interesado
- **Programar entrevista**: Agendar entrevista inicial
- **Añadir notas**: Comentarios internos

---

## Revisar Aplicaciones

### Lista de Aplicaciones

1. Ve a **"Aplicaciones"** en el menú
2. Filtra por estado: Nuevas, Revisadas, Shortlist, Rechazadas

```
┌─────────────────────────────────────────────────────────────┐
│                     Aplicaciones Recibidas                   │
├─────────────────────────────────────────────────────────────┤
│ Filtros: [Estado: Nuevas] [Workflow: Senior Developer]      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🆕 María González | maria@email.com | Score: 0.85      │ │
│ │ 📄 CV: [Descargar] | 🌐 Portfolio: [Ver]                │ │
│ │ 📅 Aplicó: 16/01/2024 14:30                            │ │
│ │ [Revisar] [Shortlist] [Rechazar] [Entrevistar]          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🆕 Carlos Rodríguez | carlos@email.com | Score: 0.78   │ │
│ │ 📄 CV: [Descargar] | 🌐 GitHub: [Ver]                   │ │
│ │ 📅 Aplicó: 16/01/2024 16:45                            │ │
│ │ [Revisar] [Shortlist] [Rechazar] [Entrevistar]          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Revisar Aplicación

Al hacer clic en **"Revisar"**:

```
┌─────────────────────────────────────────────────────────────┐
│                  Revisión de Aplicación                      │
├─────────────────────────────────────────────────────────────┤
│ Candidato: María González                                    │
│ Email: maria@email.com                                       │
│ Workflow: Senior Software Engineer                           │
│                                                             │
│ 📄 CV Adjunto: [Descargar PDF]                              │
│ 🌐 Portfolio: https://github.com/mariagonzalez              │
│ 📝 Carta de Presentación: [Ver]                             │
│                                                             │
│ 📊 Evaluación Automática:                                   │
│ • Score: 0.85/1.00                                          │
│ • Skills técnicos: 90%                                      │
│ • Experiencia relevante: 85%                                │
│ • Fit cultural: 80%                                         │
│                                                             │
│ 📝 Evaluación Manual:                                       │
│ • Skills Técnicos: [1] [2] [3] [4] [5] ⭐⭐⭐⭐⭐           │
│ • Experiencia: [1] [2] [3] [4] [5] ⭐⭐⭐⭐                 │
│ • Fit Cultural: [1] [2] [3] [4] [5] ⭐⭐⭐⭐⭐               │
│ • Comunicación: [1] [2] [3] [4] [5] ⭐⭐⭐⭐                 │
│                                                             │
│ 💬 Comentarios:                                             │
│ [Excelente perfil técnico, experiencia muy relevante...]   │
│                                                             │
│ 🎯 Recomendación:                                           │
│ ○ Entrevistar ○ Shortlist ○ Rechazar ○ Contratar           │
│                                                             │
│ 📅 Próximos Pasos:                                          │
│ • Programar entrevista: [Fecha] [Hora]                     │
│ • Enviar email de confirmación: [Personalizar]             │
│                                                             │
│ [Guardar Evaluación] [Programar Entrevista] [Enviar Email]  │
└─────────────────────────────────────────────────────────────┘
```

### Estados de Aplicación

- **🆕 Nueva**: Aplicación recién recibida
- **👁️ Revisada**: Evaluada por RRHH
- **⭐ Shortlist**: Candidato seleccionado para entrevista
- **❌ Rechazada**: No cumple requisitos
- **✅ Contratada**: Proceso completado exitosamente

---

## Métricas y Reportes

### Dashboard de Métricas

```
┌─────────────────────────────────────────────────────────────┐
│                    Métricas del Workflow                     │
├─────────────────────────────────────────────────────────────┤
│ 📊 Resumen General                                           │
│ • Total candidatos: 45                                       │
│ • Contactados: 23                                            │
│ • Respondieron: 8                                            │
│ • Aplicaron: 12                                              │
│ • Shortlist: 5                                               │
│ • Contratados: 1                                             │
│                                                             │
│ ⏱️ Métricas de Tiempo                                        │
│ • Tiempo hasta primera aplicación: 4 horas                  │
│ • Tiempo promedio de respuesta: 2.5 horas                   │
│ • Tiempo total del proceso: 18 días                         │
│                                                             │
│ 📈 Métricas de Engagement                                    │
│ • Tasa de apertura de emails: 65.2%                         │
│ • Tasa de clics: 34.8%                                       │
│ • Tasa de respuesta LinkedIn: 15.2%                         │
│ • Tasa de conversión: 7.7%                                   │
│                                                             │
│ 💰 Métricas de Costo                                         │
│ • Costo por candidato: $25                                   │
│ • Costo por aplicación: $95                                  │
│ • Costo por contratación: $1,125                            │
└─────────────────────────────────────────────────────────────┘
```

### Reportes Disponibles

1. **Reporte de Efectividad por Fuente**
   - LinkedIn vs bases internas vs portales externos
   - Tasa de conversión por fuente
   - Costo por fuente

2. **Reporte de Tiempo de Contratación**
   - Tiempo promedio por puesto
   - Comparación con benchmarks del mercado
   - Análisis de cuellos de botella

3. **Reporte de Calidad de Candidatos**
   - Score promedio por workflow
   - Distribución de scores
   - Correlación entre score y contratación

4. **Reporte de Costos**
   - Costo total por proceso
   - Desglose por actividad
   - ROI del proceso de recruiting

### Exportar Datos

- **Excel**: Datos completos en formato .xlsx
- **PDF**: Reportes formateados
- **CSV**: Datos para análisis externo
- **API**: Integración con otros sistemas

---

## Configuración

### Configuración de la Empresa

1. Ve a **"Configuración"** → **"Empresa"**

```
┌─────────────────────────────────────────────────────────────┐
│                  Configuración de Empresa                    │
├─────────────────────────────────────────────────────────────┤
│ 📧 Proveedor de Email                                        │
│ • Servicio: [SendGrid] [AWS SES] [Otro]                     │
│ • API Key: [••••••••••••••••]                               │
│ • Email remitente: careers@empresa.com                      │
│                                                             │
│ 🔗 Integración ATS                                           │
│ • Proveedor: [BambooHR] [Workday] [Otro]                    │
│ • API Key: [••••••••••••••••]                               │
│ • Webhook URL: https://api.empresa.com/webhooks/ats         │
│                                                             │
│ 💼 Configuración LinkedIn                                    │
│ • API Key: [••••••••••••••••]                               │
│ • Límite diario: [100]                                       │
│ • Delay entre requests: [1000ms]                            │
│                                                             │
│ 📝 Plantillas de Email                                       │
│ • Invitación personalizada: [Editar]                        │
│ • Seguimiento: [Editar]                                      │
│ • Rechazo: [Editar]                                          │
│                                                             │
│ 🎨 Plantillas de Landing Page                               │
│ • Tech Modern: [Vista previa] [Editar]                      │
│ • Corporate: [Vista previa] [Editar]                        │
│ • Startup: [Vista previa] [Editar]                          │
│                                                             │
│ [Guardar Configuración] [Probar Conexiones]                 │
└─────────────────────────────────────────────────────────────┘
```

### Plantillas de Email

#### Invitación Personalizada
```
Asunto: Oportunidad en {empresa} - {puesto}

Hola {nombre},

Vimos tu perfil en LinkedIn y nos gustaría invitarte a considerar una oportunidad como {puesto} en {empresa}.

{descripción_personalizada}

¿Te interesaría conocer más detalles? Puedes aplicar directamente aquí:
{link_landing_page}

Saludos,
{nombre_recruiter}
{empresa}
```

#### Email de Seguimiento
```
Asunto: Seguimiento - {puesto} en {empresa}

Hola {nombre},

Te escribo para hacer seguimiento a mi mensaje anterior sobre la oportunidad de {puesto} en {empresa}.

¿Tienes alguna pregunta o te gustaría programar una llamada para conversar más sobre el rol?

Saludos,
{nombre_recruiter}
```

### Configuración de Compliance

```
┌─────────────────────────────────────────────────────────────┐
│                  Configuración de Compliance                 │
├─────────────────────────────────────────────────────────────┤
│ 📋 Aviso de Privacidad                                       │
│ • Texto del aviso: [Editar]                                 │
│ • URL de política completa: [https://empresa.com/privacy]   │
│                                                             │
│ ✅ Consentimiento                                            │
│ • Requerir consentimiento explícito: ☑ Sí                   │
│ • Texto del consentimiento: [Editar]                        │
│                                                             │
│ 🗂️ Retención de Datos                                        │
│ • Tiempo de retención: [12 meses]                           │
│ • Política de eliminación: [Automática]                     │
│                                                             │
│ 🌍 Regulaciones                                              │
│ • GDPR: ☑ Aplicable                                         │
│ • LOPD: ☑ Aplicable                                         │
│ • Regulaciones locales: [Especificar]                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Solución de Problemas

### Problemas Comunes

#### 1. Workflow no inicia
**Síntomas**: El workflow se queda en estado "Iniciado"
**Solución**:
1. Verificar configuración de APIs
2. Revisar logs del sistema
3. Contactar soporte técnico

#### 2. No se encuentran candidatos
**Síntomas**: Workflow completado pero 0 candidatos
**Solución**:
1. Revisar criterios de búsqueda
2. Verificar configuración de LinkedIn
3. Ajustar keywords de búsqueda

#### 3. Emails no se envían
**Síntomas**: Outreach creado pero emails no enviados
**Solución**:
1. Verificar API key de email
2. Revisar límites del proveedor
3. Comprobar configuración de remitente

#### 4. Landing page no funciona
**Síntomas**: Error 404 o página no carga
**Solución**:
1. Verificar configuración de dominio
2. Revisar plantilla seleccionada
3. Comprobar permisos de archivos

### Contacto de Soporte

- **Email**: recruiting-support@empresa.com
- **Chat**: Disponible en la aplicación
- **Teléfono**: +57 1 234 5678 (ext. 123)
- **Horarios**: Lunes a Viernes 8:00 AM - 6:00 PM

### Información para Reportes

Al contactar soporte, incluye:
- ID del workflow: `rec_empresa123_1703123456`
- Descripción del problema
- Pasos para reproducir
- Capturas de pantalla si aplica
- Logs de error si están disponibles

---

## Consejos y Mejores Prácticas

### Para Optimizar Resultados

1. **Keywords específicos**: Usa términos técnicos precisos
2. **Descripción clara**: Define bien el perfil buscado
3. **Mensaje personalizado**: Adapta el outreach al candidato
4. **Seguimiento oportuno**: Responde rápidamente a candidatos
5. **Evaluación consistente**: Usa los mismos criterios para todos

### Para Mejorar Engagement

1. **Emails personalizados**: Menciona experiencia específica
2. **Timing adecuado**: Envía en horarios laborales
3. **Call-to-action claro**: Incluye link directo a aplicación
4. **Seguimiento automático**: Configura secuencias de email
5. **Feedback rápido**: Responde en menos de 24 horas

### Para Reducir Costos

1. **Filtros precisos**: Define bien los requisitos
2. **Fuentes optimizadas**: Usa las que mejor funcionan
3. **Evaluación temprana**: Filtra candidatos antes del outreach
4. **Automatización**: Aprovecha las funciones automáticas
5. **Métricas**: Monitorea y optimiza continuamente 