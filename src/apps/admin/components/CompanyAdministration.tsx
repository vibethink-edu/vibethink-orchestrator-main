import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertTriangle, CreditCard, Settings, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import UserApprovalPanel from '@/components/admin/UserApprovalPanel';
import { AIUsageMonitoring } from '@/components/admin/AIUsageMonitoring';
import { BillingManagement } from '@/components/admin/BillingManagement';
import CompanyLimitsDisplay from '@/components/admin/CompanyLimitsDisplay';

interface CompanyStats {
  activeUsers: number;
  pendingApprovals: number;
  aiRequestsThisMonth: number;
  usagePercentage: number;
}

const CompanyAdministration = () => {
  const { user } = useAuth();
  const [companyStats, setCompanyStats] = useState<CompanyStats>({
    activeUsers: 0,
    pendingApprovals: 0,
    aiRequestsThisMonth: 0,
    usagePercentage: 0
  });

  useEffect(() => {
    fetchCompanyStats();
  }, [user]);

  const fetchCompanyStats = async () => {
    if (!user?.company?.id) return;

    try {
      // Mock data for development
      const mockStats: CompanyStats = {
        activeUsers: 3,
        pendingApprovals: 2,
        aiRequestsThisMonth: 750,
        usagePercentage: 75
      };

      setCompanyStats(mockStats);
    } catch (error) {
      console.error('Error fetching company stats:', error);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Administración de Empresa
        </h1>
        <p className="text-[#A0A9C9] text-lg">
          Panel de control para {user?.company?.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[#1A2341] border-[#2A3451]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#A0A9C9]">
              Usuarios Activos
            </CardTitle>
            <Users className="h-4 w-4 text-[#A0A9C9]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {companyStats.activeUsers}/{user?.company?.max_users || 5}
            </div>
            <p className="text-xs text-[#A0A9C9]">
              {companyStats.activeUsers === user?.company?.max_users ? 'Límite alcanzado' : 'Disponibles'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A2341] border-[#2A3451]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#A0A9C9]">
              Aprobaciones Pendientes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {companyStats.pendingApprovals}
            </div>
            <p className="text-xs text-[#A0A9C9]">
              Usuarios esperando aprobación
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A2341] border-[#2A3451]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#A0A9C9]">
              Uso de IA (Mes)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[#A0A9C9]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {companyStats.usagePercentage}%
            </div>
            <p className="text-xs text-[#A0A9C9]">
              {companyStats.aiRequestsThisMonth} de {user?.company?.max_monthly_ai_requests || 1000} requests
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A2341] border-[#2A3451]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#A0A9C9]">
              Plan Actual
            </CardTitle>
            <CreditCard className="h-4 w-4 text-[#A0A9C9]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {user?.company?.subscription_plan || 'STARTER'}
            </div>
            <p className="text-xs text-[#A0A9C9]">
              Estado: {user?.company?.status || 'TRIAL'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {(companyStats.usagePercentage >= 80 || companyStats.activeUsers === user?.company?.max_users) && (
        <Card className="bg-orange-500/10 border-orange-500/30 mb-6">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {companyStats.usagePercentage >= 80 && (
                <p className="text-orange-300">
                  ⚠️ Uso de IA al {companyStats.usagePercentage}% del límite mensual
                </p>
              )}
              {companyStats.activeUsers === user?.company?.max_users && (
                <p className="text-orange-300">
                  ⚠️ Límite de usuarios alcanzado ({companyStats.activeUsers}/{user?.company?.max_users})
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs principales */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-[#1A2341] border-[#2A3451]">
          <TabsTrigger value="users" className="data-[state=active]:bg-[#4A7FFF]">
            <Users className="w-4 h-4 mr-2" />
            Gestión de Usuarios
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-[#4A7FFF]">
            <Activity className="w-4 h-4 mr-2" />
            Monitoreo de IA
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-[#4A7FFF]">
            <CreditCard className="w-4 h-4 mr-2" />
            Facturación
          </TabsTrigger>
          <TabsTrigger value="limits" className="data-[state=active]:bg-[#4A7FFF]">
            <Settings className="w-4 h-4 mr-2" />
            Límites del Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserApprovalPanel onStatsUpdate={fetchCompanyStats} />
        </TabsContent>

        <TabsContent value="monitoring">
          <AIUsageMonitoring />
        </TabsContent>

        <TabsContent value="billing">
          <BillingManagement />
        </TabsContent>

        <TabsContent value="limits">
          <CompanyLimitsDisplay />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyAdministration;
