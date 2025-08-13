"use client";

import { useState, useEffect } from "react";

import {
  WelcomeCard,
  LeaderboardCard,
  LearningPathCard,
  ChartMostActivity,
  ProgressStatisticsCard,
  StudentSuccessCard,
  CourseProgressByMonth,
  CoursesListTable
} from "./components";

/**
 * Academy Dashboard Page
 * VibeThink Orchestrator
 * 
 * Complete educational dashboard with student management, course tracking,
 * and comprehensive learning analytics. Optimized for educational institutions
 * and e-learning platforms.
 * 
 * Features:
 * - Student success rate tracking and analytics
 * - Course progress monitoring and completion rates  
 * - Learning path management and recommendations
 * - Student leaderboard and gamification
 * - Activity charts and engagement metrics
 * - Progress statistics with trend analysis
 * - Course management and enrollment tracking
 * - Interactive welcome dashboard with key insights
 * 
 * Architecture:
 * - Multi-tenant security with company_id filtering
 * - Responsive grid layout optimized for educational data
 * - HSL color variables for seamless theme integration
 * - Real-time updates via WebSocket connections
 * - VibeThink 1.0 methodology compliance with CMMI-ML3
 * 
 * Layout Structure:
 * Row 1: Welcome Card (full width), Learning Path, Leaderboard
 * Row 2: Student Success, Progress Statistics, Activity Chart
 * Row 3: Course Progress Chart, Courses List Table
 */
export default function AcademyDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="mb-4">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
        
        {/* Top Row Skeleton */}
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-12 xl:col-span-6 h-64 bg-muted animate-pulse rounded-lg" />
          <div className="lg:col-span-6 xl:col-span-3 h-64 bg-muted animate-pulse rounded-lg" />
          <div className="lg:col-span-6 xl:col-span-3 h-64 bg-muted animate-pulse rounded-lg" />
        </div>
        
        {/* Middle Row Skeleton */}
        <div className="grid gap-4 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        
        {/* Bottom Row Skeleton */}
        <div className="mt-4 gap-4 space-y-4 xl:grid xl:grid-cols-2 xl:space-y-0">
          <div className="h-80 bg-muted animate-pulse rounded-lg" />
          <div className="h-80 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Academy Dashboard Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Academy</h1>
      </div>
      
      {/* Top Section: Welcome and Quick Stats */}
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-12 xl:col-span-6">
          <WelcomeCard />
        </div>
        <div className="lg:col-span-6 xl:col-span-3">
          <LearningPathCard />
        </div>
        <div className="lg:col-span-6 xl:col-span-3">
          <LeaderboardCard />
        </div>
      </div>
      
      {/* Middle Section: Analytics and Statistics */}
      <div className="grid gap-4 xl:grid-cols-3">
        <StudentSuccessCard
          currentSuccessRate={88}
          previousSuccessRate={85}
          totalStudents={1500}
          passingStudents={1320}
        />
        <ProgressStatisticsCard />
        <ChartMostActivity />
      </div>
      
      {/* Bottom Section: Detailed Reports */}
      <div className="mt-4 gap-4 space-y-4 xl:grid xl:grid-cols-2 xl:space-y-0">
        <CourseProgressByMonth />
        <CoursesListTable />
      </div>
    </div>
  );
}