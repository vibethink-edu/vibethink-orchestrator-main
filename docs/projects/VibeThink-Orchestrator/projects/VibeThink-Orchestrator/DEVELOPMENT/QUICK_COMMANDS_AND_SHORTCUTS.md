# 🚀 Comandos Rápidos y Atajos - AI Pair Platform

## 🌍 Sistema de Idiomas Optimizado

### URLs de Prueba
- **Página de Prueba de Idiomas**: `http://localhost:8080/testing/language`
- **Cambio de Idioma**: Usar el selector en el header o componentes específicos

### Componentes Principales
- `LanguageSwitcher` - Selector completo con dropdown
- `LanguageSwitcherCompact` - Versión compacta para espacios reducidos
- `useLanguage` - Hook personalizado para gestión de idiomas

### Funcionalidades Implementadas
- ✅ **Español** (🇪🇸) - Idioma por defecto
- ✅ **Inglés** (🇺🇸) - Idioma secundario
- ✅ **Detección automática** del navegador
- ✅ **Persistencia** en localStorage
- ✅ **Cambio dinámico** sin recarga
- ✅ **Accesibilidad** completa
- ✅ **Responsive** design

### Archivos Clave
```
src/lib/i18n.ts                    # Configuración principal
src/hooks/useLanguage.ts           # Hook personalizado
src/components/LanguageSwitcher.tsx # Componentes UI
src/locales/es.json                # Traducciones español
src/locales/en.json                # Traducciones inglés
src/pages/testing/LanguageTesting.tsx # Página de prueba
```

### Comandos de Desarrollo - Sistema de Idiomas
```bash
# Verificar traducciones
npm run build  # Detecta claves faltantes

# Probar sistema de idiomas
# Ir a: http://localhost:8080/testing/language

# Verificar archivos de traducción
cat src/locales/es.json | jq '.language'
cat src/locales/en.json | jq '.language'
```

## 🎨 Sistema de Temas Avanzado

### URLs de Prueba
- **Página de Prueba de Temas**: `http://localhost:8080/testing/theme`
- **Selector de Tema**: Header principal con ThemeSwitcher

### Componentes Principales
- `ThemeSwitcher` - Selector avanzado con preview
- `ModeToggle` - Toggle básico (actualizado)
- `useDaylightTheme` - Hook para tema automático

### Funcionalidades Implementadas
- ✅ **Tema Claro** - Modo claro optimizado
- ✅ **Tema Oscuro** - Modo oscuro por defecto
- ✅ **Tema Sistema** - Sigue preferencias del OS
- ✅ **Daylight Mode** - Cambio automático según hora
- ✅ **Persistencia** en localStorage
- ✅ **Transiciones suaves**
- ✅ **Accesibilidad** completa

### Archivos Clave
```
src/components/ThemeSwitcher.tsx   # Selector avanzado
src/components/ui/mode-toggle.tsx  # Toggle básico
src/hooks/useDaylightTheme.ts      # Hook daylight
src/components/theme-provider.tsx  # Provider principal
src/pages/testing/ThemeTesting.tsx # Página de prueba
```

### Comandos de Desarrollo - Sistema de Temas
```bash
# Probar sistema de temas
# Ir a: http://localhost:8080/testing/theme

# Verificar configuración de temas
cat src/components/theme-provider.tsx

# Verificar hook daylight
cat src/hooks/useDaylightTheme.ts
```

## 🔧 Comandos de Desarrollo Rápido

### Servidor y Build
```bash
# Iniciar servidor de desarrollo
npm run dev                    # Puerto 8080

# Build de producción
npm run build

# Preview de build
npm run preview

# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Testing y Calidad
```bash
# Ejecutar tests
npm run test

# Tests en modo watch
npm run test:watch

# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

### Base de Datos y Migraciones
```bash
# Aplicar migraciones
npm run db:migrate

# Resetear base de datos
npm run db:reset

# Generar tipos de Supabase
npm run db:types
```

## 📁 Estructura de Archivos Importantes

### Core Files
```
src/
├── App.tsx                     # Rutas principales
├── main.tsx                    # Entry point
├── lib/
│   ├── i18n.ts                # Sistema de idiomas
│   └── utils.ts               # Utilidades
├── hooks/
│   ├── useLanguage.ts         # Hook idiomas
│   ├── useDaylightTheme.ts    # Hook temas
│   └── useAuth.ts             # Autenticación
├── components/
│   ├── LanguageSwitcher.tsx   # Selector idiomas
│   ├── ThemeSwitcher.tsx      # Selector temas
│   └── ui/                    # Componentes shadcn/ui
├── locales/
│   ├── es.json                # Español
│   └── en.json                # Inglés
└── pages/
    ├── Index.tsx              # Landing page
    ├── Dashboard.tsx          # Dashboard principal
    └── testing/               # Páginas de prueba
```

