import { Button } from "@vibethink/ui/components/button";
import {
  ChatWidget,
  ExerciseMinutes,
  LatestPayments,
  PaymentMethodCard,
  SubscriptionsCard,
  TeamMembersCard,
  TotalRevenueCard
} from "./components";
import CustomDateRangePicker from "@/shared/components/bundui-premium/components/custom-date-range-picker";
import { Download } from "lucide-react";

/**
 * Default Dashboard Page
 * VibeThink Orchestrator - Bundui Premium Mirror
 * 
 * Landing dashboard with overview of key metrics:
 * - Team members and subscriptions
 * - Total revenue tracking
 * - Chat widget for quick communication
 * - Exercise minutes tracking
 * - Latest payments overview
 * - Payment method management
 * 
 * This is a 1:1 mirror of Bundui Premium default dashboard.
 */
export default function DefaultDashboardPage() {
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

