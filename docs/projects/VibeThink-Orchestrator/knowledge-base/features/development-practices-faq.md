# FAQ: Buenas Prácticas de Desarrollo

## 📋 **Índice**
1. [Hooks Base](#hooks-base)
2. [Componentes Base](#componentes-base)
3. [Utilidades Centralizadas](#utilidades-centralizadas)
4. [Arquitectura y Layout](#arquitectura-y-layout)
5. [Personalización](#personalización)
6. [Cumplimiento y Cookies](#cumplimiento-y-cookies)
7. [Control de Versiones](#control-de-versiones)
8. [Eliminación de Boilerplate](#eliminación-de-boilerplate)

---

## 🪝 **Hooks Base**

### **¿Qué son los hooks base y por qué los necesitamos?**
Los hooks base son hooks reutilizables que eliminan código repetitivo común en React. Proporcionan funcionalidades estándar como fetch de datos, manejo de formularios, persistencia local, etc.

**Beneficios:**
- Reducen duplicación de código en 80%
- Estandarizan patrones de desarrollo
- Facilitan testing y mantenimiento
- Mejoran la consistencia del código

### **¿Cuáles hooks base están disponibles?**
- `useQuery` - Para fetch de datos con cache
- `useMutation` - Para operaciones CRUD
- `useLocalStorage` - Para persistencia local
- `useDebounce` - Para optimización de búsquedas
- `useClickOutside` - Para detectar clics externos
- `useIntersectionObserver` - Para detectar visibilidad
- `usePrevious` - Para obtener valor anterior
- `useAsync` - Para operaciones asíncronas
- `useToggle` - Para estados booleanos
- `useWindowSize` - Para tamaño de ventana
- `useMediaQuery` - Para media queries

### **¿Cómo usar useQuery?**
```tsx
const { data, loading, error, refetch } = useQuery({
  queryKey: 'users',
  queryFn: () => apiClient.get('/users'),
  enabled: !!user?.id,
  staleTime: 5 * 60 * 1000, // 5 minutos
});
```

### **¿Cómo usar useMutation?**
```tsx
const { mutate, loading, error } = useMutation({
  mutationFn: (userData) => apiClient.post('/users', userData),
  onSuccess: (data) => console.log('Usuario creado:', data),
  onError: (error) => console.error('Error:', error),
});

// Uso
mutate({ name: 'Juan', email: 'juan@example.com' });
```

### **¿Cuándo usar useLocalStorage vs useQuery?**
- **useLocalStorage:** Para preferencias de usuario, configuraciones locales, datos temporales
- **useQuery:** Para datos del servidor que necesitan cache y sincronización

---

## 🧩 **Componentes Base**

### **¿Qué son los componentes base?**
Componentes reutilizables que proporcionan funcionalidades comunes como cards, tablas, formularios, modales y botones con estados predefinidos.

### **¿Cuáles componentes base están disponibles?**
- `BaseCard` - Cards con estructura común
- `BaseTable` - Tablas con paginación y búsqueda
- `BaseForm` - Formularios con validación
- `BaseModal` - Modales con acciones
- `BaseButton` - Botones con loading y confirmación

### **¿Cómo usar BaseCard?**
```tsx
<BaseCard
  title="Usuarios Activos"
  description="Lista de usuarios conectados"
  loading={loading}
  error={error}
  actions={<Button>Agregar Usuario</Button>}
>
  <UserList users={users} />
</BaseCard>
```

### **¿Cómo usar BaseTable?**
```tsx
<BaseTable
  data={users}
  columns={[
    { key: 'name', header: 'Nombre', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'actions', header: 'Acciones', cell: (user) => <UserActions user={user} /> }
  ]}
  searchable
  sortable
  pagination={pagination}
  onRowClick={(user) => navigate(`/users/${user.id}`)}
/>
```

### **¿Cómo usar BaseForm?**
```tsx
<BaseForm
  title="Crear Usuario"
  fields={[
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'role', label: 'Rol', type: 'select', options: [
      { value: 'admin', label: 'Administrador' },
      { value: 'user', label: 'Usuario' }
    ]}
  ]}
  onSubmit={handleSubmit}
  loading={loading}
/>
```

### **¿Cuándo crear un componente base vs un componente específico?**
- **Componente base:** Cuando la funcionalidad es genérica y se usa en múltiples lugares
- **Componente específico:** Cuando la funcionalidad es única para un módulo específico

---

## 🔧 **Utilidades Centralizadas**

### **¿Qué son las utilidades centralizadas?**
Funciones y clases que proporcionan funcionalidades comunes como validación, formateo, API client, etc.

### **¿Cuáles utilidades están disponibles?**
- `apiClient` - Cliente HTTP centralizado
- `validators` - Validaciones reutilizables
- `formatters` - Formateo de datos

### **¿Cómo usar apiClient?**
```tsx
// GET request
const users = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', userData);

// PUT request
const updatedUser = await apiClient.put(`/users/${id}`, userData);

// DELETE request
await apiClient.delete(`/users/${id}`);

// Upload file
const result = await apiClient.upload('/upload', file);

// Download file
await apiClient.download('/download', 'filename.pdf');
```

### **¿Cómo usar validators?**
```tsx
// Validación individual
const emailError = validate(email, [
  validators.required(),
  validators.email()
]);

// Validación de formulario completo
const schema = {
  email: [validators.required(), validators.email()],
  password: [validators.required(), validators.password()],
  confirmPassword: [validators.required(), validators.confirmPassword('password')]
};

const results = validateForm(formData, schema);
const isValid = isFormValid(results);
```

### **¿Cómo usar formatters?**
```tsx
// Formatear moneda
const formattedAmount = formatters.currency(1234567.89); // "$ 1.234.567,89"

// Formatear fecha
const formattedDate = formatters.date('2023-12-25'); // "25/12/2023"

// Formatear teléfono
const formattedPhone = formatters.phone('3001234567'); // "(300) 123-4567"

// Formatear documento
const formattedDoc = formatters.document('1234567890', 'cc'); // "12.345.678-9"

// Capitalizar texto
const capitalized = formatters.capitalize('juan pérez'); // "Juan Pérez"
```

---

## 🏗️ **Arquitectura y Layout**

### **¿Cuál es la arquitectura de layout establecida?**
- **Layout unificado:** Solo un layout para todas las rutas internas autenticadas
- **Páginas especiales:** Login, splash, landing, superadmin tienen layouts propios
- **Composición:** Cada módulo solo define su contenido, hereda sidebar, header, footer

### **¿Cómo funciona el layout unificado?**
```tsx
// Rutas internas con layout unificado
<Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
  <Route path="helpdesk" element={<HelpdeskPanel />} />
  <Route path="crm" element={<CRMPanel />} />
  <Route path="pqrs" element={<PQRSPanel />} />
</Route>

// Páginas especiales con layouts propios
<Route path="/login" element={<LoginLayout><Login /></LoginLayout>} />
<Route path="/splash/:companyId" element={<SplashLayout><Splash /></SplashLayout>} />
```

### **¿Por qué separar layouts para páginas especiales?**
- **Seguridad:** Superadmin aislado del flujo normal
- **UX:** Experiencias diferenciadas según el contexto
- **Mantenibilidad:** Cada layout tiene responsabilidades específicas

---

## 🎨 **Personalización**

### **¿Cómo funciona la personalización por usuario?**
Cada usuario puede personalizar:
- Tema (claro/oscuro/automático)
- Idioma
- Accesibilidad (alto contraste, tamaño de fuente, etc.)
- Notificaciones
- Layout (sidebar colapsado, etc.)

### **¿Cómo funciona la personalización por empresa?**
Cada empresa puede configurar:
- Branding (logo, colores)
- Reglas de negocio
- Módulos habilitados
- Configuración de cumplimiento

### **¿Dónde se almacenan las preferencias?**
- **Usuario:** Base de datos + localStorage para persistencia
- **Empresa:** Base de datos, se carga al iniciar sesión

### **¿Cómo aplicar personalización en componentes?**
```tsx
const { preferences } = useUserPreferences();
const { config } = useCompanyConfiguration();

return (
  <div 
    className={cn(
      `theme-${preferences.theme}`,
      `font-size-${preferences.fontSize}`,
      preferences.highContrast && 'high-contrast'
    )}
    style={{
      '--company-primary-color': config.branding.primaryColor,
    }}
  >
    {/* Contenido */}
  </div>
);
```

---

## 🍪 **Cumplimiento y Cookies**

### **¿Qué tipos de cookies manejamos?**
- **Necesarias:** Siempre activas, esenciales para funcionamiento
- **Funcionales:** Mejoran funcionalidad y personalización
- **Analíticas:** Ayudan a entender el uso del sitio
- **Marketing:** Utilizadas para publicidad personalizada

### **¿Cómo funciona el consentimiento de cookies?**
1. **Primera visita:** Banner obligatorio
2. **Configuración granular:** Usuario selecciona qué acepta
3. **Panel de gestión:** Accesible desde cualquier página
4. **Retiro:** Usuario puede revocar en cualquier momento

### **¿Qué normativas cumplimos?**
- **GDPR:** Consentimiento explícito, derecho a retirar
- **LGPD:** Consentimiento libre, informado e inequívoco
- **CCPA:** Derecho a saber, optar por no vender datos

### **¿Cómo implementar el banner de cookies?**
```tsx
const { consent, saveConsent } = useCookieConsent();

const handleAcceptAll = () => {
  saveConsent({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
  });
};
```

---

## 📊 **Control de Versiones**

### **¿Dónde se muestra la información de versiones?**
En el footer, solo visible en:
- Desarrollo (`NODE_ENV === 'development'`)
- Soporte (`REACT_APP_SUPPORT_MODE === 'true'`)
- Debug (`REACT_APP_DEBUG_MODE === 'true'`)

### **¿Qué información se muestra?**
- Versión de la aplicación principal
- Versiones de módulos (Helpdesk, CRM, PQRS, etc.)
- Versiones de componentes críticos
- Información de build (hash, timestamp)

### **¿Cómo actualizar versiones?**
```bash
# Ejecutar script de actualización
node scripts/update-versions.js

# O manualmente en .env
REACT_APP_VERSION=1.0.0
REACT_APP_HELPDESK_VERSION=0.9.1
REACT_APP_CRM_VERSION=1.0.0
```

### **¿Cómo usar la información de versiones para soporte?**
```tsx
const { versionInfo } = useVersionInfo();

// Copiar información para soporte
const supportInfo = `
App: ${versionInfo.app}
Helpdesk: ${versionInfo.helpdesk}
CRM: ${versionInfo.crm}
Build: ${versionInfo.build}
`;
```

---

## 🧹 **Eliminación de Boilerplate**

### **¿Qué es boilerplate y por qué eliminarlo?**
Boilerplate es código repetitivo que no agrega valor funcional pero es necesario para que el código funcione. Su eliminación:
- Reduce líneas de código en 30-40%
- Mejora mantenibilidad
- Acelera desarrollo
- Reduce errores

### **¿Cuáles son los patrones de boilerplate más comunes?**
- Estados de loading/error repetidos
- Validaciones similares
- Formateo de datos repetido
- Lógica de fetch duplicada
- Interfaces de props similares

### **¿Cómo identificar boilerplate en el código?**
- Código que se repite en múltiples archivos
- Lógica similar con pequeñas variaciones
- Patrones de manejo de estado repetidos
- Validaciones o formateo duplicados

### **¿Cuándo crear un hook/componente base vs mantener código específico?**
- **Crear base:** Cuando la funcionalidad es genérica y se usa en 3+ lugares
- **Mantener específico:** Cuando la funcionalidad es única o muy específica

---

## ✅ **Checklist de Implementación**

### **Antes de crear un nuevo componente:**
- [ ] ¿Existe un componente base que pueda usar?
- [ ] ¿Sigue las convenciones de nomenclatura?
- [ ] ¿Incluye tipos TypeScript completos?
- [ ] ¿Maneja estados de loading y error?
- [ ] ¿Es accesible?
- [ ] ¿Está documentado?

### **Antes de crear un nuevo hook:**
- [ ] ¿Reutiliza hooks base cuando es posible?
- [ ] ¿Maneja errores apropiadamente?
- [ ] ¿Incluye cleanup en useEffect?
- [ ] ¿Está optimizado?
- [ ] ¿Está documentado?

### **Antes de hacer commit:**
- [ ] ¿El código sigue los estándares establecidos?
- [ ] ¿Están eliminados todos los console.log?
- [ ] ¿Están manejados todos los casos de error?
- [ ] ¿Está actualizada la documentación?
- [ ] ¿Pasan todos los tests?

---

## 📚 **Recursos Adicionales**

### **Documentación Relacionada:**
- [Buenas Prácticas Completas](../development/BEST_PRACTICES_COMPLETE.md)
- [Layout Unificado](../development/LAYOUT_UNIFIED_ARCHITECTURE.md)
- [Cumplimiento de Cookies](../development/COOKIE_COMPLIANCE_GUIDE.md)
- [Estándares de Personalización](../development/PERSONALIZATION_STANDARDS.md)
- [Control de Versiones](../development/FOOTER_VERSION_CONTROL.md)

### **Ejemplos de Código:**
- [Hooks Base](../../src/hooks/base/)
- [Componentes Base](../../src/components/base/)
- [Utilidades](../../src/utils/)

---

**Nota:** Esta FAQ es obligatoria para todo el equipo. Cualquier pregunta no cubierta debe ser agregada aquí para mantener la documentación actualizada. 