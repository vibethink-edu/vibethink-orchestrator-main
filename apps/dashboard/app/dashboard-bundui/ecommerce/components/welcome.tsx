"use client";

import Image from "next/image";

import { Button } from "@vibethink/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import { useTranslation } from "@/lib/i18n";

export function EcommerceWelcomeCard() {
  const { t } = useTranslation('ecommerce');
  
  return (
    <Card className="bg-muted relative overflow-hidden md:col-span-6 xl:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl">{t('welcome.title', { name: 'Vito' })}</CardTitle>
        <CardDescription>{t('welcome.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-3xl">$15,231.89</div>
            <div className="text-muted-foreground text-xs">
              <span className="text-green-500">+65%</span> {t('welcome.fromLastMonth', { percentage: '65' })}
            </div>
          </div>
          <Button variant="outline">{t('welcome.viewSales')}</Button>
        </div>
      </CardContent>
      <Image
        width={800}
        height={300}
        src={`/star-shape.png`}
        className="pointer-events-none absolute inset-0 aspect-auto"
        unoptimized
        alt="..."
      />
    </Card>
  );
}






