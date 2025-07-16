
# REGLAS DE NEGOCIO: CAMBIO DE PLANES EMPRESARIALES

## 📋 RESUMEN EJECUTIVO

Este documento establece las reglas de negocio para el cambio de planes de suscripción empresarial, definiendo claramente qué cambios son permitidos automáticamente y cuáles requieren intervención manual.

## 🎯 PRINCIPIOS FUNDAMENTALES

### 1. Filosofía de Crecimiento
- **Solo se permiten upgrades automáticos** hacia planes superiores
- **Los downgrades requieren intervención manual** del equipo de soporte
- **Los cambios de plan son inmediatos** una vez aprobados

### 2. Protección al Cliente y Negocio
- Evitar pérdida de funcionalidades críticas por downgrades impulsivos
- Garantizar continuidad de servicio sin interrupciones técnicas
- Proteger ingresos recurrentes del negocio

## 🔄 MATRIZ DE CAMBIOS PERMITIDOS

### ✅ UPGRADES AUTOMÁTICOS PERMITIDOS

| Plan Actual | Upgrade Disponible | Costo Adicional | Efectividad |
|-------------|-------------------|------------------|-------------|
| STARTER ($29) | PROFESSIONAL ($99) | +$70/mes | Inmediato |
| STARTER ($29) | ENTERPRISE ($299) | +$270/mes | Inmediato |
| PROFESSIONAL ($99) | ENTERPRISE ($299) | +$200/mes | Inmediato |
| Cualquier Plan | CUSTOM (Variable) | Según cotización | Inmediato |

### ❌ DOWNGRADES BLOQUEADOS

| Cambio Solicitado | Razón del Bloqueo | Proceso Requerido |
|-------------------|-------------------|-------------------|
| ENTERPRISE → PROFESSIONAL | Exceso de storage/usuarios | Contactar soporte |
| ENTERPRISE → STARTER | Múltiples limitaciones | Contactar soporte |
| PROFESSIONAL → STARTER | Posible exceso de límites | Contactar soporte |
| CUSTOM → Cualquier otro | Configuración personalizada | Contactar soporte |

## 🚫 LIMITACIONES TÉCNICAS QUE IMPIDEN DOWNGRADES AUTOMÁTICOS

### 1. **Storage/Almacenamiento**
```
Enterprise: 100GB → Professional: 25GB
Si uso actual > 25GB → DOWNGRADE BLOQUEADO
```

### 2. **Usuarios Activos**
```
Enterprise: 100 usuarios → Professional: 25 usuarios
Si usuarios activos > 25 → DOWNGRADE BLOQUEADO
```

### 3. **Requests de IA Mensuales**
```
Enterprise: 50,000 → Professional: 10,000
Si consumo mensual > 10,000 → DOWNGRADE BLOQUEADO
```

### 4. **Páginas de Scraping**
```
Enterprise: 5,000 páginas → Professional: 1,000 páginas
Si uso mensual > 1,000 → DOWNGRADE BLOQUEADO
```

### 5. **Features Exclusivas**
```
Funcionalidades enterprise (SSO, API completa, white-label)
Una vez implementadas → DOWNGRADE COMPLEJO
```

## 💳 FACTURACIÓN Y COSTOS

### Upgrades Automáticos
- **Cobro inmediato** de la diferencia mensual
- **Prorrateado** según días restantes del período actual
- **Aplicación instantánea** de nuevos límites
- **Sin reembolsos** por cambios de decisión

### Ejemplo de Cálculo
```
Plan actual: PROFESSIONAL ($99/mes)
Nuevo plan: ENTERPRISE ($299/mes)
Días restantes: 15 de 30
Cálculo: ($299 - $99) × (15/30) = $100
Cobro inmediato: $100
```

## 🛡️ PROCESO DE DOWNGRADE MANUAL

### Requisitos para Solicitar Downgrade
1. **Ticket de soporte** con justificación empresarial
2. **Análisis técnico** del uso actual vs límites del nuevo plan
3. **Plan de migración** si excede límites técnicos
4. **Aprobación gerencial** para pérdida de funcionalidades

