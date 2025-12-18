import { Button } from "@vibethink/ui";
import {
  AverageDailySalesCard,
  WebsiteAnalyticsCard,
  SaleOverviewCard,
  EarningReportsCard,
  TicketsCard,
  SalesByCountriesCard,
  TotalEarningCard,
  MonthlyCampaignStateCard
} from "./components";
import CustomDateRangePicker from "@/shared/components/custom-date-range-picker";

export default function WebsiteAnalyticsPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Website Analytics</h1>
        <div className="flex items-center space-x-2">
          <div className="grow">
            <CustomDateRangePicker />
          </div>
          <Button>Download</Button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <WebsiteAnalyticsCard />
        </div>
        <div className="lg:col-span-4">
          <AverageDailySalesCard />
        </div>
        <div className="lg:col-span-4">
          <SaleOverviewCard />
        </div>
        <div className="lg:col-span-12 xl:col-span-8">
          <EarningReportsCard />
        </div>
        <div className="lg:col-span-12 xl:col-span-4">
          <TicketsCard />
        </div>
        <div className="lg:col-span-4">
          <SalesByCountriesCard />
        </div>
        <div className="lg:col-span-4">
          <TotalEarningCard />
        </div>
        <div className="lg:col-span-4">
          <MonthlyCampaignStateCard />
        </div>
      </div>
    </div>
  );
}
