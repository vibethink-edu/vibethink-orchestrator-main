# Guía de Cumplimiento de Cookies y Privacidad

## Principios Fundamentales

### 1. Clasificación de Cookies

**Regla de Oro:** Toda cookie debe estar clasificada correctamente antes de su implementación.

#### Tipos de Cookies
- **Necesarias (Strictly Necessary):** Siempre activas, esenciales para el funcionamiento del sitio.
- **Funcionales (Functional):** Mejoran la funcionalidad y personalización.
- **Analíticas (Analytics):** Ayudan a entender el uso del sitio.
- **Marketing (Marketing):** Utilizadas para publicidad personalizada.

### 2. Consentimiento Explícito

**Regla de Oro:** Consentimiento explícito antes de usar cookies no esenciales.

#### Flujo de Consentimiento
1. **Primera visita:** Banner de consentimiento obligatorio.
2. **Configuración granular:** Usuario puede seleccionar qué tipos acepta.
3. **Revisión:** Panel de gestión accesible desde cualquier página.
4. **Retiro:** Usuario puede revocar consentimiento en cualquier momento.

### 3. Cumplimiento Normativo

#### GDPR (Reglamento General de Protección de Datos)
- Consentimiento explícito y específico.
- Información clara sobre el uso de cookies.
- Derecho a retirar consentimiento.
- Registro de consentimientos.

#### LGPD (Lei Geral de Proteção de Dados)
- Consentimiento libre, informado e inequívoco.
- Finalidad específica y legítima.
- Transparencia en el tratamiento.

#### CCPA (California Consumer Privacy Act)
- Derecho a saber qué datos se recopilan.
- Derecho a optar por no vender datos.
- Derecho a eliminar datos.

### 4. Implementación Técnica

#### Hook de Gestión de Cookies
```tsx
// src/hooks/useCookieConsent.ts
interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: string;
}

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  
  const loadConsent = () => {
    const stored = localStorage.getItem('cookie-consent');
    if (stored) {
      setConsent(JSON.parse(stored));
    }
  };
  
  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithMetadata = {
      ...newConsent,
      timestamp: Date.now(),
      version: '1.0',
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(consentWithMetadata));
    setConsent(consentWithMetadata);
    
    // Aplicar cookies según consentimiento
    applyCookies(consentWithMetadata);
    
    // Registrar en base de datos para auditoría
    logConsentChange(user.id, consentWithMetadata);
  };
  
  const applyCookies = (consent: CookieConsent) => {
    if (consent.analytics) {
      // Habilitar Google Analytics
      enableGoogleAnalytics();
    } else {
      // Deshabilitar Google Analytics
      disableGoogleAnalytics();
    }
    
    if (consent.marketing) {
      // Habilitar cookies de marketing
      enableMarketingCookies();
    } else {
      // Deshabilitar cookies de marketing
      disableMarketingCookies();
    }
  };
  
  return { consent, saveConsent, loadConsent };
};
```

