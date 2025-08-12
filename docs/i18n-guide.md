# 🌍 Guía de Internacionalización (i18n) - VibeThink Orchestrator

> **🚨 DOCUMENTO MIGRADO**  
> **Esta guía se ha consolidado en:** [`MULTILANG_CONSOLIDATED_RULES.md`](../MULTILANG_VALIDATION_RULES.md)  
> **Usa el documento consolidado para todas las reglas, implementación y validación multilang.**

---

## 📋 Resumen DEPRECADO

**IMPORTANTE:** Este contenido ha sido migrado y consolidado. Ver documento principal.

## 🏗️ Arquitectura

### **Configuración Base**
- **Librería:** `react-i18next` + `i18next-browser-languagedetector`
- **Archivos de traducción:** `/src/locales/es.json` y `/src/locales/en.json`
- **Configuración:** `/src/lib/i18n.ts`
- **Idiomas soportados:** Español (es) e Inglés (en)
- **Idioma por defecto:** Español

### **Estructura de Archivos**
```
src/
├── lib/
│   └── i18n.ts                    # Configuración principal
├── locales/
│   ├── es.json                    # Traducciones en español
│   └── en.json                    # Traducciones en inglés
└── shared/components/bundui/
    └── LanguageSwitcher.tsx       # Componente selector de idioma
```

## 🚀 Uso Básico

### **1. Importar useTranslation**
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t('dashboard.title')}</h1>;
};
```

### **2. Usar traducciones**
```tsx
// Traducción simple
{t('auth.login.title')}

// Con variables
{t('dashboard.welcome', { name: user.name })}

// Con pluralización
{t('notifications', { count: 5 })}
```

### **3. Cambiar idioma programáticamente**
```tsx
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();

// Cambiar a inglés
await i18n.changeLanguage('en');

// Cambiar a español
await i18n.changeLanguage('es');
```

## 📝 Estructura de Claves

### **Organización Jerárquica**
```json
{
  "dashboard": {
    "title": "Panel de Control",
    "download": "Descargar"
  },
  "auth": {
    "login": {
      "title": "Iniciar Sesión",
      "subtitle": "Ingresa tus credenciales"
    }
  },
  "bundui": {
    "dashboard": {
      "title": "Panel de Control"
    },
    "chat": {
      "new_message": "Nuevo mensaje"
    }
  }
}
```

### **Convenciones de Nomenclatura**
- **Uso de puntos:** `section.subsection.key`
- **Descriptivo:** `auth.login.title` en lugar de `text1`
- **Consistente:** Misma estructura en ambos archivos
- **Agrupado por contexto:** `bundui.dashboard`, `bundui.chat`

## 🔧 Funciones Helper Disponibles

### **Desde `/src/lib/i18n.ts`**
```tsx
import { 
  changeLanguage, 
  getCurrentLanguage, 
  isLanguageSupported,
  getSupportedLanguages,
  getDefaultLanguage 
} from '@/lib/i18n';

// Cambiar idioma
await changeLanguage('en');

// Obtener idioma actual
const currentLang = getCurrentLanguage(); // 'es' o 'en'

// Verificar soporte
const isSupported = isLanguageSupported('fr'); // false

// Obtener idiomas soportados
const languages = getSupportedLanguages(); // ['es', 'en']

// Obtener idioma por defecto
const defaultLang = getDefaultLanguage(); // 'es'
```

## 🎨 Componente LanguageSwitcher

### **Uso**
```tsx
import LanguageSwitcher from '@/shared/components/bundui/LanguageSwitcher';

// En cualquier componente
<LanguageSwitcher />
```

### **Características**
- **Dropdown con banderas:** 🇪🇸 Español, 🇺🇸 English
- **Indicador de idioma actual:** Muestra "Actual" en el idioma activo
- **Responsive:** Se adapta a diferentes tamaños de pantalla
- **Persistencia:** Guarda la preferencia en localStorage

## 📋 Mejores Prácticas

### **✅ Hacer**
```tsx
// ✅ Correcto: Usar traducciones
const { t } = useTranslation();
<h1>{t('dashboard.title')}</h1>

// ✅ Correcto: Con variables
{t('welcome', { name: user.name })}

// ✅ Correcto: Con pluralización
{t('notifications', { count: notificationCount })}
```

### **❌ No Hacer**
```tsx
// ❌ Incorrecto: Texto hardcodeado
<h1>Dashboard</h1>

// ❌ Incorrecto: Claves genéricas
{t('text1')}

// ❌ Incorrecto: Sin fallback
{t('missing.key')} // Sin verificar si existe
```

### **🔍 Detección de Textos Hardcodeados**
```bash
# Buscar textos en español hardcodeados
grep -r "[\u00C0-\u017F]" src/ --include="*.tsx" --include="*.ts"

# Buscar textos en inglés hardcodeados
grep -r "Dashboard\|Welcome\|Sign in" src/ --include="*.tsx" --include="*.ts"
```

## 🚀 Agregar Nuevos Idiomas

### **1. Crear archivo de traducción**
```json
// src/locales/fr.json
{
  "dashboard": {
    "title": "Tableau de Bord",
    "download": "Télécharger"
  }
}
```

### **2. Actualizar configuración**
```tsx
// src/lib/i18n.ts
const supportedLanguages = ['es', 'en', 'fr'];
const resources = {
  es: { translation: es },
  en: { translation: en },
  fr: { translation: fr } // Agregar nuevo idioma
};
```

### **3. Actualizar LanguageSwitcher**
```tsx
const languages = [
  { code: 'es', name: t('language.spanish'), flag: '🇪🇸' },
  { code: 'en', name: t('language.english'), flag: '🇺🇸' },
  { code: 'fr', name: t('language.french'), flag: '🇫🇷' }, // Agregar
];
```

## 🧪 Testing

### **Pruebas de Traducción**
```tsx
// Verificar que todas las claves existen
const { t } = useTranslation();
expect(t('dashboard.title')).not.toBe('dashboard.title');

// Verificar cambio de idioma
await i18n.changeLanguage('en');
expect(i18n.language).toBe('en');
```

### **Validación de Archivos**
```bash
# Verificar que ambos archivos tienen las mismas claves
node scripts/validate-translations.js
```

## 🔍 Debugging

### **Modo Debug**
```tsx
// En desarrollo, activar logs
debug: process.env.NODE_ENV === 'development'
```

### **Claves Faltantes**
```tsx
// Configuración para detectar claves faltantes
parseMissingKeyHandler: (key: string) => {
  console.warn(`Missing translation key: ${key}`);
  return key;
}
```

## 📚 Recursos Adicionales

- **Documentación oficial:** [i18next.com](https://www.i18next.com/)
- **React i18next:** [react.i18next.com](https://react.i18next.com/)
- **Herramientas de extracción:** [i18next-scanner](https://github.com/i18next/i18next-scanner)

## 🎯 Checklist de Implementación

- [ ] Todos los textos visibles usan `t('clave')`
- [ ] No hay textos hardcodeados en componentes
- [ ] Archivos de traducción están sincronizados
- [ ] LanguageSwitcher está integrado en la UI
- [ ] Pruebas de cambio de idioma funcionan
- [ ] Documentación está actualizada

---

**Última actualización:** {{ new Date().toLocaleDateString() }}
**Versión:** 1.0.0
**Mantenido por:** Equipo VThink 1.0 