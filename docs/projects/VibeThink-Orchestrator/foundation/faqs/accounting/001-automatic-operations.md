# FAQ: 001-Operaciones Automáticas del Agente Contable

## 🎯 **PREGUNTA PRINCIPAL**
**P:** ¿Qué operaciones hace automáticamente el Agente Auxiliar Contable?

**A:** El agente contable automatiza **80% de las tareas operativas** que son claras, estándar y no requieren juicio profesional complejo.

## 📋 **DETALLES TÉCNICOS**
### Alcance
- ✅ **Recepción de facturas** por email y extracción automática
- ✅ **Almacenamiento** en Drive con organización por fecha
- ✅ **Contabilización** de facturas simples con IVA estándar (19%)
- ✅ **Procesamiento** de gastos estándar y recibos básicos
- ✅ **Creación** de asientos de nómina estándar
- ✅ **Organización** automática de documentos por tipo y fecha
- ✅ **Creación** de tareas y recordatorios automáticos
- ✅ **Notificaciones** sobre el estado de las operaciones
- ❌ **NO procesa** facturas con descuentos complejos
- ❌ **NO maneja** transacciones con reglas fiscales no claras
- ❌ **NO hace** correcciones de asientos contables
- ❌ **NO toma** decisiones sobre clasificación compleja

### Ejemplos Prácticos
```typescript
// Ejemplo 1: Factura simple automática
const facturaSimple = {
  tipo: 'factura_estandar',
  iva: 0.19,
  monto: 1000000,
  proveedor: 'Proveedor conocido',
  resultado: {
    status: 'PROCESADO_AUTOMATICAMENTE',
    asientoContable: 'Creado automáticamente',
    tarea: 'Creada para seguimiento',
    tiempoAhorrado: '5 minutos'
  }
};

// Ejemplo 2: Gasto estándar
const gastoEstandar = {
  tipo: 'gasto_estandar',
  categoria: 'Servicios públicos',
  monto: 500000,
  resultado: {
    status: 'PROCESADO_AUTOMATICAMENTE',
    clasificacion: 'Gastos operacionales',
    asiento: 'Creado automáticamente',
    tiempoAhorrado: '3 minutos'
  }
};
```

### Casos de Uso
- **Caso A**: Factura de servicios con IVA 19% → Procesamiento automático completo
- **Caso B**: Recibo de servicios públicos → Clasificación y contabilización automática
- **Caso C**: Nómina básica → Creación automática de asientos
- **Caso D**: Organización de documentos → Clasificación automática por fecha y tipo

## 🔗 **RELACIONADAS**
- [FAQ: 002-Operaciones Manuales](002-manual-operations.md)
- [FAQ: 003-Detección de Incertidumbre](003-uncertainty-detection.md)
- [FAQ: 004-Integraciones Contables](004-integrations.md)
- [Documento: Arquitectura del Agente Contable](../../../features/ACCOUNTING_ASSISTANT_ARCHITECTURE.md)

## 📊 **MÉTRICAS**
- **Alcance**: 80% de operaciones automáticas
- **Confianza**: 95% en casos estándar
- **Tiempo**: 5-10 minutos ahorrados por factura
- **Productividad**: 70% de mejora en procesamiento
- **Errores**: 90% de reducción en operaciones estándar
- **Volumen**: Hasta 100 facturas diarias por empresa 