#### Componente de Banner de Consentimiento
```tsx
// src/components/compliance/CookieConsentBanner.tsx
const CookieConsentBanner = () => {
  const { consent, saveConsent } = useCookieConsent();
  const { t } = useTranslation();
  
  // No mostrar si ya hay consentimiento
  if (consent) return null;
  
  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  };
  
  const handleAcceptSelected = (selected: Partial<CookieConsent>) => {
    saveConsent({
      necessary: true, // Siempre true
      functional: selected.functional || false,
      analytics: selected.analytics || false,
      marketing: selected.marketing || false,
    });
  };
  
  const handleRejectAll = () => {
    saveConsent({
      necessary: true, // Siempre true
      functional: false,
      analytics: false,
      marketing: false,
    });
  };
  
  return (
    <div className="cookie-consent-banner" role="alert" aria-live="polite">
      <div className="cookie-content">
        <div className="cookie-header">
          <h3>{t('cookies.title', 'Configuración de Cookies')}</h3>
          <button 
            className="cookie-close" 
            onClick={handleRejectAll}
            aria-label={t('cookies.close', 'Cerrar')}
          >
            ×
          </button>
        </div>
        
        <p className="cookie-description">
          {t('cookies.description', 
            'Utilizamos cookies para mejorar tu experiencia. Algunas son necesarias para el funcionamiento del sitio, otras nos ayudan a mejorar nuestros servicios.'
          )}
        </p>
        
        <div className="cookie-options">
          <CookieOption
            type="necessary"
            title={t('cookies.necessary.title', 'Necesarias')}
            description={t('cookies.necessary.description', 'Cookies esenciales para el funcionamiento del sitio')}
            required={true}
            checked={true}
            disabled={true}
          />
          
          <CookieOption
            type="functional"
            title={t('cookies.functional.title', 'Funcionales')}
            description={t('cookies.functional.description', 'Mejoran la funcionalidad y personalización')}
            required={false}
            checked={false}
            onChange={(checked) => handleAcceptSelected({ functional: checked })}
          />
          
          <CookieOption
            type="analytics"
            title={t('cookies.analytics.title', 'Analíticas')}
            description={t('cookies.analytics.description', 'Nos ayudan a entender cómo usas el sitio')}
            required={false}
            checked={false}
            onChange={(checked) => handleAcceptSelected({ analytics: checked })}
          />
          
          <CookieOption
            type="marketing"
            title={t('cookies.marketing.title', 'Marketing')}
            description={t('cookies.marketing.description', 'Utilizadas para publicidad personalizada')}
            required={false}
            checked={false}
            onChange={(checked) => handleAcceptSelected({ marketing: checked })}
          />
        </div>
        
        <div className="cookie-actions">
          <button 
            onClick={handleRejectAll}
            className="btn-secondary"
          >
            {t('cookies.rejectAll', 'Rechazar todas')}
          </button>
          
          <button 
            onClick={handleAcceptAll}
            className="btn-primary"
          >
            {t('cookies.acceptAll', 'Aceptar todas')}
          </button>
        </div>
        
        <div className="cookie-links">
          <a href="/privacy-policy">
            {t('cookies.privacyPolicy', 'Política de Privacidad')}
          </a>
          <a href="/cookie-policy">
            {t('cookies.cookiePolicy', 'Política de Cookies')}
          </a>
        </div>
      </div>
    </div>
  );
};
```

### 5. Panel de Gestión de Cookies

```tsx
// src/components/compliance/CookieManager.tsx
const CookieManager = () => {
  const { consent, saveConsent } = useCookieConsent();
  const { t } = useTranslation();
  
  const handleUpdateConsent = (updates: Partial<CookieConsent>) => {
    if (consent) {
      saveConsent({ ...consent, ...updates });
    }
  };
  
  const handleRevokeAll = () => {
    saveConsent({
      necessary: true, // Siempre true
      functional: false,
      analytics: false,
      marketing: false,
    });
  };
  
  if (!consent) {
    return <div>No hay configuración de cookies guardada.</div>;
  }
  
  return (
    <div className="cookie-manager">
      <h2>{t('cookies.manage.title', 'Gestión de Cookies')}</h2>
      <p>{t('cookies.manage.description', 'Puedes cambiar tus preferencias de cookies en cualquier momento.')}</p>
      
      <div className="cookie-settings">
        <CookieOption
          type="necessary"
          title={t('cookies.necessary.title', 'Necesarias')}
          description={t('cookies.necessary.description', 'Cookies esenciales para el funcionamiento del sitio')}
          required={true}
          checked={consent.necessary}
          disabled={true}
        />
        
        <CookieOption
          type="functional"
          title={t('cookies.functional.title', 'Funcionales')}
          description={t('cookies.functional.description', 'Mejoran la funcionalidad y personalización')}
          required={false}
          checked={consent.functional}
          onChange={(checked) => handleUpdateConsent({ functional: checked })}
        />
        
        <CookieOption
          type="analytics"
          title={t('cookies.analytics.title', 'Analíticas')}
          description={t('cookies.analytics.description', 'Nos ayudan a entender cómo usas el sitio')}
          required={false}
          checked={consent.analytics}
          onChange={(checked) => handleUpdateConsent({ analytics: checked })}
        />
        
        <CookieOption
          type="marketing"
          title={t('cookies.marketing.title', 'Marketing')}
          description={t('cookies.marketing.description', 'Utilizadas para publicidad personalizada')}
          required={false}
          checked={consent.marketing}
          onChange={(checked) => handleUpdateConsent({ marketing: checked })}
        />
      </div>
      
      <div className="cookie-actions">
        <button 
          onClick={handleRevokeAll}
          className="btn-secondary"
        >
          {t('cookies.revokeAll', 'Revocar todas')}
        </button>
        
        <button 
          onClick={() => saveConsent(consent)}
          className="btn-primary"
        >
          {t('cookies.save', 'Guardar cambios')}
        </button>
      </div>
      
      <div className="cookie-info">
        <p>
          <strong>{t('cookies.lastUpdated', 'Última actualización:')}</strong>
          {new Date(consent.timestamp).toLocaleString()}
        </p>
        <p>
          <strong>{t('cookies.version', 'Versión:')}</strong>
          {consent.version}
        </p>
      </div>
    </div>
  );
};
```

