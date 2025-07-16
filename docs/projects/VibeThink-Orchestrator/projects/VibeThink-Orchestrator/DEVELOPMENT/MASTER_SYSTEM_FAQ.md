# FAQ Maestro del Sistema AI Pair - Documentación Completa

## Visión General

FAQ maestro que integra todos los sistemas de la plataforma AI Pair: versionado inmutable, flujos universales, integración de reuniones, manejo de errores, y arquitectura paramétrica.

## 🏗️ **SISTEMAS PRINCIPALES**

### **1. Sistema de Versionado Inmutable**
- **Propósito**: Garantizar inmutabilidad de entidades críticas
- **Documentación**: `IMMUTABLE_VERSIONING_ARCHITECTURE.md`
- **FAQ**: `IMMUTABLE_VERSIONING_FAQ.md`

### **2. Sistema de Flujos Universales**
- **Propósito**: Diseñador visual de flujos de trabajo
- **Documentación**: `UNIVERSAL_FLOW_SYSTEM_FAQ.md`

### **3. Integración de Reuniones**
- **Propósito**: Grabación, transcripción y análisis de reuniones
- **Documentación**: `MEETING_INTEGRATION_FAQ.md`

### **4. Sistema de Manejo de Errores**
- **Propósito**: Detección, notificación y remediación de errores
- **Documentación**: `ERROR_HANDLING_SYSTEM_FAQ.md`

### **5. Arquitectura Paramétrica**
- **Propósito**: Sistema configurable por empresa sin hardcoding
- **Documentación**: `PARAMETRIC_ARCHITECTURE_GUIDELINES.md`

## 🚨 **REGLAS CRÍTICAS DEL SISTEMA**

### **Versionado Inmutable - NUNCA VIOLAR**

#### Q: ¿Qué entidades son inmutables?
**A:**
- **Flujos de trabajo**: `flow`
- **Parámetros de negocio**: `business_parameter`
- **Reglas de compliance**: `compliance_rule`
- **Configuraciones de seguridad**: `security_config`
- **Procesos financieros**: `financial_process`
- **Reglas legales**: `legal_rule` (PQRS, etc.)

#### Q: ¿Qué pasa si intento cambiar el tipo de versionado?
**A:**
- **BLOQUEO INMEDIATO**: El sistema bloquea la operación
- **LOG CRÍTICO**: Se registra el intento de cambio
- **ALERTA AUTOMÁTICA**: Se notifica a administradores
- **ERROR EXPLÍCITO**: Mensaje claro de por qué se bloqueó

#### Q: ¿Qué pasa si falla la auditoría?
**A:**
- **SHUTDOWN DE EMERGENCIA**: El sistema se detiene automáticamente
- **NOTIFICACIÓN INMEDIATA**: Todos los administradores son alertados
- **LOG CRÍTICO**: Se registra el fallo con detalles completos

### **Arquitectura Paramétrica - SIEMPRE RESPETAR**

#### Q: ¿Qué significa "arquitectura paramétrica"?
**A:** Es un sistema donde TODO es configurable por empresa sin hardcoding de valores específicos de país, empresa o jurisdicción.

#### Q: ¿Qué NO se puede hardcodear?
**A:**
- ❌ Nombres de países ("Colombia", "España")
- ❌ Monedas específicas ("COP", "EUR")
- ❌ Reglas legales específicas
- ❌ Configuraciones de empresa
- ❌ Valores de jurisdicción

#### Q: ¿Cómo se valida la arquitectura paramétrica?
**A:**
- **ESLint**: Reglas automáticas de validación
- **Pre-commit hooks**: Verificación antes de commits
- **GitHub Actions**: Validación automática en CI/CD
- **Code Review**: Revisión manual obligatoria

### **Flujos Universales - DISEÑO VISUAL**

#### Q: ¿Qué es el diseñador de flujos universales?
**A:** Es un canvas visual drag & drop para crear automatizaciones personalizables para diferentes industrias.

#### Q: ¿Qué tipos de nodos existen?
**A:**
- **Trigger Nodes**: Inician flujos automáticamente
- **Action Nodes**: Ejecutan acciones específicas
- **Condition Nodes**: Toman decisiones basadas en datos
- **Integration Nodes**: Conectan con APIs externas

#### Q: ¿Cómo se parametrizan los flujos?
**A:**
- **Por empresa**: Configuración específica por empresa
- **Por industria**: Plantillas predefinidas por sector
- **Por usuario**: Preferencias personalizadas
- **Por departamento**: Configuraciones por área

