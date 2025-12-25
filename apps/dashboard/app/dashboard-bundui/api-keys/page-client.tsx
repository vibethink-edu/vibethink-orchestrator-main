"use client";

import ApiKeysDataTable from "./components/datatable";
import UpgradePlanCard from "./components/upgrade-plan-card";
import SuccessfulConversionsCard from "./components/successful-conversions-card";
import FailedConversionsCard from "./components/failed-conversions-card";
import ApiCallsCard from "./components/api-calls-card";
import { useTranslation } from "@/lib/i18n";

interface ApiKeysPageClientProps {
  apiKeys: any[];
}

export default function ApiKeysPageClient({ apiKeys }: ApiKeysPageClientProps) {
  const { t } = useTranslation('api-keys');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t('header.title')}</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UpgradePlanCard />
        <SuccessfulConversionsCard />
        <FailedConversionsCard />
        <ApiCallsCard />
      </div>
      <ApiKeysDataTable data={apiKeys} />
    </div>
  );
}







