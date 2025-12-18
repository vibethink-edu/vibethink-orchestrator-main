# 🎯 Estrategia: Shadcn UI First

**Fecha:** 2024-12-17  
**Principio:** Shadcn UI como estándar, Bundui solo como extensión cuando sea necesario

---

## 📐 Principio Fundamental

> **Shadcn UI es el estándar. Bundui y otros son extensiones que se adaptan a Shadcn, no al revés.**

---

## 🏗️ Arquitectura Propuesta

```
┌─────────────────────────────────────────┐
│     Shadcn UI (Estándar Oficial)        │
│  - Componentes base                      │
│  - Patrones oficiales                    │
│  - API estándar                          │
└─────────────────────────────────────────┘
              │
              ├─ Extiende
              │
┌─────────────────────────────────────────┐
│     @vibethink/ui                       │
│  - 100% Shadcn compatible               │
│  - Extensiones VThink                   │
│  - Theme Customizer (extensión)         │
└─────────────────────────────────────────┘
              │
              ├─ Usa cuando necesario
              │
┌─────────────────────────────────────────┐
│     Bundui (Referencia/Inspiración)     │
│  - Solo para UX patterns                │
│  - NO copiar código directamente        │
│  - Adaptar a estándares Shadcn          │
└─────────────────────────────────────────┘
```

---

## ✅ Qué Mantener de Shadcn UI

### Componentes Base (100% Shadcn)
- ✅ Todos los componentes en `packages/ui/src/components/*.tsx`
- ✅ API idéntica a Shadcn UI v4
- ✅ Patrones oficiales (forwardRef, data-slot, etc.)

### Estándares a Seguir
1. **Naming:** Igual que Shadcn
2. **API:** Compatible 100%
3. **Props:** Mismas interfaces
4. **Styling:** Tailwind CSS 4 + OKLCH
5. **Patterns:** forwardRef, data-slot, etc.

---

## 🔄 Qué Adaptar de Bundui

### ✅ Permitido (como inspiración)
- **UX Patterns:** Layouts, flujos de usuario
- **Theme Customizer:** Concepto, pero implementado con Shadcn
- **Visual Design:** Colores, espaciado (pero usando variables Shadcn)

### ❌ NO Permitido
- Copiar código directamente de Bundui
- Usar APIs diferentes a Shadcn
- Crear componentes que dupliquen Shadcn
- Usar patrones no estándar

---

## 🎨 Theme Customizer: Caso Especial

**Estado:** Extensión válida, pero debe seguir estándares Shadcn

### ✅ Correcto
- Usa componentes Shadcn (Select, ToggleGroup, etc.)
- API compatible con Shadcn
- Estilos con variables CSS estándar

### ⚠️ Ajustar
- Asegurar que todos los selectores usen componentes Shadcn
- Validar que los atributos `data-theme-*` sigan convenciones
- Documentar como extensión, no como reemplazo

---

## 📋 Plan de Acción

### Fase 1: Consolidar Componentes Base ✅
- [x] Todos los componentes Shadcn en `@vibethink/ui`
- [x] API 100% compatible
- [x] Sin dependencias de Bundui en componentes base

### Fase 2: Revisar Extensiones 🔄
- [ ] Theme Customizer: Validar que use solo Shadcn
- [ ] Sidebar: Asegurar que siga Shadcn v4
- [ ] Layouts: Usar solo componentes Shadcn

### Fase 3: Limpiar Bundui Premium 🧹
- [ ] Evaluar qué componentes de `bundui-premium` realmente necesitamos
- [ ] Migrar a Shadcn o remover
- [ ] Documentar extensiones válidas

---

## 🎯 Regla de Oro

> **Si existe en Shadcn UI, úsalo. Si no existe, extiéndelo siguiendo los estándares de Shadcn.**

---

## 📚 Referencias

- **Shadcn UI v4:** `C:\IA Marcelo Labs\shadcn-ui\ui\apps\v4\`
- **Bundui (referencia):** `C:\IA Marcelo Labs\bundui\shadcn-ui-kit-dashboard\`
- **VThink UI:** `packages/ui/src/components/`

---

**Última actualización:** 2024-12-17



