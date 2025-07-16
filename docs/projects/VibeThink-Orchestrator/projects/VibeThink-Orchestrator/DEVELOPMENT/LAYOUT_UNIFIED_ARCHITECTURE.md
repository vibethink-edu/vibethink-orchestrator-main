# Ley de Oro: Layout Unificado y Personalización

## Principios Fundamentales

### 1. Layout Unificado y Centralizado

**Regla de Oro:** Solo existe un layout para todas las rutas internas autenticadas. Las páginas especiales (login, splash, superadmin) tienen layouts propios y diferenciados.

#### Arquitectura del Layout
```tsx
// src/components/layout/DashboardLayout.tsx
// ÚNICO layout para todos los módulos internos
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, company } = useAuth();
  const { theme, language } = useUserPreferences();
  
  return (
    <div className={`dashboard-layout theme-${theme}`}>
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-area">
          {children} {/* Aquí va el contenido específico de cada módulo */}
        </main>
        <Footer />
      </div>
      <RightPanel />
    </div>
  );
};
```

#### Rutas y Layouts
```tsx
// src/routes/AppRoutes.tsx
<Routes>
  {/* Páginas públicas con layouts propios */}
  <Route path="/login" element={<LoginLayout><Login /></LoginLayout>} />
  <Route path="/splash/:companyId" element={<SplashLayout><Splash /></SplashLayout>} />
  <Route path="/landing" element={<LandingLayout><Landing /></LandingLayout>} />
  <Route path="/superadmin" element={<SuperAdminLayout><SuperAdmin /></SuperAdminLayout>} />
  
  {/* Rutas internas con layout unificado */}
  <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
    <Route path="helpdesk" element={<HelpdeskPanel />} />
    <Route path="crm" element={<CRMPanel />} />
    <Route path="pqrs" element={<PQRSPanel />} />
    <Route path="analytics" element={<AnalyticsPanel />} />
    {/* ... otros módulos */}
  </Route>
</Routes>
```

### 2. Personalización por Usuario

**Regla de Oro:** Cada usuario puede personalizar su experiencia. Las preferencias se almacenan en la base de datos y se aplican globalmente.

#### Hook de Preferencias de Usuario
```tsx
// src/hooks/useUserPreferences.ts
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  accessibility: {
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  layout: {
    sidebarCollapsed: boolean;
    rightPanelCollapsed: boolean;
    compactMode: boolean;
  };
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>();
  
  // Cargar preferencias desde la base de datos
  useEffect(() => {
    if (user) {
      loadUserPreferences(user.id);
    }
  }, [user]);
  
  const updatePreference = async (key: keyof UserPreferences, value: any) => {
    // Actualizar en base de datos y estado local
    await updateUserPreference(user.id, key, value);
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  
  return { preferences, updatePreference };
};
```

#### Aplicación de Preferencias
```tsx
// src/components/layout/DashboardLayout.tsx
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { preferences } = useUserPreferences();
  const { company } = useAuth();
  
  return (
    <div 
      className={cn(
        'dashboard-layout',
        `theme-${preferences?.theme}`,
        `font-size-${preferences?.accessibility?.fontSize}`,
        preferences?.accessibility?.highContrast && 'high-contrast',
        preferences?.accessibility?.reducedMotion && 'reduced-motion'
      )}
      style={{
        '--company-primary-color': company?.branding?.primaryColor,
        '--company-secondary-color': company?.branding?.secondaryColor,
      } as React.CSSProperties}
    >
      {/* Layout con preferencias aplicadas */}
    </div>
  );
};
```

### 3. Personalización por Empresa

**Regla de Oro:** Cada empresa puede personalizar branding, reglas de negocio y configuración. Se aplica globalmente para todos los usuarios de la empresa.

#### Configuración de Empresa
```tsx
// src/types/company.ts
interface CompanyConfiguration {
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    favicon: string;
  };
  localization: {
    defaultLanguage: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  businessRules: {
    maxUsers: number;
    maxStorage: number;
    allowedModules: string[];
    customFields: Record<string, any>;
  };
  compliance: {
    gdprEnabled: boolean;
    dataRetentionDays: number;
    auditLogging: boolean;
  };
}
```

