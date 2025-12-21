"use client";

import { Download, RefreshCw } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vibethink/ui/components/tabs";
import { Button } from "@vibethink/ui/components/button";
import { Badge } from "@vibethink/ui/components/badge";
import CustomDateRangePicker from "@/shared/components/bundui-premium/components/custom-date-range-picker";

import PatientVisitsChart from "./components/patient-visits-chart";
import PatientsByDepartmentChart from "./components/patients-by-department-chart";
import UpcomingAppointments from "./components/upcoming-appointments";
import PatientsWithLastProcedure from "./components/patients-with-last-procedure";
import Notes from "./components/notes";
import HospitalReports from "./components/reports";
import PlannedCalendar from "./components/planned-calendar";
import SummaryCards from "./components/summary-cards";

// ⭐ VThink 1.0 Pattern: Import hooks
import { useHospitalData, useHospitalFilters } from "./hooks";

/**
 * Hospital Management Dashboard Page
 * VibeThink Orchestrator - Architecture Upgrade Phase 4
 * 
 * Complete hospital administration dashboard with patient management,
 * appointment tracking, department analytics, and comprehensive
 * healthcare operational tools.
 * 
 * ✨ REFACTORED WITH VTHINK 1.0 PATTERN:
 * - useHospitalData: Data fetching with multi-tenant security
 * - useHospitalFilters: Filter logic separated from UI
 * - Clean component: NO business logic, only UI
 * 
 * Features:
 * - Patient visits tracking by gender and department
 * - Upcoming appointments management
 * - Patients with last procedure tracking
 * - Planned calendar with appointments
 * - Notes and reminders system
 * - Hospital reports and analytics
 * - Multi-tenant security (company_id filtering)
 * 
 * @route /dashboard-bundui/hospital-management
 */

export default function HospitalManagementDashboardPage() {
  // ⭐ VThink Pattern: Hooks for data and filters
  const {
    patients,
    appointments,
    stats,
    isLoading,
    company_id,
    lastUpdated,
    refresh
  } = useHospitalData();

  const {
    filters,
    filterPatients,
    filterAppointments,
    activeFiltersCount,
    setDateRange
  } = useHospitalFilters();

  // Apply filters
  const filteredPatients = filterPatients(patients);
  const filteredAppointments = filterAppointments(appointments);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Loading hospital data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
            Hospital Management
          </h1>
          {/* Multi-tenant badge */}
          {company_id && (
            <Badge variant="outline" className="text-xs">
              {company_id}
            </Badge>
          )}
          {/* Active filters badge */}
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <CustomDateRangePicker
            onDateChange={(from, to) => setDateRange(from, to)}
          />
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden lg:inline ml-2">Refresh</span>
          </Button>
          <Button>
            <Download />
            <span className="hidden lg:inline">Download</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      {lastUpdated && (
        <p className="text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()} •
          {filteredPatients.length} patients •
          {filteredAppointments.length} appointments
        </p>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Activities
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* Pass filtered data to components */}
          <SummaryCards stats={stats} />
          <div className="gap-4 space-y-4 md:grid-cols-2 lg:grid lg:grid-cols-7 lg:space-y-0">
            <PatientVisitsChart
              patients={filteredPatients}
              stats={stats}
            />
            <PatientsByDepartmentChart
              patients={filteredPatients}
              stats={stats}
            />
          </div>
          <div className="gap-4 space-y-4 md:grid-cols-2 lg:grid lg:grid-cols-7 lg:space-y-0">
            <UpcomingAppointments
              appointments={filteredAppointments}
            />
            <PatientsWithLastProcedure
              patients={filteredPatients}
            />
          </div>
          <div className="gap-4 space-y-4 md:grid-cols-2 lg:grid lg:grid-cols-2 lg:space-y-0">
            <PlannedCalendar
              appointments={filteredAppointments}
            />
            <Notes company_id={company_id} />
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <HospitalReports
            patients={filteredPatients}
            appointments={filteredAppointments}
            stats={stats}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
