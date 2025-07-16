# Cursor Documentation - VTK 1.0

## 📚 **Documentación para Developers que usan Cursor**

Esta carpeta contiene toda la documentación relacionada con el uso de Cursor IDE en el proyecto AI Pair Orchestrator Pro, siguiendo la metodología VTK 1.0.

---

## 📁 **Estructura de Documentación**

### **Guías Principales:**
- **[CURSOR_DEVELOPER_GUIDE.md](./CURSOR_DEVELOPER_GUIDE.md)** - Guía completa para developers
- **[CURSOR_QUICK_REFERENCE.md](./CURSOR_QUICK_REFERENCE.md)** - Referencia rápida con snippets
- **[CURSOR_REFACTORING_GUIDE.md](./CURSOR_REFACTORING_GUIDE.md)** - Guía de refactoring y mantenimiento

### **Explicaciones y FAQ:**
- **[CURSOR_RULES_EXPLANATION.md](./CURSOR_RULES_EXPLANATION.md)** - Explicación de cómo funcionan las reglas
- **[DEVELOPER_FAQ.md](./DEVELOPER_FAQ.md)** - Preguntas frecuentes de developers

---

## 🎯 **Organización VTK 1.0**

### **¿Por qué está aquí?**
Esta documentación está ubicada en `PROJECT/08_TOOLCHAIN_AND_SETUP/` porque:

- ✅ **Es específica del proyecto** - No es metodología universal
- ✅ **Es parte del toolchain** - Cursor es una herramienta de desarrollo
- ✅ **Sigue la estructura XTP** - Organización funcional por propósito
- ✅ **Está separada de la metodología** - No es parte de XTP_METHODOLOGY

### **Separación Metodología vs Proyecto:**
```
docs/
├── XTP_METHODOLOGY/           # 🧠 Metodología Universal
│   └── 01_PRINCIPLES/         # Principios XTP
├── PROJECT/                   # 🎯 Proyecto Específico
│   └── 08_TOOLCHAIN_AND_SETUP/ # Herramientas del proyecto
│       └── cursor-documentation/ # Documentación de Cursor
```

---

## 🚀 **Inicio Rápido**

### **Para nuevos developers:**
1. Lee **[CURSOR_QUICK_REFERENCE.md](./CURSOR_QUICK_REFERENCE.md)** (5 min)
2. Lee **[CURSOR_DEVELOPER_GUIDE.md](./CURSOR_DEVELOPER_GUIDE.md)** (15 min)
3. Consulta **[DEVELOPER_FAQ.md](./DEVELOPER_FAQ.md)** según necesites

### **Para refactoring:**
1. Lee **[CURSOR_REFACTORING_GUIDE.md](./CURSOR_REFACTORING_GUIDE.md)**
2. Usa los scripts de validación automática
3. Sigue el workflow recomendado

### **Para entender las reglas:**
1. Lee **[CURSOR_RULES_EXPLANATION.md](./CURSOR_RULES_EXPLANATION.md)**
2. Entiende por qué son agnósticas
3. Aprende cuándo actualizarlas

---

## 🔧 **Reglas Cursor Relacionadas**

### **Archivos de Reglas:**
- `.cursorrules` - Reglas principales del proyecto
- `.cursor/rules/` - Reglas especializadas
- `.cursor/snippets/` - Snippets de desarrollo

### **Validación:**
```bash
# Validar reglas Cursor
node scripts/validate-cursor-rules.js

# Validar estructura del proyecto
npm run validate:structure

# Validar imports
npm run validate:imports
```

---

## 📊 **Métricas de Documentación**

### **Cobertura:**
- ✅ **Guías completas** - Desarrollo, refactoring, FAQ
- ✅ **Explicaciones claras** - Cómo funcionan las reglas
- ✅ **Ejemplos prácticos** - Casos de uso reales
- ✅ **Workflows definidos** - Procesos paso a paso

### **Calidad:**
- ✅ **VTK 1.0 compliant** - Sigue metodología
- ✅ **Organización correcta** - En toolchain del proyecto
- ✅ **Separación clara** - Metodología vs proyecto específico
- ✅ **Fácil navegación** - Estructura lógica

---

## 🔄 **Mantenimiento**

### **Actualización de Documentación:**
- ✅ **Solo cuando cambien reglas** - No por refactoring menor
- ✅ **Seguir estructura XTP** - Mantener organización
- ✅ **Validar cambios** - Usar scripts de validación
- ✅ **Documentar decisiones** - Seguir protocolo de sesión

### **Contribución:**
- ✅ **Reportar inconsistencias** - Crear issues
- ✅ **Sugerir mejoras** - Proceso de mejora continua
- ✅ **Mantener calidad** - Seguir estándares XTP
- ✅ **Actualizar según necesidades** - Evolución del proyecto

---

## 📞 **Enlaces Relacionados**

### **Metodología XTP:**
- `docs/XTP_METHODOLOGY/` - Metodología universal
- `docs/XTP_METHODOLOGY/01_PRINCIPLES/` - Principios fundamentales
- `docs/XTP_METHODOLOGY/02_TEMPLATES/` - Templates reutilizables

### **Proyecto:**
- `docs/PROJECT/` - Documentación específica del proyecto
- `docs/PROJECT/03_DESIGN/` - Diseño y arquitectura
- `docs/PROJECT/05_VALIDATION/` - Testing y validación

### **Scripts:**
- `scripts/validate-cursor-rules.js` - Validación de reglas
- `scripts/update-cursor-rules.js` - Actualización automática
- `scripts/generate-refactor-report.js` - Reportes de refactoring

---

*Documentación organizada según estructura VTK 1.0 - Toolchain del proyecto* 