#### Hook de Configuración de Empresa
```tsx
// src/hooks/useCompanyConfiguration.ts
export const useCompanyConfiguration = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<CompanyConfiguration>();
  
  useEffect(() => {
    if (user?.company_id) {
      loadCompanyConfiguration(user.company_id);
    }
  }, [user?.company_id]);
  
  return { config };
};
```

### 4. Manejo de Cookies y Cumplimiento Normativo

**Regla de Oro:** Cumplimiento total con GDPR, LGPD, CCPA. Consentimiento explícito antes de usar cookies no esenciales.

#### Banner de Consentimiento de Cookies
```tsx
// src/components/compliance/CookieConsent.tsx
interface CookiePreferences {
  necessary: boolean; // Siempre true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });
  
  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    saveCookiePreferences(allAccepted);
    setShowBanner(false);
  };
  
  const acceptSelected = () => {
    saveCookiePreferences(preferences);
    setShowBanner(false);
  };
  
  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    saveCookiePreferences(onlyNecessary);
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="cookie-consent-banner">
      <div className="cookie-content">
        <h3>Configuración de Cookies</h3>
        <p>
          Utilizamos cookies para mejorar tu experiencia. Algunas son necesarias para el funcionamiento del sitio, 
          otras nos ayudan a mejorar nuestros servicios.
        </p>
        
        <div className="cookie-options">
          <div className="cookie-option">
            <label>
              <input 
                type="checkbox" 
                checked={preferences.necessary} 
                disabled 
              />
              Necesarias (siempre activas)
            </label>
            <small>Cookies esenciales para el funcionamiento del sitio</small>
          </div>
          
          <div className="cookie-option">
            <label>
              <input 
                type="checkbox" 
                checked={preferences.functional}
                onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
              />
              Funcionales
            </label>
            <small>Mejoran la funcionalidad y personalización</small>
          </div>
          
          <div className="cookie-option">
            <label>
              <input 
                type="checkbox" 
                checked={preferences.analytics}
                onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
              />
              Analíticas
            </label>
            <small>Nos ayudan a entender cómo usas el sitio</small>
          </div>
          
          <div className="cookie-option">
            <label>
              <input 
                type="checkbox" 
                checked={preferences.marketing}
                onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
              />
              Marketing
            </label>
            <small>Utilizadas para publicidad personalizada</small>
          </div>
        </div>
        
        <div className="cookie-actions">
          <button onClick={rejectAll} className="btn-secondary">
            Rechazar todas
          </button>
          <button onClick={acceptSelected} className="btn-primary">
            Aceptar seleccionadas
          </button>
          <button onClick={acceptAll} className="btn-primary">
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  );
};
```

#### Panel de Gestión de Cookies
```tsx
// src/components/compliance/CookieManager.tsx
const CookieManager = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>();
  
  useEffect(() => {
    loadCookiePreferences().then(setPreferences);
  }, []);
  
  const updatePreferences = async (newPreferences: CookiePreferences) => {
    await saveCookiePreferences(newPreferences);
    setPreferences(newPreferences);
    
    // Aplicar cambios inmediatamente
    if (!newPreferences.analytics) {
      // Deshabilitar Google Analytics
      window.gtag?.('config', 'GA_MEASUREMENT_ID', { 'send_page_view': false });
    }
  };
  
  return (
    <div className="cookie-manager">
      <h2>Gestión de Cookies</h2>
      <p>Puedes cambiar tus preferencias de cookies en cualquier momento.</p>
      
      {/* Misma interfaz que el banner pero para gestión */}
    </div>
  );
};
```

### 5. Footer con Control de Versiones

**Regla de Oro:** En desarrollo y soporte, mostrar versiones de componentes críticos para facilitar debugging y control de calidad.

