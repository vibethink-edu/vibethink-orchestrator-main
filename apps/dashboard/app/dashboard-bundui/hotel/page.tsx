"use client";

import { ReservationsCard } from "./components/reservations-card";
import { CampaignOverview } from "./components/campaign-overview";
import { RecentActivities } from "./components/recent-activities";
import { RevenueStat } from "./components/revenue-stat";
import { StatCards } from "./components/stat-cards";
import { BookingsCard } from "./components/bookings-card";
import { BookingList } from "./components/booking-list";
import { ClipboardMinusIcon, PlusIcon } from "@vibethink/ui/icons";
import { Button } from "@vibethink/ui";
import { useTranslation } from "@/lib/i18n";

export default function Page() {
  const { t } = useTranslation('hotel');
  
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">{t('components.header.title')}</h1>
        <div className="flex gap-2">
          <Button>
            <PlusIcon /> <span className="hidden md:flex">{t('components.header.actions.addNew')}</span>
          </Button>
          <Button variant="outline">
            <ClipboardMinusIcon /> <span className="hidden md:flex">{t('components.header.actions.reports')}</span>
          </Button>
        </div>
      </div>
      <StatCards />
      <div className="gap-4 space-y-4 xl:grid xl:grid-cols-3 xl:space-y-0">
        <ReservationsCard />
        <div className="xl:col-span-2">
          <CampaignOverview />
        </div>
      </div>
      <div className="gap-4 space-y-4 xl:grid xl:grid-cols-3 xl:space-y-0">
        <RecentActivities />
        <RevenueStat />
        <BookingsCard />
      </div>
      <BookingList />
    </div>
  );
}
