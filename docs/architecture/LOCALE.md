# Sistema de Configuración Regional y Locale (SaaS Empresarial)

## 🎯 Objetivo

Documentación completa del sistema de configuración regional, locales, zonas horarias y monedas para VibeThink Orchestrator como SaaS Empresarial multi-tenant. Este sistema proporciona una base sólida para configuración por usuario/empresa con integración futura a base de datos.

---

## 📋 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Locales Soportados](#locales-soportados)
3. [Zonas Horarias (Timezones)](#zonas-horarias-timezones)
4. [Monedas](#monedas)
5. [Configuración Jerárquica](#configuración-jerárquica)
6. [Configuración Regional Genérica](#configuración-regional-genérica)
7. [Integración con Base de Datos (Futuro)](#integración-con-base-de-datos-futuro)
8. [Casos de Uso SaaS Empresarial](#casos-de-uso-saas-empresarial)
9. [API y Uso](#api-y-uso)
10. [Mejores Prácticas](#mejores-prácticas)

---

## 🏗️ Arquitectura General

### Niveles de Configuración

```
┌─────────────────────────────────────────────────────────────┐
│                    NIVEL DE USUARIO                         │
│  (Prioridad más alta - sobrescribe empresa y sistema)       │
│  - Preferencias personales                                  │
│  - Zona horaria personal                                    │
│  - Formato de fecha/hora preferido                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  NIVEL DE EMPRESA                           │
│  (Prioridad media - sobrescribe sistema)                    │
│  - Moneda corporativa                                       │
│  - Zona horaria de oficina                                  │
│  - Estándares de formateo corporativos                      │
│  - Locale corporativo                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  NIVEL DE SISTEMA                           │
│  (Prioridad más baja - defaults)                            │
│  - Locales pre-configurados                                 │
│  - Configuraciones por defecto                              │
│  - Fallbacks                                                │
└─────────────────────────────────────────────────────────────┘
```

### Componentes

```
packages/utils/
├── src/
│   ├── regional-config.ts          # Sistema de configuración jerárquica
│   ├── formatters-enhanced.ts      # Formatters que usan configuración
│   └── ...
└── package.json

apps/dashboard/
└── src/lib/i18n/
    ├── config.ts                   # Configuración i18n (integración futura)
    └── utils.ts                    # Formatters i18n (integración futura)
```

---

## 🌍 Locales Soportados

### Locales Pre-configurados

#### Inglés (Estados Unidos) - `en-US`
```typescript
{
  locale: 'en-US',
  number: {
    locale: 'en-US',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,              // 1,234.56
  },
  currency: {
    currency: 'USD',
    locale: 'en-US',
    symbolPosition: 'prefix',       // $1,234.56
  },
  date: {
    locale: 'en-US',
    timezone: 'America/New_York',
    format: 'short',                // MM/dd/yyyy
    firstDayOfWeek: 0,              // Sunday
    weekNumbering: 'US',
  },
  time: {
    locale: 'en-US',
    timezone: 'America/New_York',
    format: '12h',                  // 3:45 PM
  }
}
```

#### Español (España) - `es-ES`
```typescript
{
  locale: 'es-ES',
  number: {
    locale: 'es-ES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,              // 1.234,56
  },
  currency: {
    currency: 'EUR',
    locale: 'es-ES',
    symbolPosition: 'suffix',       // 1.234,56 €
  },
  date: {
    locale: 'es-ES',
    timezone: 'Europe/Madrid',
    format: 'short',                // dd/MM/yyyy
    firstDayOfWeek: 1,              // Monday
    weekNumbering: 'ISO',
  },
  time: {
    locale: 'es-ES',
    timezone: 'Europe/Madrid',
    format: '24h',                  // 15:45
  }
}
```

#### Español (México) - `es-MX`
```typescript
{
  locale: 'es-MX',
  number: {
    locale: 'es-MX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,              // 1,234.56
  },
  currency: {
    currency: 'MXN',
    locale: 'es-MX',
    symbolPosition: 'prefix',       // $1,234.56
  },
  date: {
    locale: 'es-MX',
    timezone: 'America/Mexico_City',
    format: 'short',                // dd/MM/yyyy
    firstDayOfWeek: 0,              // Sunday
    weekNumbering: 'US',
  },
  time: {
    locale: 'es-MX',
    timezone: 'America/Mexico_City',
    format: '24h',                  // 15:45
  }
}
```

### Agregar Nuevos Locales

Para agregar un nuevo locale, editar `packages/utils/src/regional-config.ts`:

```typescript
const SYSTEM_DEFAULTS: Record<string, Partial<RegionalConfiguration>> = {
  // ... locales existentes ...
  
  'fr-FR': {
    number: {
      locale: 'fr-FR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,              // 1 234,56 (espacio como separador)
    },
    currency: {
      currency: 'EUR',
      locale: 'fr-FR',
      symbolPosition: 'suffix',       // 1 234,56 €
    },
    date: {
      locale: 'fr-FR',
      timezone: 'Europe/Paris',
      format: 'short',                // dd/MM/yyyy
      firstDayOfWeek: 1,              // Monday
      weekNumbering: 'ISO',
    },
    time: {
      locale: 'fr-FR',
      timezone: 'Europe/Paris',
      format: '24h',                  // 15:45
    }
  },
};
```

### Locales Genéricos vs Específicos

**Regla:** Siempre usar locales específicos cuando sea posible:

- ✅ `es-ES` (España) - específico
- ✅ `es-MX` (México) - específico
- ✅ `en-US` (EE.UU.) - específico
- ❌ `es` - genérico (evitar)
- ❌ `en` - genérico (evitar)

**Razón:** Los locales específicos proporcionan:
- Configuración de zona horaria correcta
- Moneda correcta por región
- Formato de número correcto (separadores)
- Convenciones culturales apropiadas

---

## 🕐 Zonas Horarias (Timezones)

### Zonas Horarias Comunes

#### América del Norte
- `America/New_York` - Eastern Time (ET)
- `America/Chicago` - Central Time (CT)
- `America/Denver` - Mountain Time (MT)
- `America/Los_Angeles` - Pacific Time (PT)
- `America/Mexico_City` - México
- `America/Toronto` - Canadá (Eastern)

#### América del Sur
- `America/Sao_Paulo` - Brasil
- `America/Buenos_Aires` - Argentina
- `America/Lima` - Perú
- `America/Bogota` - Colombia
- `America/Santiago` - Chile

#### Europa
- `Europe/London` - Reino Unido (GMT/BST)
- `Europe/Paris` - Francia (CET/CEST)
- `Europe/Madrid` - España (CET/CEST)
- `Europe/Berlin` - Alemania (CET/CEST)
- `Europe/Rome` - Italia (CET/CEST)

#### Asia
- `Asia/Tokyo` - Japón (JST)
- `Asia/Shanghai` - China (CST)
- `Asia/Hong_Kong` - Hong Kong
- `Asia/Singapore` - Singapur
- `Asia/Dubai` - Emiratos Árabes Unidos

### Manejo de Zonas Horarias en SaaS Empresarial

#### Configuración por Nivel

**Sistema (Default):**
```typescript
// Configuración por locale del sistema
'en-US' → 'America/New_York'
'es-ES' → 'Europe/Madrid'
'es-MX' → 'America/Mexico_City'
```

**Empresa:**
```typescript
// Una empresa puede tener su oficina principal en una zona horaria
{
  level: 'company',
  date: {
    timezone: 'America/New_York',  // Oficina principal en NYC
  },
  time: {
    timezone: 'America/New_York',
  }
}
```

**Usuario:**
```typescript
// Un usuario puede trabajar desde otra zona horaria
{
  level: 'user',
  date: {
    timezone: 'America/Los_Angeles',  // Usuario remoto en LA
  },
  time: {
    timezone: 'America/Los_Angeles',
  }
}
```

#### Casos de Uso Comunes

1. **Usuario remoto:**
   - Empresa en NYC (America/New_York)
   - Usuario en LA (America/Los_Angeles)
   - Usuario ve fechas/horas en su zona horaria local

2. **Empresa multinacional:**
   - Empresa puede configurar zona horaria de oficina principal
   - Usuarios en otras oficinas configuran su zona horaria personal

3. **Reuniones y eventos:**
   - Eventos corporativos en zona horaria de empresa
   - Calendarios personales en zona horaria de usuario

### Conversión de Zonas Horarias

```typescript
import { formatDateRegional } from '@vibethink/utils';
import { getRegionalConfig } from '@vibethink/utils';

// Formatear fecha usando zona horaria del usuario
const config = getRegionalConfig();
const formatted = formatDateRegional(new Date(), {
  config,
  // La zona horaria viene de config.date.timezone automáticamente
});

// Para conversión manual entre zonas horarias (futuro)
// Se puede usar librerías como date-fns-tz o luxon
```

### Best Practices para Timezones

1. **Almacenar en UTC:**
   - Todas las fechas en BD deben almacenarse en UTC
   - Convertir a zona horaria del usuario solo para display

2. **Usar IANA Timezone Database:**
   - Siempre usar formato IANA (ej: `America/New_York`)
   - Evitar abreviaciones ambiguas (ej: `EST`, `PST`)

3. **Respetar DST (Daylight Saving Time):**
   - La base de datos IANA maneja DST automáticamente
   - No hardcodear offsets fijos

---

## 💰 Monedas

### Monedas por Locale

#### América del Norte
- `en-US` → `USD` (Dólar estadounidense) - $1,234.56
- `es-MX` → `MXN` (Peso mexicano) - $1,234.56
- `en-CA` → `CAD` (Dólar canadiense) - $1,234.56

#### Europa
- `es-ES` → `EUR` (Euro) - 1.234,56 €
- `fr-FR` → `EUR` (Euro) - 1 234,56 €
- `de-DE` → `EUR` (Euro) - 1.234,56 €
- `en-GB` → `GBP` (Libra esterlina) - £1,234.56
- `it-IT` → `EUR` (Euro) - 1.234,56 €

#### América del Sur
- `pt-BR` → `BRL` (Real brasileño) - R$ 1.234,56
- `es-AR` → `ARS` (Peso argentino) - $ 1.234,56
- `es-CO` → `COP` (Peso colombiano) - $ 1.234,56
- `es-CL` → `CLP` (Peso chileno) - $1.234

#### Asia
- `ja-JP` → `JPY` (Yen japonés) - ¥1,235 (sin decimales)
- `zh-CN` → `CNY` (Yuan chino) - ¥1,234.56
- `zh-HK` → `HKD` (Dólar de Hong Kong) - HK$1,234.56

### Configuración de Monedas en SaaS Empresarial

#### Por Empresa
```typescript
// Empresa puede tener moneda corporativa
{
  level: 'company',
  currency: {
    currency: 'EUR',           // Moneda corporativa
    locale: 'es-ES',
    symbolPosition: 'suffix',  // 1.234,56 €
  }
}
```

#### Por Usuario (Override)
```typescript
// Usuario puede preferir ver en otra moneda (ej: para reportes)
{
  level: 'user',
  currency: {
    currency: 'USD',           // Usuario prefiere USD
    locale: 'en-US',
    symbolPosition: 'prefix',  // $1,234.56
  }
}
```

#### Multi-Moneda
```typescript
// Para sistemas multi-moneda, se puede especificar moneda por campo
formatCurrencyRegional(amount, {
  config: getRegionalConfig(),
  currency: 'EUR',  // Override temporal para este campo
});
```

### Símbolos de Moneda

El sistema usa símbolos estándar de Unicode/ISO:

- `USD` → `$` (U+0024)
- `EUR` → `€` (U+20AC)
- `GBP` → `£` (U+00A3)
- `JPY` → `¥` (U+00A5)
- `MXN` → `$` (mismo símbolo que USD, diferencia en locale)

### Posición del Símbolo

```typescript
// Prefix (antes del número)
'USD' → '$1,234.56'
'GBP' → '£1,234.56'

// Suffix (después del número)
'EUR' → '1.234,56 €' (es-ES)
'EUR' → '1 234,56 €' (fr-FR)
```

### Decimales por Moneda

```typescript
// Monedas con 2 decimales (estándar)
USD, EUR, GBP, MXN, CAD, BRL, ARS, COP, CLP

// Monedas sin decimales (formateo especial)
JPY → '¥1,235' (sin decimales)
KRW → '₩1,235' (sin decimales)
```

### Tipos de Cambio (Futuro - Integración BD)

Cuando se integre con BD, se puede agregar:

```typescript
interface CurrencyExchange {
  from: string;      // 'USD'
  to: string;        // 'EUR'
  rate: number;      // 0.92
  lastUpdated: Date;
}

// Función futura
function convertCurrency(
  amount: number,
  from: string,
  to: string,
  exchangeRates: CurrencyExchange[]
): number {
  // Implementación con tipos de cambio
}
```

---

## 🔄 Configuración Jerárquica

### Flujo de Resolución

```typescript
// 1. Sistema (default)
const systemConfig = {
  currency: { currency: 'USD', locale: 'en-US' },
  date: { timezone: 'America/New_York' },
};

// 2. Empresa (sobrescribe sistema)
const companyConfig = {
  currency: { currency: 'EUR', locale: 'es-ES' },
  // date no se especifica, usa sistema
};

// 3. Usuario (sobrescribe empresa y sistema)
const userConfig = {
  date: { timezone: 'America/Los_Angeles' },
  // currency no se especifica, usa empresa
};

// Resultado final (merged):
{
  currency: { currency: 'EUR', locale: 'es-ES' },  // De empresa
  date: { timezone: 'America/Los_Angeles' },       // De usuario
}
```

### Ejemplo Completo

```typescript
import { 
  initializeRegionalConfig, 
  getRegionalConfigManager,
  formatCurrencyRegional,
  formatDateRegional 
} from '@vibethink/utils';

// 1. Inicializar con sistema
const manager = initializeRegionalConfig('en-US');

// 2. Configurar empresa (EUR, Madrid)
manager.setCompanyConfig({
  currency: {
    currency: 'EUR',
    locale: 'es-ES',
  },
  date: {
    timezone: 'Europe/Madrid',
    locale: 'es-ES',
  },
  time: {
    timezone: 'Europe/Madrid',
    locale: 'es-ES',
    format: '24h',
  },
});

// 3. Configurar usuario (prefiere LA timezone)
manager.setUserConfig({
  date: {
    timezone: 'America/Los_Angeles',
  },
  time: {
    timezone: 'America/Los_Angeles',
  },
});

// 4. Usar formatters
const price = formatCurrencyRegional(1234.56);
// Resultado: "1.234,56 €" (moneda de empresa, formato español)

const date = formatDateRegional(new Date());
// Resultado: fecha en timezone de usuario (LA)
```

---

## 🌐 Configuración Regional Genérica

### Locales Genéricos vs Específicos

**Regla General:** Preferir locales específicos, pero tener fallback a genéricos.

```typescript
// Mapeo de locales genéricos a específicos
const LOCALE_FALLBACKS: Record<string, string> = {
  'en': 'en-US',      // Inglés genérico → EE.UU.
  'es': 'es-ES',      // Español genérico → España
  'fr': 'fr-FR',      // Francés genérico → Francia
  'de': 'de-DE',      // Alemán genérico → Alemania
  'pt': 'pt-BR',      // Portugués genérico → Brasil
  'ja': 'ja-JP',      // Japonés genérico → Japón
  'zh': 'zh-CN',      // Chino genérico → China
};

function resolveLocale(locale: string): string {
  return LOCALE_FALLBACKS[locale] || locale || 'en-US';
}
```

### Detección Automática

```typescript
// Detectar locale del navegador
function getBrowserLocale(): string {
  if (typeof window === 'undefined') return 'en-US';
  
  const browserLang = navigator.language;  // Ej: 'es-ES', 'es-MX', 'en-US'
  
  // Si es genérico (ej: 'es'), usar fallback
  if (browserLang.length === 2) {
    return LOCALE_FALLBACKS[browserLang] || 'en-US';
  }
  
  return browserLang;
}
```

---

## 💾 Integración con Base de Datos (Futuro)

### Estructura de Tablas

#### `companies` (Configuración por Empresa)
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  -- Configuración regional
  locale VARCHAR(10) DEFAULT 'en-US',
  timezone VARCHAR(50) DEFAULT 'UTC',
  currency_code VARCHAR(3) DEFAULT 'USD',
  date_format VARCHAR(20) DEFAULT 'short',
  time_format VARCHAR(20) DEFAULT '12h',
  first_day_of_week INT DEFAULT 0,  -- 0 = Sunday, 1 = Monday
  week_numbering VARCHAR(10) DEFAULT 'US',  -- 'US' | 'ISO'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `user_preferences` (Configuración por Usuario)
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  -- Configuración regional (override de empresa)
  locale VARCHAR(10),              -- NULL = usar empresa
  timezone VARCHAR(50),            -- NULL = usar empresa
  currency_code VARCHAR(3),        -- NULL = usar empresa
  date_format VARCHAR(20),         -- NULL = usar empresa
  time_format VARCHAR(20),         -- NULL = usar empresa
  first_day_of_week INT,           -- NULL = usar empresa
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### Carga de Configuración desde BD

```typescript
// apps/dashboard/src/lib/api/regional-config.ts

interface CompanyRegionalConfig {
  locale: string;
  timezone: string;
  currency_code: string;
  date_format: string;
  time_format: string;
  first_day_of_week: number;
  week_numbering: 'US' | 'ISO';
}

interface UserRegionalConfig {
  locale?: string;
  timezone?: string;
  currency_code?: string;
  date_format?: string;
  time_format?: string;
  first_day_of_week?: number;
}

export async function loadRegionalConfig(
  companyId: string,
  userId: string
): Promise<void> {
  const configManager = getRegionalConfigManager();
  
  // 1. Cargar configuración de empresa
  const companyConfig = await api.get<CompanyRegionalConfig>(
    `/companies/${companyId}/settings/regional`
  );
  
  configManager.setCompanyConfig({
    number: {
      locale: companyConfig.locale,
    },
    currency: {
      currency: companyConfig.currency_code,
      locale: companyConfig.locale,
    },
    date: {
      locale: companyConfig.locale,
      timezone: companyConfig.timezone,
      format: companyConfig.date_format as DateFormatPreset,
      firstDayOfWeek: companyConfig.first_day_of_week,
      weekNumbering: companyConfig.week_numbering,
    },
    time: {
      locale: companyConfig.locale,
      timezone: companyConfig.timezone,
      format: companyConfig.time_format as TimeFormatPreset,
    },
  });
  
  // 2. Cargar configuración de usuario (si existe)
  const userPrefs = await api.get<UserRegionalConfig>(
    `/users/${userId}/preferences/regional`
  );
  
  if (userPrefs) {
    configManager.setUserConfig({
      number: userPrefs.locale ? { locale: userPrefs.locale } : undefined,
      currency: userPrefs.currency_code ? {
        currency: userPrefs.currency_code,
        locale: userPrefs.locale || companyConfig.locale,
      } : undefined,
      date: {
        locale: userPrefs.locale || companyConfig.locale,
        timezone: userPrefs.timezone || companyConfig.timezone,
        format: (userPrefs.date_format || companyConfig.date_format) as DateFormatPreset,
        firstDayOfWeek: userPrefs.first_day_of_week ?? companyConfig.first_day_of_week,
      },
      time: {
        locale: userPrefs.locale || companyConfig.locale,
        timezone: userPrefs.timezone || companyConfig.timezone,
        format: (userPrefs.time_format || companyConfig.time_format) as TimeFormatPreset,
      },
    });
  }
}
```

### Persistencia de Configuración

```typescript
export async function updateCompanyRegionalConfig(
  companyId: string,
  config: Partial<CompanyRegionalConfig>
): Promise<void> {
  await api.put(`/companies/${companyId}/settings/regional`, config);
  
  // Actualizar configuración local
  const configManager = getRegionalConfigManager();
  configManager.setCompanyConfig(/* ... */);
}

export async function updateUserRegionalConfig(
  userId: string,
  config: Partial<UserRegionalConfig>
): Promise<void> {
  await api.put(`/users/${userId}/preferences/regional`, config);
  
  // Actualizar configuración local
  const configManager = getRegionalConfigManager();
  configManager.setUserConfig(/* ... */);
}
```

---

## 🏢 Casos de Uso SaaS Empresarial

### Caso 1: Empresa Multinacional

**Escenario:** Empresa con oficinas en NYC, Madrid y Ciudad de México.

```typescript
// Configuración de empresa (oficina principal en NYC)
manager.setCompanyConfig({
  currency: { currency: 'USD', locale: 'en-US' },
  date: { timezone: 'America/New_York' },
});

// Usuario en Madrid (prefiere EUR y timezone de Madrid)
manager.setUserConfig({
  currency: { currency: 'EUR', locale: 'es-ES' },
  date: { timezone: 'Europe/Madrid' },
  time: { timezone: 'Europe/Madrid', format: '24h' },
});
```

### Caso 2: Usuario Remoto

**Escenario:** Usuario trabaja remotamente desde zona horaria diferente.

```typescript
// Empresa en NYC
manager.setCompanyConfig({
  date: { timezone: 'America/New_York' },
});

// Usuario remoto en LA
manager.setUserConfig({
  date: { timezone: 'America/Los_Angeles' },
  time: { timezone: 'America/Los_Angeles' },
});

// Resultado: Usuario ve todo en su zona horaria local
```

### Caso 3: Multi-Moneda

**Escenario:** Empresa opera en múltiples países con diferentes monedas.

```typescript
// Configuración base (USD)
manager.setCompanyConfig({
  currency: { currency: 'USD', locale: 'en-US' },
});

// Para reportes específicos, override temporal
const reportEUR = formatCurrencyRegional(amount, {
  currency: 'EUR',  // Override temporal
  locale: 'es-ES',
});
```

### Caso 4: Consolidación de Reportes

**Escenario:** Reportes consolidados para empresa multinacional.

```typescript
// Cada usuario ve en su moneda local
const userPrice = formatCurrencyRegional(amount);  // Usa configuración del usuario

// Reporte consolidado en moneda corporativa
const consolidatedPrice = formatCurrencyRegional(amount, {
  currency: companyConfig.currency.currency,  // Moneda corporativa
});
```

---

## 📖 API y Uso

### Inicialización

```typescript
import { 
  initializeRegionalConfig,
  getRegionalConfigManager,
  getRegionalConfig 
} from '@vibethink/utils';

// Inicializar
const manager = initializeRegionalConfig('es-ES');

// Obtener manager existente
const manager = getRegionalConfigManager();

// Obtener configuración activa (merged)
const config = getRegionalConfig();
```

### Formateo

```typescript
import {
  formatNumberRegional,
  formatCurrencyRegional,
  formatDateRegional,
  formatTimeRegional,
  formatDateTimeRegional,
  formatRelativeTimeRegional,
} from '@vibethink/utils';

// Números
formatNumberRegional(1234.56);                    // "1.234,56" (es-ES)
formatNumberRegional(1234.56, { maximumFractionDigits: 0 }); // "1.235"

// Moneda
formatCurrencyRegional(1234.56);                  // "1.234,56 €" (EUR, es-ES)

// Fechas
formatDateRegional(new Date());                   // "31/12/2024" (short)
formatDateRegional(new Date(), { preset: 'long' }); // "31 de diciembre de 2024"

// Tiempo
formatTimeRegional(new Date());                   // "15:45" (24h, es-ES)

// Fecha y Tiempo
formatDateTimeRegional(new Date());               // "31/12/2024 15:45"

// Tiempo relativo
formatRelativeTimeRegional(new Date(Date.now() - 3600000)); // "hace 1 hora"
```

---

## ✅ Mejores Prácticas

### ✅ DEBE

1. **Usar configuración regional centralizada** para TODO formateo
2. **Almacenar fechas en UTC** en base de datos
3. **Convertir a zona horaria del usuario** solo para display
4. **Usar locales específicos** (`es-ES` vs `es`)
5. **Respetar jerarquía** (usuario > empresa > sistema)
6. **Documentar cambios** en configuración

### ❌ NO DEBE

1. **Hardcodear locales/timezones** en código
2. **Usar abreviaciones ambiguas** (ej: `EST`, `PST`)
3. **Asumir zona horaria** del usuario
4. **Ignorar configuración de empresa** cuando existe
5. **Mezclar sistemas** de formateo

### 🚨 Consideraciones Especiales

1. **DST (Daylight Saving Time):**
   - Usar IANA timezone database (maneja DST automáticamente)
   - No hardcodear offsets fijos

2. **Monedas sin decimales:**
   - JPY, KRW: formatear sin decimales
   - Implementar lógica especial si es necesario

3. **Multi-tenancy:**
   - Cada tenant (empresa) puede tener su configuración
   - Aislar configuración entre tenants

4. **Performance:**
   - Cachear configuración en memoria
   - Evitar recálculos innecesarios

---

## 🔮 Roadmap Futuro

- [ ] Integración con base de datos
- [ ] UI para configuración de usuario/empresa
- [ ] Soporte para más locales (30+)
- [ ] Tipos de cambio automáticos (API externa)
- [ ] Validación de configuraciones
- [ ] Migración automática de código existente
- [ ] Tests unitarios y de integración
- [ ] Documentación de API completa
- [ ] Soporte para formatos personalizados
- [ ] Cacheo y optimización de performance
- [ ] Soporte para calendarios no gregorianos (futuro)

---

## 📝 Referencias

- [Intl API - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [IANA Timezone Database](https://www.iana.org/time-zones)
- [ISO 4217 Currency Codes](https://www.iso.org/iso-4217-currency-codes.html)
- [CLDR Locale Data](http://cldr.unicode.org/)
- [Unicode Locale Data Markup Language (LDML)](http://unicode.org/reports/tr35/)

---

**Última actualización:** 2025-12-20
**Versión:** 1.0.0