### Pasos del Proceso
1. **Evaluación técnica** (2-3 días hábiles)
2. **Propuesta de migración** (si es necesaria)
3. **Confirmación del cliente** de pérdida de funcionalidades
4. **Ejecución programada** del downgrade
5. **Verificación post-cambio**

### Posibles Resultados
- ✅ **Downgrade aprobado** - Sin conflictos técnicos
- ⚠️ **Downgrade condicionado** - Requiere migración de datos
- ❌ **Downgrade denegado** - Incompatibilidad técnica

## 🎨 EXPERIENCIA DE USUARIO

### En la Interfaz del Admin
```
┌─ Plan Actual: PROFESSIONAL ($99/mes) ──┐
│                                        │
│ 🔼 UPGRADES DISPONIBLES:               │
│ ✅ Enterprise ($299/mes) +$200         │
│ ✅ Custom Plan (Cotización)            │
│                                        │
│ 🔽 DOWNGRADES:                         │
│ ❌ "Contacta a soporte para asistencia" │
│                                        │
│ 📞 soporte@VibeThink.com                  │
│ 📱 +1-555-SUPPORT                      │
└────────────────────────────────────────┘
```

### Confirmación de Upgrade
```
⚠️ CONFIRMACIÓN DE UPGRADE
Plan actual: Professional ($99/mes)
Nuevo plan: Enterprise ($299/mes)

Se cobrará $200 adicionales inmediatamente
Los nuevos límites se aplicarán al instante:
• Usuarios: 25 → 100
• IA requests: 10,000 → 50,000/mes
• Scraping: 1,000 → 5,000 páginas/mes
• Storage: 25GB → 100GB

[ Confirmar Upgrade ] [ Cancelar ]
```

## 📊 MÉTRICAS DE CONTROL

### KPIs a Monitorear
- **Tasa de upgrade automático**: % de upgrades exitosos
- **Tickets de downgrade**: Volumen mensual de solicitudes
- **Tiempo de resolución**: Promedio para downgrades manuales
- **Tasa de satisfacción**: Post-cambio de plan

### Alertas Automáticas
- Usuario cerca del límite de su plan actual
- Intento de downgrade automático (para investigar por qué)
- Upgrade fallido por problemas de pago

## 🔧 IMPLEMENTACIÓN TÉCNICA

### Validaciones Pre-Upgrade
```typescript
interface UpgradeValidation {
  hasValidPaymentMethod: boolean;
  planExists: boolean;
  isUpgradeDirection: boolean;
  userHasPermission: boolean;
}
```

### Validaciones Pre-Downgrade
```typescript
interface DowngradeBlockers {
  exceedsStorage: boolean;
  exceedsUsers: boolean;
  exceedsMonthlyLimits: boolean;
  hasExclusiveFeatures: boolean;
}
```

## 📝 EXCEPCIONES AUTORIZADAS

### Casos Especiales para Downgrade Automático
1. **Nuevos clientes** (< 30 días) con uso mínimo
2. **Planes de prueba** a planes pagos inferiores
3. **Errores de facturación** confirmados por finanzas
4. **Autorizaciones ejecutivas** caso por caso

### Proceso de Excepción
1. Solicitud con código de autorización ejecutiva
2. Bypass temporal de validaciones técnicas
3. Monitoreo post-cambio de 48 horas
4. Informe de excepción para auditoría

## 🎯 OBJETIVOS COMERCIALES

### Metas del Sistema
- **Incrementar ARR** mediante upgrades fluidos
- **Reducir churn** evitando downgrades impulsivos
- **Mejorar experiencia** con cambios transparentes
- **Optimizar soporte** concentrando esfuerzo en casos complejos

### Métricas de Éxito
- 85% de cambios de plan son upgrades automáticos
- <2% de tickets de soporte por cambios de plan
- >95% de satisfacción en proceso de upgrade
- <24h tiempo promedio de resolución de downgrades

---

**Documento**: Plan Upgrade Business Rules v1.0  
**Autor**: Equipo de Producto  
**Fecha**: Enero 2025  
**Próxima revisión**: Trimestral  
**Aprobado por**: CEO, CTO, CFO
