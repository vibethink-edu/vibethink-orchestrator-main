# 🔧 Extensiones BundUI Premium - VibeThink Orchestrator

## 📋 Resumen

Este documento registra las **extensiones personalizadas** que hemos agregado al design system **BundUI Premium** para satisfacer las necesidades específicas de VibeThink Orchestrator. Estas extensiones **NO vienen originalmente** en BundUI Premium y fueron desarrolladas por nuestro equipo.

---

## 🎯 **Propósito de esta Documentación**

### **Para Upgrades Futuros:**
- **Identificar** qué componentes son nuestros vs originales
- **Preservar** nuestras extensiones durante upgrades
- **Migrar** correctamente cuando BundUI Premium agregue funcionalidades similares
- **Mantener** compatibilidad y funcionalidad

### **Para el Equipo:**
- **Conocer** qué componentes podemos modificar libremente
- **Entender** qué depende de BundUI Premium
- **Planificar** migraciones cuando sea necesario

---

## 🏗️ **Arquitectura de Extensiones**

### **Estructura de Archivos**
```
bundui/
├── src/
│   ├── components/
│   │   ├── BunduiButton.tsx          # ✅ ORIGINAL Premium
│   │   ├── BunduiInput.tsx           # ✅ ORIGINAL Premium
│   │   ├── BunduiCard.tsx            # ✅ ORIGINAL Premium
│   │   ├── BunduiDialog.tsx          # ✅ ORIGINAL Premium
│   │   ├── BunduiLanguageSwitcher.tsx # 🔧 NUESTRA EXTENSIÓN
│   │   └── ui/
│   │       ├── button.tsx            # ✅ ORIGINAL Premium
│   │       └── dropdown-menu.tsx     # 🔧 NUESTRA EXTENSIÓN
│   └── index.ts                      # 🔧 EXTENDIDO por nosotros
```

---

## 🔧 **Extensiones Desarrolladas por Nosotros**

### **1. BunduiLanguageSwitcher**
- **Archivo:** `bundui/src/components/BunduiLanguageSwitcher.tsx`
- **Propósito:** Selector de idioma con soporte multiidioma
- **Características:**
  - Dropdown con banderas de países
  - Soporte para múltiples idiomas
  - Indicador visual del idioma actual
  - Responsive design
  - Configuración flexible

```typescript
// Ejemplo de uso
<BunduiLanguageSwitcher
  languages={[
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]}
  currentLanguage="es"
  onLanguageChange={(lang) => i18n.changeLanguage(lang)}
/>
```

### **2. DropdownMenu UI Component**
- **Archivo:** `bundui/src/components/ui/dropdown-menu.tsx`
- **Propósito:** Componente base para dropdowns (usado por LanguageSwitcher)
- **Dependencias:** `@radix-ui/react-dropdown-menu`
- **Características:**
  - Accesibilidad completa
  - Animaciones suaves
  - Soporte para submenús
  - Checkbox y radio items

### **3. Extensiones al index.ts**
- **Archivo:** `bundui/src/index.ts`
- **Cambios realizados:**
  ```typescript
  // ✅ ORIGINAL - No modificar
  export { BunduiButton, buttonVariants } from './components/BunduiButton';
  export { BunduiInput } from './components/BunduiInput';
  export { BunduiCard, ... } from './components/BunduiCard';
  export { BunduiDialog, ... } from './components/BunduiDialog';
  
  // 🔧 NUESTRA EXTENSIÓN - Cuidado en upgrades
  export { BunduiLanguageSwitcher } from './components/BunduiLanguageSwitcher';
  export type { BunduiLanguageSwitcherProps } from './components/BunduiLanguageSwitcher';
  ```

---

## ✅ **Componentes Originales de BundUI Premium**

### **Componentes Base (NO MODIFICAR)**
- `BunduiButton` - Botones con variantes
- `BunduiInput` - Campos de entrada
- `BunduiCard` - Tarjetas y contenedores
- `BunduiDialog` - Modales y diálogos
- `BunduiThemeProvider` - Proveedor de temas

### **Hooks Originales (NO MODIFICAR)**
- `useSidebar` - Hook para sidebar
- `useToast` - Hook para notificaciones
- `useLocalStorage` - Hook para localStorage

### **Utilidades Originales (NO MODIFICAR)**
- `cn` - Función de clases CSS
- `formatDate` - Formateo de fechas
- `validateEmail` - Validación de email
- `generateId` - Generación de IDs

---

## 🚨 **Reglas de Migración para Upgrades**

### **1. Antes de un Upgrade de BundUI Premium**

#### **Checklist de Preparación:**
- [ ] **Backup** de todas nuestras extensiones
- [ ] **Documentar** versiones actuales de dependencias
- [ ] **Probar** en ambiente de desarrollo
- [ ] **Verificar** compatibilidad con nuestras extensiones

