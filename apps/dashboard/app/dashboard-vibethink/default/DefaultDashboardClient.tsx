"use client";

import { Download } from "lucide-react";
import { Button } from "@vibethink/ui/components/button";
import CustomDateRangePicker from "@/shared/components/bundui-premium/components/custom-date-range-picker";
import {
  ChatWidget,
  ExerciseMinutes,
  LatestPayments,
  PaymentMethodCard,
  SubscriptionsCard,
  TeamMembersCard,
  TotalRevenueCard
} from "./components";

export default function DefaultDashboardClient() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <CustomDateRangePicker />
          <Button>
            <Download />
            <span className="hidden lg:inline">Download</span>
          </Button>
        </div>
      </div>
      <div className="gap-4 space-y-4 lg:grid lg:grid-cols-3 lg:space-y-0">
        <TeamMembersCard />
        <SubscriptionsCard />
        <TotalRevenueCard />
        <ChatWidget />
        <div className="lg:col-span-2">
          <ExerciseMinutes />
        </div>
        <div className="lg:col-span-2">
          <LatestPayments />
        </div>
        <PaymentMethodCard />
      </div>
    </div>
  );
}
