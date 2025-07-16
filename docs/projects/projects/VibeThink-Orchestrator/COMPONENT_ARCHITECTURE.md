
# 🏗️ Arquitectura de Componentes

## 📋 Principios de Diseño

### 1. **Composición sobre Herencia**
Los componentes deben ser pequeños, focalizados y combinables para crear interfaces complejas.

```typescript
// ✅ CORRECTO: Composición modular
const ConfigurationPanel = () => (
  <Tabs>
    <TabsContent value="configurations">
      <ConfigurationTable data={configurations} />
    </TabsContent>
    <TabsContent value="form">
      <ConfigurationForm onSubmit={handleSubmit} />
    </TabsContent>
    <TabsContent value="audit">
      <AuditLogTable data={auditLog} />
    </TabsContent>
  </Tabs>
);

// ❌ INCORRECTO: Componente monolítico
const ConfigurationPanel = () => {
  // 300+ líneas manejando tabla, formulario, modal, API, etc.
};
```

### 2. **Props Interface Bien Definidas**
Cada componente debe tener una interfaz clara y tipada.

```typescript
interface ConfigurationTableProps {
  configurations: Configuration[];
  onEdit?: (config: Configuration) => void;
  onDelete?: (id: string) => void;
  title: string;
  description: string;
  isLoading?: boolean;
}
```

### 3. **Single Responsibility Principle**
Cada componente debe tener una razón específica para cambiar.

```typescript
// ✅ CORRECTO: Responsabilidad única
const ConfigurationForm = () => {
  // Solo maneja la lógica del formulario
};

const ConfigurationTable = () => {
  // Solo maneja la visualización de datos
};

const AuditLogTable = () => {
  // Solo maneja el log de auditoría
};
```

## 🔧 Patrones de Componentes

### 1. **Container/Presentation Pattern**

#### Container (Smart Component)
```typescript
// containers/ConfigurationContainer.tsx
export const ConfigurationContainer = () => {
  const {
    configurations,
    loading,
    updateConfiguration,
    deleteConfiguration
  } = usePlatformConfigurations();

  const handleEdit = (config: Configuration) => {
    // Lógica de edición
  };

  const handleDelete = (id: string) => {
    // Lógica de eliminación
  };

  return (
    <ConfigurationTable
      configurations={configurations}
      onEdit={handleEdit}
      onDelete={handleDelete}
      loading={loading}
    />
  );
};
```

#### Presentation (Dumb Component)
```typescript
// components/ConfigurationTable.tsx
export const ConfigurationTable: React.FC<ConfigurationTableProps> = ({
  configurations,
  onEdit,
  onDelete,
  loading
}) => {
  return (
    <Table>
      {/* Solo UI, sin lógica de negocio */}
    </Table>
  );
};
```

### 2. **Compound Component Pattern**
```typescript
// Componente padre que maneja estado compartido
const ConfigurationManager = ({ children }) => {
  const [selectedConfig, setSelectedConfig] = useState(null);
  
  return (
    <ConfigurationContext.Provider value={{ selectedConfig, setSelectedConfig }}>
      {children}
    </ConfigurationContext.Provider>
  );
};

// Componentes hijos que usan el contexto
ConfigurationManager.Table = ConfigurationTable;
ConfigurationManager.Form = ConfigurationForm;
ConfigurationManager.Details = ConfigurationDetails;

// Uso
<ConfigurationManager>
  <ConfigurationManager.Table />
  <ConfigurationManager.Form />
  <ConfigurationManager.Details />
</ConfigurationManager>
```

### 3. **Render Props Pattern**
```typescript
interface DataFetcherProps<T> {
  children: (data: T[], loading: boolean, error: string | null) => React.ReactNode;
  fetcher: () => Promise<T[]>;
}

const DataFetcher = <T,>({ children, fetcher }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetcher()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [fetcher]);

  return children(data, loading, error);
};

// Uso
<DataFetcher fetcher={fetchConfigurations}>
  {(configurations, loading, error) => (
    loading ? <Loading /> : <ConfigurationTable data={configurations} />
  )}
</DataFetcher>
```

## 📁 Estructura de Directorios

### Organización por Características
```
src/components/admin/
├── configuration/
│   ├── ConfigurationForm.tsx
│   ├── ConfigurationTable.tsx
│   ├── ConfigurationDetails.tsx
│   ├── hooks/
│   │   └── useConfigurations.tsx
│   ├── types/
│   │   └── configurationTypes.ts
│   └── utils/
│       └── configurationUtils.ts
├── users/
│   ├── UserForm.tsx
│   ├── UserTable.tsx
│   └── ...
└── shared/
    ├── DataTable.tsx
    ├── FormField.tsx
    └── ...
```

### Archivos por Componente
```
ConfigurationForm/
├── ConfigurationForm.tsx      # Componente principal
├── ConfigurationForm.test.tsx # Tests
├── ConfigurationForm.stories.tsx # Storybook
├── types.ts                   # Tipos específicos
└── index.ts                   # Barrel export
```

## 🎨 Component Design Guidelines

