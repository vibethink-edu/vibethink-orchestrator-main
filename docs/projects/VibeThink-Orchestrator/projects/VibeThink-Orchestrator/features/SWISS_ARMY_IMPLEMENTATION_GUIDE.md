# 🚀 Guía de Implementación - Framework "Navaja Suiza"

## 📋 **Resumen Ejecutivo**

Esta guía proporciona instrucciones paso a paso para implementar el framework "Navaja Suiza" en nuestro proyecto SaaS empresarial multitenant.

## 🎯 **Fase 1: Configuración Inicial (Semana 1)**

### **1.1 Instalación de Dependencias**

```bash
# Instalar herramientas de la navaja suiza
npm install recharts @tanstack/react-table react-hook-form @hookform/resolvers zod
npm install @assistant-ui/react @assistant-ui/ui
npm install @radix-ui/react-* # Para shadcn/ui

# Instalar utilidades de desarrollo
npm install -D @types/d3 # Para casos especializados
```

### **1.2 Configuración de shadcn/ui**

```bash
# Inicializar shadcn/ui
npx shadcn@latest init

# Instalar componentes base
npx shadcn@latest add button card badge progress tabs
npx shadcn@latest add table form input select
npx shadcn@latest add dialog dropdown-menu
```

### **1.3 Configuración de Recharts**

```typescript
// src/config/charts.ts
import { ResponsiveContainer } from 'recharts';

export const chartConfig = {
  responsive: true,
  maintainAspectRatio: false,
  defaultHeight: 300,
  colors: [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ]
};

// Componente wrapper para consistencia
export const ChartContainer: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <ResponsiveContainer width="100%" height={chartConfig.defaultHeight}>
    {children}
  </ResponsiveContainer>
);
```

### **1.4 Configuración de TanStack Table**

```typescript
// src/config/tables.ts
import { createColumnHelper } from '@tanstack/react-table';

export const tableConfig = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  defaultSorting: [],
  enableSorting: true,
  enableFiltering: true,
  enablePagination: true
};

// Helper para crear columnas consistentes
export const createStandardColumns = <T extends object>() => {
  const columnHelper = createColumnHelper<T>();
  
  return {
    columnHelper,
    defaultProps: {
      enableSorting: true,
      enableColumnFilter: true
    }
  };
};
```

### **1.5 Configuración de React Hook Form + Zod**

```typescript
// src/config/forms.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const formConfig = {
  mode: 'onChange' as const,
  defaultValues: {},
  resolver: zodResolver
};

// Schemas comunes
export const commonSchemas = {
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  required: z.string().min(1, 'Campo requerido'),
  optional: z.string().optional()
};
```

## 🎯 **Fase 2: Creación de Templates (Semana 2)**

### **2.1 Template de Gráficos**

```typescript
// src/components/templates/ChartTemplate.tsx
import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area } from 'recharts';
import { ChartContainer, chartConfig } from '@/config/charts';

interface ChartTemplateProps {
  data: any[];
  type: 'line' | 'bar' | 'pie' | 'area';
  xKey: string;
  yKey: string;
  title?: string;
  height?: number;
}

export const ChartTemplate: React.FC<ChartTemplateProps> = ({
  data,
  type,
  xKey,
  yKey,
  title,
  height = chartConfig.defaultHeight
}) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <Line type="monotone" dataKey={yKey} stroke={chartConfig.colors[0]} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <Bar dataKey={yKey} fill={chartConfig.colors[0]} />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie data={data} dataKey={yKey} fill={chartConfig.colors[0]} />
          </PieChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <Area type="monotone" dataKey={yKey} fill={chartConfig.colors[0]} />
          </AreaChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      <ChartContainer>
        {renderChart()}
      </ChartContainer>
    </div>
  );
};
```

### **2.2 Template de Tablas**

