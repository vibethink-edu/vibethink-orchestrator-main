# Sistema de Configuración Regional

## 🎯 Objetivo

Sistema centralizado para configuración de fechas, números, monedas y estándares regionales en el monorepo VibeThink Orchestrator. Soporta configuración jerárquica (Sistema → Empresa → Usuario) para multi-tenancy y personalización.

---

## 📋 Tabla de Contenidos

1. [Arquitectura](#arquitectura)
2. [Configuración Jerárquica](#configuración-jerárquica)
3. [Uso Básico](#uso-básico)
4. [Integración con i18n](#integración-con-i18n)
5. [Configuración por Usuario/Empresa](#configuración-por-usuarioempresa)
6. [API Reference](#api-reference)
7. [Ejemplos](#ejemplos)

---

## 🏗️ Arquitectura

### Ubicación

```
packages/utils/
├── src/
│   ├── regional-config.ts      # Sistema de configuración
│   └── formatters-enhanced.ts  # Formatters que usan la configuración
└── package.json
```

### Componentes Principales

1. **`RegionalConfigManager`**: Gestor de configuración jerárquica
2. **`RegionalConfiguration`**: Interface de configuración completa
3. **Formatters**: Funciones de formateo que respetan la configuración

---

## 🔄 Configuración Jerárquica

### Niveles de Configuración

La configuración sigue una jerarquía donde los niveles superiores sobrescriben los inferiores:

```
Usuario (user)     ← Prioridad más alta
    ↓
Empresa (company)  ← Prioridad media
    ↓
Sistema (system)   ← Prioridad más baja (defaults)
```

### Ejemplo de Jerarquía

```typescript
// Sistema (default): USD, en-US, America/New_York
// Empresa: EUR, es-ES, Europe/Madrid (sobrescribe sistema)
// Usuario: GBP, en-GB, Europe/London (sobrescribe empresa)
// Resultado final: GBP, en-GB, Europe/London
```

---

## 📖 Uso Básico

### Inicialización

```typescript
import { initializeRegionalConfig, getRegionalConfig } from '@vibethink/utils';

// Inicializar con locale del sistema
const configManager = initializeRegionalConfig('es-ES');

// Obtener configuración activa
const config = getRegionalConfig();
```

### Formateo Básico

```typescript
import {
  formatNumber,
  formatCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
} from '@vibethink/utils';

// Números
formatNumber(1234.56);                    // "1,234.56" (en-US) o "1.234,56" (es-ES)
formatNumber(1234.56, { maximumFractionDigits: 0 }); // "1,235"

// Moneda
formatCurrency(1234.56);                  // "$1,234.56" (USD) o "1.234,56 €" (EUR)

// Fechas
formatDate(new Date());                   // "12/31/2024" (short, en-US)
formatDate(new Date(), { preset: 'long' }); // "December 31, 2024"

// Tiempo
formatTime(new Date());                   // "3:45 PM" (12h) o "15:45" (24h)

// Fecha y Tiempo
formatDateTime(new Date());               // "12/31/2024 3:45 PM"

// Tiempo relativo
formatRelativeTime(new Date(Date.now() - 3600000)); // "1 hour ago"
```

---

## 🌍 Integración con i18n

### Actualizar `apps/dashboard/src/lib/i18n/utils.ts`

Las funciones de formateo en el sistema i18n pueden usar la configuración regional:

```typescript
import { getRegionalConfig, formatNumber as formatNumberRegional } from '@vibethink/utils';
import { Locale } from './types';

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  // Mapear locale a configuración regional
  const regionalLocale = locale === 'es' ? 'es-ES' : 'en-US';
  const config = getRegionalConfig();
  
  // Usar formatter regional o fallback a Intl
  return formatNumberRegional(value, { config });
}
```

### Hook de React

```typescript
// apps/dashboard/src/lib/i18n/hooks/useRegionalConfig.ts
import { useMemo } from 'react';
import { getRegionalConfig } from '@vibethink/utils';
import { useI18n } from '../context';

export function useRegionalConfig() {
  const { locale } = useI18n();
  
  const config = useMemo(() => {
    const regionalLocale = locale === 'es' ? 'es-ES' : 'en-US';
    return getRegionalConfig();
  }, [locale]);
  
  return config;
}
```

---

## 👥 Configuración por Usuario/Empresa

### Estructura de Datos (Futuro)

Cuando se implemente autenticación y multi-tenancy, la configuración puede almacenarse así:

```typescript
// Base de datos
interface UserPreferences {
  userId: string;
  regionalConfig?: Partial<RegionalConfiguration>;
}

interface CompanySettings {
  companyId: string;
  regionalConfig?: Partial<RegionalConfiguration>;
}

// Ejemplo de uso
async function loadUserRegionalConfig(userId: string) {
  const userPrefs = await getUserPreferences(userId);
  const companySettings = await getCompanySettings(userPrefs.companyId);
  
  const configManager = getRegionalConfigManager();
  
  // Cargar configuración de empresa
  if (companySettings.regionalConfig) {
    configManager.setCompanyConfig(companySettings.regionalConfig);
  }
  
  // Cargar configuración de usuario (sobrescribe empresa)
  if (userPrefs.regionalConfig) {
    configManager.setUserConfig(userPrefs.regionalConfig);
  }
}
```

### API de Configuración (Futuro)

```typescript
// apps/dashboard/src/lib/api/regional-config.ts
export async function updateUserRegionalConfig(
  userId: string,
  config: Partial<RegionalConfiguration>
): Promise<void> {
  await api.put(`/users/${userId}/preferences/regional`, config);
  
  // Actualizar configuración local
  const configManager = getRegionalConfigManager();
  configManager.setUserConfig(config);
}

export async function updateCompanyRegionalConfig(
  companyId: string,
  config: Partial<RegionalConfiguration>
): Promise<void> {
  await api.put(`/companies/${companyId}/settings/regional`, config);
  
  // Actualizar configuración local
  const configManager = getRegionalConfigManager();
  configManager.setCompanyConfig(config);
}
```

---

## 📚 API Reference

### `RegionalConfigManager`

#### Métodos

- `setCompanyConfig(config: Partial<RegionalConfiguration>): void`
- `setUserConfig(config: Partial<RegionalConfiguration>): void`
- `getConfig(): RegionalConfiguration`
- `getConfigForLevel(level: ConfigurationLevel): Partial<RegionalConfiguration> | null`
- `clearUserConfig(): void`
- `clearCompanyConfig(): void`
- `reset(systemLocale?: string): void`

### Funciones de Formateo

**Nota:** Estas funciones están exportadas con el sufijo `Regional` para evitar conflictos con los formatters genéricos (legacy).

#### `formatNumberRegional(value, options?)`
Formatea un número según la configuración regional.

#### `formatCurrencyRegional(amount, options?)`
Formatea una cantidad monetaria.

#### `formatDateRegional(date, options?)`
Formatea una fecha.

#### `formatTimeRegional(date, options?)`
Formatea una hora.

#### `formatDateTimeRegional(date, options?)`
Formatea fecha y hora juntos.

#### `formatRelativeTimeRegional(date, options?)`
Formatea tiempo relativo ("hace 2 horas", "en 3 días").

#### `formatPercentageRegional(value, options?)`
Formatea un porcentaje.

---

## 💡 Ejemplos

### Ejemplo 1: Configuración Básica

```typescript
import { initializeRegionalConfig, formatCurrency } from '@vibethink/utils';

// Inicializar
initializeRegionalConfig('es-ES');

// Usar
const price = formatCurrency(1234.56); // "1.234,56 €"
```

### Ejemplo 2: Configuración por Empresa

```typescript
import { getRegionalConfigManager, formatCurrency } from '@vibethink/utils';

const manager = getRegionalConfigManager();

// Configurar empresa (EUR)
manager.setCompanyConfig({
  currency: {
    currency: 'EUR',
    locale: 'es-ES',
  },
});

// Formatear
const price = formatCurrency(1234.56); // "1.234,56 €"
```

### Ejemplo 3: Configuración por Usuario

```typescript
import { getRegionalConfigManager, formatCurrency } from '@vibethink/utils';

const manager = getRegionalConfigManager();

// Configurar empresa (EUR)
manager.setCompanyConfig({
  currency: { currency: 'EUR', locale: 'es-ES' },
});

// Usuario prefiere USD
manager.setUserConfig({
  currency: { currency: 'USD', locale: 'en-US' },
});

// Formatear (usa configuración de usuario)
const price = formatCurrency(1234.56); // "$1,234.56"
```

### Ejemplo 4: Integración con Componentes React

```typescript
import { useMemo } from 'react';
import { formatCurrency, getRegionalConfig } from '@vibethink/utils';

function PriceDisplay({ amount }: { amount: number }) {
  const formatted = useMemo(() => {
    return formatCurrency(amount);
  }, [amount]);
  
  return <span>{formatted}</span>;
}
```

---

## 🔧 Configuración de Locales Soportados

### Locales Pre-configurados

- `en-US`: Inglés (EE.UU.) - USD, America/New_York
- `es-ES`: Español (España) - EUR, Europe/Madrid
- `es-MX`: Español (México) - MXN, America/Mexico_City

### Agregar Nuevos Locales

Editar `packages/utils/src/regional-config.ts`:

```typescript
const SYSTEM_DEFAULTS: Record<string, Partial<RegionalConfiguration>> = {
  // ... locales existentes ...
  
  'de-DE': {
    number: {
      locale: 'de-DE',
      // ...
    },
    currency: {
      currency: 'EUR',
      locale: 'de-DE',
      // ...
    },
    // ...
  },
};
```

---

## 🚨 Reglas y Mejores Prácticas

### ✅ DEBE

1. **Usar el sistema centralizado** para TODO el formateo de fechas/números/monedas
2. **Inicializar la configuración** al inicio de la aplicación
3. **Respetar la jerarquía** (usuario > empresa > sistema)
4. **Sincronizar con i18n** para mantener consistencia
5. **Documentar cambios** en configuración de empresa/usuario

### ❌ NO DEBE

1. **Hardcodear formatos** (ej: `toLocaleString()` con locale hardcoded)
2. **Usar múltiples sistemas** de formateo (usar solo este)
3. **Ignorar configuración de usuario** (siempre respetar preferencias)
4. **Asumir locales** (siempre obtener de configuración)

---

## 🔄 Migración

### Migrar Código Existente

1. **Identificar usos de formateo:**
   ```bash
   grep -r "toLocaleString\|Intl\.DateTimeFormat\|Intl\.NumberFormat" apps/
   ```

2. **Reemplazar con formatters centralizados:**
   ```typescript
   // ❌ Antes
   const formatted = number.toLocaleString('es-ES');
   
   // ✅ Después
   import { formatNumberRegional } from '@vibethink/utils';
   const formatted = formatNumberRegional(number);
   ```

3. **Actualizar imports:**
   ```typescript
   // Actualizar apps/dashboard/src/lib/i18n/utils.ts
   import { 
     formatNumberRegional, 
     formatCurrencyRegional, 
     formatDateRegional 
   } from '@vibethink/utils';
   ```

---

## 📝 Referencias

- [Intl API Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [IANA Timezone Database](https://www.iana.org/time-zones)
- [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html)
- [CLDR Locale Data](http://cldr.unicode.org/)

---

## 🔮 Futuro

- [ ] Integración con base de datos para persistencia
- [ ] UI para configuración de usuario/empresa
- [ ] Soporte para más locales
- [ ] Validación de configuraciones
- [ ] Migración automática de código existente
- [ ] Tests unitarios y de integración
- [ ] Documentación de API completa
- [ ] Soporte para formatos personalizados (custom patterns)

