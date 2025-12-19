import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vibethink/ui";
import {
  SummaryCards,
  AchievementByYear,
  ChartProjectOverview,
  ChartProjectEfficiency,
  TableRecentProjects,
  Reminders,
  SuccessMetrics,
  Reports
} from "./components";
import CustomDateRangePicker from "@/shared/components/bundui-premium/components/custom-date-range-picker";
import { ExportButton } from "@/shared/components/CardActionMenus";

/**
 * Project Management Dashboard Page
 * VibeThink Orchestrator - Bundui Premium Mirror
 * 
 * Comprehensive project management dashboard with:
 * - Summary cards with key metrics
 * - Project overview charts
 * - Project efficiency tracking
 * - Recent projects table
 * - Reminders and tasks
 * - Success metrics
 * - Reports section
 * 
 * Features:
 * - Tab navigation (Overview, Reports, Activities)
 * - Date range filtering
 * - Export functionality
 * - Real-time project tracking
 * 
 * This is a 1:1 mirror of Bundui Premium project management dashboard.
 */
export default function ProjectManagementPage() {
  return (
    <>
      <div className="mb-4 flex flex-row items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Project Dashboard</h1>
        <div className="flex items-center space-x-2">
          <CustomDateRangePicker />
          <ExportButton />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="z-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="activities" disabled>
            Activities
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <SummaryCards />
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartProjectOverview />
            </div>
            <SuccessMetrics />
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
            <Reminders />
            <AchievementByYear />
            <ChartProjectEfficiency />
          </div>
          <TableRecentProjects />
        </TabsContent>
        <TabsContent value="reports">
          <Reports />
        </TabsContent>
        <TabsContent value="activities">...</TabsContent>
      </Tabs>
    </>
  );
}

