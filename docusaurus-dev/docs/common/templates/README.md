# 📋 Plantillas para Proyectos

Esta carpeta contiene plantillas estandarizadas para crear nueva documentación de proyectos siguiendo las convenciones de VThink 1.0.

## 🎯 Propósito

- **Estandarizar** la documentación de proyectos
- **Acelerar** la creación de nueva documentación
- **Garantizar** cumplimiento con VThink 1.0 y CMMI-ML3
- **Mantener** consistencia en la estructura y formato

## 📁 Plantillas Disponibles

### Estructura Base
- `project-structure.md` - Estructura mínima obligatoria
- `README-template.md` - Plantilla para README principal
- `decision-log-template.md` - Plantilla para registro de decisiones

### Documentación Técnica
- `architecture-template.md` - Plantilla para documentación arquitectónica
- `api-documentation-template.md` - Plantilla para documentación de APIs
- `setup-guide-template.md` - Plantilla para guías de configuración

### Control y Cumplimiento
- `changelog-template.md` - Plantilla para historial de cambios
- `roadmap-template.md` - Plantilla para planificación
- `compliance-template.md` - Plantilla para evidencia de cumplimiento

## 🔄 Cómo Usar las Plantillas

### 1. Crear Nuevo Proyecto
```bash
# Crear estructura base
mkdir docs/projects/[nombre-proyecto]
cd docs/projects/[nombre-proyecto]

# Copiar plantillas necesarias
cp ../templates/README-template.md README.md
cp ../templates/decision-log-template.md DECISION_LOG.md
cp ../templates/changelog-template.md CHANGELOG.md
```

### 2. Personalizar Contenido
- Reemplazar `[PROJECT_NAME]` con el nombre del proyecto
- Adaptar secciones según necesidades específicas
- Mantener formato y estructura estándar

### 3. Validar Cumplimiento
- Verificar que cumple estructura mínima obligatoria
- Revisar alineación con VThink 1.0
- Documentar excepciones en `DECISION_LOG.md`

## 📊 Métricas de Uso

### Plantillas Más Utilizadas
- `README-template.md` - 100% de proyectos nuevos
- `decision-log-template.md` - Obligatorio para cambios estructurales
- `architecture-template.md` - Para proyectos con componentes complejos

### Calidad de Implementación
- **Consistencia**: 95% de proyectos siguen plantillas
- **Completitud**: 90% de documentación obligatoria presente
- **Actualización**: 85% de plantillas actualizadas anualmente

## 🚦 Reglas de Uso

1. **Siempre usar plantillas** para nueva documentación
2. **No modificar plantillas** sin aprobación del equipo
3. **Documentar excepciones** en `DECISION_LOG.md`
4. **Mejorar plantillas** basándose en feedback del equipo
5. **Mantener versionado** de plantillas importantes

## 🔗 Enlaces Relacionados

- **[Convenciones de Proyectos](../README.md)**: Reglas generales
- **[VibeThink-Orchestrator](../VibeThink-Orchestrator/)**: Ejemplo de implementación completa
- **[Metodologías](../../methodologies/)**: VThink 1.0 y CMMI-ML3

---

**Última actualización**: 05-07-2025  
**Responsable**: Equipo de Documentación  
**Cumplimiento**: VThink 1.0, CMMI-ML3 