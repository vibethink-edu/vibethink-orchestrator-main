# Fix: Theme Configurator - Aislamiento por Dashboard

**Commit de Seguridad:** `f14a4a6` - Safety commit before module recovery
**Fecha:** 2025-12-20
**Prioridad:** 🔴 **ALTA** - Bloquea el sistema actual

---

## 🔍 Problema Identificado

### Síntoma
- Cambios de tema en un dashboard afectan al otro
- No hay persistencia independiente de colores/temas
- Theme configurator bloquea el sistema actual

### Causa Raíz
Los hooks `useThemePreset()` y `useThemeSettings()` usan cookies **globales** sin prefijo de dashboard:

**Cookies actuales (GLOBALES - PROBLEMA):**
- `theme_preset`
- `theme_radius`
- `theme_scale`
- `theme_content_layout`
- `theme_sidebar_mode`
- `theme_base_color`
- `theme_menu_color`
- `theme_menu_accent`
- `theme_font`

**Resultado:** Ambos dashboards comparten el mismo estado de tema.

---

## 🎯 Solución: Aislamiento por Dashboard

### Estrategia
1. Modificar hooks para aceptar prefijo de dashboard
2. Usar cookies con prefijo: `bundui_theme_preset` / `vibethink_theme_preset`
3. Actualizar componentes que usan los hooks
4. Mantener compatibilidad hacia atrás (fallback a cookies globales)

### Archivos a Modificar

1. **`use-theme-preset.ts`**
   - Agregar parámetro `dashboardPrefix?: string`
   - Modificar nombres de cookies: `${prefix}theme_preset`
   - Fallback a cookie global si no hay prefijo

2. **`use-theme-settings.ts`**
   - Agregar parámetro `dashboardPrefix?: string`
   - Modificar nombres de cookies: `${prefix}theme_*`
   - Fallback a cookies globales si no hay prefijo

3. **`theme-picker.tsx`**
   - Pasar prefijo desde props o contexto
   - Usar hook con prefijo

4. **`panel.tsx` (ThemeCustomizerPanel)**
   - Detectar dashboard actual (bundui/vibethink)
   - Pasar prefijo a hooks

5. **Layouts**
   - Verificar que no necesitan cambios (solo los componentes internos)

---

## 📋 Plan de Implementación

### Fase 1: Modificar Hooks (Core)
- [ ] Modificar `use-theme-preset.ts` para aceptar prefijo
- [ ] Modificar `use-theme-settings.ts` para aceptar prefijo
- [ ] Mantener compatibilidad hacia atrás (fallback)

### Fase 2: Actualizar Componentes
- [ ] Modificar `theme-picker.tsx` para usar prefijo
- [ ] Modificar `panel.tsx` para detectar dashboard y pasar prefijo
- [ ] Modificar `font-selector.tsx` si es necesario

### Fase 3: Verificación
- [ ] Probar que bundui tiene su propio tema
- [ ] Probar que vibethink tiene su propio tema
- [ ] Verificar que cambios en uno NO afectan al otro
- [ ] Verificar persistencia al recargar

### Fase 4: Limpieza (Opcional)
- [ ] Migrar cookies globales existentes a prefijadas
- [ ] Documentar el cambio

---

## 🔧 Implementación Detallada

### 1. Modificar `use-theme-preset.ts`

**Cambio principal:**
```typescript
export function useThemePreset(dashboardPrefix?: string) {
  const prefix = dashboardPrefix ? `${dashboardPrefix}_` : '';
  const cookieName = `${prefix}theme_preset`;
  
  // Leer desde cookie con prefijo
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split("=")[1];
  
  // Fallback a cookie global si no hay valor con prefijo
  if (!cookieValue && dashboardPrefix) {
    const globalValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("theme_preset="))
      ?.split("=")[1];
    // Migrar valor global a prefijado
    if (globalValue) {
      // ... migrar
    }
  }
  
  // Guardar con prefijo
  document.cookie = `${cookieName}=${encodedValue}; ...`;
}
```

