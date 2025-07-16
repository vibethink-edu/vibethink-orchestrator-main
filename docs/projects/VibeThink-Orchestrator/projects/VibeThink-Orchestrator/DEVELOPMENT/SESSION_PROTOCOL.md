# Protocolo de Inicio de Sesión - AI Pair Orchestrator Pro

## 🚀 **Protocolo Automático de Inicio**

### **OBLIGATORIO - Ejecutar al iniciar cada sesión:**

```typescript
// PROTOCOLO DE INICIO AUTOMÁTICO
const sessionInfo = {
  fecha: "DD-MM-YYYY",
  participante: "Nombre del participante",
  rol: "Rol en el proyecto",
  contexto: "Propósito de la sesión"
};

// VALIDACIÓN OBLIGATORIA
if (!sessionInfo.fecha || !sessionInfo.participante) {
  throw new Error("Información de sesión incompleta");
}
```

### **Preguntas Estándar de Inicio:**

1. **¿Cuál es la fecha actual?** (formato DD-MM-YYYY)
2. **¿Quién eres?** (nombre y rol en el proyecto)
3. **¿Cuál es el propósito de esta sesión?** (contexto general)

### **Documentación Automática:**

```markdown
# Session Log - [FECHA]

## Participantes
- **[NOMBRE]** ([ROL])
- **AI Assistant** (Cursor IDE)

## Contexto
[DESCRIPCIÓN DEL PROPÓSITO]

## Tareas Identificadas
[LISTA DE TAREAS]

## Decisiones Tomadas
[DECISIONES IMPORTANTES]

## Próximos Pasos
[ACCIONES A SEGUIR]

---
*Documentado por: AI Assistant*
*Fecha: [FECHA]*
*Estado: [EN PROGRESO/COMPLETADO]*
```

## 📋 **Reglas de Aplicación**

### **Antes de cualquier interacción técnica:**
- ✅ Confirmar fecha actual
- ✅ Identificar participante
- ✅ Establecer contexto
- ✅ Crear log de sesión

### **Durante la sesión:**
- ✅ Documentar decisiones importantes
- ✅ Registrar cambios de dirección
- ✅ Anotar tareas pendientes

### **Al finalizar:**
- ✅ Actualizar estado de tareas
- ✅ Documentar próximos pasos
- ✅ Guardar log en memoria del proyecto

## 🔧 **Implementación en Cursor Rules**

```json
{
  "sessionProtocol": {
    "enabled": true,
    "autoExecute": true,
    "requiredFields": ["fecha", "participante", "contexto"],
    "documentationPath": "memory-bank/essential/",
    "template": "session-log-template.md"
  }
}
```

## 📁 **Estructura de Archivos**

```
memory-bank/
├── essential/
│   ├── session-log-[YYYY-MM-DD].md
│   ├── session-log-template.md
│   └── session-index.md
└── specialized/
    └── [categorías específicas]
```

## ⚠️ **Validaciones**

- **Fecha:** Formato DD-MM-YYYY válido
- **Participante:** Nombre y rol obligatorios
- **Contexto:** Descripción mínima del propósito
- **Documentación:** Log creado antes de continuar

## 🎯 **Objetivos del Protocolo**

1. **Trazabilidad:** Seguimiento completo de todas las sesiones
2. **Responsabilidad:** Identificación clara de participantes
3. **Continuidad:** Contexto preservado entre sesiones
4. **Calidad:** Documentación consistente y completa
5. **Cumplimiento:** Seguimiento de estándares CMMI-ML3

---
*Protocolo creado: 26-06-2025*
*Responsable: Marcelo Developer*
*Estado: Activo* 