### **Integración de Reuniones - EXPERIENCIA NO INTRUSIVA**

#### Q: ¿Qué plataformas se integran?
**A:**
- **Google Meet**: Grabación y transcripción nativa
- **Microsoft Teams**: Grabación y transcripción nativa
- **Zoom**: Grabación y transcripción
- **Cal.com**: Programación de reuniones

#### Q: ¿Cómo funciona el licenciamiento?
**A:**
- **Licencias premium**: Solo para managers de departamento
- **Licencias básicas**: Para usuarios regulares
- **Configuración centralizada**: Manager controla grabaciones
- **Costo optimizado**: Solo pagas por lo que necesitas

#### Q: ¿Qué análisis se realizan automáticamente?
**A:**
- **Sentimiento**: Estado emocional de participantes
- **Participación**: Quién habló más tiempo
- **Temas**: Palabras clave y temas discutidos
- **Tareas**: Acciones pendientes identificadas

### **Manejo de Errores - DETECCIÓN INTELIGENTE**

#### Q: ¿Qué tipos de errores detecta el sistema?
**A:**
- **Fallos de API**: Google Calendar, Microsoft Teams, CRM
- **Fallos de Workflow**: Flujos incompletos o fallidos
- **Fallos de Integración**: Conexiones perdidas
- **Timeouts**: Operaciones que tardan demasiado

#### Q: ¿Cómo funciona la notificación de errores?
**A:**
- **Email automático**: A administradores y usuarios relevantes
- **Notificación en app**: Alertas dentro de la plataforma
- **Slack/SMS**: Para errores críticos
- **Escalación automática**: Si no se resuelve en tiempo

#### Q: ¿Qué acciones de remediación existen?
**A:**
- **Reintentos automáticos**: Con backoff exponencial
- **Acciones de fallback**: Métodos alternativos
- **Intervención manual**: Cuando la automatización falla
- **Caminos alternativos**: Flujos de respaldo

## 🔧 **INTEGRACIÓN ENTRE SISTEMAS**

### **Flujos + Versionado Inmutable**

#### Q: ¿Cómo se versionan los flujos?
**A:**
- **Creación**: Flujo se crea como inmutable
- **Ejecución**: Usa versión original congelada
- **Modificación**: Solo afecta nuevas ejecuciones
- **Auditoría**: Registra qué versión usó cada ejecución

#### Q: ¿Qué pasa si modifico un flujo en ejecución?
**A:**
- **NO AFECTA**: Las ejecuciones existentes mantienen su versión
- **NUEVAS EJECUCIONES**: Usan la versión actualizada
- **AUDITORÍA**: Registra el cambio para trazabilidad
- **ALERTA**: Notifica a administradores del cambio

### **Reuniones + Flujos**

#### Q: ¿Cómo se conectan las reuniones con flujos?
**A:**
- **Trigger automático**: Fin de reunión inicia flujo
- **Datos compartidos**: Transcripción y análisis disponibles
- **Tareas automáticas**: Generadas desde la reunión
- **Seguimiento**: Flujo maneja seguimiento post-reunión

#### Q: ¿Qué flujos se ejecutan después de una reunión?
**A:**
- **Crear tareas**: Basadas en transcripción
- **Programar seguimiento**: Próxima reunión
- **Enviar resumen**: Email con puntos clave
- **Actualizar CRM**: Con información de la reunión

### **Errores + Auditoría**

#### Q: ¿Cómo se auditan los errores?
**A:**
- **Log crítico**: Todos los errores se registran
- **Trazabilidad**: Qué causó el error y cuándo
- **Checksums**: Verificación de integridad
- **Reportes**: Análisis de patrones de errores

#### Q: ¿Qué pasa si falla el sistema de errores?
**A:**
- **Alerta crítica**: Notificación inmediata
- **Escalación**: Si no hay respuesta
- **Log de fallo**: Registro del problema
- **Recuperación**: Sistema de respaldo

## 📊 **CASOS DE USO INTEGRADOS**

### **Escenario 1: Reunión de Ventas Completa**

#### Proceso:
1. **Preparación**: Scraping automático de información del cliente
2. **Reunión**: Grabada y transcrita automáticamente
3. **Análisis**: Sentimiento y puntos clave identificados
4. **Flujo**: Se ejecuta automáticamente post-reunión
5. **Tareas**: Generadas automáticamente
6. **Seguimiento**: Programado automáticamente