```tsx
// src/components/layout/Footer.tsx
const Footer = () => {
  const { user } = useAuth();
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isSupportMode = process.env.REACT_APP_SUPPORT_MODE === 'true';
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span>© 2025 Euphorianet</span>
          {user?.company?.name && (
            <span className="company-name">| {user.company.name}</span>
          )}
        </div>
        
        <div className="footer-right">
          <a href="/privacy">Privacidad</a>
          <a href="/terms">Términos</a>
          <a href="/cookies">Cookies</a>
        </div>
      </div>
      
      {/* Información de versiones solo en desarrollo/soporte */}
      {(isDevelopment || isSupportMode) && (
        <div className="version-info">
          <small>
            App v{process.env.REACT_APP_VERSION} | 
            Helpdesk v{process.env.REACT_APP_HELPDESK_VERSION} | 
            CRM v{process.env.REACT_APP_CRM_VERSION} | 
            PQRS v{process.env.REACT_APP_PQRS_VERSION} |
            Layout v{process.env.REACT_APP_LAYOUT_VERSION}
          </small>
        </div>
      )}
    </footer>
  );
};
```

### 6. Checklist Obligatorio para Nuevos Desarrollos

#### ✅ Antes de crear un nuevo módulo/componente:
- [ ] ¿Usa el layout unificado? (excepto páginas especiales)
- [ ] ¿Lee y aplica preferencias de usuario?
- [ ] ¿Respeta la configuración de empresa?
- [ ] ¿Maneja cookies según las preferencias del usuario?
- [ ] ¿Incluye comentarios explicativos para personalización?
- [ ] ¿Está documentado en la wiki?

#### ✅ Antes de agregar nuevas preferencias:
- [ ] ¿Está definida en el tipo UserPreferences?
- [ ] ¿Se almacena en la base de datos?
- [ ] ¿Se aplica globalmente en el layout?
- [ ] ¿Está documentada en la wiki?
- [ ] ¿Incluye valores por defecto?

#### ✅ Antes de usar cookies:
- [ ] ¿Está clasificada correctamente (necesaria/funcional/analítica/marketing)?
- [ ] ¿Requiere consentimiento explícito?
- [ ] ¿Se puede deshabilitar desde el panel de gestión?
- [ ] ¿Está documentada en la política de privacidad?

### 7. Documentación en Código

```tsx
/**
 * DashboardLayout - Layout unificado para todas las rutas internas
 * 
 * LEY DE ORO: Este es el ÚNICO layout para módulos autenticados.
 * No crear layouts alternativos para módulos internos.
 * 
 * Personalización aplicada:
 * - Tema del usuario (light/dark/auto)
 * - Idioma del usuario
 * - Configuración de accesibilidad
 * - Branding de la empresa
 * - Preferencias de layout
 * 
 * @param children - Contenido específico del módulo
 */
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // ... implementación
};
```

### 8. Variables de Entorno Requeridas

```env
# .env.example
REACT_APP_VERSION=1.0.0
REACT_APP_HELPDESK_VERSION=0.9.1
REACT_APP_CRM_VERSION=1.0.0
REACT_APP_PQRS_VERSION=0.8.5
REACT_APP_LAYOUT_VERSION=1.2.0
REACT_APP_SUPPORT_MODE=false
REACT_APP_COOKIE_CONSENT_ENABLED=true
REACT_APP_ANALYTICS_ENABLED=true
```

---

## Resumen de Leyes de Oro

1. **Layout Unificado:** Solo un layout para rutas internas, layouts propios para páginas especiales.
2. **Personalización Centralizada:** Preferencias de usuario y empresa aplicadas globalmente.
3. **Cumplimiento Normativo:** Consentimiento explícito para cookies, cumplimiento GDPR/CCPA.
4. **Control de Versiones:** Footer con información de versiones en desarrollo/soporte.
5. **Documentación Obligatoria:** Todo debe estar documentado en código y wiki.
6. **Checklist de Calidad:** Validación obligatoria antes de cada desarrollo.

---

**Nota:** Esta documentación es obligatoria para todo el equipo. Cualquier desviación debe ser justificada y documentada. 