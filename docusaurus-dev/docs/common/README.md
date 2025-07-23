# 📚 Recursos Comunes - Todos los Proyectos

Esta carpeta centraliza recursos, convenciones, plantillas y estándares que son aplicables a **todos los proyectos** del monorepo, siguiendo las metodologías VThink 1.0 y CMMI-ML3.

## 🎯 Propósito

- **Centralizar** convenciones y estándares globales
- **Evitar duplicidad** de recursos entre proyectos
- **Facilitar onboarding** de nuevos miembros y proyectos
- **Garantizar consistencia** en calidad y compliance
- **Acelerar** la creación de nuevos proyectos

## 📁 Estructura de Recursos Comunes

```plaintext
common/
├── README.md                    # Este archivo - Guía general
├── conventions.md               # Convenciones globales de nomenclatura, estructura, etc.
├── templates/                   # Plantillas reutilizables para todos los proyectos
├── onboarding.md                # Guía de onboarding para nuevos proyectos/miembros
├── governance.md                # Reglas de gobernanza y compliance
├── quality-checklist.md         # Checklist de calidad y revisión
├── workflows.md                 # Flujos de trabajo recomendados
├── standards.md                 # Estándares técnicos y de calidad
└── best-practices.md            # Mejores prácticas establecidas
```

## 🔄 Cómo Usar los Recursos Comunes

### Para Nuevos Proyectos
1. **Revisar** `conventions.md` antes de crear estructura
2. **Copiar** plantillas relevantes desde `templates/`
3. **Seguir** `quality-checklist.md` durante desarrollo
4. **Consultar** `best-practices.md` para decisiones técnicas

### Para Miembros del Equipo
1. **Leer** `onboarding.md` al integrarse al proyecto
2. **Familiarizarse** con `workflows.md` para procesos
3. **Revisar** `governance.md` para reglas de compliance
4. **Aplicar** `standards.md` en desarrollo diario

### Para Líderes de Proyecto
1. **Validar** cumplimiento con `quality-checklist.md`
2. **Revisar** alineación con `governance.md`
3. **Actualizar** recursos comunes según necesidades
4. **Documentar** excepciones en `conventions.md`

## 📋 Recursos Disponibles

### Convenciones Globales
- **Nomenclatura**: Estándares de nombres para archivos, carpetas, variables
- **Estructura**: Organización de carpetas y archivos
- **Documentación**: Formato y estilo de documentación
- **Commits**: Convenciones de mensajes y versionado

### Plantillas Reutilizables
- **README**: Plantilla base para proyectos
- **Decision Log**: Registro de decisiones arquitectónicas
- **Changelog**: Historial de cambios
- **Roadmap**: Planificación de proyectos
- **API Docs**: Documentación de APIs
- **Setup Guide**: Guías de configuración

### Estándares de Calidad
- **Testing**: Estrategias y cobertura mínima
- **Security**: Políticas y mejores prácticas
- **Performance**: Métricas y umbrales
- **Accessibility**: Estándares de accesibilidad
- **Compliance**: Evidencia CMMI-ML3

### Flujos de Trabajo
- **Development**: Proceso de desarrollo
- **Review**: Proceso de code review
- **Deployment**: Proceso de despliegue
- **Monitoring**: Monitoreo y observabilidad
- **Incident Response**: Respuesta a incidentes

## 🚦 Reglas de Uso

### Obligatorio
1. **Siempre consultar** recursos comunes antes de crear nuevos
2. **No duplicar** contenido que ya existe aquí
3. **Documentar excepciones** en el proyecto específico
4. **Proponer mejoras** a recursos comunes cuando sea necesario

### Recomendado
1. **Revisar mensualmente** si hay actualizaciones
2. **Contribuir** mejoras basadas en experiencia
3. **Validar** que los recursos siguen siendo relevantes
4. **Comunicar** cambios importantes al equipo

## 📊 Métricas de Uso

### Adopción
- **Proyectos que usan recursos comunes**: 100%
- **Miembros que conocen recursos**: 95%
- **Actualización de recursos**: Mensual

### Calidad
- **Cumplimiento de convenciones**: 90%
- **Uso de plantillas**: 85%
- **Aplicación de estándares**: 88%

## 🔗 Enlaces Relacionados

- **[Convenciones de Proyectos](../README.md)**: Reglas generales
- **[VibeThink-Orchestrator](../VibeThink-Orchestrator/)**: Ejemplo de implementación
- **[Metodologías](../../methodologies/)**: VThink 1.0 y CMMI-ML3
- **[Arquitectura](../../architecture/)**: Decisiones arquitectónicas globales

## 🔄 Actualización de Recursos

### Proceso de Mejora
1. **Identificar** necesidad de mejora o actualización
2. **Proponer** cambio con justificación
3. **Revisar** impacto en proyectos existentes
4. **Implementar** cambio con comunicación clara
5. **Validar** adopción en proyectos

### Responsabilidades
- **Mantenimiento**: Equipo de Documentación
- **Validación**: Tech Leads de proyectos
- **Aprobación**: Product Owners
- **Comunicación**: Equipo de Comunicación

---

**Última actualización**: 05-07-2025  
**Responsable**: Equipo de Documentación  
**Cumplimiento**: VThink 1.0, CMMI-ML3  
**Revisión**: Mensual 