### 1. **Tamaños de Componentes**
- **Micro (< 50 líneas)**: Elementos básicos (Button, Input, Badge)
- **Pequeño (50-100 líneas)**: Componentes focalizados (Form, Table Row)
- **Mediano (100-150 líneas)**: Paneles simples (ConfigurationForm)
- **Grande (> 150 líneas)**: ⚠️ Candidato a refactorización

### 2. **Props Guidelines**
```typescript
interface ComponentProps {
  // Props requeridas primero
  data: Configuration[];
  onSubmit: (data: FormData) => void;
  
  // Props opcionales después
  title?: string;
  description?: string;
  isLoading?: boolean;
  
  // Event handlers con 'on' prefix
  onEdit?: (item: Configuration) => void;
  onDelete?: (id: string) => void;
  
  // Render props al final
  renderActions?: (item: Configuration) => React.ReactNode;
}
```

### 3. **Estado Local vs Global**
```typescript
// ✅ Estado local para UI temporal
const ConfigurationForm = () => {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ...
};

// ✅ Estado global para datos compartidos
const ConfigurationContainer = () => {
  const { configurations, loading } = usePlatformConfigurations();
  
  // ...
};
```

## 🔄 Lifecycle y Performance

### 1. **Optimización con React.memo**
```typescript
// Para componentes que reciben props complejas
export const ConfigurationTable = React.memo<ConfigurationTableProps>(
  ({ configurations, onEdit, onDelete }) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    // Custom comparison si es necesario
    return prevProps.configurations.length === nextProps.configurations.length;
  }
);
```

### 2. **useCallback para Event Handlers**
```typescript
const ConfigurationContainer = () => {
  const { updateConfiguration } = usePlatformConfigurations();
  
  const handleEdit = useCallback((config: Configuration) => {
    updateConfiguration(config);
  }, [updateConfiguration]);
  
  return <ConfigurationTable onEdit={handleEdit} />;
};
```

### 3. **useMemo para Computaciones Costosas**
```typescript
const ConfigurationTable = ({ configurations, searchTerm }) => {
  const filteredConfigurations = useMemo(() => {
    return configurations.filter(config => 
      config.config_key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [configurations, searchTerm]);
  
  return <Table data={filteredConfigurations} />;
};
```

## 🧪 Testing Strategy

### 1. **Component Testing**
```typescript
// ConfigurationForm.test.tsx
describe('ConfigurationForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    title: 'Test Form',
    description: 'Test Description'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<ConfigurationForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/clave/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data', async () => {
    const mockOnSubmit = jest.fn();
    render(<ConfigurationForm {...defaultProps} onSubmit={mockOnSubmit} />);
    
    // Simular interacción del usuario
    await userEvent.selectOptions(screen.getByLabelText(/categoría/i), 'ai_models');
    await userEvent.type(screen.getByLabelText(/clave/i), 'openai_models');
    await userEvent.click(screen.getByRole('button', { name: /guardar/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'ai_models',
        config_key: 'openai_models'
      })
    );
  });
});
```

### 2. **Integration Testing**
```typescript
// ConfigurationPanel.integration.test.tsx
describe('ConfigurationPanel Integration', () => {
  it('should create, display and delete configuration', async () => {
    render(<ConfigurationPanel />);
    
    // Crear configuración
    await userEvent.click(screen.getByText(/nueva configuración/i));
    // ... llenar formulario
    await userEvent.click(screen.getByRole('button', { name: /guardar/i }));
    
    // Verificar que aparece en la tabla
    expect(screen.getByText('openai_models')).toBeInTheDocument();
    
    // Eliminar configuración
    await userEvent.click(screen.getByLabelText(/eliminar/i));
    await userEvent.click(screen.getByText(/confirmar/i));
    
    // Verificar que se eliminó
    expect(screen.queryByText('openai_models')).not.toBeInTheDocument();
  });
});
```

## 📚 Component Documentation

### 1. **Storybook Stories**
```typescript
// ConfigurationForm.stories.tsx
export default {
  title: 'Admin/ConfigurationForm',
  component: ConfigurationForm,
  parameters: {
    docs: {
      description: {
        component: 'Formulario para crear y editar configuraciones de plataforma'
      }
    }
  }
} as Meta;

export const Default: Story = {
  args: {
    title: 'Nueva Configuración',
    description: 'Crear una nueva configuración global',
    onSubmit: action('onSubmit')
  }
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true
  }
};
```

### 2. **README por Componente**
```markdown
# ConfigurationForm

## Descripción
Formulario reutilizable para crear y editar configuraciones de plataforma.

## Props
- `onSubmit: (data: FormData) => void` - Callback cuando se envía el formulario
- `title?: string` - Título del formulario
- `isLoading?: boolean` - Estado de carga

## Ejemplo de Uso
```tsx
<ConfigurationForm
  onSubmit={handleSubmit}
  title="Nueva Configuración"
  isLoading={isSubmitting}
/>
```

## Testing
```bash
npm test ConfigurationForm
```
```

---

**Versión**: 2.0  
**Última actualización**: Junio 16, 2025  
**Próxima revisión**: Julio 2025
