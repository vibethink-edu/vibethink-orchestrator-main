
# 📖 Estándares de Desarrollo para Cursor IDE

## 🎯 Principios Fundamentales

### 1. **Componentes Pequeños y Focalizados**
- **Máximo 150 líneas** por componente
- **Una responsabilidad** por componente
- **Reutilización** antes que duplicación

```typescript
// ✅ CORRECTO: Componente focalizado
const ConfigurationForm = ({ onSubmit, isLoading }) => {
  // Solo maneja formulario de configuraciones
};

// ❌ INCORRECTO: Componente que hace demasiado
const AdminPanel = () => {
  // Maneja formularios, tablas, modal, API calls, etc.
};
```

### 2. **Separación Clara de Responsabilidades**
- **Hooks**: Lógica de negocio y estado
- **Componentes**: Solo UI y eventos
- **Utils**: Funciones puras y helpers
- **Types**: Definiciones de tipos centralizadas

### 3. **Nomenclatura Consistente**
- **PascalCase**: Componentes React
- **camelCase**: Functions, variables, hooks
- **kebab-case**: Archivos y carpetas
- **UPPER_SNAKE_CASE**: Constantes

## 🏗️ Estructura de Archivos

### Organización por Dominio
```
src/
├── components/
│   ├── admin/           # Componentes de administración
│   ├── auth/           # Componentes de autenticación  
│   ├── ui/             # Componentes de UI base
│   └── layout/         # Componentes de layout
├── hooks/              # Custom hooks
├── pages/              # Páginas principales
├── services/           # Lógica de API y servicios externos
├── types/              # Definiciones de tipos
└── utils/              # Funciones utilitarias
```

### Convenciones de Nombres
```typescript
// Componentes
ConfigurationForm.tsx
AuditLogTable.tsx
UserManagementPanel.tsx

// Hooks
usePlatformConfigurations.tsx
useAuth.tsx
useApiData.tsx

// Services
apiService.ts
authService.ts
configurationService.ts

// Types
platformTypes.ts
userTypes.ts
apiTypes.ts
```

## 🔧 Patrones de Código

### 1. **Custom Hooks para Lógica**
```typescript
// ✅ CORRECTO: Hook maneja toda la lógica
export const useConfigurations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchData = async () => {
    // API logic here
  };
  
  return { data, loading, fetchData };
};

// En el componente solo UI
const ConfigPanel = () => {
  const { data, loading, fetchData } = useConfigurations();
  
  return (
    <div>
      {loading ? <Loading /> : <Table data={data} />}
    </div>
  );
};
```

### 2. **Componentes Reutilizables**
```typescript
// ✅ CORRECTO: Componente genérico
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
}

const DataTable = <T,>({ data, columns, onEdit, onDelete }: TableProps<T>) => {
  // Implementación genérica
};

// Uso específico
const ConfigurationsTable = () => {
  const configurations = useConfigurations();
  
  return (
    <DataTable
      data={configurations.data}
      columns={configColumns}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};
```

### 3. **Error Handling Consistente**
```typescript
// ✅ CORRECTO: Error handling centralizado
const useApiCall = () => {
  return useMutation({
    mutationFn: async (data) => {
      try {
        const result = await apiCall(data);
        return result;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Operación exitosa');
    },
    onError: (error) => {
      toast.error('Error en la operación');
    }
  });
};
```

## 📝 Documentación de Código

### 1. **JSDoc para Componentes Públicos**
```typescript
/**
 * Formulario para crear y editar configuraciones de plataforma
 * 
 * @param onSubmit - Callback ejecutado cuando se envía el formulario
 * @param isLoading - Estado de carga durante el envío
 * @param title - Título del formulario
 * @param description - Descripción mostrada debajo del título
 * 
 * @example
 * ```tsx
 * <ConfigurationForm
 *   onSubmit={handleSubmit}
 *   isLoading={isSubmitting}
 *   title="Nueva Configuración"
 *   description="Crear configuración global"
 * />
 * ```
 */
export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  onSubmit,
  isLoading,
  title,
  description
}) => {
  // Implementation
};
```

