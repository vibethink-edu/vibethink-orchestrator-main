/**
 * Analytics Services Stubs
 * 
 * Stubs temporales para servicios de analytics externos durante desarrollo
 * Estos se habilitarán progresivamente según el roadmap de VThink 1.0
 * 
 * Roadmap:
 * - Fase 2 (Q1 2025): Analytics básico
 * - Fase 3 (Q2 2025): Product analytics  
 * - Fase 4 (Q3 2025): Advanced analytics
 * 
 * @author VibeThink Platform Team
 * @version 1.0.0
 */

// PostHog stub
export const posthogStub = {
  capture: (event: string, properties?: any) => {
    // TODO: log [PostHog Stub] en desarrollo
  },
  identify: (userId: string, properties?: any) => {
    // TODO: log [PostHog Stub] Identify en desarrollo
  },
  alias: (alias: string, userId?: string) => {
    // TODO: log [PostHog Stub] Alias en desarrollo
  },
  reset: () => {
    // TODO: log [PostHog Stub] Reset en desarrollo
  },
  isFeatureEnabled: (feature: string) => {
    // TODO: log [PostHog Stub] Feature check en desarrollo
    return false; // Default to disabled
  }
};

// Mixpanel stub
export const mixpanelStub = {
  track: (event: string, properties?: any) => {
    // TODO: log [Mixpanel Stub] en desarrollo
  },
  identify: (userId: string) => {
    // TODO: log [Mixpanel Stub] Identify en desarrollo
  },
  people: {
    set: (properties: any) => {
      // TODO: log [Mixpanel Stub] People set en desarrollo
    }
  }
};

// Amplitude stub
export const amplitudeStub = {
  getInstance: () => ({
    logEvent: (event: string, properties?: any) => {
      // TODO: log [Amplitude Stub] en desarrollo
    },
    setUserId: (userId: string) => {
      // TODO: log [Amplitude Stub] Set User ID en desarrollo
    },
    setUserProperties: (properties: any) => {
      // TODO: log [Amplitude Stub] User properties en desarrollo
    }
  })
};

// Google Analytics stub
export const gtagStub = (...args: any[]) => {
  // TODO: log [Google Analytics Stub] en desarrollo
};

// Track function stub
export const trackStub = (event: string, properties?: any) => {
  // TODO: log [Track Stub] en desarrollo
};

// Performance memory stub
export const performanceMemoryStub = {
  usedJSHeapSize: 0,
  totalJSHeapSize: 0,
  jsHeapSizeLimit: 0
};

// Global analytics object
export const analyticsStub = {
  track: trackStub,
  identify: (userId: string, properties?: any) => {
    // TODO: log [Analytics Stub] Identify en desarrollo
  },
  setCompany: (companyId: string, properties?: any) => {
    // TODO: log [Analytics Stub] Set Company en desarrollo
  },
  page: (page?: string, properties?: any) => {
    // TODO: log [Analytics Stub] Page en desarrollo
  }
};

// Export all stubs
export const stubs = {
  posthog: posthogStub,
  mixpanel: mixpanelStub,
  amplitude: amplitudeStub,
  gtag: gtagStub,
  track: trackStub,
  analytics: analyticsStub,
  performanceMemory: performanceMemoryStub
};

export default stubs; 