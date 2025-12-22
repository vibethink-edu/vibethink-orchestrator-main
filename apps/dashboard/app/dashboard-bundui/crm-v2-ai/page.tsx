import CustomDateRangePicker from "@/components/custom-date-range-picker";
import { Button } from "@vibethink/ui/components/button";
import { generateMeta } from "@/shared/lib/utils";
import {
  LeadBySourceCard,
  SalesPipeline,
  LeadsCard,
  TargetCard,
  TotalCustomersCard,
  TotalDeals,
  TotalRevenueCard,
  RecentTasks
} from "../crm-v2/components";
import { CrmVoiceAgent } from "./components/crm-voice-agent";

export async function generateMetadata() {
  return generateMeta({
    title: "CRM V2 + AI - AI-First CRM Dashboard",
    description:
      "CRM admin dashboard with AI voice agent integration. Manage customer relationships, track sales, and interact with your CRM through natural voice commands. Built with shadcn/ui, Tailwind CSS, Next.js, and AI-First architecture.",
    canonical: "/crm-v2-ai"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">CRM Dashboard</h1>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            AI-Powered
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <CustomDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>

      {/* AI Voice Agent Component */}
      <CrmVoiceAgent />

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

