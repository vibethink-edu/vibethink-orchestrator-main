"use client";

import React from 'react';
import BunduiDefaultDashboard from './BunduiDefaultDashboard';
import { BunduiPremiumProvider } from '@/shared/components/bundui-premium/BunduiPremiumProvider';
import { AuthProvider } from '@/shared/hooks/hooks/useAuth';

const BunduiDefaultDashboardDemo: React.FC = () => {
  return (
    <AuthProvider>
      <BunduiPremiumProvider>
        <BunduiDefaultDashboard companyId="company-123" />
      </BunduiPremiumProvider>
    </AuthProvider>
  );
};

export default BunduiDefaultDashboardDemo; 