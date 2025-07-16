# 🎯 Estrategia de Desarrollo - AI Pair Orchestrator Pro

## 📋 **Filosofía de Desarrollo**

### **Principio Fundamental: "Arreglar paso a paso, heredar coherentemente"**
- **Cada componente que arreglamos se convierte en el estándar** para todos los demás
- **Si no está documentado, esta es nuestra estrategia** por defecto
- **Todo debe ser coherente** - un patrón establecido se aplica a toda la aplicación

---

## 🏗️ **Arquitectura de Componentes**

### **1. Patrón de Componentes UI**
```typescript
// Estructura estándar para todos los componentes
interface ComponentProps {
  data?: DataType[];
  onAction: (item: DataType) => void;
  title?: string;
  isLoading?: boolean;
  className?: string;
}

// Componente funcional con hooks
const ComponentName: React.FC<ComponentProps> = ({ 
  data, 
  onAction, 
  title, 
  isLoading, 
  className 
}) => {
  // Lógica del componente
  return (
    <div className={cn("component-base", className)}>
      {/* UI del componente */}
    </div>
  );
};
```

### **2. Patrón de Hooks Personalizados**
```typescript
// Hook estándar para lógica de negocio
export const useComponentLogic = (params) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Lógica del hook
  
  return {
    data,
    isLoading,
    actions: {
      // Acciones disponibles
    }
  };
};
```

---

## 🎨 **Sistema de Diseño**

### **1. Componentes Base (shadcn/ui)**
- **Usar exclusivamente shadcn/ui** para componentes base
- **No crear componentes desde cero** si existe en shadcn/ui
- **Extender componentes existentes** cuando sea necesario

### **2. Estilos y Clases**
```typescript
// Patrón de clases CSS
const componentClasses = {
  container: "p-4 bg-white rounded-lg shadow-sm border",
  header: "flex items-center justify-between mb-4",
  content: "space-y-4",
  actions: "flex gap-2 mt-4"
};
```

### **3. Responsive Design**
- **Mobile-first** siempre
- **Breakpoints consistentes**: sm, md, lg, xl, 2xl
- **Espaciado uniforme**: p-4, m-6, gap-4

---

## 🔐 **Seguridad y Multi-tenancy**

### **1. Patrón de Seguridad**
```typescript
// Siempre verificar permisos antes de mostrar datos
const { user, hasPermission } = useAuth();
if (!user) return <Navigate to="/login" />;
if (!hasPermission('ADMIN')) return <Unauthorized />;

// Siempre filtrar por company_id
const data = await QueryBuilders.companies()
  .eq('company_id', user.company_id)
  .select('*')
  .execute();
```

### **2. RLS (Row Level Security)**
- **Todas las tablas deben tener políticas RLS**
- **Políticas por defecto**: `company_id = auth.jwt() ->> 'company_id'`
- **Excepciones solo para SUPER_ADMIN**

---

## 📊 **Gestión de Estado**

### **1. React Query para Server State**
```typescript
// Patrón estándar para queries
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', user?.company_id],
  queryFn: () => fetchResource(user?.company_id),
  enabled: !!user?.company_id,
  staleTime: 5 * 60 * 1000, // 5 minutos
});
```

### **2. Local State con useState/useReducer**
- **useState** para estado simple
- **useReducer** para estado complejo
- **Context** solo para estado global compartido

---

## 🧪 **Testing Strategy**

### **1. Component Testing**
```typescript
// Patrón de test para componentes
describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName {...mockProps} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('should handle user interactions', () => {
    const mockAction = jest.fn();
    render(<ComponentName onAction={mockAction} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockAction).toHaveBeenCalled();
  });
});
```

### **2. Integration Testing**
- **Testear flujos completos** (registro → pago → facturación)
- **Mockear servicios externos** (Stripe, Zammad)
- **Testear permisos y seguridad**

---

## 🚀 **Flujo de Desarrollo**

### **1. Crear Componente**
1. **Definir interfaz de props** siguiendo el patrón estándar
2. **Implementar componente** usando shadcn/ui
3. **Crear hook personalizado** si es necesario
4. **Agregar tests** básicos

### **2. Integrar en la Aplicación**
1. **Verificar permisos** y multi-tenancy
2. **Conectar con React Query** para datos
3. **Agregar manejo de errores**
4. **Testear flujo completo**

### **3. Documentar**
1. **Actualizar esta estrategia** si se establece un nuevo patrón
2. **Documentar decisiones arquitectónicas**
3. **Actualizar README** del componente

---

## 📝 **Convenciones de Código**

### **1. Nomenclatura**
- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useUserProfile.ts`)
- **Utilidades**: camelCase (`formatCurrency.ts`)
- **Tipos**: PascalCase (`UserProfileProps`)

### **2. Estructura de Archivos**
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── feature-name/    # Componentes específicos de feature
│   └── layout/          # Componentes de layout
├── hooks/
│   └── useFeatureName.ts
├── types/
│   └── featureName.ts
└── utils/
    └── featureName.ts
```

