# Estructura Mínima Obligatoria - [PROJECT_NAME]

## 📋 Propósito

Esta plantilla define la estructura mínima obligatoria que debe tener todo proyecto en `/docs/projects/` para cumplir con las convenciones de VThink 1.0 y CMMI-ML3.

## 🏗️ Estructura Obligatoria

```plaintext
[NombreProyecto]/
├── README.md                    # Descripción, propósito, estado
├── DECISION_LOG.md              # Registro de decisiones del proyecto
├── CHANGELOG.md                 # Historial de cambios relevantes
├── ROADMAP.md                   # Planificación y objetivos
├── architecture/                # Decisiones y diagramas arquitectónicos
│   ├── README.md               # Descripción de la arquitectura
│   ├── diagrams/               # Diagramas (Mermaid, PlantUML)
│   └── decisions/              # ADRs específicos del proyecto
├── api/                        # Documentación de APIs
│   ├── README.md               # Descripción general de APIs
│   ├── endpoints/              # Documentación por endpoint
│   └── examples/               # Ejemplos de uso
├── setup/                      # Guías de configuración e instalación
│   ├── README.md               # Guía general de setup
│   ├── environment.md          # Variables de entorno
│   ├── deployment.md           # Guías de despliegue
│   └── troubleshooting.md      # Solución de problemas
├── development/                # Patrones y guías de desarrollo
│   ├── README.md               # Patrones establecidos
│   ├── conventions.md          # Convenciones de código
│   ├── best-practices.md       # Mejores prácticas
│   └── workflows.md            # Flujos de trabajo
├── testing/                    # Estrategias y casos de prueba
│   ├── README.md               # Estrategia de testing
│   ├── unit-tests.md           # Guías de tests unitarios
│   ├── integration-tests.md    # Guías de tests de integración
│   └── e2e-tests.md            # Guías de tests E2E
├── operations/                 # Runbooks y procedimientos operativos
│   ├── README.md               # Procedimientos generales
│   ├── monitoring.md           # Guías de monitoreo
│   ├── backup.md               # Procedimientos de backup
│   └── incident-response.md    # Respuesta a incidentes
├── compliance/                 # Evidencia de cumplimiento
│   ├── README.md               # Estado de cumplimiento
│   ├── cmmi-evidence.md        # Evidencia CMMI-ML3
│   ├── security-audit.md       # Auditorías de seguridad
│   └── quality-metrics.md      # Métricas de calidad
├── templates/                  # Plantillas específicas del proyecto
│   ├── README.md               # Descripción de plantillas
│   ├── component-template.md   # Plantilla para componentes
│   └── api-template.md         # Plantilla para APIs
└── reports/                    # Reportes y métricas
    ├── README.md               # Descripción de reportes
    ├── performance.md          # Métricas de performance
    ├── quality.md              # Métricas de calidad
    └── security.md             # Reportes de seguridad
```

## 📋 Contenido Mínimo por Archivo

### README.md Principal
- **Descripción** del proyecto
- **Propósito** y objetivos
- **Estado actual** (desarrollo/producción/mantenimiento)
- **Tecnologías** principales
- **Equipo** responsable
- **Enlaces** a documentación relacionada

### DECISION_LOG.md
- **Registro** de decisiones arquitectónicas
- **Contexto** y alternativas consideradas
- **Justificación** de decisiones
- **Consecuencias** y trade-offs

### CHANGELOG.md
- **Historial** de cambios relevantes
- **Versiones** y fechas
- **Impacto** de cambios
- **Breaking changes**

### ROADMAP.md
- **Objetivos** a corto, mediano y largo plazo
- **Milestones** y fechas
- **Dependencias** y riesgos
- **Métricas** de éxito

## 🚦 Reglas de Implementación

### 1. Creación de Estructura
```bash
# Crear estructura base
mkdir -p [NombreProyecto]/{architecture,api,setup,development,testing,operations,compliance,templates,reports}

# Crear archivos obligatorios
touch [NombreProyecto]/README.md
touch [NombreProyecto]/DECISION_LOG.md
touch [NombreProyecto]/CHANGELOG.md
touch [NombreProyecto]/ROADMAP.md

# Crear README en cada subcarpeta
find [NombreProyecto] -type d -exec touch {}/README.md \;
```

### 2. Personalización
- **Adaptar** contenido según necesidades específicas
- **Mantener** formato y estructura estándar
- **Documentar** excepciones en `DECISION_LOG.md`

### 3. Validación
- **Verificar** que cumple estructura mínima
- **Revisar** alineación con VThink 1.0
- **Validar** cumplimiento CMMI-ML3

## 📊 Métricas de Cumplimiento

### Estructura
- **Carpetas obligatorias**: 100% presentes
- **Archivos obligatorios**: 100% presentes
- **README en subcarpetas**: 100% presentes

### Contenido
- **Documentación completa**: 90% mínimo
- **Actualización**: Últimos 30 días
- **Calidad**: Revisión aprobada

### Cumplimiento
- **VThink 1.0**: Alineación verificada
- **CMMI-ML3**: Evidencia presente
- **Seguridad**: Políticas documentadas

## 🔄 Proceso de Validación

### Checklist Obligatorio
- [ ] Estructura de carpetas completa
- [ ] Archivos obligatorios presentes
- [ ] README en cada subcarpeta
- [ ] Contenido mínimo completado
- [ ] Enlaces funcionando
- [ ] Cumplimiento VThink 1.0
- [ ] Evidencia CMMI-ML3

### Revisión Periódica
- **Semanal**: Verificar actualización de contenido
- **Mensual**: Revisar cumplimiento de estructura
- **Trimestral**: Evaluar calidad y completitud

## 🔗 Enlaces Relacionados

- **[Convenciones de Proyectos](../README.md)** - Reglas generales
- **[Plantillas](../templates/)** - Plantillas específicas
- **[VibeThink-Orchestrator](../VibeThink-Orchestrator/)** - Ejemplo completo
- **[Metodologías](../../methodologies/)** - VThink 1.0 y CMMI-ML3

---

**Última actualización**: [DD-MM-YYYY]  
**Responsable**: Equipo de Documentación  
**Cumplimiento**: VThink 1.0, CMMI-ML3 