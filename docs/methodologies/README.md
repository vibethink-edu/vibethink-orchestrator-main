# 📚 Metodologías del Proyecto

Esta carpeta centraliza todas las metodologías, estándares y evidencia de compliance del proyecto AI Pair Orchestrator Pro.

## 🏗️ Estructura de Metodologías

```
methodologies/
├── CMMI3-ML3/              # CMMI Level 3 - Fuente oficial de compliance
├── VThink-1.0/             # VThink Methodology 1.0 - Metodología principal
├── vthink/                 # VThink (legacy)
└── README.md               # Este archivo
```

## 📋 Reglas de Organización

### Naming Convention
- **Siempre incluir versión** en el nombre del directorio
- **Ejemplos correctos**: `CMMI3-ML3`, `VThink`, `iso27001-2022`
- **❌ Evitar nombres genéricos** como `compliance` o `metodologia` sin estándar y versión

### Estructura Interna
- Cada metodología debe tener su propio `README.md` explicando:
  - Alcance y versión
  - Estructura interna
  - Reglas específicas
- Organización jerárquica por áreas, prácticas o procesos
- Evidencia independiente para cada metodología

### Principios Fundamentales
- **Nunca mezclar** evidencia de diferentes metodologías o versiones
- **Trazabilidad obligatoria** para auditoría
- **Separación clara** entre metodologías de desarrollo y compliance

## 🎯 Metodologías Implementadas

### 1. VThink Methodology 1.0
- **Propósito**: Metodología principal de desarrollo
- **Ubicación**: `VThink-1.0/`
- **Estado**: Activa y vigente

### 2. CMMI3-ML3
- **Propósito**: Estándar de calidad y compliance
- **Ubicación**: `CMMI3-ML3/`
- **Estado**: Fuente oficial de evidencia CMMI

## 🔄 Relación entre Metodologías

Un proyecto desarrollado bajo **VThink** puede tener asociadas una o más metodologías de calidad y compliance (CMMI, ISO, ITIL, etc.), cada una con su propio directorio, versión y evidencia independiente.

## 📞 Responsabilidad

- **Equipo de calidad y compliance**
- Consultar a los responsables de cada metodología antes de modificar estructura o contenido
- Mantener trazabilidad y evidencia actualizada

---

> **Nota**: Esta carpeta reemplaza la estructura anterior que incluía una subcarpeta `metodologias/` redundante. Las reglas de organización se han consolidado aquí para mayor claridad. 