#### **Archivos a Preservar:**
```bash
# Nuestras extensiones - NO SOBRESCRIBIR
bundui/src/components/BunduiLanguageSwitcher.tsx
bundui/src/components/ui/dropdown-menu.tsx

# Archivos modificados - CUIDADO
bundui/src/index.ts
```

### **2. Durante el Upgrade**

#### **Proceso Seguro:**
```bash
# 1. Backup de extensiones
cp bundui/src/components/BunduiLanguageSwitcher.tsx backup/
cp bundui/src/components/ui/dropdown-menu.tsx backup/

# 2. Upgrade de BundUI Premium
npm update @bundui/premium

# 3. Restaurar extensiones
cp backup/BunduiLanguageSwitcher.tsx bundui/src/components/
cp backup/dropdown-menu.tsx bundui/src/components/ui/

# 4. Verificar index.ts
# Re-aplicar nuestras exportaciones si es necesario
```

### **3. Después del Upgrade**

#### **Verificaciones Post-Upgrade:**
- [ ] **Componentes originales** funcionan correctamente
- [ ] **Nuestras extensiones** siguen funcionando
- [ ] **No hay conflictos** de dependencias
- [ ] **Testing completo** de funcionalidad

---

## 📊 **Matriz de Responsabilidad**

| Componente | Origen | Responsable | Modificable |
|------------|--------|-------------|-------------|
| `BunduiButton` | BundUI Premium | BundUI Team | ❌ NO |
| `BunduiInput` | BundUI Premium | BundUI Team | ❌ NO |
| `BunduiCard` | BundUI Premium | BundUI Team | ❌ NO |
| `BunduiDialog` | BundUI Premium | BundUI Team | ❌ NO |
| `BunduiLanguageSwitcher` | **Nuestra Extensión** | VibeThink Team | ✅ SÍ |
| `dropdown-menu.tsx` | **Nuestra Extensión** | VibeThink Team | ✅ SÍ |

---

## 🔄 **Proceso de Migración Automatizado**

### **Script de Backup (Pre-Upgrade)**
```bash
#!/bin/bash
# backup-bundui-extensions.sh

echo "🔄 Backup de extensiones BundUI..."

# Crear directorio de backup
mkdir -p bundui-backup/$(date +%Y%m%d)

# Backup de nuestras extensiones
cp bundui/src/components/BunduiLanguageSwitcher.tsx bundui-backup/$(date +%Y%m%d)/
cp bundui/src/components/ui/dropdown-menu.tsx bundui-backup/$(date +%Y%m%d)/

# Backup del index.ts modificado
cp bundui/src/index.ts bundui-backup/$(date +%Y%m%d)/

echo "✅ Backup completado en bundui-backup/$(date +%Y%m%d)/"
```

### **Script de Restauración (Post-Upgrade)**
```bash
#!/bin/bash
# restore-bundui-extensions.sh

echo "🔄 Restaurando extensiones BundUI..."

# Restaurar extensiones
cp bundui-backup/$(date +%Y%m%d)/BunduiLanguageSwitcher.tsx bundui/src/components/
cp bundui-backup/$(date +%Y%m%d)/dropdown-menu.tsx bundui/src/components/ui/

# Verificar index.ts y re-aplicar si es necesario
# (Manual - revisar cambios)

echo "✅ Restauración completada"
```

---

## 📝 **Registro de Cambios**

### **Versión 1.0.0 - Extensiones Iniciales**
- **Fecha:** {{ new Date().toLocaleDateString() }}
- **Extensiones Agregadas:**
  - `BunduiLanguageSwitcher` - Selector de idioma
  - `dropdown-menu.tsx` - Componente UI base
  - Modificaciones en `index.ts`

### **Próximas Extensiones Planificadas:**
- [ ] `BunduiDataTable` - Tabla de datos avanzada
- [ ] `BunduiChart` - Componentes de gráficos
- [ ] `BunduiFormBuilder` - Constructor de formularios
- [ ] `BunduiNotificationCenter` - Centro de notificaciones

---

## 🎯 **Recomendaciones para el Equipo**

### **Para Desarrolladores:**
1. **Siempre consultar** esta documentación antes de modificar BundUI
2. **Crear nuevas extensiones** siguiendo el patrón establecido
3. **Documentar** cualquier nueva extensión aquí
4. **Probar** compatibilidad antes de commits

### **Para DevOps:**
1. **Incluir scripts** de backup/restore en CI/CD
2. **Monitorear** cambios en BundUI Premium
3. **Alertar** al equipo sobre upgrades disponibles
4. **Validar** compatibilidad post-upgrade

### **Para Producto:**
1. **Evaluar** nuevas funcionalidades de BundUI Premium
2. **Planificar** migración de extensiones si es necesario
3. **Priorizar** funcionalidades que podrían reemplazar nuestras extensiones

---

**Última actualización:** {{ new Date().toLocaleDateString() }}
**Versión del documento:** 1.0.0
**Mantenido por:** Equipo VThink 1.0 