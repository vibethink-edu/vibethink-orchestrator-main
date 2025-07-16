
import React from 'react';
import { Gauge, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useTranslation } from 'react-i18next';

const LimitManagement = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {t('admin.limits.title')}
        </h1>
        <p className="text-[#A0A9C9] text-lg">
          {t('admin.limits.subtitle')}
        </p>
      </div>

      {/* Coming Soon Feature Card */}
      <Card className="bg-[#1A2341] border-[#2A3451]">
        <CardHeader className="text-center py-12">
          {/* Feature Icon */}
          <div className="mx-auto w-16 h-16 bg-[#4A7FFF]/20 rounded-full flex items-center justify-center mb-4">
            <Gauge className="w-8 h-8 text-[#4A7FFF]" />
          </div>
          
          {/* Feature Title and Description */}
          <CardTitle className="text-white text-2xl mb-2">
            {t('admin.limits.comingSoon.title')}
          </CardTitle>
          <CardDescription className="text-[#A0A9C9] text-lg max-w-md mx-auto">
            {t('admin.limits.comingSoon.description')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center pb-12">
          {/* Feature Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {/* Quotas Feature */}
            <div className="text-center">
              <Gauge className="w-8 h-8 text-[#4A7FFF] mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">{t('admin.limits.comingSoon.features.quotas.title')}</h3>
              <p className="text-[#A0A9C9] text-sm">{t('admin.limits.comingSoon.features.quotas.description')}</p>
            </div>
            
            {/* Monitoring Feature */}
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-[#4A7FFF] mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">{t('admin.limits.comingSoon.features.monitoring.title')}</h3>
              <p className="text-[#A0A9C9] text-sm">{t('admin.limits.comingSoon.features.monitoring.description')}</p>
            </div>
            
            {/* Alerts Feature */}
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-[#4A7FFF] mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">{t('admin.limits.comingSoon.features.alerts.title')}</h3>
              <p className="text-[#A0A9C9] text-sm">{t('admin.limits.comingSoon.features.alerts.description')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LimitManagement;
