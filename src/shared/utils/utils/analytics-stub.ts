/**
 * Analytics Stub for VThink 1.0 Development
 * 
 * Sistema de analytics completamente stub para permitir desarrollo sin dependencias externas
 * Los servicios reales se habilitarán progresivamente según roadmap
 * 
 * @author VibeThink Platform Team
 * @version 1.0.0
 */

import React from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useCookies } from '@/shared/hooks/stubs/hooks-stubs';
import { usePersonalization } from '@/shared/hooks/stubs/hooks-stubs';

// Analytics event types
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  FEATURE_USED: 'feature_used',
  ERROR_OCCURRED: 'error_occurred',
  SEARCH_PERFORMED: 'search_performed',
  CONTENT_VIEWED: 'content_viewed',
  DOWNLOAD_STARTED: 'download_started'
} as const;

// Analytics configuration stub
const defaultConfig = {
  enabled: false, // Disabled during development
  externalServices: {
    mixpanel: { enabled: false },
    amplitude: { enabled: false },
    googleAnalytics: { enabled: false },
    posthog: { enabled: false }
  },
  sampling: {
    rate: 1.0,
    enabledEvents: Object.values(ANALYTICS_EVENTS)
  }
};

// Main analytics object
export const analytics = {
  track: (event: string, properties?: any) => {
    // TODO: log [Analytics Stub] Track en desarrollo
  },
  
  identify: (userId: string, properties?: any) => {
    // TODO: log [Analytics Stub] Identify en desarrollo
  },
  
  setCompany: (companyId: string, properties?: any) => {
    // TODO: log [Analytics Stub] Set Company en desarrollo
  },
  
  page: (page?: string, properties?: any) => {
    // TODO: log [Analytics Stub] Page en desarrollo
  },
  
  reset: () => {
    // TODO: log [Analytics Stub] Reset en desarrollo
  }
};

// Track function for global use
export const track = (event: string, properties?: any) => {
  analytics.track(event, properties);
};

// Page tracking hook
export const usePageTracking = (pageName?: string) => {
  const { user } = useAuth();
  const { hasConsent } = useCookies();
  const { preferences: companyConfig } = usePersonalization();

  React.useEffect(() => {
    // TODO: log [Analytics Stub] Page tracking en desarrollo
    // Stub - no real tracking during development
  }, [pageName]);

  React.useEffect(() => {
    if (user?.company?.id && hasConsent('analytics')) {
      analytics.setCompany(user.company.id, {
        name: user.company?.name,
        plan: (user.company as any)?.subscription_plan
      });
    }
  }, [user?.company?.id, companyConfig, hasConsent]);

  return {
    trackEvent: analytics.track,
    trackPage: analytics.page
  };
};

// Event tracking hook
export const useEventTracking = () => {
  const { user } = useAuth();
  const { hasConsent } = useCookies();

  const trackEvent = React.useCallback((event: string, properties?: any) => {
    if (hasConsent('analytics')) {
      analytics.track(event, {
        ...properties,
        user_id: user?.id,
        company_id: user?.company?.id,
        timestamp: new Date().toISOString()
      });
    }
  }, [user?.id, user?.company?.id, hasConsent]);

  return { trackEvent };
};

// Performance tracking stub
export const performanceTracker = {
  startMeasure: (name: string) => {
    // TODO: log [Performance Stub] Start measure en desarrollo
  },
  
  endMeasure: (name: string) => {
    // TODO: log [Performance Stub] End measure en desarrollo
  },
  
  trackError: (error: Error, context?: any) => {
    // TODO: log [Performance Stub] Track error en desarrollo
  }
};

// Error tracking
export const trackError = (error: Error, context?: any) => {
  performanceTracker.trackError(error, context);
};

// Export default analytics
export default analytics; 