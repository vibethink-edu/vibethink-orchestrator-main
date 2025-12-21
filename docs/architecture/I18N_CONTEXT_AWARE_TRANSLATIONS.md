# Estrategia de Traducciones Sensibles al Contexto (Context-Aware)

**Fecha:** 2025-12-20  
**Estado:** ✅ OBLIGATORIO - Para módulos reutilizables  
**Propósito:** Manejar traducciones para módulos que se usan en múltiples contextos (Hotel, Studio, etc.)

---

## 🎯 Problema Identificado

**Caso de uso:** El módulo `booking` se usa en diferentes contextos:

### Contexto 1: Hotel
- "Reserva habitación"
- Tipos: "Premium", "De Lujo", "Estándar"
- Campos: "Número de habitación", "Check-in", "Check-out"

### Contexto 2: Estudio de Grabación
- "Reserva Sala 10"
- Tipos: "Tipo A", "Tipo B", "Sin instrumentos"
- Campos: "Número de sala", "Hora de inicio", "Hora de fin"

**Problema:** Los strings están hardcoded específicamente para Hotel, pero el módulo es reutilizable.

---

## 📊 Estrategias de Solución

### Opción 1: Namespaces Específicos por Contexto (Recomendado)

**Estructura:**
```json
{
  "hotel": {
    "booking": {
      "reserveLabel": "Reserva habitación",
      "roomType": {
        "premium": "Premium",
        "deluxe": "De Lujo",
        "standard": "Estándar"
      },
      "fields": {
        "roomNumber": "Número de habitación",
        "checkIn": "Check-in",
        "checkOut": "Check-out"
      }
    }
  },
  "studio": {
    "booking": {
      "reserveLabel": "Reserva Sala",
      "roomType": {
        "typeA": "Tipo A",
        "typeB": "Tipo B",
        "withoutInstruments": "Sin instrumentos"
      },
      "fields": {
        "roomNumber": "Número de sala",
        "startTime": "Hora de inicio",
        "endTime": "Hora de fin"
      }
    }
  }
}
```

**Ventajas:**
- ✅ Contexto claro y explícito
- ✅ No hay ambigüedad
- ✅ Fácil de mantener
- ✅ Cada contexto puede tener sus propias variaciones

**Desventajas:**
- ⚠️ Duplicación de estructura (pero con valores diferentes)
- ⚠️ Más archivos JSON

**Uso en código:**
```typescript
// En contexto Hotel
const { t } = useTranslation('hotel');
const reserveLabel = t('booking.reserveLabel'); // "Reserva habitación"
const roomType = t('booking.roomType.deluxe'); // "De Lujo"

// En contexto Studio
const { t } = useTranslation('studio');
const reserveLabel = t('booking.reserveLabel'); // "Reserva Sala"
const roomType = t('booking.roomType.withoutInstruments'); // "Sin instrumentos"
```

---

### Opción 2: Namespace Genérico con Parámetros

**Estructura:**
```json
{
  "booking": {
    "reserveLabel": "Reserva {{itemType}}",
    "itemNumber": "Número de {{itemType}}",
    "roomTypes": {
      "premium": "Premium",
      "deluxe": "De Lujo",
      "standard": "Estándar",
      "typeA": "Tipo A",
      "typeB": "Tipo B",
      "withoutInstruments": "Sin instrumentos"
    }
  }
}
```

**Ventajas:**
- ✅ Un solo namespace para todos los contextos
- ✅ Menos duplicación
- ✅ Fácil de compartir entre módulos

**Desventajas:**
- ⚠️ Parámetros pueden ser ambiguos
- ⚠️ Difícil manejar variaciones significativas entre contextos
- ⚠️ Los tipos de habitación/sala son completamente diferentes

**Uso en código:**
```typescript
const { t } = useTranslation('booking');
const reserveLabel = t('reserveLabel', { itemType: 'habitación' }); // "Reserva habitación"
const roomType = t('roomTypes.deluxe'); // "De Lujo"
```

---

### Opción 3: Sistema Híbrido (Recomendado para casos complejos)

