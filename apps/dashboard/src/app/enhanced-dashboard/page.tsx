"use client";

/**
 * Enhanced Dashboard Page - VThink 1.0
 * 
 * Dashboard mejorado que combina:
 * - BunduiCompleteLayout (sidebar modular ORIGINAL)
 * - ShadcnStyleDashboard (componentes premium)
 * - AI Consensus Framework workflow
 * 
 * Siguiendo VThink 1.0 Architecture:
 * /apps + /src structure con componentes desacoplados
 */

import React from 'react';
import BunduiCompleteLayout from '@/shared/components/bundui-premium/components/layout/BunduiCompleteLayout';
import EnhancedDashboardContent from '@/components/enhanced-dashboard/EnhancedDashboardContent';

export default function EnhancedDashboardPage() {
  return (
    <BunduiCompleteLayout>
      <EnhancedDashboardContent />
    </BunduiCompleteLayout>
  );
}
