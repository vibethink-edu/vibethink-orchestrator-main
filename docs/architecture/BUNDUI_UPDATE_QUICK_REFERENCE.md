# Referencia Rápida: Actualización de Bundui sin i18n

## 🎯 Problema

**Bundui se actualiza sin i18n** → ¿Cómo mantener VibeThink actualizado con i18n?

---

## ✅ Solución Recomendada: Estrategia Híbrida

### 1. **Freeze Strategy** (Base)
- Bundui se congela en versión actual
- Solo se actualiza manualmente si es crítico
- Nuevas features van directo a VibeThink

### 2. **Cherry-Pick** (Features Críticas)
- Solo migrar features específicas que necesitamos
- Migrar a VibeThink con i18n
- Ignorar el resto

### 3. **Version Tracking** (Documentación)
- Registrar versión actual de Bundui
- Documentar features migradas
- Mantener backlog de pendientes

---

## 📋 Proceso Rápido

### Cuando hay Nueva Versión de Bundui

```
1. ¿Es feature crítica? 
   → SÍ: Cherry-pick a VibeThink con i18n
   → NO: Registrar en tracking, revisar después

2. Migrar feature:
   - Crear namespace i18n
   - Extraer textos
   - Crear traducciones (en, es)
   - Migrar código
   - Probar

3. Documentar:
   - Versión de Bundui
   - Feature migrada
   - Estado i18n
```

---

## 🚨 Reglas Críticas

| Regla | Bundui | VibeThink |
|-------|--------|-----------|
| **Idioma** | Solo Inglés | Multidioma |
| **Actualización** | Manual, rara | Continuo |
| **i18n** | ❌ No | ✅ Obligatorio |
| **Nuevas Features** | Solo referencia | Con i18n desde inicio |

---

## 📊 Matriz de Decisión

| Escenario | Acción |
|-----------|--------|
| Feature crítica | Cherry-pick a VibeThink |
| Feature menor | Registrar, evaluar después |
| Bugfix crítico | Migrar a VibeThink |
| Sin necesidad | Freeze (no hacer nada) |

---

## 🔗 Referencias

- [Estrategia Completa](./BUNDUI_UPDATE_STRATEGY.md) - Todas las opciones detalladas
- [Tandem Bundui-VibeThink](./BUNDUI_VIBETHINK_TANDEM.md) - Comparación completa
- [Estrategia i18n](./I18N_STRATEGY.md) - Reglas de i18n

---

**Última actualización:** 2025-01-XX