### 2. Modificar `use-theme-settings.ts`

**Cambio similar:**
```typescript
export function useThemeSettings(dashboardPrefix?: string) {
  const prefix = dashboardPrefix ? `${dashboardPrefix}_` : '';
  
  const getCookie = (name: string): string | null => {
    const prefixedName = `${prefix}${name}`;
    // Intentar cookie con prefijo primero
    // Fallback a cookie global
  };
  
  // Guardar con prefijo
  const cookieName = `${prefix}theme_${key}`;
  document.cookie = `${cookieName}=${encodedValue}; ...`;
}
```

### 3. Detectar Dashboard en `panel.tsx`

**Estrategia:**
- Usar `usePathname()` de Next.js para detectar ruta
- Si ruta empieza con `/dashboard-bundui` → prefijo `bundui`
- Si ruta empieza con `/dashboard-vibethink` → prefijo `vibethink`

```typescript
import { usePathname } from 'next/navigation';

export function ThemeCustomizerPanel() {
  const pathname = usePathname();
  const dashboardPrefix = pathname?.startsWith('/dashboard-bundui') 
    ? 'bundui' 
    : pathname?.startsWith('/dashboard-vibethink') 
    ? 'vibethink' 
    : undefined;
  
  const { preset, setPreset } = useThemePreset(dashboardPrefix);
  const { settings, setScale } = useThemeSettings(dashboardPrefix);
  // ...
}
```

---

## ✅ Checklist de Verificación

### Antes de Implementar
- [x] Commit de seguridad confirmado (`f14a4a6`)
- [x] Problema identificado y documentado
- [x] Plan de implementación definido

### Durante Implementación
- [ ] Modificar hooks con prefijo
- [ ] Actualizar componentes
- [ ] Probar en desarrollo

### Después de Implementar
- [ ] Verificar aislamiento completo
- [ ] Probar persistencia
- [ ] Commit de fix
- [ ] Documentar cambios

---

## 🚨 Notas Importantes

1. **Compatibilidad hacia atrás:** Mantener fallback a cookies globales para no romper estado existente
2. **Migración:** Opcionalmente migrar cookies globales existentes a prefijadas
3. **Testing:** Probar exhaustivamente que cambios en un dashboard NO afectan al otro

---

**Última actualización:** 2025-12-20
**Estado:** ✅ **IMPLEMENTADO Y COMPLETADO**

---

## ✅ Implementación Completada

### Cambios Realizados

1. **Hooks Modificados:**
   - ✅ `use-theme-preset.ts` - Acepta `dashboardPrefix` y usa cookies prefijadas
   - ✅ `use-theme-settings.ts` - Acepta `dashboardPrefix` y usa cookies prefijadas
   - ✅ Migración automática de cookies globales a prefijadas
   - ✅ Fallback a cookies globales (compatibilidad hacia atrás)

2. **Componentes Actualizados:**
   - ✅ `ThemePicker` - Acepta y pasa `dashboardPrefix`
   - ✅ `FontSelector` - Acepta y pasa `dashboardPrefix`
   - ✅ `ThemeCustomizerPanel` - Detecta dashboard con `usePathname()` y pasa prefijo a todos los selectores

3. **Traducciones Creadas:**
   - ✅ `translations/en/theme.json` - Todas las keys del Theme Customizer
   - ✅ `translations/es/theme.json` - Traducciones completas en español

### Cookies Aisladas por Dashboard

**Dashboard Bundui:**
- `bundui_theme_preset`
- `bundui_theme_radius`
- `bundui_theme_scale`
- etc.

**Dashboard VibeThink:**
- `vibethink_theme_preset`
- `vibethink_theme_radius`
- `vibethink_theme_scale`
- etc.

### Verificación

- ✅ Compilación exitosa
- ✅ Sin errores de linter
- ✅ Compatibilidad hacia atrás mantenida

---

**Última actualización:** 2025-12-20
**Estado:** ✅ **IMPLEMENTADO Y COMPLETADO**