### 6. Integración con Analytics

```tsx
// src/utils/analytics.ts
export const initializeAnalytics = (consent: CookieConsent) => {
  if (!consent.analytics) {
    console.log('Analytics disabled due to user consent');
    return;
  }
  
  // Inicializar Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  
  gtag('js', new Date());
  gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });
  
  window.gtag = gtag;
};

export const disableAnalytics = () => {
  // Deshabilitar Google Analytics
  if (window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
      'send_page_view': false
    });
  }
};
```

### 7. Auditoría y Logging

```tsx
// src/services/auditService.ts
export const logConsentChange = async (
  userId: string, 
  consent: CookieConsent,
  source: 'banner' | 'manager' | 'api' = 'banner'
) => {
  try {
    await supabase
      .from('cookie_consent_logs')
      .insert({
        user_id: userId,
        consent_data: consent,
        source,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error logging consent change:', error);
  }
};
```

### 8. Checklist de Cumplimiento

#### ✅ Antes de implementar cookies:
- [ ] ¿Está clasificada correctamente?
- [ ] ¿Requiere consentimiento explícito?
- [ ] ¿Se puede deshabilitar?
- [ ] ¿Está documentada en la política de privacidad?
- [ ] ¿Se registra el consentimiento para auditoría?

#### ✅ Antes de usar analytics:
- [ ] ¿El usuario ha dado consentimiento explícito?
- [ ] ¿Se anonimiza la IP?
- [ ] ¿Se respeta la configuración de "Do Not Track"?
- [ ] ¿Se puede deshabilitar completamente?

#### ✅ Antes de usar cookies de marketing:
- [ ] ¿El usuario ha dado consentimiento explícito?
- [ ] ¿Se puede optar por no vender datos (CCPA)?
- [ ] ¿Se respeta la configuración de "Do Not Track"?

### 9. Variables de Entorno

```env
# .env.example
REACT_APP_COOKIE_CONSENT_ENABLED=true
REACT_APP_ANALYTICS_ENABLED=true
REACT_APP_MARKETING_COOKIES_ENABLED=true
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
REACT_APP_COOKIE_POLICY_URL=https://example.com/cookie-policy
REACT_APP_PRIVACY_POLICY_URL=https://example.com/privacy-policy
```

### 10. Documentación Legal

#### Política de Cookies (ejemplo)
```markdown
# Política de Cookies

## ¿Qué son las cookies?
Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo...

## Tipos de cookies que utilizamos

### Cookies necesarias
- Propósito: Funcionamiento esencial del sitio
- Duración: Sesión
- Consentimiento: No requerido

### Cookies funcionales
- Propósito: Mejorar funcionalidad y personalización
- Duración: 1 año
- Consentimiento: Requerido

### Cookies analíticas
- Propósito: Entender el uso del sitio
- Duración: 2 años
- Consentimiento: Requerido

### Cookies de marketing
- Propósito: Publicidad personalizada
- Duración: 1 año
- Consentimiento: Requerido

## Cómo gestionar cookies
Puedes cambiar tus preferencias en cualquier momento...
```

---

## Resumen de Leyes de Oro

1. **Consentimiento Explícito:** Siempre requerido para cookies no esenciales.
2. **Clasificación Correcta:** Toda cookie debe estar clasificada antes de implementación.
3. **Gestión Granular:** Usuario debe poder seleccionar qué tipos acepta.
4. **Auditoría Completa:** Registrar todos los cambios de consentimiento.
5. **Cumplimiento Normativo:** Respetar GDPR, LGPD, CCPA.
6. **Documentación Legal:** Políticas de privacidad y cookies actualizadas.

---

**Nota:** Esta guía es obligatoria para todo el equipo. Cualquier implementación de cookies debe seguir estos estándares. 