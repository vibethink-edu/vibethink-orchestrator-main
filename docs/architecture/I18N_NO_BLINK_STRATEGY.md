# 🚫 Estrategia para Evitar Blink de Texto en i18n

**Fecha:** 2025-12-21  
**Propósito:** Evitar que se muestre el key de traducción antes de que se cargue la traducción

---

## 🔍 Problema del Blink

### ¿Cuándo ocurre el blink?

1. **Primera carga de la página:**
   - Las traducciones se cargan de forma asíncrona
   - Durante la carga inicial, `t('cards.tickets.ticketStatus')` puede devolver la key literal `"cards.tickets.ticketStatus"` antes de que se cargue el JSON
   - El componente se renderiza con la key visible por un momento

2. **Cambio de idioma:**
   - Al cambiar de idioma (ej: `en` → `es`), las traducciones del nuevo idioma se cargan
   - Durante la carga, puede mostrar la key o el texto anterior
   - Una vez cargadas, se actualiza al nuevo idioma

---

## ✅ Estrategia Actual en el Sistema

### **1. Caché de Traducciones**

El sistema tiene un caché (`translationCache`) que evita recargar traducciones:

```typescript
// apps/dashboard/src/lib/i18n/loader.ts
const translationCache: Map<string, TranslationDictionary> = new Map();

export async function loadTranslation(
  locale: Locale,
  namespace: TranslationNamespace
): Promise<TranslationDictionary> {
  const cacheKey = getCacheKey(locale, namespace);
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!; // ✅ Retorna inmediatamente
  }
  
  // Si no está en caché, carga dinámicamente
  const translation = await import(`./translations/${locale}/${namespace}.json`);
  translationCache.set(cacheKey, translation);
  return translation;
}
```

**✅ VENTAJA:** Si las traducciones ya están cargadas, no hay blink al cambiar de idioma.

### **2. Estado de Loading**

El `I18nProvider` tiene un estado `isLoading`:

```typescript
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const init = async () => {
    setIsLoading(true);
    // Preload common namespaces
    await Promise.all(preloadNamespaces.map(loadNamespace));
    setIsLoading(false); // ✅ Una vez cargadas, isLoading = false
  };
  init();
}, [locale]);
```

**⚠️ PROBLEMA:** El `isLoading` no se expone ni se usa en los componentes, por lo que no previene el render.

### **3. Preload de Namespaces Comunes**

El sistema preload namespaces comunes durante la inicialización:

```typescript
preloadNamespaces = ['common', 'navigation']
```

**⚠️ PROBLEMA:** El namespace `analytics` NO está en el preload por defecto, por lo que se carga "on-demand" la primera vez.

---

## 🎯 Soluciones Recomendadas

### **Solución 1: Preload del Namespace al Cargar la Página**

**Agregar `analytics` al preload en el layout o en el componente de la página:**

```typescript
// apps/dashboard/app/dashboard-bundui/analytics/layout.tsx (o page.tsx)
import { I18nProvider } from '@/lib/i18n';

export default function AnalyticsLayout({ children }) {
  return (
    <I18nProvider preloadNamespaces={['common', 'navigation', 'analytics']}>
      {children}
    </I18nProvider>
  );
}
```

**✅ VENTAJA:** Las traducciones se cargan antes de renderizar los componentes, evitando el blink en la primera carga.

### **Solución 2: Preload al Cambiar de Idioma**

**Mejorar `setLocale` para preload antes de cambiar:**

```typescript
const setLocale = useCallback(
  async (newLocale: Locale) => {
    if (!isValidLocale(newLocale)) return;
    
    // 1. Preload todas las traducciones del nuevo idioma ANTES de cambiar
    setIsLoading(true);
    await preloadTranslations(newLocale, preloadNamespaces);
    
    // 2. Solo después de cargar, cambiar el locale
    setLocaleState(newLocale);
    setIsLoading(false);
  },
  [preloadNamespaces]
);
```

**✅ VENTAJA:** No hay blink al cambiar de idioma porque las traducciones ya están cargadas.

### **Solución 3: Fallback al Texto en el Idioma Actual**

**Mientras se carga la traducción, mostrar el texto del idioma anterior:**

