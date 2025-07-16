|# 🏛️ Estándares y Patrones de Desarrollo - AI Pair Orchestrator Pro

## 📅 **Fecha:** 19 Junio 2025
## 🎯 **Objetivo:** Definir el conjunto de estándares, patrones y mejores prácticas para el desarrollo de software en este proyecto, sirviendo como un activo de proceso organizacional clave para CMMI Nivel 3.
## 👥 **Audiencia:** Equipo de Desarrollo

---

## 🧭 **Filosofía de Ingeniería**

Este documento es la **fuente de verdad** para "cómo construimos software". Nuestro objetivo es crear un producto que sea:
- **Robusto y Confiable:** Código que funciona de manera predecible y maneja errores con gracia.
- **Mantenible y Escalable:** Código fácil de entender, modificar y extender.
- **Seguro:** Protegemos los datos de nuestros usuarios y la integridad de la plataforma como máxima prioridad.
- **Consistente:** Un codebase unificado donde cualquier desarrollador puede sentirse productivo.

**Este es un documento vivo.** Se espera que evolucione a medida que nuestro equipo y tecnología lo hagan.

---

## 📚 **Índice de Contenidos**

1.  [Principios de Diseño de Software](#-principios-de-diseño-de-software)
2.  [Control de Versiones (Git)](#-control-de-versiones-git)
3.  [Estructura y Organización de Archivos](#-estructura-y-organización-de-archivos)
4.  [Convenciones de Nomenclatura](#-convenciones-de-nomenclatura)
5.  [Estándares de TypeScript](#-estándares-de-typescript)
6.  [Patrones de Componentes React](#-patrones-de-componentes-react)
7.  [Gestión de Estado](#-gestión-de-estado)
8.  [Estilo y CSS con Tailwind](#-estilo-y-css-con-tailwind)
9.  [Manejo de Errores](#-manejo-de-errores)
10. [Estándares de Seguridad](#-estándares-de-seguridad)
11. [Gestión de Temas y Accesibilidad](#-gestión-de-temas-y-accesibilidad)
12. [Sistema de Temas Avanzado](#-sistema-de-temas-avanzado)
13. [🗄️ ORM, Prisma y SQL Directo: Principios y Buenas Prácticas](#-orm-prisma-y-sql-directo-principios-y-buenas-prácticas)
14. [🧩 Integración de Código Externo y Refactorizaciones (Refworks, Forks, Adaptaciones)](#-integración-de-código-externo-y-refactorizaciones-refworks-forks-adaptaciones)

---

## 📐 **1. Principios de Diseño de Software**

Aplicamos los siguientes principios en todo nuestro trabajo:

- **SOLID:**
    - **S (Single Responsibility):** Cada componente, hook o función tiene una única razón para cambiar.
    - **O (Open/Closed):** Abiertos para la extensión (ej. vía props), cerrados para la modificación.
    - **L (Liskov Substitution):** Los componentes que extienden a otros deben ser sustituibles sin alterar el comportamiento.
    - **I (Interface Segregation):** Preferimos props específicas y pequeñas sobre interfaces monolíticas.
    - **D (Dependency Inversion):** Dependemos de abstracciones (ej. hooks) en lugar de implementaciones concretas.
- **DRY (Don't Repeat Yourself):** Evitamos la duplicación de código mediante la creación de utilidades y componentes reutilizables.
- **KISS (Keep It Simple, Stupid):** Priorizamos soluciones simples y legibles sobre complejidad innecesaria.

---

## 🌿 **2. Control de Versiones (Git)**

- **Nomenclatura de Ramas:**
    - `feature/<ticket-id>-descripcion-corta` (ej. `feature/T-123-user-login-form`)
    - `bugfix/<ticket-id>-descripcion-corta` (ej. `bugfix/T-124-fix-button-style`)
    - `chore/mejora-corta` (ej. `chore/update-readme`)
- **Mensajes de Commit:** Seguimos la especificación de [Conventional Commits](https://www.conventionalcommits.org/).
    - `feat: ✨ Añade formulario de login`
    - `fix: 🐛 Corrige el estilo del botón primario`
    - `docs: 📝 Actualiza la guía de instalación`
    - `refactor: 🧹 Simplifica el hook useAuth`
    - `test: ✅ Añade tests para el componente Header`
- **Flujo de Pull Request:** Todos los cambios se integran a `main` a través de PRs que deben seguir nuestra [plantilla de PR](./.github/pull_request_template.md) y ser aprobados.

---

## 📁 **3. Estructura y Organización de Archivos**

### **Directorio `src` Principal**
```
src/
├── api/             # Lógica de fetching de datos y comunicación con el backend.
├── assets/          # Imágenes, fuentes y otros archivos estáticos.
├── components/      # Componentes React reutilizables.
│   ├── ui/          # Primitivas de UI (shadcn/ui).
│   ├── layout/      # Componentes de estructura (Header, Sidebar).
│   └── features/    # Componentes complejos específicos de una feature.
├── config/          # Configuración de la aplicación (ej. i18n, themes).
├── hooks/           # Hooks de React personalizados y reutilizables.
├── lib/             # Instancias de librerías y utilidades (ej. supabase, queryClient).
├── pages/           # Componentes que representan rutas de la aplicación.
├── services/        # Lógica de negocio no-React (ej. conectores externos).
├── state/           # Stores de estado global (Zustand).
├── styles/          # Hojas de estilo globales.
├── types/           # Definiciones de tipos globales y de API.
└── utils/           # Funciones de utilidad puras y genéricas.
```

### **Estructura de Ficheros de un Componente**
Para componentes con lógica compleja, usamos la co-ubicación de archivos:
```
components/features/UserProfile/
├── UserProfile.tsx        # El componente principal.
├── UserProfile.test.tsx   # Tests para el componente.
├── UserProfile.module.css # Estilos específicos si son necesarios.
├── index.ts               # Exportación del componente (barrel file).
```

---

## 📛 **4. Convenciones de Nomenclatura**

- **Componentes:** `PascalCase` (ej. `UserProfile.tsx`).
- **Hooks:** `useCamelCase` (ej. `useAuth.ts`).
- **Variables y Funciones:** `camelCase` (ej. `const userData = ...`).
- **Constantes:** `UPPER_SNAKE_CASE` (ej. `const API_URL = ...`).
- **Tipos e Interfaces:** `PascalCase` con sufijo si es necesario (ej. `interface UserProfileProps`).
- **Archivos:** `kebab-case` para utilidades y hooks, `PascalCase` para componentes.

---

## 🏗️ **5. Estándares de TypeScript**

- **Strict Mode:** Todo el código debe ser compatible con `strict: true`.
- **Evitar `any`:** El uso de `any` está prohibido. Usar `unknown` para tipos de datos inciertos y realizar validación de tipo.
- **Interfaces de Props:** Todas las props de los componentes deben tener una interfaz que comience con el nombre del componente y termine en `Props`.
    ```typescript
    interface UserProfileProps {
      userId: string;
      onUpdate: (data: UserData) => void;
      // ...
    }
    ```
- **Tipos de Base de Datos:** Los tipos que representan entidades de la base de datos deben importarse desde `@/types/supabase` y no redefinirse.

---

## 🔧 **6. Patrones de Componentes React**

- **Funcionales con Hooks:** Todos los componentes deben ser funcionales. Los componentes de clase están prohibidos.
- **Composición sobre Herencia:** Usamos la composición de componentes (pasando componentes como props o `children`) en lugar de herencia.
- **Patrón de Contenedor/Presentación:** Separamos la lógica de fetching de datos (contenedores, usualmente hooks) de la lógica de renderizado (componentes de presentación).
- **Tamaño de Componentes:** Un componente no debe exceder las **150 líneas**. Si lo hace, es un indicador de que necesita ser refactorizado en componentes más pequeños.

---

## 📊 **7. Gestión de Estado**

Se sigue una jerarquía clara para decidir dónde debe vivir el estado:
1.  **Estado Local (`useState`, `useReducer`):** Para estado que solo afecta a un único componente (ej. visibilidad de un dropdown).
2.  **Estado de Servidor (`@tanstack/react-query`):** Es nuestra fuente de verdad para cualquier dato que provenga del backend. Gestiona caching, re-fetching y mutaciones.
3.  **Estado Global (`zustand`):** Solo para estado de UI global que es compartido por partes no relacionadas de la aplicación (ej. estado del tema light/dark, información del usuario autenticado).

---

## 🎨 **8. Estilo y CSS con Tailwind**

- **Clases de Utilidad:** Priorizamos el uso de clases de utilidad de Tailwind sobre la escritura de CSS personalizado.
- **Componentes de `shadcn/ui`:** Se deben usar los componentes de nuestra librería de UI (`@/components/ui`) como base para asegurar consistencia.
- **Variables de Tema:** Para colores, espaciados o fuentes, usamos las variables definidas en `tailwind.config.js` y `globals.css` para mantener un sistema de diseño consistente.

---

## 🛡️ **9. Manejo de Errores**

- **Límites de Error (Error Boundaries):** Envolvemos secciones principales de la aplicación (ej. rutas) en `ErrorBoundary` para prevenir que un error en una parte de la UI rompa toda la aplicación.
- **Errores de API:** Todas las llamadas a la API deben estar envueltas en un `try/catch` o usar el manejo de errores provisto por React Query (`isError`, `error`).
- **Notificaciones al Usuario:** Los errores deben ser comunicados al usuario de forma amigable usando `sonner` u otro componente de notificación. No mostrar objetos de error crudos.

---

## 🔐 **10. Estándares de Seguridad**

- **Aislamiento Multi-Tenant:** Toda query a la base de datos que acceda a recursos de una empresa **DEBE** incluir un filtro `.eq('company_id', user.company_id)`.
- **Validación de Permisos:** La lógica que depende de un rol de usuario **DEBE** estar protegida por el hook `useAuth` y la función `hasPermission`.
- **Renderizado Condicional:** Los elementos de la UI que solo deben ser visibles para ciertos roles **DEBEN** estar envueltos en una comprobación de permisos.
- **No Exponer Claves Secretas:** Ninguna clave de API o secreto debe estar presente en el código del frontend. Deben cargarse desde variables de entorno.

---

## 🌙 **11. Gestión de Temas y Accesibilidad**

### **Sistema de Temas**
- **next-themes:** Usamos `next-themes` como librería estándar para gestión de temas.
- **Tres Modos:** Claro, Oscuro y Sistema (automático según preferencias del sistema).
- **Daylight Automático:** Cuando el usuario selecciona "Sistema", el tema cambia automáticamente:
  - **Claro:** 7:00 - 19:00
  - **Oscuro:** 19:00 - 7:00

### **Componentes de Tema**
- **ModeToggle:** Componente estándar ubicado en `@/components/ui/mode-toggle.tsx`.
- **useDaylightTheme:** Hook personalizado para manejo de cambios automáticos por hora.
- **Integración:** El selector de tema debe estar siempre visible en el header principal.

### **Accesibilidad**
- **Contraste:** Todos los colores deben cumplir con WCAG 2.1 AA (contraste mínimo 4.5:1).
- **Screen Readers:** Todos los elementos interactivos deben tener `aria-label` o `sr-only` text.
- **Navegación por Teclado:** Todos los componentes deben ser navegables con Tab, Enter y Escape.
- **Reducción de Movimiento:** Respetar la preferencia `prefers-reduced-motion` del usuario.

### **Patrones de Implementación**
```typescript
// Hook para tema automático
const { isDaylight, timeUntilChange } = useDaylightTheme()

// Componente de selector
<ModeToggle variant="outline" size="icon" />

// Variables CSS para temas
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

[data-theme="dark"] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

---

## 🎨 **12. Sistema de Temas Avanzado**

### **Visión General**
El sistema de temas hereda inteligentemente de shadcn/ui, proporcionando una experiencia de usuario superior con soporte para daylight automático y mejor UX.

### **Componentes Principales**

#### **ThemeSwitcher Avanzado**
```typescript
import { ThemeSwitcher } from '@/components/ui/theme-switcher'

// Uso básico
<ThemeSwitcher />

// Características:
// ✅ Preview de temas con miniaturas
// ✅ Estado del sistema en tiempo real
// ✅ Tiempo hasta próximo cambio automático
// ✅ Accesibilidad completa (ARIA labels)
// ✅ Diseño inspirado en shadcn/ui
```

#### **ThemeSwitcherCompact**
```typescript
import { ThemeSwitcherCompact } from '@/components/ui/theme-switcher'

// Para espacios reducidos
<ThemeSwitcherCompact />

// Características:
// ✅ Ciclo rápido de temas (light → dark → system)
// ✅ Icono dinámico según tema actual
// ✅ Interacción con un clic
// ✅ Espacio mínimo requerido
```

#### **Hook useDaylightTheme**
```typescript
import { useDaylightTheme } from '@/hooks/useDaylightTheme'

const { isDaylight, timeUntilChange, forceDaylightUpdate } = useDaylightTheme()

// Funcionalidades:
// ✅ Detección automática de hora del día
// ✅ Cálculo de tiempo hasta próximo cambio
// ✅ Actualización forzada del tema
// ✅ Horarios: Claro (7:00-19:00), Oscuro (19:00-7:00)
```

### **Configuración del Sistema**

#### **ThemeProvider**
```typescript
// src/App.tsx
<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  {/* Aplicación */}
</ThemeProvider>

// Configuración recomendada:
// - defaultTheme: "dark" (mejor para desarrollo)
// - storageKey: "vite-ui-theme" (consistente con Vite)
// - enableSystem: true (habilitado por defecto)
```

#### **Variables CSS Personalizadas**
```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... más variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... más variables */
}
```

### **Patrones de Uso**

#### **En Headers y Navegación**
```typescript
// Header público
<div className="flex items-center space-x-4">
  <LanguageSwitcher />
  <ThemeSwitcher /> {/* Versión completa */}
  <Button>Acción</Button>
</div>

// Header compacto
<div className="flex items-center space-x-2">
  <ThemeSwitcherCompact /> {/* Versión compacta */}
  <Button>Acción</Button>
</div>
```

#### **En Páginas de Configuración**
```typescript
// Página de preferencias
<Card>
  <CardHeader>
    <CardTitle>Preferencias de Tema</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span>Tema</span>
        <ThemeSwitcher />
      </div>
      {theme === "system" && (
        <div className="text-sm text-muted-foreground">
          Próximo cambio: {formatTimeUntilChange()}
        </div>
      )}
    </div>
  </CardContent>
</Card>
```

### **Testing y Debugging**

#### **Página de Prueba**
```typescript
// src/pages/testing/ThemeTesting.tsx
// URL: /testing/theme

// Funcionalidades de prueba:
// ✅ Comparación de componentes
// ✅ Estado del tema en tiempo real
// ✅ Prueba de daylight automático
// ✅ Información detallada del sistema
```

#### **Debugging del Tema**
```typescript
// Verificar estado del tema
const { theme, resolvedTheme } = useTheme()
const { isDaylight, timeUntilChange } = useDaylightTheme()

console.log({
  selectedTheme: theme,
  appliedTheme: resolvedTheme,
  isDaylight,
  timeUntilChange
})
```

### **Mejores Prácticas**

#### **Accesibilidad**
- ✅ Usar `aria-label` en botones de tema
- ✅ Proporcionar texto alternativo con `sr-only`
- ✅ Mantener contraste adecuado en todos los temas
- ✅ Soporte para navegación por teclado

#### **Performance**
- ✅ Evitar re-renders innecesarios
- ✅ Usar `useCallback` para funciones de tema
- ✅ Optimizar intervalos de actualización
- ✅ Lazy loading de componentes de tema

#### **UX/UI**
- ✅ Preview visual de temas
- ✅ Feedback inmediato al cambiar tema
- ✅ Información contextual (tiempo hasta cambio)
- ✅ Transiciones suaves entre temas

### **Integración con shadcn/ui**

#### **Compatibilidad**
```typescript
// El sistema es 100% compatible con shadcn/ui
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'

// Todos los componentes heredan automáticamente el tema
```

#### **Extensibilidad**
```typescript
// Agregar nuevos temas
const customThemeOptions = [
  ...themeOptions,
  {
    value: "custom",
    label: "Personalizado",
    icon: <CustomIcon className="h-4 w-4" />,
    description: "Tema personalizado",
    preview: "bg-gradient-to-r from-purple-400 to-pink-400"
  }
]
```

### **Documentación CMMI**

#### **Activos de Proceso**
- ✅ Componentes documentados con JSDoc
- ✅ Patrones de uso establecidos
- ✅ Guías de accesibilidad
- ✅ Tests de funcionalidad

#### **Control de Calidad**
- ✅ Revisión de accesibilidad
- ✅ Testing en múltiples navegadores
- ✅ Validación de contraste
- ✅ Performance testing

---

**Última actualización**: 19/06/2025
**Versión**: 2.0.0
**Estado**: ✅ Activo y documentado

## 🗄️ ORM, Prisma y SQL Directo: Principios y Buenas Prácticas

- **Prisma Migrate** se usa para todas las migraciones de estructura (tablas, relaciones, constraints).
- **Scripts SQL directos** se usan para migraciones de datos complejas, inicialización masiva o transformaciones avanzadas.
- **Prisma Client** es el estándar para la lógica de negocio, CRUD y relaciones habituales.
- **SQL directo** se usa para reporting avanzado, queries con CTEs, funciones de ventana, o features avanzadas de PostgreSQL (RLS, triggers, funciones almacenadas).
- **Vistas y materialized views** pueden mapearse en Prisma si se requiere integración con TypeScript.
- **Toda migración y script debe ser auditable, reversible y documentado.**

> Estas reglas son obligatorias para todo el equipo y deben revisarse en cada code review.

### Resumen visual

| Caso de uso                        | Prisma Migrate | Prisma Client | SQL Directo |
|------------------------------------|:--------------:|:-------------:|:-----------:|
| Crear/modificar tablas             |      ✔️        |               |             |
| CRUD entidades principales         |               |      ✔️       |             |
| Relaciones N:M                     |      ✔️        |      ✔️       |             |
| Poblar datos iniciales masivos     |                |               |     ✔️      |
| Migraciones de datos complejas     |                |               |     ✔️      |
| Reporting avanzado/CTEs            |                |               |     ✔️      |
| RLS, triggers, funciones           |                |               |     ✔️      |
| Mapear vistas/materialized views   |                |      ✔️*      |     ✔️      |

\* Prisma puede mapear vistas si es necesario.

## 🧩 Integración de Código Externo y Refactorizaciones (Refworks, Forks, Adaptaciones)

- Toda integración, refactorización o reimplementación de código externo (por ejemplo, Postiz, módulos open source, etc.) que requiera persistencia de datos, **debe centralizar la gestión de modelos y migraciones en el archivo `prisma/schema.prisma` de la raíz del monorepo**.
    - Los modelos y relaciones deben adaptarse y documentarse en el schema principal.
    - Las migraciones de estructura se gestionan exclusivamente con Prisma Migrate.
    - Los scripts de migración de datos masivos o inicialización deben ubicarse en la carpeta de migraciones y documentarse.
    - **No se permite mantener esquemas paralelos o aislados fuera de la gobernanza central de Prisma.**

> Esta regla es obligatoria para todo el equipo y debe aplicarse en cada integración de código externo o refactorización mayor.

---

## 📋 Integración CMMI y XTP en el Ciclo de Vida

### Referencia central
- Ver `docs/EXTREME_TRACEABLE_PROGRAMMING_XTP.md` para el protocolo completo de trazabilidad, evidencia y control de calidad.

### Checklist de Cumplimiento
- [x] Requerimientos documentados y versionados
- [x] Alcance y criterios de éxito definidos
- [x] Arquitectura y decisiones registradas (ADRs, Decision Log)
- [x] Implementación siguiendo patrones y estándares
- [x] Pruebas automatizadas con evidencia (Postman/Newman)
- [x] Despliegue solo tras pasar todas las pruebas
- [x] Monitoreo y mejora continua
- [x] Handoff y roles documentados

### Ejemplo de aplicación
- Cada feature nueva debe:
  1. Tener requerimiento y alcance documentado
  2. Ser implementada siguiendo los patrones de este archivo
  3. Tener pruebas automatizadas y evidencia en `tests/postman/reports/`
  4. Registrar cualquier decisión crítica en `docs/DECISION_LOG.md`
  5. Documentar el handoff si cambia de responsable (IA ↔ humano)

---

**Última actualización:** {fecha_actual}
**Estado:** Activo y auditado
