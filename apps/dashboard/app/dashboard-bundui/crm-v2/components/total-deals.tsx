"use client";

import { BriefcaseBusiness } from "lucide-react";
import { Card, CardAction, CardDescription, CardHeader } from "@vibethink/ui/components/card";
import { useTranslation } from "@/lib/i18n";

export function TotalDeals() {
  const { t } = useTranslation('crm-v2');
  
  return (
    <Card>
      <CardHeader>
        <CardDescription>{t('cards.totalDeals.title')}</CardDescription>
        <div className="flex flex-col gap-2">
          <h4 className="font-display text-2xl lg:text-3xl">1,02,890</h4>
          <div className="text-muted-foreground text-sm">
            <span className="text-red-600">-0.8%</span> {t('cards.fromLastMonth')}
          </div>
        </div>
        <CardAction>
          <div className="flex gap-4">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full border">
              <BriefcaseBusiness className="size-5" />
            </div>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