**Estructura:**
```json
{
  "booking": {
    "common": {
      "actions": {
        "reserve": "Reservar",
        "cancel": "Cancelar",
        "confirm": "Confirmar"
      },
      "status": {
        "pending": "Pendiente",
        "confirmed": "Confirmado",
        "cancelled": "Cancelado"
      }
    }
  },
  "hotel": {
    "booking": {
      "context": {
        "itemType": "habitación",
        "itemLabel": "Habitación"
      },
      "roomTypes": {
        "premium": "Premium",
        "deluxe": "De Lujo",
        "standard": "Estándar"
      },
      "fields": {
        "itemNumber": "Número de habitación",
        "checkIn": "Check-in",
        "checkOut": "Check-out"
      }
    }
  },
  "studio": {
    "booking": {
      "context": {
        "itemType": "sala",
        "itemLabel": "Sala"
      },
      "roomTypes": {
        "typeA": "Tipo A",
        "typeB": "Tipo B",
        "withoutInstruments": "Sin instrumentos"
      },
      "fields": {
        "itemNumber": "Número de sala",
        "startTime": "Hora de inicio",
        "endTime": "Hora de fin"
      }
    }
    }
}
```

**Ventajas:**
- ✅ Comparte strings comunes (acciones, estados)
- ✅ Mantiene contexto específico separado
- ✅ Flexible para variaciones

**Desventajas:**
- ⚠️ Más complejo
- ⚠️ Requiere usar múltiples namespaces

**Uso en código:**
```typescript
// Strings comunes
const { t: tBooking } = useTranslation('booking');
const cancelLabel = tBooking('common.actions.cancel'); // "Cancelar"

// Strings específicos del contexto
const { t: tHotel } = useTranslation('hotel');
const reserveLabel = tHotel('booking.context.itemLabel'); // "Habitación"
const roomType = tHotel('booking.roomTypes.deluxe'); // "De Lujo"
```

---

## ✅ Estrategia Recomendada: Opción 1 (Namespaces Específicos)

**Razón:** Es la más clara, explícita y fácil de mantener. Cada contexto tiene su propio namespace completo.

### Estructura Recomendada

```json
{
  "hotel": {
    "booking": {
      "reserveLabel": "Reserva habitación",
      "itemLabel": "Habitación",
      "itemNumber": "Número de habitación",
      "roomTypes": {
        "premium": "Premium",
        "deluxe": "De Lujo",
        "standard": "Estándar"
      },
      "fields": {
        "checkIn": "Check-in",
        "checkOut": "Check-out"
      }
    }
  },
  "studio": {
    "booking": {
      "reserveLabel": "Reserva Sala",
      "itemLabel": "Sala",
      "itemNumber": "Número de sala",
      "roomTypes": {
        "typeA": "Tipo A",
        "typeB": "Tipo B",
        "withoutInstruments": "Sin instrumentos"
      },
      "fields": {
        "startTime": "Hora de inicio",
        "endTime": "Hora de fin"
      }
    }
  }
}
```

### Implementación en Código

**Componente reutilizable (BookingForm):**
```typescript
interface BookingFormProps {
  context: 'hotel' | 'studio';
  // ... otros props
}

export function BookingForm({ context, ...props }: BookingFormProps) {
  // Usar namespace según contexto
  const namespace = context === 'hotel' ? 'hotel' : 'studio';
  const { t } = useTranslation(namespace);
  
  return (
    <div>
      <h2>{t('booking.reserveLabel')}</h2>
      <label>{t('booking.itemNumber')}</label>
      <select>
        {roomTypes.map(type => (
          <option key={type} value={type}>
            {t(`booking.roomTypes.${type}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Uso:**
```typescript
// En módulo Hotel
<BookingForm context="hotel" />

// En módulo Studio
<BookingForm context="studio" />
```

---

## 📋 Checklist de Validación para Módulos Reutilizables

### Antes de Crear Traducciones

- [ ] **Identificar contexto(s) de uso:**
  - ¿En qué módulos se usa este componente?
  - ¿Los strings cambian según el contexto?
  
- [ ] **Clasificar strings:**
  - **Específicos del contexto:** Van al namespace del módulo (ej: `hotel.booking.*`)
  - **Genéricos:** Podrían ir a namespace compartido (si aplica)

- [ ] **Decidir estrategia:**
  - ¿Opción 1 (namespaces específicos)? → Recomendado
  - ¿Opción 2 (genérico con parámetros)? → Solo si las variaciones son mínimas
  - ¿Opción 3 (híbrido)? → Solo si hay muchos strings comunes

### Durante Implementación

- [ ] **Crear namespaces por contexto:**
  - `hotel.booking.*` para contexto Hotel
  - `studio.booking.*` para contexto Studio
  - (Agregar más según se necesite)

- [ ] **Componente recibe contexto:**
  - Prop `context` que determina qué namespace usar
  - O usar `useTranslation(contextNamespace)` dinámicamente

- [ ] **Validar en todos los contextos:**
  - Probar componente en contexto Hotel (ES/EN)
  - Probar componente en contexto Studio (ES/EN)
  - Verificar que strings correctos se muestran

