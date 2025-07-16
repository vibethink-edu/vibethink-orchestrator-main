# Control de Versiones en Footer

## Principios Fundamentales

### 1. Información de Versiones

**Regla de Oro:** En desarrollo y soporte, mostrar versiones de componentes críticos para facilitar debugging y control de calidad.

#### Tipos de Información de Versión
- **Versión de la aplicación principal**
- **Versiones de módulos principales** (Helpdesk, CRM, PQRS, etc.)
- **Versiones de componentes críticos** (Layout, UI, etc.)
- **Versiones de dependencias importantes**
- **Información de build** (hash, timestamp, etc.)

### 2. Implementación del Footer

```tsx
// src/components/layout/Footer.tsx
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface VersionInfo {
  app: string;
  helpdesk: string;
  crm: string;
  pqrs: string;
  layout: string;
  ui: string;
  build: string;
  timestamp: string;
}

const Footer: React.FC = () => {
  const { user } = useAuth();
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isSupportMode = process.env.REACT_APP_SUPPORT_MODE === 'true';
  const isDebugMode = process.env.REACT_APP_DEBUG_MODE === 'true';

  // Información de versiones
  const versionInfo: VersionInfo = {
    app: process.env.REACT_APP_VERSION || '1.0.0',
    helpdesk: process.env.REACT_APP_HELPDESK_VERSION || '0.9.1',
    crm: process.env.REACT_APP_CRM_VERSION || '1.0.0',
    pqrs: process.env.REACT_APP_PQRS_VERSION || '0.8.5',
    layout: process.env.REACT_APP_LAYOUT_VERSION || '1.2.0',
    ui: process.env.REACT_APP_UI_VERSION || '1.1.0',
    build: process.env.REACT_APP_BUILD_HASH || 'dev',
    timestamp: process.env.REACT_APP_BUILD_TIMESTAMP || new Date().toISOString(),
  };

  // Mostrar información de versiones solo en desarrollo/soporte/debug
  const shouldShowVersionInfo = isDevelopment || isSupportMode || isDebugMode;

  return (
    <footer className={cn(
      "app-footer",
      "border-t bg-background",
      "px-4 py-3 md:px-6 lg:px-8"
    )}>
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        {/* Información principal */}
        <div className="flex flex-col space-y-1 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <span className="text-sm text-muted-foreground">
            © 2025 Euphorianet
          </span>
          
          {user?.company?.name && (
            <span className="text-sm text-muted-foreground">
              | {user.company.name}
            </span>
          )}
          
          {user?.role && (
            <span className="text-sm text-muted-foreground">
              | {user.role}
            </span>
          )}
        </div>

        {/* Enlaces */}
        <div className="flex items-center space-x-4">
          <a 
            href="/privacy-policy" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacidad
          </a>
          <a 
            href="/terms-of-service" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Términos
          </a>
          <a 
            href="/cookie-policy" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cookies
          </a>
          <a 
            href="/support" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Soporte
          </a>
        </div>
      </div>

      {/* Información de versiones */}
      {shouldShowVersionInfo && (
        <div className="mt-2 pt-2 border-t border-border">
          <div className="flex flex-col space-y-1 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-wrap items-center space-x-4 text-xs text-muted-foreground">
              <span>App v{versionInfo.app}</span>
              <span>Helpdesk v{versionInfo.helpdesk}</span>
              <span>CRM v{versionInfo.crm}</span>
              <span>PQRS v{versionInfo.pqrs}</span>
              <span>Layout v{versionInfo.layout}</span>
              <span>UI v{versionInfo.ui}</span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Build: {versionInfo.build}</span>
              <span>{new Date(versionInfo.timestamp).toLocaleString()}</span>
            </div>
          </div>
          
          {/* Información adicional en debug mode */}
          {isDebugMode && (
            <div className="mt-1 pt-1 border-t border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                <div>
                  <strong>User ID:</strong> {user?.id}
                </div>
                <div>
                  <strong>Company ID:</strong> {user?.company_id}
                </div>
                <div>
                  <strong>Environment:</strong> {process.env.NODE_ENV}
                </div>
                <div>
                  <strong>API URL:</strong> {process.env.REACT_APP_SUPABASE_URL}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </footer>
  );
};

export default Footer;
```

### 3. Gestión de Versiones

