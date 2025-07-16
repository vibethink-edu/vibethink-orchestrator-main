
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { useCompanyLimits } from '@/hooks/useCompanyLimits';
import { useAuth } from '@/hooks/useAuth';

const CompanyLimitsDisplay = () => {
  const { user } = useAuth();
  const { limits, loading, error } = useCompanyLimits();

  if (loading) {
    return (
      <Card className="bg-[#1A2341] border-[#2A3451]">
        <CardContent className="p-6">
          <div className="text-[#A0A9C9]">Cargando límites...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !limits) {
    return (
      <Card className="bg-[#1A2341] border-[#2A3451]">
        <CardContent className="p-6">
          <div className="text-red-400">Error al cargar límites: {error}</div>
        </CardContent>
      </Card>
    );
  }

  const company = user?.company;
  // Ensure features is always an array
  const features = Array.isArray(limits.features) ? limits.features : [];
  
  return (
    <Card className="bg-[#1A2341] border-[#2A3451]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Límites de la Empresa</CardTitle>
            <CardDescription className="text-[#A0A9C9]">
              {company?.name} - Plan Actual
            </CardDescription>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400">
            {company?.subscription_plan || 'STARTER'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Users Limit */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white">Usuarios</span>
            <span className="text-sm text-[#A0A9C9]">0 / {limits.max_users}</span>
          </div>
          <Progress 
            value={0} 
            className="h-2 bg-[#2A3451]"
          />
        </div>

        {/* AI Requests Limit */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white">Requests IA (Mensual)</span>
            <span className="text-sm text-[#A0A9C9]">0 / {limits.max_monthly_ai_requests.toLocaleString()}</span>
          </div>
          <Progress 
            value={0} 
            className="h-2 bg-[#2A3451]"
          />
        </div>

        {/* Scraping Pages Limit */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white">Páginas Scraping (Mensual)</span>
            <span className="text-sm text-[#A0A9C9]">0 / {limits.max_monthly_scraping_pages.toLocaleString()}</span>
          </div>
          <Progress 
            value={0} 
            className="h-2 bg-[#2A3451]"
          />
        </div>

        {/* Storage Limit */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white">Almacenamiento</span>
            <span className="text-sm text-[#A0A9C9]">0 GB / {limits.max_storage_gb} GB</span>
          </div>
          <Progress 
            value={0} 
            className="h-2 bg-[#2A3451]"
          />
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-white">Características Habilitadas</span>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-[#A0A9C9] border-[#3A4561]">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyLimitsDisplay;
