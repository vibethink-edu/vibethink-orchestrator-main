# 🍽️ Prompt para Nuevo Chat: Conceptos Restaurant, Pub, Bar, etc.

**Para**: Nuevo chat de arquitectura
**Objetivo**: Diseñar e implementar conceptos adicionales al sistema multi-concepto

---

## 📋 PROMPT PARA COPIAR Y PEGAR:

```
Hola, necesito ayuda para diseñar e implementar nuevos conceptos en el sistema VibeThink Orchestrator.

CONTEXTO DEL PROYECTO:
- Proyecto: VibeThink Orchestrator (Next.js 15.3, React 19, TypeScript)
- Arquitectura: Multi-concepto con i18n AI-First
- Branch sugerido: Crear nuevo branch desde main
- Conceptos existentes: Hotel, Coworking, Coliving, Studio

OBJETIVO:
Diseñar e implementar los siguientes conceptos adicionales con la misma arquitectura que los existentes:

CONCEPTOS A IMPLEMENTAR:
1. 🍽️ Restaurant
   - Gestión de mesas y reservas
   - Menú digital
   - Órdenes y cocina
   - Sistema de propinas

2. 🍺 Pub / Bar
   - Gestión de inventario de bebidas
   - Sistema de cuenta abierta
   - Happy hour y promociones
   - Control de aforo

3. ☕ Café / Coffee Shop
   - Sistema de pedidos rápidos
   - Programa de fidelidad
   - Gestión de productos perecederos
   - Take-away y delivery

4. 🎭 Event Venue
   - Calendario de eventos
   - Venta de tickets
   - Gestión de espacios
   - Catering y servicios adicionales

ARQUITECTURA DE REFERENCIA:
- Leer: docs/architecture/I18N_AI_FIRST_COMPLETE_GUIDE.md
- Leer: docs/architecture/I18N_MULTI_DEPARTMENT_ARCHITECTURE.md
- Referencia: Conceptos existentes en apps/dashboard/app/dashboard-bundui/

REQUERIMIENTOS:
1. Cada concepto debe tener:
   - Namespace i18n propio (concept-restaurant.json, concept-pub.json, etc.)
   - Terminología específica del dominio
   - Componentes UI adaptados al negocio
   - Dashboard con métricas relevantes
   - Gestión de recursos específicos

2. Seguir arquitectura AI-First:
   - Capa Semántica (conceptos de negocio)
   - Motor de Terminología (traducciones contextuales)
   - Capa de UI (componentes)

3. Integración con sistema existente:
   - Usar packages/utils para lógica compartida
   - Seguir convenciones de i18n actuales
   - Mantener compatibilidad con multi-tenant

PLAN SUGERIDO:
1. Diseño arquitectónico de los 4 conceptos
2. Definir terminología y namespaces i18n
3. Crear estructura de archivos
4. Implementar concepto piloto (Restaurant)
5. Validar con usuario
6. Escalar a los demás conceptos

DOCUMENTOS DE REFERENCIA:
- docs/architecture/I18N_MULTI_DEPARTMENT_ARCHITECTURE.md
- docs/architecture/VITO_ARCHITECTURE_SPEC_UNIFIED.md
- apps/dashboard/app/dashboard-bundui/hotel/ (como referencia)
- apps/dashboard/src/lib/i18n/translations/en/concept-hotel.json (ejemplo)

¿Puedes ayudarme a diseñar la arquitectura y comenzar con el concepto Restaurant?
```

---

## 📊 INFORMACIÓN ADICIONAL:

### Conceptos existentes para usar como referencia:

1. **Hotel** (`concept-hotel.json`):
   - rooms, bookings, guests
   - housekeeping, maintenance
   - check-in/check-out

2. **Coworking** (`concept-cowork.json`):
   - desks, meeting rooms
   - memberships, plans
   - community, events

3. **Coliving** (`concept-coliving.json`):
   - rooms, common areas
   - residents, community
   - utilities, services

4. **Studio** (`concept-studio.json`):
   - equipment, bookings
   - projects, clients
   - sessions, rates

### Terminología sugerida para Restaurant:

```typescript
// concept-restaurant.json
{
  "tables": {
    "singular": "Table",
    "plural": "Tables",
    "available": "Available",
    "occupied": "Occupied",
    "reserved": "Reserved"
  },
  "menu": {
    "categories": "Menu Categories",
    "items": "Menu Items",
    "specials": "Today's Specials",
    "allergens": "Allergens"
  },
  "orders": {
    "new": "New Order",
    "pending": "Pending",
    "preparing": "In Kitchen",
    "ready": "Ready to Serve",
    "delivered": "Delivered"
  },
  "staff": {
    "waiter": "Waiter",
    "chef": "Chef",
    "host": "Host",
    "manager": "Manager"
  }
}
```

### Métricas sugeridas para Dashboard:

**Restaurant**:
- Ocupación de mesas (%)
- Tiempo promedio de servicio
- Ticket promedio
- Rotación de mesas/día
- Órdenes pendientes

**Pub/Bar**:
- Inventario de bebidas
- Ventas por hora (happy hour)
- Cuentas abiertas
- Consumo promedio/cliente

**Café**:
- Órdenes/hora
- Producto más vendido
- Tiempo promedio de preparación
- Clientes fidelidad

**Event Venue**:
- Eventos este mes
- Ocupación por espacio
- Revenue por evento
- Tickets vendidos

---

## 🎯 RESULTADO ESPERADO:

Al finalizar el nuevo chat:
1. ✅ Arquitectura completa de los 4 conceptos
2. ✅ Namespaces i18n definidos
3. ✅ Concepto piloto (Restaurant) implementado
4. ✅ Componentes UI creados
5. ✅ Dashboard funcional
6. ✅ Documentación actualizada
7. ✅ Plan para escalar a los demás conceptos

---

## 📁 ESTRUCTURA SUGERIDA:

```
apps/dashboard/app/dashboard-bundui/
  ├── restaurant/
  │   ├── page.tsx
  │   ├── components/
  │   │   ├── TablesGrid.tsx
  │   │   ├── MenuManager.tsx
  │   │   ├── OrdersQueue.tsx
  │   │   └── KitchenDisplay.tsx
  │   └── data.ts
  ├── pub/
  ├── cafe/
  └── event-venue/

apps/dashboard/src/lib/i18n/translations/en/
  ├── concept-restaurant.json
  ├── concept-pub.json
  ├── concept-cafe.json
  └── concept-event-venue.json
```

---

**Creado**: 2025-12-27
**Referencia**: Sesión de i18n completada
**Branch sugerido**: `feature/concepts-hospitality` o similar