#### Resultados:
- **CRM actualizado**: Con información de la reunión
- **Tareas creadas**: Acciones específicas asignadas
- **Resumen enviado**: Email con puntos clave
- **Auditoría completa**: Todo registrado y trazable

### **Escenario 2: PQRS con Compliance**

#### Proceso:
1. **Creación**: PQRS se crea con reglas inmutables
2. **Procesamiento**: Usa reglas originales durante todo el proceso
3. **Flujo**: Maneja el workflow de aprobación
4. **Auditoría**: Registra cada paso del proceso
5. **Cumplimiento**: Garantiza cumplimiento legal

#### Resultados:
- **Cumplimiento legal**: 100% trazabilidad
- **Auditoría automática**: Log de todas las decisiones
- **Protección legal**: Evita demandas por incumplimiento

### **Escenario 3: Error en Flujo Crítico**

#### Proceso:
1. **Detección**: Sistema detecta error automáticamente
2. **Notificación**: Alerta inmediata a administradores
3. **Remediación**: Intenta solucionar automáticamente
4. **Auditoría**: Registra todo el incidente
5. **Escalación**: Si no se resuelve en tiempo

#### Resultados:
- **Tiempo de resolución**: Reducido significativamente
- **Trazabilidad**: Sabemos exactamente qué falló
- **Prevención**: Patrones identificados para evitar futuros errores

## 🎯 **REGLAS DE DESARROLLO OBLIGATORIAS**

### **1. NUNCA VIOLAR INMUTABILIDAD**
```typescript
// ❌ INCORRECTO
if (skipValidation) {
  // Saltar validación
}

// ✅ CORRECTO
await VersioningValidationService.validateVersioningType(entityType);
```

### **2. NUNCA HARDCODEAR VALORES**
```typescript
// ❌ INCORRECTO
const country = "Colombia";
const currency = "COP";

// ✅ CORRECTO
const country = getCompanyConfig().country;
const currency = getCompanyConfig().currency;
```

### **3. SIEMPRE AUDITAR OPERACIONES CRÍTICAS**
```typescript
// ❌ INCORRECTO
await saveData(data);

// ✅ CORRECTO
await CriticalAuditService.logCriticalTransaction(
  'DATA_SAVE',
  'document',
  documentId,
  versionId,
  'save',
  data
);
```

### **4. SIEMPRE MANEJAR ERRORES**
```typescript
// ❌ INCORRECTO
const result = await riskyOperation();

// ✅ CORRECTO
try {
  const result = await riskyOperation();
} catch (error) {
  await ErrorHandlingService.handleError(error);
  throw error;
}
```

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### **Fase 1: Validaciones Críticas**
- [ ] Implementar validaciones de tipo inmutables
- [ ] Configurar ESLint para arquitectura paramétrica
- [ ] Bloquear cambios de tipo de versionado
- [ ] Log crítico de intentos de cambio

### **Fase 2: Auditoría Completa**
- [ ] Sistema de auditoría de transacciones
- [ ] Verificación de integridad con checksums
- [ ] Log de todas las operaciones críticas
- [ ] Backup automático de logs

### **Fase 3: Integración de Sistemas**
- [ ] Conectar flujos con versionado inmutable
- [ ] Integrar reuniones con flujos automáticos
- [ ] Conectar manejo de errores con auditoría
- [ ] Validar arquitectura paramétrica

### **Fase 4: Testing Exhaustivo**
- [ ] Testing de validaciones críticas
- [ ] Testing de auditoría bajo carga
- [ ] Testing de integración entre sistemas
- [ ] Testing de casos de fallo

## 🚀 **PRÓXIMOS PASOS**

1. **Revisar toda la documentación** con el equipo técnico
2. **Implementar validaciones críticas** en el código
3. **Configurar sistema de auditoría** obligatorio
4. **Desplegar monitoreo continuo** con alertas
5. **Testing exhaustivo** de todos los casos críticos
6. **Capacitación del equipo** en todas las reglas

---

## 📚 **DOCUMENTACIÓN RELACIONADA**

### **Arquitectura y Diseño:**
- `IMMUTABLE_VERSIONING_ARCHITECTURE.md` - Arquitectura de versionado inmutable
- `PARAMETRIC_ARCHITECTURE_GUIDELINES.md` - Guías de arquitectura paramétrica
- `UNIVERSAL_FLOW_SYSTEM_FAQ.md` - Sistema de flujos universales