```typescript
const t = useCallback(
  (key: string, params?: Record<string, string | number | boolean>): string => {
    const parsed = parseTranslationKey(key);
    const { namespace, key: translationKey } = parsed;
    
    const localeStore = translationStore.get(locale);
    let namespaceTranslations = localeStore?.get(namespace);
    
    // Si no está cargado, intentar usar traducción del idioma anterior
    if (!namespaceTranslations && locale !== i18nConfig.defaultLocale) {
      const fallbackStore = translationStore.get(i18nConfig.defaultLocale);
      namespaceTranslations = fallbackStore?.get(namespace);
    }
    
    // Si aún no hay traducción, devolver key
    if (!namespaceTranslations) {
      loadNamespace(namespace).catch(console.error);
      return key;
    }
    
    const translation = getNestedValue(namespaceTranslations, translationKey);
    return translation || key;
  },
  [locale]
);
```

**✅ VENTAJA:** Mientras carga el nuevo idioma, muestra el texto del idioma anterior en lugar de la key.

### **Solución 4: Suspense para Traducciones**

**Usar React Suspense para esperar a que carguen las traducciones:**

```typescript
// apps/dashboard/src/lib/i18n/context.tsx
export function useTranslation(namespace: TranslationNamespace) {
  const { t, locale, isLoading } = useI18n();
  const translations = useMemo(() => {
    if (isLoading) {
      throw new Promise((resolve) => {
        // Esperar a que se carguen las traducciones
        setTimeout(resolve, 0);
      });
    }
    return translations;
  }, [isLoading, locale, namespace]);
  
  // ... rest of hook
}
```

**⚠️ COMPLEJIDAD:** Requiere más cambios en la arquitectura.

---

## ✅ Recomendación: Solución Híbrida (1 + 2)

### **Implementación Recomendada:**

1. **Preload en el layout de Analytics:**
   ```typescript
   // apps/dashboard/app/dashboard-bundui/analytics/layout.tsx
   export default function AnalyticsLayout({ children }) {
     return (
       <I18nProvider preloadNamespaces={['common', 'navigation', 'analytics']}>
         {children}
       </I18nProvider>
     );
   }
   ```

2. **Preload antes de cambiar idioma:**
   ```typescript
   // apps/dashboard/src/lib/i18n/context.tsx
   const setLocale = useCallback(
     async (newLocale: Locale) => {
       if (!isValidLocale(newLocale) || newLocale === locale) return;
       
       // Preload translations before switching
       setIsLoading(true);
       try {
         const allNamespaces = Array.from(
           translationStore.get(locale)?.keys() || []
         );
         
         await Promise.all(
           allNamespaces.map(ns => loadNamespace(ns))
         );
       } catch (error) {
         console.error('[i18n] Error preloading translations:', error);
       } finally {
         setLocaleState(newLocale);
         setIsLoading(false);
       }
     },
     [locale, loadNamespace]
   );
   ```

3. **Fallback al idioma anterior:**
   ```typescript
   // Si no hay traducción en el nuevo idioma, usar la del anterior
   if (!namespaceTranslations && previousLocale) {
     const prevStore = translationStore.get(previousLocale);
     namespaceTranslations = prevStore?.get(namespace);
   }
   ```

---

## 📊 Comportamiento Esperado

### **Primera Carga:**
1. ✅ Preload `analytics` en el layout
2. ✅ Componentes se renderizan con traducciones ya cargadas
3. ✅ **NO HAY BLINK**

### **Cambio de Idioma:**
1. ✅ Preload todas las traducciones del nuevo idioma
2. ✅ Cambiar locale solo después de cargar
3. ✅ Si alguna traducción falla, usar fallback al idioma anterior
4. ✅ **NO HAY BLINK**

---

## 🔧 Estado Actual vs Recomendado

| Aspecto | Estado Actual | Recomendado |
|---------|---------------|-------------|
| **Primera carga** | ⚠️ Blink posible si `analytics` no está preloaded | ✅ Preload `analytics` en layout |
| **Cambio de idioma** | ⚠️ Blink durante carga de nuevas traducciones | ✅ Preload antes de cambiar locale |
| **Fallback** | ❌ Muestra la key si no hay traducción | ✅ Usa traducción del idioma anterior |
| **Caché** | ✅ Ya implementado | ✅ Mantener |

---

## 📝 Notas Importantes

1. **Solo ocurre en la primera carga:** Una vez que las traducciones están en caché, no hay blink.
2. **Cambio de idioma:** Si las traducciones del nuevo idioma no están en caché, puede haber un pequeño blink mientras se cargan.
3. **Optimización:** El preload en el layout asegura que las traducciones estén listas antes de renderizar.

---

**Última actualización:** 2025-12-21  
**Creado por:** Auto (Claude Sonnet 4.5)




