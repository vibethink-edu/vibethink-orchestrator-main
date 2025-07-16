
# Component Documentation Standards

## Overview
Este documento establece los estándares de documentación para todos los componentes del proyecto. La documentación debe ser clara, completa y útil tanto para desarrolladores actuales como futuros.

## Estándares de Documentación de Componentes

### 1. Comentarios JSDoc
Todos los componentes deben incluir comentarios JSDoc descriptivos:

```typescript
/**
 * Componente principal de navegación lateral
 * Proporciona navegación adaptativa con soporte para tooltips,
 * estados collapsed/expanded y permisos de usuario
 * 
 * @param collapsed - Estado de colapso del sidebar
 * @param onToggleCollapse - Función para alternar estado collapsed
 * @param onClose - Función para cerrar el sidebar en mobile
 */
```

### 2. Documentación de Props
Todas las interfaces de props deben estar documentadas:

```typescript
interface ComponentProps {
  /** Título principal del componente */
  title: string;
  /** Función callback ejecutada al hacer clic */
  onClick: () => void;
  /** Si el componente está en estado de carga */
  loading?: boolean;
  /** Clase CSS adicional opcional */
  className?: string;
}
```

### 3. Comentarios Inline
Para lógica compleja, incluir comentarios explicativos:

```typescript
// Verificar permisos de usuario antes de mostrar opciones de admin
const isAdmin = user?.profile?.role === 'ADMIN' || user?.profile?.role === 'OWNER';

// Generar slug automáticamente a partir del nombre
const generateSlug = (name: string) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-')         // Espacios a guiones
    .replace(/-+/g, '-')          // Múltiples guiones a uno
    .trim();
};
```

### 4. Tooltips Obligatorios
Todos los elementos interactivos DEBEN tener tooltips descriptivos:

```typescript
<TooltipWrapper content="Crear nueva empresa con la configuración seleccionada">
  <Button onClick={handleCreate}>
    Crear Empresa
  </Button>
</TooltipWrapper>
```

### 5. Documentación de Estados
Documentar estados complejos y su propósito:

```typescript
const [formData, setFormData] = useState<FormData>({
  name: '',           // Nombre de la empresa
  slug: '',           // URL única para identificación
  status: 'TRIAL',    // Estado inicial siempre en trial
  plan_id: ''         // ID del plan seleccionado
});
```

## Estándares UX/UI Implementados

### Tooltips Obligatorios
- ✅ Todos los botones
- ✅ Todos los iconos
- ✅ Campos de formulario
- ✅ Badges y estados
- ✅ Elementos de navegación
- ✅ Controles de filtro
- ✅ Toggles y switches

### Mensajes de Tooltip
Los tooltips deben ser:
- **Descriptivos**: Explicar claramente qué hace el elemento
- **Contextuales**: Incluir estado actual cuando sea relevante
- **Concisos**: Cortos pero informativos
- **Accionables**: Usar verbos de acción para elementos interactivos

### Ejemplos de Buenos Tooltips
```typescript
// ❌ Malo
<TooltipWrapper content="Botón">
  <Button>Save</Button>
</TooltipWrapper>

// ✅ Bueno
<TooltipWrapper content="Guardar cambios en la configuración">
  <Button>Save</Button>
</TooltipWrapper>

// ✅ Excelente con contexto
<TooltipWrapper content={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}>
  <Button onClick={toggle}>
    <Menu />
  </Button>
</TooltipWrapper>
```

## Estructura de Archivos de Componentes

### Componentes Simples (< 100 líneas)
```
src/components/ui/Button.tsx
```

### Componentes Complejos
```
src/components/admin/
├── CompanyManager/
│   ├── index.tsx              # Componente principal
│   ├── CompanyList.tsx        # Lista de empresas
│   ├── CompanyForm.tsx        # Formulario de empresa
│   ├── CompanyFilters.tsx     # Filtros
│   └── types.ts               # Tipos específicos
```

### Hooks Personalizados
```
src/hooks/
├── useCompanyData.ts          # Lógica de datos
├── useFormValidation.ts       # Validaciones
└── usePermissions.ts          # Lógica de permisos
```

## Accesibilidad

### Estándares Obligatorios
- ✅ Navegación por teclado en todos los elementos
- ✅ ARIA labels apropiados
- ✅ Contraste de color suficiente
- ✅ Indicadores de foco visibles
- ✅ Tooltips compatibles con lectores de pantalla

### Implementación
```typescript
<button
  aria-label="Crear nueva empresa"
  aria-describedby="create-company-tooltip"
  onKeyDown={handleKeyDown}
  className="focus:ring-2 focus:ring-primary"
>
  <Plus className="w-4 h-4" />
</button>
```

## Testing y Quality Assurance

### Checklist de Componente
Antes de marcar un componente como completo:

- [ ] JSDoc documentado
- [ ] Props interface documentada
- [ ] Tooltips en todos los elementos interactivos
- [ ] Responsive design verificado
- [ ] Accesibilidad testeda
- [ ] Estados de error manejados
- [ ] Loading states implementados
- [ ] TypeScript sin errores
- [ ] Comentarios inline para lógica compleja

### Performance
- ✅ Lazy loading para componentes pesados
- ✅ Memoization cuando apropiado
- ✅ Optimización de re-renders
- ✅ Bundle size monitoring

## Mantenimiento Continuo

### Refactoring Guidelines
Cuando un archivo supera las 200 líneas:
1. Identificar responsabilidades separables
2. Extraer componentes más pequeños
3. Crear hooks para lógica reutilizable
4. Mantener la funcionalidad exacta
5. Actualizar imports y exports
6. Verificar que no se rompa nada

### Code Review Checklist
- [ ] Tooltips presentes y descriptivos
- [ ] Documentación completa
- [ ] Accesibilidad implementada
- [ ] Performance optimizada
- [ ] Responsive design
- [ ] Error handling robusto