### **Integración y Operaciones:**
- `MEETING_INTEGRATION_FAQ.md` - Integración de reuniones
- `ERROR_HANDLING_SYSTEM_FAQ.md` - Sistema de manejo de errores
- `AUTONOMOUS_CI_CD_SYSTEM.md` - Sistema de CI/CD autónomo

### **Compliance y Seguridad:**
- `GOVERNMENT_COMPLIANCE_GUIDE.md` - Guía de compliance gubernamental
- `CODING_STANDARDS.md` - Estándares de código
- `DEVELOPER_AGREEMENT_PARAMETRIC.md` - Acuerdo de desarrolladores

---

**NOTA CRÍTICA**: Esta documentación debe ser leída y entendida por TODOS los desarrolladores antes de trabajar en cualquier sistema de la plataforma. Cualquier violación de estas reglas puede resultar en pérdida de datos, incumplimiento legal o fallos del sistema.

## Principios Universales del Sistema

### Multicanalidad
Todo módulo, flujo o asistente IA debe poder operar en los canales preferidos de cada usuario o departamento (web, móvil, Teams, Slack, WhatsApp, email, etc.), garantizando una experiencia consistente y segura en todos los puntos de contacto.

### Enfoque Universal
La plataforma y sus asistentes IA están diseñados para ser aplicables a cualquier área o departamento de la organización, no solo IT. Esto permite que los mismos principios, flujos y automatizaciones se adapten a RRHH, Finanzas, Facilities, Comercial, etc., asegurando escalabilidad y coherencia organizacional.

## Universalidad y Scope en la Plataforma

La universalidad significa que todos los módulos, servicios y asistentes IA están diseñados para servir a cualquier actor de la plataforma (usuarios, agentes, jefes de área, administradores, superadministradores), pero siempre respetando el scope o ámbito de información y permisos de cada uno.

- Cada actor solo puede acceder, consultar o interactuar con información y agentes dentro de su ámbito autorizado.
- Los asistentes IA y las bases de datos vectoriales deben filtrar y limitar la información según el scope del usuario.
- El canal de interacción no altera el scope: la seguridad y el aislamiento de datos se mantienen en todo momento.
- Los permisos y roles determinan el alcance de la información y las acciones posibles para cada usuario.

**Ejemplos:**
- Un cliente de soporte solo puede ver y consultar tickets de su propia empresa.
- Un jefe de área puede ver todos los tickets y documentos de su departamento, pero no de otros.
- Un administrador de compañía puede interactuar con todos los agentes y datos de su empresa, pero no de otras.
- Un superadministrador tiene acceso global, pero debe quedar registrado y auditable.

**Justificación:**
Este principio garantiza la seguridad, privacidad y cumplimiento normativo, además de asegurar una experiencia personalizada y relevante para cada actor de la plataforma.

### Parametrización y Localización

La universalidad también implica que todos los módulos, servicios y flujos están diseñados para cubrir los casos típicos y generales de operación mediante definiciones y parametrización estándar. Sin embargo, la plataforma debe ser capaz de:

- Adaptar reglas, flujos y validaciones a las condiciones regulatorias, legales o de negocio de cada jurisdicción, país o industria.
- Permitir la personalización de parámetros, campos y procesos para ajustarse a necesidades particulares, sin perder la trazabilidad ni la coherencia con el modelo universal.
- Mantener una clara distinción entre lo que es estándar/universal y lo que es local/personalizado, facilitando el mantenimiento y la evolución del sistema.

**Ejemplos:**
- Un flujo de PQRS puede ser estándar para todos los países, pero en Colombia debe cumplir con la Ley 1755 y en México con la Ley Federal de Protección al Consumidor.
- Un campo "Tipo de documento" puede tener valores universales, pero permitir agregar opciones locales según la regulación de cada país.
- Los reportes de cumplimiento pueden tener una estructura base, pero incluir secciones específicas para normativas locales.

**Justificación:**
Esto garantiza que la plataforma sea global, escalable y adaptable, cumpliendo tanto con las mejores prácticas universales como con los requisitos particulares de cada contexto.

## Timeline Unificado y Enriquecimiento de Perfil