#### Variables de Entorno
```env
# .env.example
REACT_APP_VERSION=1.0.0
REACT_APP_HELPDESK_VERSION=0.9.1
REACT_APP_CRM_VERSION=1.0.0
REACT_APP_PQRS_VERSION=0.8.5
REACT_APP_LAYOUT_VERSION=1.2.0
REACT_APP_UI_VERSION=1.1.0
REACT_APP_BUILD_HASH=abc123
REACT_APP_BUILD_TIMESTAMP=2025-01-24T10:30:00.000Z
REACT_APP_SUPPORT_MODE=false
REACT_APP_DEBUG_MODE=false
```

#### Script de Actualización de Versiones
```javascript
// scripts/update-versions.js
const fs = require('fs');
const path = require('path');

// Leer package.json para obtener versiones
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Generar hash de build
const buildHash = require('crypto').randomBytes(8).toString('hex');
const buildTimestamp = new Date().toISOString();

// Crear archivo .env con versiones actualizadas
const envContent = `
# Versiones de la aplicación
REACT_APP_VERSION=${packageJson.version}
REACT_APP_HELPDESK_VERSION=${packageJson.dependencies['@/components/helpdesk'] || '0.9.1'}
REACT_APP_CRM_VERSION=${packageJson.dependencies['@/components/crm'] || '1.0.0'}
REACT_APP_PQRS_VERSION=${packageJson.dependencies['@/components/pqrs'] || '0.8.5'}
REACT_APP_LAYOUT_VERSION=${packageJson.dependencies['@/components/layout'] || '1.2.0'}
REACT_APP_UI_VERSION=${packageJson.dependencies['@/components/ui'] || '1.1.0'}

# Información de build
REACT_APP_BUILD_HASH=${buildHash}
REACT_APP_BUILD_TIMESTAMP=${buildTimestamp}

# Modos de desarrollo
REACT_APP_SUPPORT_MODE=false
REACT_APP_DEBUG_MODE=false
`.trim();

fs.writeFileSync('.env.local', envContent);
console.log('Versiones actualizadas en .env.local');
```

### 4. Hook para Información de Versiones

```tsx
// src/hooks/useVersionInfo.ts
import { useMemo } from 'react';

interface VersionInfo {
  app: string;
  helpdesk: string;
  crm: string;
  pqrs: string;
  layout: string;
  ui: string;
  build: string;
  timestamp: string;
  environment: string;
  isDevelopment: boolean;
  isSupportMode: boolean;
  isDebugMode: boolean;
}

export const useVersionInfo = (): VersionInfo => {
  return useMemo(() => ({
    app: process.env.REACT_APP_VERSION || '1.0.0',
    helpdesk: process.env.REACT_APP_HELPDESK_VERSION || '0.9.1',
    crm: process.env.REACT_APP_CRM_VERSION || '1.0.0',
    pqrs: process.env.REACT_APP_PQRS_VERSION || '0.8.5',
    layout: process.env.REACT_APP_LAYOUT_VERSION || '1.2.0',
    ui: process.env.REACT_APP_UI_VERSION || '1.1.0',
    build: process.env.REACT_APP_BUILD_HASH || 'dev',
    timestamp: process.env.REACT_APP_BUILD_TIMESTAMP || new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isSupportMode: process.env.REACT_APP_SUPPORT_MODE === 'true',
    isDebugMode: process.env.REACT_APP_DEBUG_MODE === 'true',
  }), []);
};
```

### 5. Componente de Información de Versiones

```tsx
// src/components/debug/VersionInfo.tsx
import React from 'react';
import { useVersionInfo } from '@/hooks/useVersionInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const VersionInfo: React.FC = () => {
  const versionInfo = useVersionInfo();

  // Solo mostrar en desarrollo/soporte/debug
  if (!versionInfo.isDevelopment && !versionInfo.isSupportMode && !versionInfo.isDebugMode) {
    return null;
  }

  return (
    <Card className="version-info-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Información de Versiones</span>
          <Badge variant={versionInfo.isDevelopment ? 'default' : 'secondary'}>
            {versionInfo.environment}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <strong>App:</strong> v{versionInfo.app}
          </div>
          <div>
            <strong>Helpdesk:</strong> v{versionInfo.helpdesk}
          </div>
          <div>
            <strong>CRM:</strong> v{versionInfo.crm}
          </div>
          <div>
            <strong>PQRS:</strong> v{versionInfo.pqrs}
          </div>
          <div>
            <strong>Layout:</strong> v{versionInfo.layout}
          </div>
          <div>
            <strong>UI:</strong> v{versionInfo.ui}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Build:</strong> {versionInfo.build}
            </div>
            <div>
              <strong>Timestamp:</strong> {new Date(versionInfo.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionInfo;
```

