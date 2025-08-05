"use client";

/**
 * Enhanced Dashboard Page - VThink 1.0
 * 
 * Dashboard mejorado que combina:
 * - DashboardLayout (sidebar modular ESTÁNDAR)
 * - ShadcnStyleDashboard (componentes premium)
 * - AI Consensus Framework workflow
 * 
 * Siguiendo VThink 1.0 Architecture:
 * /apps + /src structure con componentes desacoplados
 */

import React from 'react';
import DashboardLayout from '@/shared/components/bundui-premium/components/layout/DashboardLayout';
import EnhancedDashboardContent from '@/components/enhanced-dashboard/EnhancedDashboardContent';

export default function EnhancedDashboardPage() {
  return (
    <DashboardLayout>
      <EnhancedDashboardContent />
    </DashboardLayout>
  );
}