```typescript
// src/components/templates/TableTemplate.tsx
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import { tableConfig } from '@/config/tables';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TableTemplateProps<T extends object> {
  data: T[];
  columns: any[];
  title?: string;
  enableSearch?: boolean;
  enablePagination?: boolean;
}

export function TableTemplate<T extends object>({
  data,
  columns,
  title,
  enableSearch = true,
  enablePagination = true
}: TableTemplateProps<T>) {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...tableConfig
  });

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      
      {enableSearch && (
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Buscar..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enablePagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </span>
        </div>
      )}
    </div>
  );
}
```

### **2.3 Template de Formularios**

```typescript
// src/components/templates/FormTemplate.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formConfig } from '@/config/forms';

interface FormTemplateProps {
  schema: z.ZodSchema;
  defaultValues?: any;
  onSubmit: (data: any) => void;
  title?: string;
  submitText?: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number';
    placeholder?: string;
    required?: boolean;
  }>;
}

export const FormTemplate: React.FC<FormTemplateProps> = ({
  schema,
  defaultValues,
  onSubmit,
  title,
  submitText = 'Enviar',
  fields
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
    ...formConfig
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            {...form.register(field.name)}
          />
          {form.formState.errors[field.name] && (
            <p className="text-sm text-red-500">
              {form.formState.errors[field.name]?.message as string}
            </p>
          )}
        </div>
      ))}

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Enviando...' : submitText}
      </Button>
    </form>
  );
};
```

## 🎯 **Fase 3: Implementación del Hook (Semana 3)**

### **3.1 Hook Principal**

```typescript
// src/hooks/useSwissArmyDecision.ts
// (Ver archivo completo en la implementación anterior)
```

### **3.2 Hook de Evaluación Rápida**

```typescript
// src/hooks/useQuickEvaluation.ts
import { useState } from 'react';
import { useSwissArmyDecision } from './useSwissArmyDecision';

export const useQuickEvaluation = () => {
  const { getRecommendations, createDecision } = useSwissArmyDecision();
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const evaluateUseCase = async (useCase: any) => {
    setIsEvaluating(true);
    try {
      const recommendation = getRecommendations(useCase);
      const decision = createDecision(useCase, recommendation, recommendation);
      
      setEvaluation({
        recommendation,
        decision,
        timestamp: new Date()
      });
      
      return { recommendation, decision };
    } catch (error) {
      console.error('Error evaluating use case:', error);
      throw error;
    } finally {
      setIsEvaluating(false);
    }
  };

  return {
    evaluation,
    isEvaluating,
    evaluateUseCase
  };
};
```

## 🎯 **Fase 4: Componentes de UI (Semana 4)**

### **4.1 Panel de Decisión**

```typescript
// src/components/ui/SwissArmyDecisionPanel.tsx
// (Ver archivo completo en la implementación anterior)
```

### **4.2 Componente de Métricas**