**Definición:**
Cada usuario/contacto tiene una identidad única y centralizada en la plataforma. Su historial (timeline) es persistente, transversal y se enriquece continuamente, sin importar los cambios de empresa, cargo o contexto. Este timeline integra eventos de vida, carrera, soporte, interacciones, preferencias y análisis de comportamiento.

**Diferenciación CRM vs CDP:**
- **CRM:** Identidad, relaciones, cargos, empresas, historial de soporte, eventos de vida y carrera.
- **CDP:** Actividades, preferencias, tendencias, engagement, análisis de comportamiento y sentimiento.

**Ejemplos:**
- Cambio de empresa o cargo, actualización de estado civil, graduación, eventos personales.
- Casos de soporte abiertos/cerrados, participación en proyectos.
- Enriquecimiento por scraping/CDM: nuevos cargos, estudios, visitas comerciales.
- Preferencias, tendencias, engagement y análisis de sentimiento (CDP).

**Justificación:**
Este modelo permite una visión 360° real del usuario, personalización extrema, analítica avanzada y una experiencia de usuario superior, convirtiéndose en uno de los valores más importantes y diferenciadores de la plataforma.

### Patrones Avanzados de Personalización y Adaptación de la Comunicación

**Caso de uso principal:**
El agente (humano o IA) revisa el historial de comunicaciones y el análisis de sentimiento/tendencias del usuario para adaptar el tono, canal y contenido de la respuesta, almacenando preferencias y aprendiendo de la retroalimentación.

**Patrones y posibilidades asociadas:**
- **Sugerencia/adaptación automática de tono:** El sistema analiza el tono preferido y ajusta la redacción de los mensajes (cordial, formal, empático, técnico, breve, etc.).
- **Personalización de canal y horario:** Detecta el canal y horario preferido del usuario y prioriza la comunicación por ese medio.
- **Proactividad y anticipación:** Envía actualizaciones o alertas antes de que el usuario lo solicite, especialmente si detecta frustración o eventos críticos recientes.
- **Segmentación y scoring:** Clasifica usuarios por satisfacción, engagement o riesgo, priorizando atención o asignando agentes especializados.
- **Sugerencias de contenido:** Recomienda artículos, respuestas o soluciones que han funcionado bien con ese usuario o perfil.
- **Automatización de encuestas y seguimiento:** Envía encuestas personalizadas según el historial y la respuesta previa del usuario.
- **Alertas para el agente:** Advierte sobre incidentes críticos, eventos personales o patrones de insatisfacción para ajustar la atención.
- **Integración con IA generativa:** Redacta respuestas personalizadas ajustando tono, longitud y nivel de detalle según el perfil y contexto emocional.
- **Reconocimiento de hitos y logros:** Felicita automáticamente al usuario por logros personales o profesionales detectados en el timeline.
- **Detección de cambios de comportamiento:** Si el usuario cambia su patrón de interacción (menos activo, más negativo), el sistema alerta para intervención proactiva.
- **Recomendaciones de productos/servicios:** Sugiere productos, servicios o upgrades alineados a los intereses y necesidades detectados en el timeline y CDP.
- **Gestión de crisis personalizadas:** Si el usuario atraviesa un evento difícil, el sistema ajusta la comunicación y prioriza la empatía.

**Ejemplo práctico:**
Usuario: Juan Pérez
- Prefiere WhatsApp, tono cordial y directo
- Última interacción: frustración por demora
- Evento personal reciente: duelo familiar
- Engagement alto en webinars técnicos

Respuesta sugerida:
- Canal: WhatsApp
- Tono: cordial, empático, directo
- Mensaje: "Hola Juan, entiendo lo importante que es para ti resolver esto rápido. Ya estamos trabajando en tu caso y te mantendré informado de cada avance. Si necesitas algo más, estoy aquí para ayudarte."

**Justificación:**
Estos patrones permiten una experiencia hiperpersonalizada, humana y eficiente, aumentando la satisfacción, la lealtad y la eficacia operativa.

## Timeline Transversal y Navegación Contextual

**Definición:**
El timeline es un eje transversal y universal en la plataforma. Cada entidad clave (empresa, departamento, empleado, cliente, caso, ticket, etc.) tiene su propio timeline, accesible desde la interfaz gráfica y vía API, permitiendo navegación jerárquica y contextual.