### **3. Imports**
```typescript
// Orden de imports
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// Componentes externos
import { Button } from '@/components/ui/button';

// Componentes internos
import { UserProfile } from '@/components/UserProfile';

// Hooks
import { useUserProfile } from '@/hooks/useUserProfile';

// Tipos
import { UserProfileProps } from '@/types/userProfile';

// Utilidades
import { formatCurrency } from '@/utils/formatters';
```

---

## 🔄 **Evolución de la Estrategia**

### **Cuándo Actualizar esta Documentación**
1. **Nuevo patrón establecido** que se aplica a múltiples componentes
2. **Cambio en arquitectura** que afecta toda la aplicación
3. **Nueva tecnología** o librería adoptada
4. **Lección aprendida** que debe aplicarse consistentemente

### **Proceso de Actualización**
1. **Identificar** el nuevo patrón o cambio
2. **Documentar** en esta estrategia
3. **Aplicar** a componentes existentes
4. **Comunicar** al equipo

---

## 🎯 **Objetivos de Calidad**

### **1. Consistencia**
- **Mismo patrón** en toda la aplicación
- **Misma experiencia** de usuario
- **Mismo nivel** de calidad

### **2. Mantenibilidad**
- **Código legible** y bien documentado
- **Componentes reutilizables**
- **Tests automatizados**

### **3. Escalabilidad**
- **Arquitectura preparada** para crecimiento
- **Patrones establecidos** para nuevas features
- **Documentación actualizada**

---

## 📚 **Recursos y Referencias**

### **Documentación Técnica**
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **Patrones de Referencia**
- **Componentes existentes** en el proyecto
- **Esta documentación** como guía principal
- **Mejores prácticas** de React y TypeScript

---

## 🎯 **Patrones Establecidos (Actualizado)**

### **1. Componente Base (PatternBase)**
```typescript
// Patrón establecido para todos los componentes
<PatternBase
  title="Título del Componente"
  description="Descripción opcional"
  isLoading={isLoading}
  error={error}
  className={className}
  variant="card" // default | card | section | minimal
  size="md" // sm | md | lg | xl
  actions={<Button>Acción</Button>}
>
  {/* Contenido del componente */}
</PatternBase>
```

### **2. Hook Base (usePatternBase)**
```typescript
// Hook estándar para manejo de estados
const { isLoading, error, handleAsync, clearError } = usePatternBase();

const result = await handleAsync(
  async () => {
    // Lógica asíncrona
    return data;
  },
  'Mensaje de error personalizado'
);
```

### **3. Props Estándar**
```typescript
// Props base para todos los componentes
interface BaseComponentProps {
  className?: string;
  isLoading?: boolean;
  error?: string | null;
  onError?: (error: string) => void;
}

// Props para componentes con datos
interface DataComponentProps<T> extends BaseComponentProps {
  data?: T[];
  onAction?: (item: T) => void;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

// Props para componentes de formulario
interface FormComponentProps extends BaseComponentProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialData?: any;
}
```

### **4. Ejemplo de Implementación**
```typescript
// Componente que sigue el patrón establecido
const MyComponent: React.FC<DataComponentProps<MyDataType>> = ({
  data,
  onAction,
  title,
  isLoading,
  error,
  className,
  actions
}) => {
  const { handleAsync, clearError } = usePatternBase();

  const handleAction = async (item: MyDataType) => {
    const result = await handleAsync(
      async () => {
        // Lógica de acción
        return await processItem(item);
      },
      'Error procesando elemento'
    );

    if (result) {
      onAction?.(item);
    }
  };

  return (
    <PatternBase
      title={title}
      isLoading={isLoading}
      error={error}
      className={className}
      actions={actions}
      variant="card"
    >
      <div className="space-y-4">
        {data?.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg">
            {/* Contenido del item */}
            <Button onClick={() => handleAction(item)}>
              Acción
            </Button>
          </div>
        ))}
      </div>
    </PatternBase>
  );
};
```

---

## 🏆 **Componentes Mejorados (Ejemplos Concretos)**

### **1. ColombianCardRegistrationV2**
- **Aplica PatternBase** para estructura consistente
- **Usa usePatternBase** para manejo de estados
- **Implementa FormComponentProps** para props estándar
- **Manejo de errores** mejorado y coherente
- **Validación** en tiempo real
- **Accesibilidad** mejorada

### **2. useBilling Hook**
- **Patrón establecido** para hooks de negocio
- **Manejo de estados** consistente
- **Tipos TypeScript** bien definidos
- **Funciones utilitarias** reutilizables
- **Integración** con React Query preparada

### **3. ColombianPlansDisplay**
- **Diseño coherente** con el sistema
- **Responsive** y accesible
- **Internacionalización** integrada
- **Estados de carga** y error manejados
- **Patrón de precios** establecido

---

**Última actualización**: 2025-01-20  
**Responsable**: Equipo de Desarrollo  
**Versión**: 2.0 - Con patrones establecidos 