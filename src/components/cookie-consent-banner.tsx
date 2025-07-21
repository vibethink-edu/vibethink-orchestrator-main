/**
 * Banner de Consentimiento de Cookies - VThink 1.0
 * 
 * Componente moderno que implementa:
 * - GDPR/CCPA/LGPD compliance
 * - Estándares de cookies 2025
 * - Diseño accesible
 * - Animaciones suaves
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useCookieManager } from '@/lib/cookie-manager';
import { CookieConsent } from '@/types/vthink-unified';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Cookie, 
  Shield, 
  Settings, 
  BarChart3, 
  Megaphone, 
  Heart,
  X,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CookieConsentBannerProps {
  tenantId: string;
  userId?: string;
  onConsentUpdate?: (consents: Partial<CookieConsent>) => void;
  className?: string;
}

export function CookieConsentBanner({
  tenantId,
  userId,
  onConsentUpdate,
  className = ''
}: CookieConsentBannerProps) {
  const { updateConsent, hasConsent, isLoading } = useCookieManager(tenantId, userId);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [consents, setConsents] = useState<Partial<CookieConsent>>({
    essential_consent: true,
    functional_consent: false,
    analytics_consent: false,
    marketing_consent: false,
    preferences_consent: false
  });

  useEffect(() => {
    // Mostrar banner si no hay consentimiento previo
    const hasAnyConsent = Object.values(consents).some(consent => consent);
    if (!hasAnyConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsentUpdate = async (newConsents: Partial<CookieConsent>) => {
    const updatedConsents = { ...consents, ...newConsents };
    setConsents(updatedConsents);
    
    try {
      await updateConsent(updatedConsents);
      onConsentUpdate?.(updatedConsents);
      
      // Ocultar banner después de aceptar
      if (updatedConsents.essential_consent) {
        setTimeout(() => setIsVisible(false), 500);
      }
    } catch (error) {
      // TODO: log 'Error al actualizar consentimientos:' error
    }
  };

  const handleAcceptAll = () => {
    handleConsentUpdate({
      essential_consent: true,
      functional_consent: true,
      analytics_consent: true,
      marketing_consent: true,
      preferences_consent: true
    });
  };

  const handleAcceptEssential = () => {
    handleConsentUpdate({
      essential_consent: true,
      functional_consent: false,
      analytics_consent: false,
      marketing_consent: false,
      preferences_consent: false
    });
  };

  const handleToggleConsent = (consentType: keyof CookieConsent) => {
    setConsents(prev => ({
      ...prev,
      [consentType]: !prev[consentType]
    }));
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <Card className="max-w-4xl mx-auto shadow-lg border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cookie className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg font-semibold">
                Configuración de Cookies
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                VThink 1.0
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mensaje principal */}
          <div className="text-sm text-muted-foreground leading-relaxed">
            Utilizamos cookies para mejorar tu experiencia en VibeThink. 
            Algunas son esenciales para el funcionamiento del sitio, mientras que otras 
            nos ayudan a mejorar nuestros servicios.
          </div>

          {/* Tipos de cookies */}
          <div className="space-y-3">
            {/* Cookies Esenciales */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Cookies Esenciales</div>
                  <div className="text-xs text-muted-foreground">
                    Necesarias para el funcionamiento básico del sitio
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Siempre activas
                </Badge>
                <Switch checked={true} disabled />
              </div>
            </div>

            {/* Cookies Funcionales */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">Cookies Funcionales</div>
                  <div className="text-xs text-muted-foreground">
                    Mejoran la funcionalidad y personalización
                  </div>
                </div>
              </div>
              <Switch
                checked={consents.functional_consent || false}
                onCheckedChange={() => handleToggleConsent('functional_consent')}
              />
            </div>

            {/* Cookies de Analytics */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-sm">Cookies de Analytics</div>
                  <div className="text-xs text-muted-foreground">
                    Nos ayudan a entender cómo usas el sitio
                  </div>
                </div>
              </div>
              <Switch
                checked={consents.analytics_consent || false}
                onCheckedChange={() => handleToggleConsent('analytics_consent')}
              />
            </div>

            {/* Cookies de Marketing */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-medium text-sm">Cookies de Marketing</div>
                  <div className="text-xs text-muted-foreground">
                    Utilizadas para publicidad personalizada
                  </div>
                </div>
              </div>
              <Switch
                checked={consents.marketing_consent || false}
                onCheckedChange={() => handleToggleConsent('marketing_consent')}
              />
            </div>

            {/* Cookies de Preferencias */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-pink-600" />
                <div>
                  <div className="font-medium text-sm">Cookies de Preferencias</div>
                  <div className="text-xs text-muted-foreground">
                    Recuerdan tus configuraciones personales
                  </div>
                </div>
              </div>
              <Switch
                checked={consents.preferences_consent || false}
                onCheckedChange={() => handleToggleConsent('preferences_consent')}
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>
              Puedes cambiar estas configuraciones en cualquier momento desde tu perfil.
            </span>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={handleAcceptEssential}
              variant="outline"
              disabled={isLoading}
              className="flex-1"
            >
              <Shield className="h-4 w-4 mr-2" />
              Solo Esenciales
            </Button>
            
            <Button
              onClick={handleAcceptAll}
              disabled={isLoading}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Aceptar Todas
            </Button>
            
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              disabled={isLoading}
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              Personalizar
            </Button>
          </div>

          {/* Información legal */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Al continuar, aceptas nuestra{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Política de Privacidad
            </a>
            {' '}y el uso de cookies según nuestros{' '}
            <a href="/cookies" className="text-primary hover:underline">
              Términos de Cookies
            </a>
            .
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// COMPONENTE DE GESTIÓN DE COOKIES
// ============================================================================

interface CookieManagementProps {
  tenantId: string;
  userId?: string;
}

export function CookieManagement({ tenantId, userId }: CookieManagementProps) {
  const { hasConsent, createCookie, deleteCookie, cleanupExpiredCookies } = useCookieManager(tenantId, userId);
  const [isLoading, setIsLoading] = useState(false);

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      const deletedCount = await cleanupExpiredCookies();
      // TODO: log `Se eliminaron ${deletedCount} cookies expiradas`
    } catch (error) {
      // TODO: log 'Error al limpiar cookies:' error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gestión de Cookies</h3>
        <Button
          onClick={handleCleanup}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Limpiar Expiradas
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries({
          essential: 'Esenciales',
          functional: 'Funcionales',
          analytics: 'Analytics',
          marketing: 'Marketing',
          preferences: 'Preferencias'
        }).map(([purpose, label]) => (
          <Card key={purpose} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-muted-foreground">
                  {hasConsent(purpose as any) ? 'Permitidas' : 'Bloqueadas'}
                </div>
              </div>
              <Badge variant={hasConsent(purpose as any) ? 'default' : 'secondary'}>
                {hasConsent(purpose as any) ? 'Activa' : 'Inactiva'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 