### Configuración
```
├── tailwind.config.js         # Configuración Tailwind
├── vite.config.ts             # Configuración Vite
├── tsconfig.json              # Configuración TypeScript
├── package.json               # Dependencias
└── supabase/                  # Configuración Supabase
```

## 🎯 URLs Principales

### Páginas Públicas
- **Home**: `http://localhost:8080/`
- **Login**: `http://localhost:8080/login`
- **Auth**: `http://localhost:8080/auth`

### Páginas Protegidas
- **Dashboard**: `http://localhost:8080/dashboard`
- **Admin**: `http://localhost:8080/admin`
- **Super Admin**: `http://localhost:8080/super-admin`

### Páginas de Prueba
- **Temas**: `http://localhost:8080/testing/theme`
- **Idiomas**: `http://localhost:8080/testing/language`
- **Roles**: `http://localhost:8080/testing/roles`
- **Phase 2**: `http://localhost:8080/testing/phase2`

### Mockups y Demos
- **AI Studio**: `http://localhost:8080/aistudio`
- **Mockup Demo**: `http://localhost:8080/mockup-demo`
- **Dashboard Clásico**: `http://localhost:8080/classic`
- **Dashboard Minimal**: `http://localhost:8080/minimal`

## 🔑 Credenciales de Prueba

### Usuarios de Prueba
```bash
# Super Admin
Email: superadmin@test.com
Password: 12345

# Admin
Email: admin@test.com
Password: 12345

# Manager
Email: manager@test.com
Password: 12345

# Employee
Email: employee@test.com
Password: 12345
```

## 🚀 Tips de Desarrollo

### Desarrollo Rápido
1. **Hot Reload**: Los cambios se reflejan automáticamente
2. **TypeScript**: Verificación de tipos en tiempo real
3. **ESLint**: Linting automático en el editor
4. **Prettier**: Formateo automático al guardar

### Debugging
1. **Console**: `console.log()` para debugging
2. **React DevTools**: Para inspeccionar componentes
3. **Network Tab**: Para verificar requests
4. **Application Tab**: Para verificar localStorage

### Performance
1. **Bundle Analyzer**: `npm run analyze`
2. **Lighthouse**: Para métricas de performance
3. **React Profiler**: Para profiling de componentes

## 📚 Documentación

### Archivos de Documentación
```
docs/
├── LANGUAGE_SYSTEM_OPTIMIZATION.md  # Sistema de idiomas
├── DEVELOPMENT_PATTERNS.md          # Patrones de desarrollo
├── ARCHITECTURE.md                  # Arquitectura del sistema
├── API.md                           # Documentación de API
└── BUSINESS_STRATEGY.md             # Estrategia de negocio
```

### Comandos CMMI
```bash
# Backup completo del proyecto
npm run backup:complete

# Backup de memoria del sistema
npm run backup:memory

# Aplicar migraciones manuales
npm run db:migrate:manual

# Verificar estado del proyecto
npm run status:check
```

## 🎉 Estado Actual del Proyecto

### ✅ Completado
- **Sistema de Idiomas**: Español e Inglés con detección automática
- **Sistema de Temas**: Claro, Oscuro, Sistema + Daylight
- **Autenticación**: Multi-tenant con roles
- **Dashboard**: Interfaz principal funcional
- **Admin Panel**: Gestión empresarial
- **Super Admin**: Gestión de plataforma
- **Documentación**: CMMI Nivel 3

### 🚧 En Desarrollo
- **Universal Assistant**: IA personal para cada empleado
- **Integraciones**: Google Workspace, Office 365
- **Analytics**: Métricas de uso y performance
- **Testing**: Cobertura completa de tests

### 📋 Próximos Pasos
1. **Navegación**: Sistema de navegación avanzado
2. **Notificaciones**: Sistema de notificaciones en tiempo real
3. **Chat**: Interfaz de chat mejorada
4. **Mobile**: Optimización para dispositivos móviles

---

**Última actualización**: 19/06/2025  
**Versión**: 2.0.0  
**Estado**: 🟢 **Desarrollo Activo** 