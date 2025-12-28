# Guía de Plantillas con i18n

## 🎯 Objetivo

Esta guía proporciona un template completo y mejores prácticas para crear nuevas plantillas en `dashboard-vibethink` con soporte multidioma desde el inicio.

---

## 📋 Template Completo: Nueva Plantilla

### Paso 1: Preparación (Antes de Código)

#### 1.1 Definir Namespace

```typescript
// src/lib/i18n/types.ts
export type TranslationNamespace =
  | 'common'
  | 'crm'
  | 'sales'
  | 'new-module'; // ← Agregar aquí PRIMERO
```

#### 1.2 Crear Estructura de Traducciones

**Planificar estructura ANTES de escribir código:**

```json
// Estructura propuesta para new-module.json
{
  "header": {
    "title": "...",
    "subtitle": "..."
  },
  "actions": {
    "save": "...",
    "cancel": "...",
    "delete": "...",
    "edit": "...",
    "add": "..."
  },
  "table": {
    "columns": {
      "name": "...",
      "email": "...",
      "status": "..."
    },
    "empty": "...",
    "loading": "..."
  },
  "form": {
    "labels": {
      "name": "...",
      "email": "..."
    },
    "placeholders": {
      "name": "...",
      "email": "..."
    },
    "validation": {
      "required": "...",
      "invalid": "..."
    }
  },
  "messages": {
    "success": {
      "created": "...",
      "updated": "...",
      "deleted": "..."
    },
    "error": {
      "generic": "...",
      "notFound": "..."
    }
  },
  "filters": {
    "search": "...",
    "status": "...",
    "dateRange": "..."
  }
}
```

#### 1.3 Crear Archivos de Traducción

```bash
# Crear archivos base
touch src/lib/i18n/translations/en/new-module.json
touch src/lib/i18n/translations/es/new-module.json
```

**Template inicial (en):**

```json
{
  "header": {
    "title": "New Module",
    "subtitle": "Manage and organize your data"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add New",
    "export": "Export",
    "import": "Import"
  },
  "table": {
    "columns": {
      "name": "Name",
      "email": "Email",
      "status": "Status",
      "createdAt": "Created",
      "actions": "Actions"
    },
    "empty": "No data available",
    "loading": "Loading...",
    "rowsPerPage": "Rows per page"
  },
  "form": {
    "labels": {
      "name": "Name",
      "email": "Email",
      "description": "Description"
    },
    "placeholders": {
      "name": "Enter name",
      "email": "Enter email address",
      "description": "Enter description"
    },
    "validation": {
      "required": "This field is required",
      "invalidEmail": "Please enter a valid email address"
    }
  },
  "messages": {
    "success": {
      "created": "Item created successfully",
      "updated": "Item updated successfully",
      "deleted": "Item deleted successfully"
    },
    "error": {
      "generic": "An error occurred",
      "notFound": "Item not found"
    }
  },
  "filters": {
    "search": "Search...",
    "status": "Filter by status",
    "dateRange": "Date range",
    "clear": "Clear filters"
  }
}
```

**Template inicial (es):**

```json
{
  "header": {
    "title": "Nuevo Módulo",
    "subtitle": "Gestiona y organiza tus datos"
  },
  "actions": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "edit": "Editar",
    "add": "Agregar Nuevo",
    "export": "Exportar",
    "import": "Importar"
  },
  "table": {
    "columns": {
      "name": "Nombre",
      "email": "Correo",
      "status": "Estado",
      "createdAt": "Creado",
      "actions": "Acciones"
    },
    "empty": "No hay datos disponibles",
    "loading": "Cargando...",
    "rowsPerPage": "Filas por página"
  },
  "form": {
    "labels": {
      "name": "Nombre",
      "email": "Correo electrónico",
      "description": "Descripción"
    },
    "placeholders": {
      "name": "Ingresa el nombre",
      "email": "Ingresa el correo electrónico",
      "description": "Ingresa la descripción"
    },
    "validation": {
      "required": "Este campo es obligatorio",
      "invalidEmail": "Por favor ingresa un correo válido"
    }
  },
  "messages": {
    "success": {
      "created": "Elemento creado exitosamente",
      "updated": "Elemento actualizado exitosamente",
      "deleted": "Elemento eliminado exitosamente"
    },
    "error": {
      "generic": "Ocurrió un error",
      "notFound": "Elemento no encontrado"
    }
  },
  "filters": {
    "search": "Buscar...",
    "status": "Filtrar por estado",
    "dateRange": "Rango de fechas",
    "clear": "Limpiar filtros"
  }
}
```

---

### Paso 2: Implementar Componente Base

#### 2.1 Template de Página Principal

```tsx
// app/dashboard-vibethink/new-module/page.tsx
'use client';

import { useTranslation } from '@/lib/i18n';
import { NewModuleHeader } from './components/NewModuleHeader';
import { NewModuleTable } from './components/NewModuleTable';
import { NewModuleFilters } from './components/NewModuleFilters';

export default function NewModulePage() {
  const { t } = useTranslation('new-module');

  return (
    <div className="space-y-6">
      <NewModuleHeader />
      <NewModuleFilters />
      <NewModuleTable />
    </div>
  );
}
```

#### 2.2 Template de Header Component

```tsx
// app/dashboard-vibethink/new-module/components/NewModuleHeader.tsx
'use client';

import { Button } from '@vibethink/ui';
import { Plus, Download } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export function NewModuleHeader() {
  const { t } = useTranslation('new-module');
  const { t: tCommon } = useTranslation('common');

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{t('header.title')}</h1>
        <p className="text-muted-foreground">{t('header.subtitle')}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          {t('actions.export')}
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {t('actions.add')}
        </Button>
      </div>
    </div>
  );
}
```

