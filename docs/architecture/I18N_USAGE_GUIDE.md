# Guía de Uso i18n - Referencia Rápida

## 🚀 Inicio Rápido

### Importar Hook

```tsx
import { useTranslation } from '@/lib/i18n';
```

### Usar en Componente

```tsx
'use client';

export function MyComponent() {
  const { t } = useTranslation('namespace');
  
  return <h1>{t('header.title')}</h1>;
}
```

---

## 📖 API Reference

### `useTranslation(namespace)`

Hook principal para traducciones.

**Parámetros:**
- `namespace`: `TranslationNamespace` - Namespace del módulo

**Retorna:**
```typescript
{
  t: (key: string, params?: Record<string, string | number | boolean>) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatPercentage: (value: number, decimals?: number) => string;
}
```

**Ejemplo:**
```tsx
const { t, formatCurrency, formatDate } = useTranslation('crm');
```

### `useI18n()`

Hook general con todas las funciones (sin namespace específico).

**Uso:**
```tsx
const { locale, setLocale, formatCurrency } = useI18n();
```

---

## 🔑 Funciones de Traducción

### `t(key, params?)`

Traduce una key con parámetros opcionales.

```tsx
// Simple
t('header.title') // "CRM Dashboard"

// Con parámetros
t('welcome', { name: 'John' }) // "Welcome, John!"
```

**JSON:**
```json
{
  "welcome": "Welcome, {name}!"
}
```

### Múltiples Namespaces

```tsx
const { t: tCrm } = useTranslation('crm');
const { t: tCommon } = useTranslation('common');

<h1>{tCrm('header.title')}</h1>
<Button>{tCommon('buttons.save')}</Button>
```

---

## 💰 Formateo de Datos

### `formatCurrency(amount, currency?)`

```tsx
const { formatCurrency } = useI18n();

formatCurrency(1234.56)        // "$1,234.56" (en) / "1.234,56 €" (es)
formatCurrency(1234.56, 'EUR') // "€1,234.56"
```

### `formatNumber(value, options?)`

```tsx
const { formatNumber } = useI18n();

formatNumber(1234567)                    // "1,234,567" (en) / "1.234.567" (es)
formatNumber(1234.56, { minimumFractionDigits: 2 }) // "1,234.56"
```

### `formatPercentage(value, decimals?)`

```tsx
const { formatPercentage } = useI18n();

formatPercentage(15.5)  // "15.5%" (en) / "15,5%" (es)
formatPercentage(15.5, 2) // "15.50%"
```

### `formatDate(date, options?)`

```tsx
const { formatDate } = useI18n();

formatDate(new Date()) // "Jan 18, 2025" (en) / "18 ene 2025" (es)
formatDate(new Date(), { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}) // "January 18, 2025"
```

### `formatTime(date, options?)`

```tsx
const { formatTime } = useI18n();

formatTime(new Date()) // "10:30 AM" (en) / "10:30" (es)
formatTime(new Date(), { 
  hour: '2-digit', 
  minute: '2-digit',
  hour12: false 
}) // "10:30"
```

---

## 🌍 Cambiar Idioma

### Usar Selector de Idioma

El componente `LocaleSelector` ya está integrado en el header.

### Programáticamente

```tsx
const { setLocale } = useI18n();

<Button onClick={() => setLocale('es')}>
  Cambiar a Español
</Button>
```

---

## 📝 Ejemplos Completos

### Ejemplo 1: Header con Acciones

```tsx
'use client';

import { Button } from '@vibethink/ui';
import { Plus, Download } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export function ModuleHeader() {
  const { t } = useTranslation('module');
  const { t: tCommon } = useTranslation('common');

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{t('header.title')}</h1>
        <p className="text-muted-foreground">{t('header.subtitle')}</p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {t('actions.export')}
        </Button>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('actions.add')}
        </Button>
      </div>
    </div>
  );
}
```

### Ejemplo 2: Tabla con Datos Formateados

```tsx
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@vibethink/ui';
import { useTranslation, useI18n } from '@/lib/i18n';

interface Item {
  id: string;
  name: string;
  amount: number;
  date: Date;
}

export function DataTable({ items }: { items: Item[] }) {
  const { t } = useTranslation('module');
  const { formatCurrency, formatDate } = useI18n();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.columns.name')}</TableHead>
          <TableHead>{t('table.columns.amount')}</TableHead>
          <TableHead>{t('table.columns.date')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{formatCurrency(item.amount)}</TableCell>
            <TableCell>{formatDate(item.date)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Ejemplo 3: Formulario con Validación

```tsx
'use client';

import { Button, Input, Label } from '@vibethink/ui';
import { useTranslation } from '@/lib/i18n';
import { useForm } from 'react-hook-form';

export function MyForm() {
  const { t } = useTranslation('module');
  const { t: tValidation } = useTranslation('validation');
  const { t: tCommon } = useTranslation('common');
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

### Ejemplo 4: Métricas con Formateo

```tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui';
import { useTranslation, useI18n } from '@/lib/i18n';
import { DollarSign, TrendingUp } from 'lucide-react';

export function MetricsCard({ revenue, growth }: { revenue: number; growth: number }) {
  const { t } = useTranslation('module');
  const { formatCurrency, formatPercentage } = useI18n();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {t('metrics.revenue')}
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCurrency(revenue)}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatPercentage(growth)} {t('metrics.fromLastMonth')}
        </p>
      </CardContent>
    </Card>
  );
}
```

---

## 🐛 Troubleshooting

### Problema: Traducción muestra la key en lugar del texto

**Causa:** La key no existe en el JSON o el namespace es incorrecto.

**Solución:**
1. Verificar que el namespace existe en `types.ts`
2. Verificar que el archivo JSON existe
3. Verificar la key en el JSON
4. Revisar consola para warnings

### Problema: Formateo incorrecto

**Causa:** Configuración de locale incorrecta.

**Solución:**
1. Verificar `localeMetadata` en `config.ts`
2. Verificar que `Intl` está disponible
3. Verificar formato en `utils.ts`

### Problema: Idioma no persiste

**Causa:** Provider no está en el layout o middleware no está configurado.

**Solución:**
1. Verificar que `I18nProvider` está en el layout raíz
2. Verificar que middleware está configurado
3. Verificar cookies en DevTools

---

## 📚 Referencias

- [Estrategia i18n](./I18N_STRATEGY.md) - Bundui vs VibeThink
- [Arquitectura i18n](./I18N_ARCHITECTURE.md) - Sistema completo
- [Guía de Plantillas](./I18N_TEMPLATE_GUIDE.md) - Templates completos

---

**Última actualización:** 2025-01-XX  
**Versión:** 1.0.0




