// import posthog from 'posthog-js'; // TEMPORALMENTE DESHABILITADO
import { useAuth } from '@/shared/hooks/useAuth';

// Stub para PostHog mientras está deshabilitado
const posthog = {
  init: (...args: any[]) => {},
  capture: (...args: any[]) => {},
  identify: (...args: any[]) => {},
  group: (...args: any[]) => {},
  people: { set: (...args: any[]) => {} },
  reset: (...args: any[]) => {},
  getInstance: () => posthog
};

// PostHog Configuration - TEMPORALMENTE DESHABILITADO
const POSTHOG_CONFIG = {
  apiKey: '', // import.meta.env.VITE_POSTHOG_API_KEY || '',
  apiHost: 'http://localhost:8000', // import.meta.env.VITE_POSTHOG_API_HOST || 'http://localhost:8000',
  enable: false, // FORZADO A FALSE - PostHog temporalmente deshabilitado
  debug: false, // import.meta.env.DEV,
  capture_pageview: false, // We'll capture manually
  capture_pageleave: true,
  disable_session_recording: false,
  enable_recording_console_log: false,
  enable_recording_network_payloads: false,
  autocapture: true,
  disable_persistence: false,
  disable_cookie: false,
  secure_cookie: true,
  property_blacklist: ['$initial_referrer', '$initial_referring_domain'],
  sanitize_properties: (properties: any) => {
    // Remove sensitive data
    const { password, token, secret, ...sanitized } = properties;
    return sanitized;
  }
};

// Multi-tenant configuration
interface PostHogMultiTenantConfig {
  companyId: string;
  companyName: string;
  userId: string;
  userEmail: string;
  userRole: string;
}

class PostHogService {
  private isInitialized = false;
  private currentCompanyId: string | null = null;

  /**
   * Initialize PostHog with multi-tenant configuration
   */
  initialize(config: PostHogMultiTenantConfig): void {
    if (!POSTHOG_CONFIG.enable || this.isInitialized) {
      return;
    }

    try {
      // Initialize PostHog
      posthog.init(POSTHOG_CONFIG.apiKey, {
        api_host: POSTHOG_CONFIG.apiHost,
        ...POSTHOG_CONFIG
      });

      // Set user identity
      posthog.identify(config.userId, {
        email: config.userEmail,
        role: config.userRole,
        company_id: config.companyId,
        company_name: config.companyName
      });

      // Set company context
      posthog.group('company', config.companyId, {
        name: config.companyName,
        id: config.companyId
      });

      this.currentCompanyId = config.companyId;
      this.isInitialized = true;
      // TODO: log PostHog initialized with multi-tenant config en desarrollo
    } catch (error) {
      // TODO: log Failed to initialize PostHog en desarrollo
    }
  }

  /**
   * Track custom event with company context
   */
  track(event: string, properties: Record<string, any> = {}): void {
    if (!this.isInitialized || !POSTHOG_CONFIG.enable) {
      return;
    }

    try {
      // Add company context to all events
      const eventWithContext = {
        ...properties,
        company_id: this.currentCompanyId,
        timestamp: new Date().toISOString()
      };

      posthog.capture(event, eventWithContext);

      if (POSTHOG_CONFIG.debug) {
        // TODO: log PostHog event tracked en desarrollo
      }

    } catch (error) {
      // TODO: log Failed to track PostHog event en desarrollo
    }
  }

  /**
   * Track page view with company context
   */
  trackPageView(url: string, title?: string): void {
    if (!this.isInitialized || !POSTHOG_CONFIG.enable) {
      return;
    }

    try {
      posthog.capture('$pageview', {
        $current_url: url,
        $pathname: new URL(url).pathname,
        $title: title || document.title,
        company_id: this.currentCompanyId
      });

    } catch (error) {
      // TODO: log Failed to track page view en desarrollo
    }
  }

  /**
   * Track user action with company context
   */
  trackUserAction(action: string, details: Record<string, any> = {}): void {
    this.track('user_action', {
      action,
      ...details
    });
  }

  /**
   * Track feature usage with company context
   */
  trackFeatureUsage(feature: string, usage: Record<string, any> = {}): void {
    this.track('feature_usage', {
      feature,
      ...usage
    });
  }

  /**
   * Track error with company context
   */
  trackError(error: Error, context: Record<string, any> = {}): void {
    this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...context
    });
  }

  /**
   * Track performance metrics with company context
   */
  trackPerformance(metric: string, value: number, context: Record<string, any> = {}): void {
    this.track('performance', {
      metric,
      value,
      ...context
    });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>): void {
    if (!this.isInitialized || !POSTHOG_CONFIG.enable) {
      return;
    }

    try {
      posthog.people.set(properties);
    } catch (error) {
      // TODO: log Failed to set user properties en desarrollo
    }
  }

  /**
   * Set company properties
   */
  setCompanyProperties(properties: Record<string, any>): void {
    if (!this.isInitialized || !POSTHOG_CONFIG.enable || !this.currentCompanyId) {
      return;
    }

    try {
      posthog.group('company', this.currentCompanyId, properties);
    } catch (error) {
      // TODO: log Failed to set company properties en desarrollo
    }
  }

  /**
   * Reset user session (for logout)
   */
  reset(): void {
    if (!this.isInitialized) {
      return;
    }

    try {
      posthog.reset();
      this.isInitialized = false;
      this.currentCompanyId = null;
    } catch (error) {
      // TODO: log Failed to reset PostHog en desarrollo
    }
  }

  /**
   * Get PostHog instance for advanced usage
   */
  getInstance(): typeof posthog {
    return posthog;
  }

  /**
   * Check if PostHog is enabled
   */
  isEnabled(): boolean {
    return POSTHOG_CONFIG.enable && this.isInitialized;
  }
}

// Export singleton instance
export const posthogService = new PostHogService();

// React hook for PostHog
export const usePostHog = () => {
  const { user, company } = useAuth();

  const initializePostHog = () => {
    if (!user || !company) {
      return;
    }

    posthogService.initialize({
      companyId: company.id,
      companyName: company.name,
      userId: user.id,
      userEmail: user.email,
      userRole: user.role
    });
  };

  const trackEvent = (event: string, properties: Record<string, any> = {}) => {
    posthogService.track(event, properties);
  };

  const trackPageView = (url: string, title?: string) => {
    posthogService.trackPageView(url, title);
  };

  const trackUserAction = (action: string, details: Record<string, any> = {}) => {
    posthogService.trackUserAction(action, details);
  };

  const trackFeatureUsage = (feature: string, usage: Record<string, any> = {}) => {
    posthogService.trackFeatureUsage(feature, usage);
  };

  const trackError = (error: Error, context: Record<string, any> = {}) => {
    posthogService.trackError(error, context);
  };

  const trackPerformance = (metric: string, value: number, context: Record<string, any> = {}) => {
    posthogService.trackPerformance(metric, value, context);
  };

  return {
    initialize: initializePostHog,
    track: trackEvent,
    trackPageView,
    trackUserAction,
    trackFeatureUsage,
    trackError,
    trackPerformance,
    isEnabled: posthogService.isEnabled(),
    reset: posthogService.reset
  };
};

// Export for direct usage
export default posthogService; 