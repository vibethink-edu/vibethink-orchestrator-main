# 🚫 CODING STANDARDS: NO HARDCODING POLICY

**Establecido**: 2025-01-04  
**Aplicación**: OBLIGATORIA para todo el proyecto VThink Orchestrator

## 🎯 Principio Fundamental

**CERO HARDCODEO EN VIBETHINK** - Todo componente debe ser modular, configurable y reutilizable.

### 🚨 REGLA ABSOLUTA:
**NO tendremos NADA hardcodeado en VibeThink, a menos que sea en DEV TIME**

- ✅ **Permitido**: Hardcodeo temporal durante desarrollo/prototipado
- ❌ **Prohibido**: Hardcodeo en código de producción
- ⚠️ **Obligatorio**: Refactorizar todo hardcodeo antes de merge a producción

## ❌ Prohibido: Componentes Hardcodeados

### Ejemplo de ANTI-PATRÓN:
```typescript
// ❌ NUNCA HACER ESTO
function BunduiCompleteLayout({ children }) {
  return (
    <div className="fixed-layout-hardcoded">
      <div className="hardcoded-sidebar">
        <div className="hardcoded-header">Dashboard</div>
        <div className="hardcoded-menu">
          <a href="/sales">Sales</a>
          <a href="/crm">CRM</a>
          {/* Más enlaces hardcodeados */}
        </div>
      </div>
      <div className="hardcoded-content">
        {children}
      </div>
    </div>
  );
}
```

**Problemas del hardcodeo:**
- ❌ No es reutilizable
- ❌ Difícil de mantener
- ❌ No se puede personalizar
- ❌ Mezcla responsabilidades
- ❌ Código duplicado
- ❌ Testing complicado

## ✅ Estándar Aprobado: Componentes Modulares

### Ejemplo de PATRÓN CORRECTO:
```typescript
// ✅ SIEMPRE HACER ESTO
interface DashboardLayoutProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  sidebarConfig?: SidebarConfig;
  headerConfig?: HeaderConfig;
}

function DashboardLayout({ 
  children, 
  defaultOpen = true,
  sidebarConfig,
  headerConfig 
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar config={sidebarConfig} />
      <SidebarInset>
        <Header config={headerConfig} />
        <div className="configurable-content">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

**Beneficios del enfoque modular:**
- ✅ Completamente reutilizable
- ✅ Fácil de mantener y actualizar
- ✅ Configurable mediante props
- ✅ Separación clara de responsabilidades
- ✅ Testing sencillo
- ✅ Escalable y extensible

## 🏗️ Arquitectura Estándar Aprobada

### Estructura de componentes modulares:
```
src/shared/components/layout/
├── DashboardLayout.tsx      # Layout principal modular
├── sidebar/
│   ├── Sidebar.tsx         # Componente sidebar configurable
│   ├── SidebarMenu.tsx     # Menu configurable por props
│   └── SidebarItem.tsx     # Items individuales configurables
├── header/
│   ├── Header.tsx          # Header configurable
│   ├── SearchBar.tsx       # Búsqueda configurable
│   └── UserMenu.tsx        # Menu usuario configurable
└── content/
    ├── ContentArea.tsx     # Área de contenido configurable
    └── PageWrapper.tsx     # Wrapper de página configurable
```

## 📋 Checklist de Revisión

Antes de aprobar cualquier componente, verificar:

- [ ] **¿Es configurable mediante props?**
- [ ] **¿Puede reutilizarse en diferentes contextos?**
- [ ] **¿Tiene responsabilidades claramente separadas?**
- [ ] **¿Se puede testear independientemente?**
- [ ] **¿Sigue el principio de composición?**
- [ ] **¿Evita valores hardcodeados?**
- [ ] **¿Es extensible para futuros requerimientos?**

## 🚨 Violaciones Comunes a Evitar

### 1. Hardcodeo de rutas:
```typescript
// ❌ MAL
<a href="/dashboard/sales">Sales</a>

// ✅ BIEN
<Link href={routes.sales}>Sales</Link>
```

### 2. Hardcodeo de estilos:
```typescript
// ❌ MAL
<div className="w-64 h-screen bg-gray-100">

// ✅ BIEN
<div className={cn("sidebar", className)} style={customStyles}>
```

### 3. Hardcodeo de configuración:
```typescript
// ❌ MAL
const menuItems = [
  { title: "Sales", href: "/sales" },
  { title: "CRM", href: "/crm" }
];

// ✅ BIEN
interface MenuConfig {
  items: MenuItem[];
  defaultExpanded?: boolean;
  theme?: 'light' | 'dark';
}
```

## 🎯 Plan de Migración

### Componentes a migrar INMEDIATAMENTE:
1. **BunduiCompleteLayout** → **DashboardLayout**
2. Cualquier componente con valores hardcodeados
3. Layouts monolíticos existentes

### Proceso de migración:
1. **Identificar** componentes hardcodeados
2. **Refactorizar** a componentes modulares
3. **Testear** funcionalidad
4. **Documentar** nuevos componentes
5. **Eliminar** código legacy

## 📝 Documentación Requerida

Todo componente modular debe incluir:
- **Props interface** claramente definida
- **Ejemplos de uso** en diferentes contextos
- **Tests unitarios** comprensivos
- **Storybook stories** para documentación visual

## 🔍 Herramientas de Validación

### Scripts de validación:
```bash
npm run validate:no-hardcoding    # Detecta hardcodeo
npm run validate:modularity       # Verifica modularidad
npm run validate:reusability      # Confirma reutilización
```

## ⚖️ Consecuencias

**Violación de este estándar:**
- ❌ Pull Request **RECHAZADO**
- ❌ Componente **NO APROBADO** para producción
- ❌ Requiere **REFACTORING** obligatorio

**Cumplimiento del estándar:**
- ✅ Código **APROBADO** para merge
- ✅ Componente **REUSABLE** en todo el proyecto
- ✅ **MANTENIMIENTO** simplificado

---

## 🤖 AI Development Guidelines

Para Claude Code y otros AI assistants:

**SIEMPRE:**
- Crear componentes modulares y configurables
- Usar props para personalización
- Separar responsabilidades claramente
- Seguir principios de composición

**NUNCA:**
- Hardcodear valores en componentes
- Crear componentes monolíticos
- Mezclar responsabilidades
- Ignorar la reutilización

---

**Este documento es parte del VThink 1.0 Methodology y debe ser seguido por todos los desarrolladores y AI assistants trabajando en el proyecto.**