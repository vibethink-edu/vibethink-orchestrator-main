"use client";

import { Users2Icon } from "lucide-react";
import { Card, CardAction, CardDescription, CardHeader } from "@vibethink/ui/components/card";
import { useTranslation } from "@/lib/i18n";

export function TotalCustomersCard() {
  const { t } = useTranslation('crm-v2');
  
  return (
    <Card>
      <CardHeader>
        <CardDescription>{t('cards.totalCustomers.title')}</CardDescription>
        <div className="flex flex-col gap-2">
          <h4 className="font-display text-2xl lg:text-3xl">1890</h4>
          <div className="text-muted-foreground text-sm">
            <span className="text-green-600">+10.4%</span> {t('cards.fromLastMonth')}
          </div>
        </div>
        <CardAction>
          <div className="flex gap-4">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full border">
              <Users2Icon className="size-5" />
            </div>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
