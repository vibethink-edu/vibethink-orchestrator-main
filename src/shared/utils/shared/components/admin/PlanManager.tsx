
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Progress } from '@/shared/components/ui/progress';
import { Switch } from '@/shared/components/ui/switch';
import { Separator } from '@/shared/components/ui/separator';
import { toast } from 'sonner';
import {
  CreditCard,
  DollarSign,
  Users,
  Database,
  Server,
  Globe,
  Shield,
  Zap,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Download,
  Upload,
  usePlanDefinitions,
  useConfigureCompanyPlan
} from '@/shared/hooks/useCompanyLimits';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Company {
  id: string;
  name: string;
  slug: string;
  status: string;
  subscription_plan: string;
  max_users: number;
  max_monthly_ai_requests: number;
  max_monthly_scraping_pages: number;
  plan_definition_id: string;
  custom_max_users?: number;
  custom_max_monthly_ai_requests?: number;
  custom_max_monthly_scraping_pages?: number;
  custom_features?: string[];
}

const PlanManager = () => {
  const { plans, loading: plansLoading } = usePlanDefinitions();
  const { configurePlan, loading: configuring } = useConfigureCompanyPlan();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [customLimits, setCustomLimits] = useState({
    maxUsers: '',
    maxMonthlyAiRequests: '',
    maxMonthlyScrapingPages: '',
  });

  // Fetch all companies
  const { data: companies, isLoading: companiesLoading, refetch } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          id, name, slug, status, subscription_plan, max_users, 
          max_monthly_ai_requests, max_monthly_scraping_pages,
          plan_definition_id, custom_max_users, 
          custom_max_monthly_ai_requests, custom_max_monthly_scraping_pages,
          custom_features,
          plan_definitions!inner(name, display_name, base_price_usd)
        `)
        .order('name');
      
      if (error) throw error;
      return data as (Company & { plan_definitions: any })[]; // Assuming PlanDefinition is not directly imported here
    }
  });

  const handleConfigurePlan = async () => {
    if (!selectedCompany || !selectedPlan) {
      toast.error('Por favor selecciona una empresa y un plan');
      return;
    }

    try {
      const customLimitsObj = {
        maxUsers: customLimits.maxUsers ? parseInt(customLimits.maxUsers) : undefined,
        maxMonthlyAiRequests: customLimits.maxMonthlyAiRequests ? parseInt(customLimits.maxMonthlyAiRequests) : undefined,
        maxMonthlyScrapingPages: customLimits.maxMonthlyScrapingPages ? parseInt(customLimits.maxMonthlyScrapingPages) : undefined,
      };

      await configurePlan(selectedCompany, selectedPlan, customLimitsObj);
      toast.success('Plan configurado exitosamente');
      refetch();
      
      // Reset form
      setSelectedCompany('');
      setSelectedPlan('');
      setCustomLimits({
        maxUsers: '',
        maxMonthlyAiRequests: '',
        maxMonthlyScrapingPages: '',
      });
    } catch (error) {
      toast.error('Error al configurar el plan');
    }
  };

  const getPlanBadgeColor = (planName: string) => {
    switch (planName) {
      case 'STARTER': return 'bg-blue-500/20 text-blue-400';
      case 'PROFESSIONAL': return 'bg-green-500/20 text-green-400';
      case 'ENTERPRISE': return 'bg-purple-500/20 text-purple-400';
      case 'CUSTOM': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (plansLoading || companiesLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Gestión de Planes</h1>
        <p className="text-[#A0A9C9]">
          Configura planes y límites para las empresas en el sistema
        </p>
      </div>

      {/* Configuration Form */}
      <Card className="bg-[#1A2341] border-[#2A3451]">
        <CardHeader>
          <CardTitle className="text-white">Configurar Plan de Empresa</CardTitle>
          <CardDescription className="text-[#A0A9C9]">
            Asigna o modifica el plan de una empresa específica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Empresa</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="bg-[#2A3451] border-[#3A4561] text-white">
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A3451] border-[#3A4561]">
                  {companies?.map((company) => (
                    <SelectItem key={company.id} value={company.id} className="text-white">
                      {company.name} ({company.slug})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="bg-[#2A3451] border-[#3A4561] text-white">
                  <SelectValue placeholder="Seleccionar plan" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A3451] border-[#3A4561]">
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.name} className="text-white">
                      {plan.display_name} (${plan.base_price_usd}/mes)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(selectedPlan === 'ENTERPRISE' || selectedPlan === 'CUSTOM') && (
            <>
              <Separator className="bg-[#3A4561]" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Límites Personalizados (Opcional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Máximo de Usuarios</Label>
                    <Input
                      type="number"
                      value={customLimits.maxUsers}
                      onChange={(e) => setCustomLimits(prev => ({ ...prev, maxUsers: e.target.value }))}
                      placeholder="Dejar vacío para usar default"
                      className="bg-[#2A3451] border-[#3A4561] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Requests IA Mensuales</Label>
                    <Input
                      type="number"
                      value={customLimits.maxMonthlyAiRequests}
                      onChange={(e) => setCustomLimits(prev => ({ ...prev, maxMonthlyAiRequests: e.target.value }))}
                      placeholder="Dejar vacío para usar default"
                      className="bg-[#2A3451] border-[#3A4561] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Páginas Scraping Mensuales</Label>
                    <Input
                      type="number"
                      value={customLimits.maxMonthlyScrapingPages}
                      onChange={(e) => setCustomLimits(prev => ({ ...prev, maxMonthlyScrapingPages: e.target.value }))}
                      placeholder="Dejar vacío para usar default"
                      className="bg-[#2A3451] border-[#3A4561] text-white"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <Button 
            onClick={handleConfigurePlan}
            disabled={configuring || !selectedCompany || !selectedPlan}
            className="bg-[#4A7FFF] hover:bg-[#3A6FEF] text-white"
          >
            {configuring ? 'Configurando...' : 'Configurar Plan'}
          </Button>
        </CardContent>
      </Card>

      {/* Companies List */}
      <Card className="bg-[#1A2341] border-[#2A3451]">
        <CardHeader>
          <CardTitle className="text-white">Empresas Registradas</CardTitle>
          <CardDescription className="text-[#A0A9C9]">
            Lista de todas las empresas y sus planes actuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companies?.map((company) => (
              <div key={company.id} className="border border-[#3A4561] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{company.name}</h3>
                    <p className="text-sm text-[#A0A9C9]">{company.slug}</p>
                  </div>
                  <Badge className={(company.plan_definitions as any)?.name ? getPlanBadgeColor((company.plan_definitions as any).name) : 'bg-gray-500/20 text-gray-400'}>
                    {(company.plan_definitions as any)?.display_name || 'Sin Plan'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-[#A0A9C9]">Usuarios: </span>
                    <span className="text-white">{company.custom_max_users || company.max_users}</span>
                  </div>
                  <div>
                    <span className="text-[#A0A9C9]">IA/mes: </span>
                    <span className="text-white">{company.custom_max_monthly_ai_requests || company.max_monthly_ai_requests}</span>
                  </div>
                  <div>
                    <span className="text-[#A0A9C9]">Scraping/mes: </span>
                    <span className="text-white">{company.custom_max_monthly_scraping_pages || company.max_monthly_scraping_pages}</span>
                  </div>
                  <div>
                    <span className="text-[#A0A9C9]">Estado: </span>
                    <span className="text-white">{company.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card className="bg-[#1A2341] border-[#2A3451]">
        <CardHeader>
          <CardTitle className="text-white">Planes Disponibles</CardTitle>
          <CardDescription className="text-[#A0A9C9]">
            Definiciones de planes configurados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="border border-[#3A4561] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{plan.display_name}</h3>
                  <Badge className={getPlanBadgeColor(plan.name)}>
                    {plan.name}
                  </Badge>
                </div>
                <p className="text-sm text-[#A0A9C9] mb-3">{plan.description}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#A0A9C9]">Precio:</span>
                    <span className="text-white">${plan.base_price_usd}/mes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A0A9C9]">Usuarios:</span>
                    <span className="text-white">{plan.max_users}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A0A9C9]">IA/mes:</span>
                    <span className="text-white">{plan.max_monthly_ai_requests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A0A9C9]">Scraping/mes:</span>
                    <span className="text-white">{plan.max_monthly_scraping_pages.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanManager;
