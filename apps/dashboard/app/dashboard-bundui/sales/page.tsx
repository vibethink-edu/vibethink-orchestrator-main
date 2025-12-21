import CustomDateRangePicker from "@/shared/components/bundui-premium/components/custom-date-range-picker";
import {
  BalanceCard,
  TaxCard,
  IncomeCard,
  ExpenseCard,
  BestSellingProducts,
  TableOrderStatus,
  RevenueChart
} from "./components";
import { Button } from "@vibethink/ui/components/button";
import { Download } from "lucide-react";

/**
 * Sales Dashboard Page
 * VibeThink Orchestrator - Bundui Premium Mirror
 * 
 * Complete sales dashboard with revenue tracking, financial metrics,
 * best-selling products, and order status management.
 * 
 * Features:
 * - Revenue chart with trends
 * - Financial cards (Balance, Income, Expense, Tax)
 * - Best selling products list
 * - Order status table
 * - Date range filtering
 * - Export functionality
 * 
 * This is a 1:1 mirror of Bundui Premium sales dashboard.
 */
export default function SalesPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Sales Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="grow">
            <CustomDateRangePicker />
          </div>
          <Button>
            <Download />
            <span className="hidden lg:inline">Download</span>
          </Button>
        </div>
      </div>
      <div className="gap-4 space-y-4 md:grid md:grid-cols-2 lg:space-y-0 xl:grid-cols-8">
        <div className="md:col-span-4">
          <RevenueChart />
        </div>
        <div className="md:col-span-4">
          <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            <BalanceCard />
            <IncomeCard />
            <ExpenseCard />
            <TaxCard />
          </div>
        </div>
      </div>
      <div className="gap-4 space-y-4 lg:space-y-0 xl:grid xl:grid-cols-3">
        <div className="xl:col-span-1">
          <BestSellingProducts />
        </div>
        <div className="xl:col-span-2">
          <TableOrderStatus />
        </div>
      </div>
    </div>
  );
}
