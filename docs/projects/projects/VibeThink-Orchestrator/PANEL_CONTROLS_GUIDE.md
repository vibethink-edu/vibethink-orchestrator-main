# 🎛️ Guía de Controles de Paneles Laterales

## Descripción General

La aplicación tiene un sistema de **3 paneles laterales colapsables**:

1. **Panel Izquierdo (Sidebar)** - Navegación principal
2. **Panel Derecho Regular** - Configuraciones y herramientas
3. **Panel Super Admin** - Funciones exclusivas de super administrador

---

## 📱 Controles de Paneles

### Controles en el Header
- **Botón PanelRight (🔄)** - Alterna el panel derecho regular
- **Botón Shield (🛡️)** - Alterna el panel de Super Admin (solo visible para SUPER_ADMIN)

### Controles Flotantes (Nuevo)
Se agregó un **panel de control flotante** en la esquina inferior derecha que permite:

- **Panel Derecho**: Botón para alternar/cerrar el panel derecho regular
- **Super Admin**: Botón rojo para alternar/cerrar el panel de Super Admin
- **Indicador de estado**: Muestra qué paneles están activos

---

## 🎯 Estados de los Paneles

### Estado Inicial
- ✅ **Sidebar izquierdo**: Visible (no colapsado)
- ✅ **Panel derecho regular**: Visible
- ❌ **Panel Super Admin**: Oculto

### Estados Posibles
```
┌─────────────────┬─────────────────┬─────────────────┐
│   Sidebar       │   Contenido     │   Panel Derecho │
│   (256px)       │   (Flexible)    │   (320px)       │
│                 │                 │                 │
│ ✅ Visible      │ ✅ Expandido    │ ✅ Visible      │
│ ❌ Colapsado    │ ❌ Reducido     │ ❌ Oculto       │
└─────────────────┴─────────────────┴─────────────────┘

┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   Sidebar       │   Contenido     │   Panel Derecho │   Super Admin   │
│   (256px)       │   (Flexible)    │   (320px)       │   (320px)       │
│                 │                 │                 │                 │
│ ✅ Visible      │ ✅ Expandido    │ ✅ Visible      │ ✅ Visible      │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

## 🔧 Cómo Usar los Controles

### 1. Panel Derecho Regular
```typescript
// En el header
<Button onClick={onToggleRightPanel}>
  <PanelRight className="w-4 h-4" />
</Button>

// En controles flotantes
<Button onClick={onToggleRightPanel}>
  <PanelRight className="w-4 h-4 mr-2" />
  Panel Derecho
</Button>
```

### 2. Panel Super Admin
```typescript
// En el header (solo para SUPER_ADMIN)
<Button onClick={onToggleSuperAdminPanel}>
  <Shield className="w-4 h-4" />
</Button>

// En controles flotantes (solo para SUPER_ADMIN)
<Button onClick={onToggleSuperAdminPanel} className="bg-red-600">
  <Shield className="w-4 h-4 mr-2" />
  Super Admin
</Button>
```

### 3. Sidebar Izquierdo
```typescript
// Botón de colapsar en el sidebar
<Button onClick={onToggleCollapse}>
  <Menu className="h-4 w-4" />
</Button>
```

---

## 🎨 Estilos y Clases CSS

### Panel Derecho
```css
.w-80                    /* Ancho fijo: 320px */
.border-l               /* Borde izquierdo */
.border-border          /* Color del borde */
.bg-card                /* Fondo del panel */
```

### Panel Super Admin
```css
.w-80                    /* Ancho fijo: 320px */
.border-l               /* Borde izquierdo */
.border-border          /* Color del borde */
.bg-card                /* Fondo del panel */
```

### Controles Flotantes
```css
.fixed.bottom-4.right-4 /* Posición fija */
.z-50                   /* Z-index alto */
.backdrop-blur-sm       /* Efecto de desenfoque */
```

---

## 🔍 Diagnóstico de Problemas

### Los paneles no se muestran
1. **Verificar estado inicial**:
   ```javascript
   console.log('DashboardLayout - Render states:', {
     showSuperAdminPanel,  // false por defecto
     showRightPanel,       // true por defecto
     isSuperAdmin,         // debe ser true para SUPER_ADMIN
     isMobile              // debe ser false en desktop
   });
   ```

2. **Verificar hooks**:
   ```javascript
   // useResponsiveLayout
   const { isMobile } = useResponsiveLayout();
   
   // useSuperAdmin
   const { isSuperAdmin } = useSuperAdmin();
   ```

3. **Verificar CSS**:
   - Los paneles usan `w-80` (320px de ancho)
   - Deben estar en un contenedor con `flex flex-shrink-0`

### Panel Super Admin no aparece
1. **Verificar credenciales**: `superadmin@VibeThink.co`
2. **Verificar hook useSuperAdmin**: Debe retornar `true`
3. **Verificar botón en header**: Solo visible para SUPER_ADMIN

---

## 📝 Comandos de Prueba

### Script de diagnóstico
```bash
node scripts/debug-panels.js
```

### Verificar en el navegador
1. Abrir DevTools (F12)
2. Ir a Console
3. Buscar logs de "DashboardLayout - Render states"
4. Verificar elementos con clase "w-80"

---

## 🚀 Próximas Mejoras

- [ ] Persistencia del estado de paneles en localStorage
- [ ] Animaciones suaves de transición
- [ ] Resize handles para ajustar ancho de paneles
- [ ] Atajos de teclado para alternar paneles
- [ ] Modo de pantalla completa para contenido principal 