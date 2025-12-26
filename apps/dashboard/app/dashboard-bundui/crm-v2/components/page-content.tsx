"use client";

import CustomDateRangePicker from "@/components/custom-date-range-picker";
import { Button } from "@vibethink/ui/components/button";
import { useTranslation } from "@/lib/i18n";
import {
  LeadBySourceCard,
  SalesPipeline,
  LeadsCard,
  TargetCard,
  TotalCustomersCard,
  TotalDeals,
  TotalRevenueCard,
  RecentTasks
} from "./";

export function CRMV2PageContent() {
  const { t } = useTranslation('crm-v2');
  
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">{t('title')}</h1>
        <div className="flex items-center space-x-2">
          <CustomDateRangePicker />
          <Button>{t('download')}</Button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TargetCard />
          <TotalCustomersCard />
          <TotalDeals />
          <TotalRevenueCard />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <LeadBySourceCard />
          <RecentTasks />
          <SalesPipeline />
        </div>
        <LeadsCard />
      </div>
    </div>
  );
}





