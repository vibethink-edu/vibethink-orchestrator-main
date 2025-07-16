# 📚 Documentación de Proyectos

Esta carpeta centraliza la documentación específica de cada proyecto del monorepo, siguiendo las convenciones establecidas en VThink 1.0.

## 🏗️ Estructura de Proyectos

```plaintext
docs/projects/
├── README.md                    # Este archivo - Guía y convenciones
├── common/                      # Recursos comunes a todos los proyectos
├── VibeThink-Orchestrator/      # Proyecto principal (estructura completa)
├── dev-tools/                   # Herramientas de desarrollo
├── dev-portal/                  # Portal de desarrollo interno
└── [otros-proyectos]/          # Futuros proyectos
```

## 📋 Convenciones Obligatorias

### Nomenclatura de Proyectos
- **Formato**: `kebab-case` (ej: `vibethink-orchestrator`)
- **Incluir versión** si aplica (ej: `project-name-v2`)
- **Descriptivo** y relacionado con el propósito del proyecto

### Estructura Mínima Obligatoria
Cada proyecto debe contener:

```plaintext
[NombreProyecto]/
├── README.md                    # Descripción, propósito, estado
├── architecture/                # Decisiones y diagramas arquitectónicos
├── api/                        # Documentación de APIs
├── setup/                      # Guías de configuración e instalación
├── development/                # Patrones y guías de desarrollo
├── testing/                    # Estrategias y casos de prueba
├── operations/                 # Runbooks y procedimientos operativos
├── compliance/                 # Evidencia de cumplimiento
├── templates/                  # Plantillas específicas del proyecto
└── reports/                    # Reportes y métricas
```

### Documentación Obligatoria

#### README.md Principal
- **Propósito** del proyecto
- **Estado actual** (desarrollo, producción, mantenimiento)
- **Tecnologías** principales utilizadas
- **Equipo** responsable
- **Enlaces** a documentación relacionada
- **Contacto** para consultas

#### Archivos de Control
- `DECISION_LOG.md` - Registro de decisiones del proyecto
- `CHANGELOG.md` - Historial de cambios relevantes
- `ROADMAP.md` - Planificación y objetivos

## 🎯 Categorías de Proyectos

### 1. Proyectos Principales
- **VibeThink-Orchestrator**: Plataforma principal
- **dev-tools**: Herramientas internas de desarrollo
- **dev-portal**: Portal de desarrollo interno

### 2. Proyectos Especializados
- **Integraciones**: APIs, servicios externos
- **Módulos**: Componentes reutilizables
- **Aplicaciones**: Apps independientes

### 3. Proyectos de Soporte
- **Documentación**: Guías y manuales
- **Testing**: Frameworks y estrategias
- **DevOps**: Automatización y despliegue

## 🔄 Flujo de Creación de Proyectos

### 1. Crear Estructura Base
```bash
mkdir docs/projects/[nombre-proyecto]
cd docs/projects/[nombre-proyecto]
```

### 2. Aplicar Plantillas
- Copiar plantillas desde `common/templates/`
- Adaptar a las necesidades específicas del proyecto
- Documentar excepciones en `DECISION_LOG.md`

### 3. Validar Cumplimiento
- Revisar estructura mínima obligatoria
- Verificar nomenclatura y convenciones
- Actualizar este README si es necesario

## 📊 Métricas de Calidad

### Documentación
- **Cobertura**: 100% de funcionalidades documentadas
- **Actualización**: Documentación sincronizada con código
- **Claridad**: Documentación comprensible para el equipo

### Cumplimiento
- **VThink 1.0**: Alineación con metodología
- **CMMI-ML3**: Evidencia de procesos
- **Seguridad**: Documentación de políticas y procedimientos

## 🚦 Reglas de Gobernanza

1. **Toda documentación** debe seguir las convenciones establecidas
2. **Cambios estructurales** deben registrarse en `DECISION_LOG.md`
3. **Plantillas** deben reutilizarse y mejorarse continuamente
4. **Responsabilidad colectiva** de mantener documentación actualizada
5. **Revisión periódica** de calidad y completitud

## 🔗 Enlaces Relacionados

- **[Recursos Comunes](./common/)**: Convenciones, plantillas y estándares globales
- **[VibeThink-Orchestrator](./VibeThink-Orchestrator/)**: Proyecto principal con estructura completa
- **[dev-tools](./dev-tools/)**: Herramientas de desarrollo
- **[dev-portal](./dev-portal/)**: Portal de desarrollo interno
- **[Metodologías](../methodologies/)**: VThink 1.0 y CMMI-ML3
- **[Arquitectura](../architecture/)**: Decisiones arquitectónicas globales

---

**Última actualización**: 05-07-2025  
**Responsable**: Equipo de Documentación  
**Cumplimiento**: VThink 1.0, CMMI-ML3 