**Visualización gráfica:**
- Timeline siempre visible en la UI, con eventos agrupados por tipo (facturación, tareas, comunicaciones, soporte, etc.).
- Uso de colapsables, filtros y semáforos de colores para priorización y estado (verde: resuelto, amarillo: pendiente, rojo: crítico).
- Navegación jerárquica: empresa → departamentos → empleados → casos individuales.

**Interactividad y trazabilidad:**
- Cada evento es clickeable, mostrando detalles, historial y acciones posibles.
- Permite ver rápidamente si un evento fue atendido, está pendiente o requiere acción.

**Integración con APIs y agentes:**
- Endpoint sugerido: `/api/timeline/{entityType}/{entityId}`
- Los agentes (humanos o IA) pueden consultar el timeline para obtener el estado actualizado antes de responder o actuar.
- El timeline se actualiza automáticamente con cada interacción, documento recibido, tarea completada, etc.

**Ejemplo de uso:**
- Un agente visualiza el timeline de una empresa y ve facturación, tareas y tickets en un solo lugar, con semáforos de estado.
- Al revisar el timeline de un cliente, puede confirmar si realmente envió un documento o correo, sin buscar en múltiples sistemas.
- Navegación fluida desde empresa → departamento → empleado → caso, siempre con contexto y trazabilidad.

**Justificación:**
El timeline transversal proporciona visibilidad total, contexto inmediato, ahorro de tiempo, reducción de errores y una base sólida para analítica avanzada y automatización inteligente. Es un requerimiento fundamental y diferenciador de la plataforma.

### UI/UX Avanzada para Timelines Extensos

**Patrones recomendados:**
- **Colapsables por categoría o fecha:** Agrupa eventos por tipo (facturación, soporte, tareas, etc.) o periodo (mes, año), permitiendo expandir/colapsar cada grupo.
- **Paginación inteligente (scroll infinito):** Carga progresiva de eventos a medida que el usuario hace scroll, usando placeholders para una experiencia fluida.
- **Filtro avanzado y búsqueda:** Permite filtrar por tipo de evento, estado, responsable, o buscar palabras clave.
- **Anclaje rápido:** Saltar a fechas clave o eventos críticos.
- **Accesibilidad:** Navegación por teclado, ARIA labels, contraste adecuado.
- **Responsive:** Adaptación a dispositivos móviles.

**Tecnologías/librerías sugeridas:**
- React Virtualized, TanStack Virtual, react-window (renderizado eficiente)
- shadcn/ui Accordions o Collapsible (agrupación y colapsado)
- React Query/SWR (paginación y carga progresiva)

**Ejemplo de interacción:**
- El usuario abre el timeline de una empresa y ve colapsables por categoría.
- Expande "Soporte" y hace scroll: los primeros 20 eventos se cargan, al llegar al final se cargan 20 más.
- Puede buscar "documento enviado" y saltar al evento relevante.
- Todo es fluido, rápido y sin recargar la página.

**Justificación:**
Este patrón garantiza performance, usabilidad y escalabilidad, permitiendo timelines extensos sin afectar la experiencia del usuario.

## Presencia Uniforme del Agente de IA Contextual

**Definición:**
El agente de IA contextual debe estar siempre visible o accesible en todas las pantallas, módulos y flujos de la plataforma, con ubicación y diseño unificados. Su comportamiento se adapta al contexto de la pantalla o entidad activa.

**Patrones recomendados:**
- **Ubicación preferente:** Esquina inferior derecha (widget de chat), barra lateral fija o zona superior, según el layout.
- **Diseño coherente:** Iconografía, colores y animaciones uniformes en toda la plataforma.
- **Comportamiento contextual:** El agente IA adapta sus sugerencias y acciones según el módulo, entidad o flujo activo.
- **Accesibilidad:** Navegable por teclado, ARIA labels, soporte para lectores de pantalla, atajo de teclado universal.

**Ejemplo de interacción:**
- En el timeline de una empresa: el agente IA sugiere insights sobre facturación, tareas o tickets críticos.
- En el perfil de un empleado: ofrece resumen de desempeño o recomendaciones.
- En el Helpdesk: ayuda a redactar respuestas, sugiere artículos o automatiza tareas.

**Justificación:**
Consistencia, eficiencia y refuerzo de la identidad de la plataforma inteligente y centrada en el usuario.

**Tecnologías recomendadas:**
- Componente React global, inyectable en cualquier layout.
- Contexto global para pasar información relevante al agente IA.
- Soporte para multicanalidad y personalización visual por empresa si es necesario.

--- 