---

## 🎓 Ejemplo Completo: Booking Component

### Estructura de Archivos

```
apps/dashboard/app/dashboard-bundui/
├── hotel/
│   └── components/
│       └── booking-form.tsx  → Usa namespace 'hotel'
└── studio/
    └── components/
        └── booking-form.tsx  → Usa namespace 'studio'

apps/dashboard/src/shared/components/
└── booking/
    └── booking-form-base.tsx  → Componente reutilizable que acepta 'context'
```

### Traducciones

**hotel.json:**
```json
{
  "hotel": {
    "booking": {
      "title": "Reserva habitación",
      "itemLabel": "Habitación",
      "itemNumber": "Número de habitación",
      "roomTypes": {
        "premium": "Premium",
        "deluxe": "De Lujo",
        "standard": "Estándar"
      },
      "fields": {
        "checkIn": "Check-in",
        "checkOut": "Check-out",
        "guestName": "Nombre del huésped"
      }
    }
  }
}
```

**studio.json:**
```json
{
  "studio": {
    "booking": {
      "title": "Reserva Sala",
      "itemLabel": "Sala",
      "itemNumber": "Número de sala",
      "roomTypes": {
        "typeA": "Tipo A",
        "typeB": "Tipo B",
        "withoutInstruments": "Sin instrumentos"
      },
      "fields": {
        "startTime": "Hora de inicio",
        "endTime": "Hora de fin",
        "clientName": "Nombre del cliente"
      }
    }
  }
}
```

### Código del Componente Base

```typescript
// booking-form-base.tsx
interface BookingFormBaseProps {
  context: 'hotel' | 'studio';
  roomTypes: string[];
  onSubmit: (data: BookingData) => void;
}

export function BookingFormBase({ context, roomTypes, onSubmit }: BookingFormBaseProps) {
  const { t } = useTranslation(context);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>{t('booking.title')}</h2>
      
      <label>{t('booking.itemNumber')}</label>
      <input name="itemNumber" />
      
      <label>{t('booking.fields.roomType')}</label>
      <select name="roomType">
        {roomTypes.map(type => (
          <option key={type} value={type}>
            {t(`booking.roomTypes.${type}`)}
          </option>
        ))}
      </select>
      
      {context === 'hotel' ? (
        <>
          <label>{t('booking.fields.checkIn')}</label>
          <input name="checkIn" type="date" />
        </>
      ) : (
        <>
          <label>{t('booking.fields.startTime')}</label>
          <input name="startTime" type="time" />
        </>
      )}
      
      <button type="submit">{t('booking.actions.confirm')}</button>
    </form>
  );
}
```

---

## 🚨 Reglas Críticas

### Regla 1: Contexto Explícito

**✅ CORRECTO:**
- Namespace específico por contexto
- Componente recibe `context` como prop
- Strings claros y específicos

**❌ INCORRECTO:**
- Strings hardcoded específicos del contexto
- Asumir un contexto único
- Mezclar contextos en un solo namespace

### Regla 2: Validar en Todos los Contextos

**✅ CORRECTO:**
- Probar componente en cada contexto
- Validar traducciones en ambos idiomas (EN/ES) para cada contexto
- Verificar que strings correctos se muestran

**❌ INCORRECTO:**
- Validar solo en un contexto
- Asumir que funciona en todos los contextos

### Regla 3: Documentar Contextos Soportados

**✅ CORRECTO:**
- Documentar qué contextos soporta el componente
- Listar namespaces requeridos
- Ejemplos de uso para cada contexto

**❌ INCORRECTO:**
- No documentar contextos
- Dejar que sea "obvio" del código

---

## 📚 Referencias

- **Protocolo i18n:** `docs/architecture/I18N_VALIDATION_DURING_IMPORT.md`
- **Component Namespace Strategy:** `docs/architecture/I18N_COMPONENT_NAMESPACE_STRATEGY.md`
- **Protocolo maestro:** `docs/architecture/MODULE_IMPORT_DEPLOYMENT_PROTOCOL.md`

---

## ✅ Estado del Protocolo

**Versión:** 1.0.0  
**Fecha:** 2025-12-20  
**Estado:** ✅ OBLIGATORIO para módulos reutilizables  

**Última actualización:** 2025-12-20  
**Aplicable a:** Módulos que se usan en múltiples contextos

---

**Este protocolo establece cómo manejar traducciones para módulos reutilizables que funcionan en diferentes contextos (Hotel, Studio, etc.).**

