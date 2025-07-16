# 🎨 Bundui UI - VibeThink Orchestrator

## 📋 **Descripción**

Bundui UI es el sistema de componentes visuales principal para VibeThink Orchestrator, siguiendo la metodología **VThink 1.0**. Proporciona componentes reutilizables, temas personalizables y layouts optimizados para la experiencia multi-tenant.

## 🏗️ **Estructura**

```
app/ui/bundui/
├── components/           # Componentes reutilizables
│   ├── common/          # Componentes básicos
│   ├── forms/           # Componentes de formularios
│   ├── navigation/      # Componentes de navegación
│   └── data-display/    # Componentes de visualización
├── layouts/             # Layouts predefinidos
│   ├── dashboard/       # Layouts de dashboard
│   ├── admin/           # Layouts administrativos
│   └── auth/            # Layouts de autenticación
├── pages/               # Páginas específicas Bundui
├── hooks/               # Hooks personalizados
├── types/               # Tipos TypeScript
├── styles/              # Estilos CSS/SCSS
├── config/              # Configuración
│   ├── theme-config.ts  # Configuración de temas
│   ├── company-themes.ts # Temas por empresa
│   └── theme-selector.tsx # Selector de temas
└── utils/               # Utilidades
```

## 🎨 **Temas Disponibles**

### **Temas Predefinidos:**
- `vthink-default`: Tema oficial VThink 1.0
- `bundui-light`: Tema claro Bundui
- `enterprise-blue`: Tema empresarial azul
- `modern-dark`: Tema oscuro moderno

### **Personalización por Empresa:**
```typescript
interface CompanyTheme {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  companyName: string;
  favicon: string;
}
```

## 🚀 **Uso Rápido**

```typescript
// Importar componente Bundui
import { BunduiDashboard } from '@/app/ui/bundui/components/Dashboard';

// Usar tema de empresa
import { useCompanyTheme } from '@/app/ui/bundui/hooks/useCompanyTheme';

const { theme } = useCompanyTheme(companyId);
```

## 📊 **Métricas de Performance**

- **Tiempo de carga**: <2s
- **Temas disponibles**: 4 predefinidos + personalizados
- **Componentes**: 50+ reutilizables
- **Compatibilidad**: Multi-tenant ready

## 🔧 **Configuración**

```typescript
// app/ui/bundui/config/theme-config.ts
export const bunduiConfig = {
  themes: predefinedThemes,
  defaultTheme: 'vthink-default',
  enableCustomization: true,
  multiTenant: true
};
```

## 🧪 **Testing**

```bash
# Test de componentes Bundui
npm run test:bundui-components

# Test de temas
npm run test:bundui-themes

# Test de performance
npm run test:bundui-performance
```

---

**Desarrollado siguiendo la metodología VThink 1.0 para VibeThink Orchestrator.** 