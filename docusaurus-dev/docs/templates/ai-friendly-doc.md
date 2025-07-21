---
id: ai-friendly-doc
title: 🤖 Template de Documentación IA-Friendly
sidebar_label: Template IA-Friendly
description: Template optimizado para herramientas de IA y análisis automático
---

# 🤖 **Template de Documentación IA-Friendly**

## 📋 **Metadatos Estructurados**

```json
{
  "component": {
    "name": "ComponentName",
    "type": "functional|class|memoized",
    "category": "ui|form|layout|utility",
    "complexity": "low|medium|high",
    "dependencies": ["react", "typescript", "tailwind"],
    "version": "1.0.0",
    "lastUpdated": "2025-07-19"
  },
  "ai": {
    "keywords": ["button", "ui", "interactive", "form"],
    "tags": ["component", "react", "typescript"],
    "summary": "Brief description for AI tools",
    "usagePatterns": ["standalone", "form-element", "navigation"],
    "relatedComponents": ["Button", "Input", "Card"]
  }
}
```

## 🎯 **Descripción del Componente**

**Propósito:** [Descripción clara del propósito del componente]

**Contexto de Uso:** [Cuándo y dónde usar este componente]

**Responsabilidades:** [Lista de responsabilidades específicas]

## 🏗️ **Arquitectura Técnica**

### **Tipo de Componente**
- **Categoría:** [UI/Form/Layout/Utility]
- **Patrón:** [Functional/Class/Memoized/ForwardRef]
- **Estado:** [Stateless/Stateful/Controlled/Uncontrolled]

### **Dependencias**
```typescript
// Dependencias principales
import React from 'react';
import { useState, useEffect } from 'react';

// Dependencias del proyecto
import { useAuth } from '@/shared/hooks';
import { Button } from '@/shared/components';

// Dependencias externas
import { clsx } from 'clsx';
```

### **Props Interface**
```typescript
interface ComponentNameProps {
  // Props requeridas
  label: string;
  value: string;
  
  // Props opcionales
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  
  // Event handlers
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  
  // Props de estilo
  className?: string;
  style?: React.CSSProperties;
}
```

## 💻 **Implementación**

### **Código del Componente**
```typescript
import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

interface ComponentNameProps {
  label: string;
  value: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  className?: string;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  label,
  value,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onChange,
  onSubmit,
  className
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = () => {
    onSubmit?.();
  };

  return (
    <div
      className={clsx(
        'component-name',
        `component-name--${variant}`,
        `component-name--${size}`,
        disabled && 'component-name--disabled',
        className
      )}
    >
      <label className="component-name__label">{label}</label>
      <input
        type="text"
        value={internalValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        className="component-name__input"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="component-name__button"
      >
        Submit
      </button>
    </div>
  );
};
```

## 🧪 **Testing**

### **Unit Tests**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders with label', () => {
    render(<ComponentName label="Test Label" value="" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const onChange = jest.fn();
    render(<ComponentName label="Test" value="" onChange={onChange} />);
    
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'new value' }
    });
    
    expect(onChange).toHaveBeenCalledWith('new value');
  });

  it('applies disabled state', () => {
    render(<ComponentName label="Test" value="" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
```

### **Integration Tests**
```typescript
describe('ComponentName Integration', () => {
  it('works with form context', () => {
    // Test integration with forms
  });

  it('handles keyboard navigation', () => {
    // Test accessibility
  });
});
```

## 📚 **Ejemplos de Uso**

### **Uso Básico**
```tsx
<ComponentName 
  label="Email"
  value={email}
  onChange={setEmail}
/>
```

### **Uso con Variantes**
```tsx
<ComponentName 
  label="Password"
  value={password}
  variant="danger"
  size="lg"
  onChange={setPassword}
/>
```

### **Uso en Formularios**
```tsx
<form onSubmit={handleSubmit}>
  <ComponentName 
    label="Username"
    value={username}
    onChange={setUsername}
  />
  <ComponentName 
    label="Password"
    value={password}
    onChange={setPassword}
  />
  <button type="submit">Submit</button>
</form>
```

## 🎨 **Estilos y Temas**

### **CSS Classes**
```css
.component-name {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.component-name__label {
  font-weight: 500;
  color: var(--text-primary);
}

.component-name__input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
}

.component-name__button {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

/* Variants */
.component-name--primary .component-name__button {
  background: var(--primary-color);
}

.component-name--secondary .component-name__button {
  background: var(--secondary-color);
}

.component-name--danger .component-name__button {
  background: var(--danger-color);
}

/* Sizes */
.component-name--sm .component-name__input {
  padding: 0.25rem;
  font-size: 0.875rem;
}

.component-name--lg .component-name__input {
  padding: 0.75rem;
  font-size: 1.125rem;
}

/* States */
.component-name--disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

## 🔧 **Configuración**

### **Storybook Stories**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    value: '',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    value: '',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    label: 'Danger Button',
    value: '',
    variant: 'danger',
  },
};
```

## 🚀 **Performance**

### **Optimizaciones**
- ✅ **React.memo** - Evita re-renders innecesarios
- ✅ **useCallback** - Memoiza event handlers
- ✅ **useMemo** - Memoiza cálculos costosos
- ✅ **Lazy loading** - Carga bajo demanda

### **Bundle Size**
- **Gzipped:** ~2.5KB
- **Minified:** ~8KB
- **Dependencies:** React, TypeScript, clsx

## 🔍 **Accesibilidad**

### **ARIA Attributes**
```tsx
<div
  role="group"
  aria-labelledby="component-label"
  aria-describedby="component-description"
>
  <label id="component-label">{label}</label>
  <input
    aria-describedby="component-description"
    aria-invalid={hasError}
    aria-required={required}
  />
</div>
```

### **Keyboard Navigation**
- ✅ **Tab** - Navegación entre elementos
- ✅ **Enter** - Activar botón
- ✅ **Space** - Activar botón
- ✅ **Escape** - Cerrar/cancelar

## 📊 **Métricas**

### **Coverage**
- **Unit Tests:** 95%
- **Integration Tests:** 85%
- **E2E Tests:** 90%

### **Performance**
- **First Render:** <5ms
- **Re-renders:** <2ms
- **Bundle Impact:** +2.5KB

## 🔄 **Changelog**

### **v1.0.0** (2025-07-19)
- ✅ Initial release
- ✅ Basic functionality
- ✅ Unit tests
- ✅ Storybook stories

### **v1.1.0** (Planned)
- 🚀 Add validation
- 🚀 Add error states
- 🚀 Add loading states

---

**🤖 Esta documentación está optimizada para herramientas de IA y análisis automático.** 