```typescript
// src/components/ui/SwissArmyMetrics.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface SwissArmyMetricsProps {
  metrics: {
    swissArmySuccessRate: number;
    averageImplementationTime: number;
    specializedToolUsage: number;
  };
}

export const SwissArmyMetrics: React.FC<SwissArmyMetricsProps> = ({ metrics }) => {
  const getStatusColor = (value: number, threshold: number) => {
    return value >= threshold ? 'text-green-600' : 
           value >= threshold * 0.8 ? 'text-yellow-600' : 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Éxito Navaja Suiza</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getStatusColor(metrics.swissArmySuccessRate, 80)}`}>
            {metrics.swissArmySuccessRate.toFixed(1)}%
          </div>
          <Progress value={metrics.swissArmySuccessRate} className="mt-2" />
          <Badge variant={metrics.swissArmySuccessRate >= 80 ? 'default' : 'secondary'}>
            {metrics.swissArmySuccessRate >= 80 ? 'Excelente' : 'Necesita mejora'}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tiempo Promedio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getStatusColor(4, metrics.averageImplementationTime)}`}>
            {metrics.averageImplementationTime.toFixed(1)}h
          </div>
          <Progress value={(4 / metrics.averageImplementationTime) * 100} className="mt-2" />
          <Badge variant={metrics.averageImplementationTime <= 4 ? 'default' : 'secondary'}>
            {metrics.averageImplementationTime <= 4 ? 'Óptimo' : 'Lento'}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Herramientas Especializadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getStatusColor(15, metrics.specializedToolUsage)}`}>
            {metrics.specializedToolUsage.toFixed(1)}%
          </div>
          <Progress value={metrics.specializedToolUsage} className="mt-2" />
          <Badge variant={metrics.specializedToolUsage <= 15 ? 'default' : 'secondary'}>
            {metrics.specializedToolUsage <= 15 ? 'Controlado' : 'Alto'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
```

## 🎯 **Fase 5: Página de Administración (Semana 5)**

### **5.1 Página Principal**

```typescript
// src/pages/admin/SwissArmyFramework.tsx
// (Ver archivo completo en la implementación anterior)
```

### **5.2 Rutas de Administración**

```typescript
// src/routes/adminRoutes.tsx
import { SwissArmyFramework } from '@/pages/admin/SwissArmyFramework';

export const adminRoutes = [
  {
    path: '/admin/swiss-army',
    element: <SwissArmyFramework />,
    title: 'Framework Navaja Suiza',
    icon: 'Tool'
  }
];
```

## 🎯 **Fase 6: Testing y Validación (Semana 6)**

### **6.1 Tests del Hook**

```typescript
// src/hooks/__tests__/useSwissArmyDecision.test.ts
import { renderHook, act } from '@testing-library/react';
import { useSwissArmyDecision } from '../useSwissArmyDecision';

describe('useSwissArmyDecision', () => {
  it('should evaluate swiss army tools correctly', () => {
    const { result } = renderHook(() => useSwissArmyDecision());

    const useCase = {
      id: 'test-1',
      name: 'Dashboard de Ventas',
      description: 'Gráficos de ventas mensuales',
      requirements: ['gráficos de línea', 'filtros'],
      performanceRequirement: 1000,
      complexity: 5,
      businessImpact: 7,
      priority: 'medium' as const
    };

    act(() => {
      const evaluation = result.current.evaluateSwissArmy(useCase);
      expect(evaluation.canHandle).toBe(true);
      expect(evaluation.recommendedTools.length).toBeGreaterThan(0);
    });
  });

  it('should recommend specialized tools when needed', () => {
    const { result } = renderHook(() => useSwissArmyDecision());

    const complexUseCase = {
      id: 'test-2',
      name: 'Visualización 3D',
      description: 'Gráficos 3D interactivos',
      requirements: ['gráficos 3D', 'interactividad avanzada'],
      performanceRequirement: 3000,
      complexity: 9,
      businessImpact: 9,
      priority: 'critical' as const
    };

    act(() => {
      const swissResult = result.current.evaluateSwissArmy(complexUseCase);
      const specializedResult = result.current.shouldUseSpecialized(complexUseCase, swissResult);
      expect(specializedResult.shouldUse).toBe(true);
    });
  });
});
```

### **6.2 Tests de Componentes**

```typescript
// src/components/ui/__tests__/SwissArmyDecisionPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SwissArmyDecisionPanel } from '../SwissArmyDecisionPanel';

describe('SwissArmyDecisionPanel', () => {
  it('should render metrics correctly', () => {
    render(<SwissArmyDecisionPanel showMetrics={true} />);
    
    expect(screen.getByText('Framework Navaja Suiza')).toBeInTheDocument();
    expect(screen.getByText('Éxito Navaja Suiza')).toBeInTheDocument();
  });

  it('should show evaluation form', () => {
    render(<SwissArmyDecisionPanel />);
    
    fireEvent.click(screen.getByText('Evaluar'));
    expect(screen.getByText('Evaluación Rápida')).toBeInTheDocument();
  });
});
```

## 🎯 **Fase 7: Documentación y Entrenamiento (Semana 7)**

### **7.1 Guía de Uso para Desarrolladores**

```markdown
# Guía de Uso - Framework Navaja Suiza

## ¿Cuándo usar la Navaja Suiza?

### ✅ Casos Ideales:
- Gráficos simples (línea, barras, pastel)
- Tablas con menos de 10k filas
- Formularios estándar
- Chat IA básico
- Componentes UI comunes

### ❌ Casos que Requieren Herramientas Especializadas:
- Gráficos 3D o visualizaciones complejas
- Tablas con más de 100k filas
- Editores de código
- Mapas interactivos
- Real-time streaming masivo

## Proceso de Decisión:

1. **Evaluar con la navaja suiza primero**
2. **Medir performance y UX**
3. **Solo usar especializada si es necesario**
4. **Documentar la decisión**

## Ejemplos de Uso:

```typescript
// ✅ Correcto - Usar navaja suiza
const SalesChart = () => (
  <ChartTemplate
    data={salesData}
    type="line"
    xKey="month"
    yKey="sales"
    title="Ventas Mensuales"
  />
);

// ❌ Incorrecto - Over-engineering
const SalesChart = () => (
  <D3Chart data={salesData} /> // Para un gráfico simple
);
```
```

### **7.2 Checklist de Implementación**

```markdown
# Checklist de Implementación

## Configuración Inicial
- [ ] Dependencias instaladas
- [ ] shadcn/ui configurado
- [ ] Templates creados
- [ ] Hook implementado

## Componentes
- [ ] Panel de decisión
- [ ] Métricas
- [ ] Página de administración
- [ ] Tests escritos

## Documentación
- [ ] Guía de uso
- [ ] Ejemplos prácticos
- [ ] FAQ
- [ ] Troubleshooting

## Entrenamiento
- [ ] Equipo capacitado
- [ ] Casos de uso documentados
- [ ] Proceso de decisión establecido
- [ ] Métricas de seguimiento
```

## 🎯 **Fase 8: Monitoreo y Optimización (Semana 8+)**

### **8.1 Métricas de Seguimiento**

```typescript
// src/utils/metricsTracker.ts
export const trackFrameworkUsage = {
  logDecision: (decision: ToolDecision) => {
    // Enviar a analytics
    analytics.track('swiss_army_decision', {
      decision: decision.decision,
      useCase: decision.useCase.name,
      complexity: decision.useCase.complexity,
      timestamp: new Date()
    });
  },

  logPerformance: (tool: string, performance: number) => {
    analytics.track('tool_performance', {
      tool,
      performance,
      timestamp: new Date()
    });
  },

  logError: (error: string, context: any) => {
    analytics.track('framework_error', {
      error,
      context,
      timestamp: new Date()
    });
  }
};
```

### **8.2 Optimización Continua**

```typescript
// src/utils/optimization.ts
export const optimizeFramework = {
  analyzeTrends: (decisions: ToolDecision[]) => {
    // Analizar tendencias y sugerir mejoras
    const trends = calculateFrameworkMetrics(decisions);
    
    if (trends.specializedToolUsage > 20) {
      return {
        recommendation: 'Revisar criterios de decisión',
        action: 'Ajustar umbrales de complejidad'
      };
    }
    
    return null;
  },

  suggestImprovements: (metrics: any) => {
    const suggestions = [];
    
    if (metrics.swissArmySuccessRate < 80) {
      suggestions.push('Mejorar templates de componentes base');
    }
    
    if (metrics.averageImplementationTime > 6) {
      suggestions.push('Crear más templates predefinidos');
    }
    
    return suggestions;
  }
};
```

## 🎯 **Conclusión**

Esta implementación del framework "Navaja Suiza" proporciona:

1. **Consistencia** en el stack tecnológico
2. **Eficiencia** en el desarrollo
3. **Calidad** en las decisiones
4. **Escalabilidad** sin fragmentación
5. **Monitoreo** continuo del rendimiento

**La clave del éxito es: "Siempre empezar simple, optimizar basado en evidencia"**.

---

*Última actualización: Enero 2024*
*Próxima revisión: Abril 2024* 