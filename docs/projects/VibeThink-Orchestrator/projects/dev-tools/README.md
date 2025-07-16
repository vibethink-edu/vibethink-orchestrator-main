# dev-tools

> **Nota:** Esta documentación cubre únicamente aspectos adicionales o específicos de `dev-tools`. La arquitectura general y los principios base son heredados de la arquitectura global de VibeThink Orchestrator. Consulta la documentación general para entender el contexto completo.

## Descripción

`dev-tools` es un conjunto de herramientas internas diseñadas para facilitar y automatizar tareas comunes del ciclo de vida de desarrollo, pruebas y despliegue en el ecosistema VibeThink Orchestrator.

## Objetivos
- Automatizar tareas repetitivas y propensas a error.
- Proveer utilidades para testing, generación de código, migraciones y análisis estático.
- Mejorar la productividad y calidad del desarrollo.

## Estructura
- Scripts de automatización
- Herramientas de generación de código
- Utilidades de testing y cobertura
- Integraciones con sistemas de CI/CD

## Ejemplo de uso
```bash
# Ejecutar un script de automatización
bash scripts/maintenance/update-dependencies.sh

# Generar un nuevo componente
bash scripts/generators/create-component.sh MiComponente
```

## Responsables
- Equipo de desarrollo interno

## Enlaces relevantes
- [Código fuente de dev-tools](../../../dev-tools)
- [Ficha de proyecto en projects](../../../projects/dev-tools.md)
- [Arquitectura general de VibeThink Orchestrator](../VibeThink-Orchestrator/README.md) 