### 2. **Comentarios Explicativos**
```typescript
// ✅ CORRECTO: Explicar el "por qué"
// Transform data to match our interface because Supabase
// returns companies as SelectQueryError when not found
return (data || []).map(item => ({
  ...item,
  companies: item.companies && typeof item.companies === 'object' && 'name' in item.companies 
    ? item.companies as { name: string; slug: string }
    : null
})) as AuditLogEntry[];

// ❌ INCORRECTO: Explicar el "qué" (obvio del código)
// Set loading to true
setLoading(true);
```

## 🧪 Testing Guidelines

### 1. **Estructura de Tests**
```typescript
// ConfigurationForm.test.tsx
describe('ConfigurationForm', () => {
  const mockOnSubmit = jest.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });
  
  it('should render form fields correctly', () => {
    render(<ConfigurationForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText('Categoría')).toBeInTheDocument();
    expect(screen.getByLabelText('Clave de Configuración')).toBeInTheDocument();
  });
  
  it('should call onSubmit with correct data', async () => {
    render(<ConfigurationForm onSubmit={mockOnSubmit} />);
    
    await userEvent.type(screen.getByLabelText('Categoría'), 'ai_models');
    await userEvent.click(screen.getByRole('button', { name: /guardar/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'ai_models'
      })
    );
  });
});
```

### 2. **Testing de Hooks**
```typescript
// usePlatformConfigurations.test.tsx
describe('usePlatformConfigurations', () => {
  it('should fetch configurations on mount', async () => {
    const { result } = renderHook(() => usePlatformConfigurations());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.configurations).toBeDefined();
  });
});
```

## 🔍 Code Review Checklist

### ✅ Pre-Commit Checks
- [ ] **Componente < 150 líneas**: ¿Es necesario dividir?
- [ ] **Responsabilidad única**: ¿El componente hace solo una cosa?
- [ ] **Nomenclatura consistente**: ¿Sigue las convenciones?
- [ ] **Tipos definidos**: ¿Todas las props tienen tipos?
- [ ] **Error handling**: ¿Se manejan los errores apropiadamente?
- [ ] **Documentación**: ¿Está documentado si es público?

### ✅ Architecture Review
- [ ] **Separación de responsabilidades**: ¿UI separada de lógica?
- [ ] **Reutilización**: ¿Se puede reutilizar este componente?
- [ ] **Performance**: ¿Hay optimizaciones innecesarias?
- [ ] **Accesibilidad**: ¿Es accesible para screen readers?
- [ ] **Mobile**: ¿Funciona en dispositivos móviles?

## 🚀 Workflow de Desarrollo

### 1. **Feature Development**
```bash
# 1. Crear rama feature
git checkout -b feature/component-refactor

# 2. Desarrollar en incrementos pequeños
# - Crear hook
# - Crear componente básico  
# - Agregar funcionalidad
# - Refactorizar si > 150 líneas

# 3. Testing local
npm run test
npm run lint
npm run type-check

# 4. Commit con mensaje descriptivo
git commit -m "feat: add reusable ConfigurationForm component"

# 5. Push y PR
git push origin feature/component-refactor
```

### 2. **Refactoring Process**
1. **Identificar**: Componentes > 150 líneas o con múltiples responsabilidades
2. **Planear**: Dividir en componentes más pequeños
3. **Extraer**: Comenzar con la lógica (hooks) 
4. **Dividir**: Separar UI en componentes focalizados
5. **Testear**: Verificar que todo funciona igual
6. **Documentar**: Actualizar documentación y logs

## 📋 Herramientas Recomendadas

### Extensions de VSCode/Cursor
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Hero**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**
- **Thunder Client** (para testing de APIs)

### Configuración de Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

---

**Versión**: 1.0  
**Última actualización**: Junio 16, 2025  
**Mantenido por**: Equipo de Desarrollo  
**Revisión**: Mensual