#### 2.3 Template de Table Component

```tsx
// app/dashboard-vibethink/new-module/components/NewModuleTable.tsx
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@vibethink/ui';
import { useTranslation } from '@/lib/i18n';
import { Skeleton } from '@vibethink/ui';

interface NewModuleTableProps {
  data?: Array<{ id: string; name: string; email: string; status: string }>;
  loading?: boolean;
}

export function NewModuleTable({ data, loading }: NewModuleTableProps) {
  const { t } = useTranslation('new-module');

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t('table.empty')}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.columns.name')}</TableHead>
          <TableHead>{t('table.columns.email')}</TableHead>
          <TableHead>{t('table.columns.status')}</TableHead>
          <TableHead>{t('table.columns.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>
              {/* Actions */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

#### 2.4 Template de Form Component

```tsx
// app/dashboard-vibethink/new-module/components/NewModuleForm.tsx
'use client';

import { Button, Input, Label, Textarea } from '@vibethink/ui';
import { useTranslation } from '@/lib/i18n';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
  description: string;
}

export function NewModuleForm() {
  const { t } = useTranslation('new-module');
  const { t: tCommon } = useTranslation('common');
  const { t: tValidation } = useTranslation('validation');
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">{t('form.labels.name')}</Label>
        <Input
          id="name"
          placeholder={t('form.placeholders.name')}
          {...register('name', { required: true })}
        />
        {errors.name && (
          <p className="text-sm text-destructive">
            {tValidation('required')}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email">{t('form.labels.email')}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t('form.placeholders.email')}
          {...register('email', { 
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          })}
        />
        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email.type === 'required' 
              ? tValidation('required')
              : tValidation('email')
            }
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description">{t('form.labels.description')}</Label>
        <Textarea
          id="description"
          placeholder={t('form.placeholders.description')}
          {...register('description')}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          {tCommon('buttons.cancel')}
        </Button>
        <Button type="submit">
          {tCommon('buttons.save')}
        </Button>
      </div>
    </form>
  );
}
```

---

### Paso 3: Formateo de Datos

#### 3.1 Template con Formateo

```tsx
// app/dashboard-vibethink/new-module/components/NewModuleMetrics.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui';
import { useI18n } from '@/lib/i18n';
import { DollarSign, Users, TrendingUp } from 'lucide-react';

interface Metrics {
  revenue: number;
  users: number;
  growth: number;
}

export function NewModuleMetrics({ metrics }: { metrics: Metrics }) {
  const { formatCurrency, formatNumber, formatPercentage } = useI18n();
  const { t } = useTranslation('new-module');

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('metrics.revenue')}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(metrics.revenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(metrics.growth)} {t('metrics.fromLastMonth')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('metrics.users')}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(metrics.users)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('metrics.growth')}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(metrics.growth)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## ✅ Checklist Completo

### Antes de Escribir Código

- [ ] Namespace agregado a `types.ts`
- [ ] Estructura de traducciones planificada
- [ ] Archivos JSON creados (en, es)
- [ ] Traducciones iniciales escritas

### Durante Desarrollo

- [ ] Todos los componentes usan `useTranslation()`
- [ ] No hay texto hardcoded
- [ ] Formateo usa funciones de i18n
- [ ] Validación usa traducciones
- [ ] Mensajes de éxito/error traducidos

### Antes de Commit

- [ ] Probado cambio de idioma (en ↔ es)
- [ ] Todas las keys tienen traducción
- [ ] Formateo funciona en ambos idiomas
- [ ] No hay console.warn de keys faltantes

---

## 🎨 Patrones Comunes

### Patrón 1: Header con Acciones

```tsx
const { t } = useTranslation('module');
const { t: tCommon } = useTranslation('common');

<div>
  <h1>{t('header.title')}</h1>
  <p>{t('header.subtitle')}</p>
  <Button>{tCommon('buttons.save')}</Button>
</div>
```

### Patrón 2: Tabla con Columnas

```tsx
const { t } = useTranslation('module');

<TableHeader>
  <TableRow>
    <TableHead>{t('table.columns.name')}</TableHead>
    <TableHead>{t('table.columns.email')}</TableHead>
  </TableRow>
</TableHeader>
```

### Patrón 3: Formulario con Validación

```tsx
const { t } = useTranslation('module');
const { t: tValidation } = useTranslation('validation');

<Label>{t('form.labels.email')}</Label>
<Input placeholder={t('form.placeholders.email')} />
{errors.email && <p>{tValidation('required')}</p>}
```

### Patrón 4: Mensajes Toast

```tsx
const { t } = useTranslation('module');
const { toast } = useToast();

toast({
  title: t('messages.success.created'),
  variant: 'default',
});
```

---

## 🚀 Quick Start Template

**Copiar y pegar este template para empezar:**

```tsx
'use client';

import { useTranslation } from '@/lib/i18n';
import { Button } from '@vibethink/ui';

export function MyNewComponent() {
  const { t } = useTranslation('my-module');
  const { t: tCommon } = useTranslation('common');

  return (
    <div>
      <h1>{t('header.title')}</h1>
      <Button>{tCommon('buttons.save')}</Button>
    </div>
  );
}
```

---

## 📚 Referencias

- [Estrategia i18n](./I18N_STRATEGY.md) - Bundui vs VibeThink
- [Arquitectura i18n](./I18N_ARCHITECTURE.md) - Sistema completo
- [Ejemplo CRM](./examples/crm-i18n-example.md) - Ejemplo real

---

**Última actualización:** 2025-01-XX  
**Versión:** 1.0.0













