
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Edit, Plus, DollarSign, Users, Zap, Globe } from 'lucide-react';
import { useSuperAdminData } from '@/shared/hooks/hooks/useSuperAdminData';
import { useTranslation } from 'react-i18next';

const PlanDefinitionsManager = () => {
  const { planDefinitions, loading } = useSuperAdminData();
  const { t } = useTranslation();

  const getPlanBadgeColor = (planName: string) => {
    switch (planName) {
      case 'STARTER': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PROFESSIONAL': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ENTERPRISE': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'CUSTOM': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">{t('planDefinitions.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('planDefinitions.title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('planDefinitions.description')}
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          {t('planDefinitions.newPlan')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planDefinitions.map((plan) => (
          <Card key={plan.id} className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">{plan.display_name}</CardTitle>
                <Badge className={getPlanBadgeColor(plan.name)}>
                  {plan.name}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Precio */}
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-foreground">
                  ${plan.base_price_usd}/{t('planDefinitions.price')}
                </span>
              </div>

              {/* Límites */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-muted-foreground">{t('planDefinitions.users')}:</span>
                  </div>
                  <span className="font-medium text-foreground">{plan.max_users}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-muted-foreground">{t('planDefinitions.aiPerMonth')}:</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {plan.max_monthly_ai_requests.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    <span className="text-muted-foreground">{t('planDefinitions.scrapingPerMonth')}:</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {plan.max_monthly_scraping_pages.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Features */}
              {plan.features && plan.features.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">{t('planDefinitions.features')}:</span>
                  <div className="flex flex-wrap gap-1">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {plan.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{plan.features.length - 3} {t('planDefinitions.more')}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <Button variant="outline" size="sm" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                {t('planDefinitions.editPlan')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanDefinitionsManager;
