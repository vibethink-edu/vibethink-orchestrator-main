# 🔄 ESTRATEGIA: Mock → CRM Real

> **Estado:** Planificación | **Fecha:** 2024-12-17  
> **Sistema Mock:** ✅ Implementado - Ver `docs/references/DASHBOARDS_MOCK_REFERENCE.md`

---

## 📌 RESUMEN

Migrar datos mock actuales a CRM funcional usando **patrón Adapter** sin romper UI existente.

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────┐
│          UI (Sin cambios)               │
├─────────────────────────────────────────┤
│          Service Layer (Hooks)          │
├───────────────┬─────────────────────────┤
│  MockAdapter  │    SupabaseAdapter      │
├───────────────┴─────────────────────────┤
│   Mock JSON   │   Supabase DB           │
└─────────────────────────────────────────┘
```

---

## 📋 FASES

### FASE 1: Preparación
- [ ] Crear `/services/adapters/`
- [ ] Definir interfaces TypeScript
- [ ] Refactorizar hooks para usar adapters

### FASE 2: Infraestructura
- [ ] Diseñar schema Supabase
- [ ] Implementar SupabaseAdapter
- [ ] Feature flags (`USE_REAL_CRM=true`)

### FASE 3: Migración
- [ ] CRM Dashboard
- [ ] Sales Dashboard
- [ ] AI Chat (persistir historial)

---

## 🎛️ FEATURE FLAGS

```env
# .env.local
USE_REAL_CRM=false       # Mock por defecto
USE_REAL_AI_STORAGE=false
```

---

## ⚠️ REGLAS

✅ Crear adapters sin modificar UI  
✅ Feature flags para switch gradual  
❌ NO modificar componentes de AI Chat existentes  
❌ NO migración big-bang  
❌ **NO mover archivos físicamente** - mantener estructura actual  
✅ **Usar metadata** (`dashboards-metadata.ts`) para identificar mock  
✅ **Mostrar badge visual** en dashboards mock  

---

## 💡 PREGUNTAS PENDIENTES

1. ¿Qué dashboards migrar primero?
2. ¿Mantener modo demo con mocks?
3. ¿AI Chat guarda historial en DB o localStorage?

---

**Timeline estimado:** 10-15 semanas para CRM completo
