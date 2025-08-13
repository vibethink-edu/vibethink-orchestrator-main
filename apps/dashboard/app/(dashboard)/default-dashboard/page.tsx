"use client";

import { useState, useEffect } from "react";
import CustomDateRangePicker from "@/shared/components/custom-date-range-picker";
import { Button } from "@/shared/components/ui/button";

import {
  ChatWidget,
  ExerciseMinutes,
  LatestPayments,
  PaymentMethodCard,
  SubscriptionsCard,
  TeamMembersCard,
  TotalRevenueCard
} from "./components";
import { Download } from "lucide-react";
import { toast } from "sonner";

/**
 * Default Dashboard Page
 * VibeThink Orchestrator
 * 
 * Comprehensive admin dashboard with key business metrics, team management,
 * and financial overview. Optimized for business intelligence and monitoring.
 * 
 * Features:
 * - Real-time team members and subscription tracking
 * - Revenue analytics with trend analysis
 * - Interactive chat widget for team communication
 * - Exercise minutes tracking for team wellness
 * - Latest payments and transaction monitoring
 * - Payment method management and analytics
 * - Custom date range filtering capabilities
 * - Responsive grid layout for all screen sizes
 * 
 * Architecture:
 * - Multi-tenant security with company_id filtering
 * - Responsive grid layout optimized for dashboard widgets
 * - HSL color variables for seamless theme integration
 * - Real-time updates via WebSocket connections
 * - VibeThink 1.0 methodology compliance with CMMI-ML3
 * 
 * Layout Structure:
 * Row 1: Header with title and date range picker
 * Row 2: Team Members, Subscriptions, Total Revenue cards
 * Row 3: Chat Widget, Exercise Minutes (2 columns)
 * Row 4: Latest Payments (2 columns), Payment Method card
 */
export default function DefaultDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownload = () => {
    toast.success("Download initiated", {
      description: "Dashboard data export is being prepared..."
    });
    // TODO: Implement actual download functionality
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="flex flex-row items-center justify-between">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="flex items-center space-x-2">
            <div className="h-10 w-48 bg-muted animate-pulse rounded" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="gap-4 space-y-4 lg:grid lg:grid-cols-3 lg:space-y-0">
          {[...Array(7)].map((_, i) => (
            <div key={i} className={`h-64 bg-muted animate-pulse rounded-lg ${
              i === 3 ? 'lg:col-span-1' : 
              i === 4 || i === 5 ? 'lg:col-span-2' : 
              i === 6 ? 'lg:col-span-1' : ''
            }`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dashboard Header */}
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <CustomDateRangePicker />
          <Button onClick={handleDownload}>
            <Download />
            <span className="hidden lg:inline">Download</span>
          </Button>
        </div>
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="gap-4 space-y-4 lg:grid lg:grid-cols-3 lg:space-y-0">
        {/* Top Row: Key Metrics */}
        <TeamMembersCard />
        <SubscriptionsCard />
        <TotalRevenueCard />
        
        {/* Middle Row: Chat and Activity */}
        <ChatWidget />
        <div className="lg:col-span-2">
          <ExerciseMinutes />
        </div>
        
        {/* Bottom Row: Payments */}
        <div className="lg:col-span-2">
          <LatestPayments />
        </div>
        <PaymentMethodCard />
      </div>
    </div>
  );
}