### 6. Integración en CI/CD

#### GitHub Actions Workflow
```yaml
# .github/workflows/update-versions.yml
name: Update Versions

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  update-versions:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Update versions
      run: node scripts/update-versions.js
    
    - name: Commit changes
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add .env.local
        git commit -m "Update versions [skip ci]" || exit 0
        git push
```

### 7. Utilidades para Soporte

```tsx
// src/utils/supportUtils.ts
export const getSupportInfo = () => {
  const versionInfo = {
    app: process.env.REACT_APP_VERSION,
    helpdesk: process.env.REACT_APP_HELPDESK_VERSION,
    crm: process.env.REACT_APP_CRM_VERSION,
    pqrs: process.env.REACT_APP_PQRS_VERSION,
    layout: process.env.REACT_APP_LAYOUT_VERSION,
    ui: process.env.REACT_APP_UI_VERSION,
    build: process.env.REACT_APP_BUILD_HASH,
    timestamp: process.env.REACT_APP_BUILD_TIMESTAMP,
    environment: process.env.NODE_ENV,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  return {
    versionInfo,
    formattedInfo: Object.entries(versionInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n'),
    jsonInfo: JSON.stringify(versionInfo, null, 2),
  };
};

export const copySupportInfo = async () => {
  const { formattedInfo } = getSupportInfo();
  
  try {
    await navigator.clipboard.writeText(formattedInfo);
    return true;
  } catch (error) {
    console.error('Error copying support info:', error);
    return false;
  }
};
```

### 8. Componente de Copia de Información de Soporte

```tsx
// src/components/support/SupportInfoCopy.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { copySupportInfo } from '@/utils/supportUtils';
import { Copy, Check } from 'lucide-react';

const SupportInfoCopy: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    const success = await copySupportInfo();
    
    if (success) {
      setCopied(true);
      toast({
        title: 'Información copiada',
        description: 'La información de versiones ha sido copiada al portapapeles.',
      });
      
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo copiar la información de versiones.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="flex items-center space-x-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          <span>Copiado</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span>Copiar info de soporte</span>
        </>
      )}
    </Button>
  );
};

export default SupportInfoCopy;
```

### 9. Checklist de Control de Versiones

#### ✅ Antes de cada release:
- [ ] Actualizar versiones en package.json
- [ ] Ejecutar script de actualización de versiones
- [ ] Verificar que las versiones se muestran correctamente en el footer
- [ ] Probar en diferentes entornos (development, staging, production)

#### ✅ Para soporte técnico:
- [ ] Verificar que la información de versiones está disponible
- [ ] Probar la funcionalidad de copia de información
- [ ] Confirmar que las versiones son correctas
- [ ] Documentar cualquier problema de versiones

#### ✅ Para desarrollo:
- [ ] Verificar que las versiones se actualizan automáticamente
- [ ] Probar en modo debug
- [ ] Confirmar que la información es útil para debugging

### 10. Variables CSS para el Footer

```css
/* src/styles/footer.css */
.app-footer {
  --footer-bg: var(--background);
  --footer-border: var(--border);
  --footer-text: var(--muted-foreground);
  --footer-link-hover: var(--foreground);
}

.app-footer {
  background-color: var(--footer-bg);
  border-top: 1px solid var(--footer-border);
  color: var(--footer-text);
}

.app-footer a {
  color: var(--footer-text);
  transition: color 0.2s ease;
}

.app-footer a:hover {
  color: var(--footer-link-hover);
}

.version-info {
  font-size: 0.75rem;
  line-height: 1.25;
  opacity: 0.8;
}

.version-info span {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .version-info {
    font-size: 0.625rem;
  }
  
  .version-info span {
    margin-right: 0.25rem;
  }
}
```

---

## Resumen de Leyes de Oro

1. **Información de Versiones:** Mostrar solo en desarrollo/soporte/debug.
2. **Variables de Entorno:** Usar variables de entorno para gestionar versiones.
3. **Automatización:** Actualizar versiones automáticamente en CI/CD.
4. **Utilidad para Soporte:** Facilitar la copia de información de versiones.
5. **Responsive:** Adaptar la información de versiones a diferentes tamaños de pantalla.
6. **Documentación:** Mantener documentación actualizada de versiones.

---

**Nota:** Esta documentación es obligatoria para todo el equipo. El control de versiones debe seguir estos estándares. 