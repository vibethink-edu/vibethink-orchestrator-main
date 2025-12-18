"use client";

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
 * progress analytics, and comprehensive learning administration tools.
 * Optimized for schools, universities, and educational institutions.
 * 
 * Features:
 * - Student success rate tracking and analytics
 * - Course progress monitoring by month
 * - Leaderboard for top performing students
 * - Learning path management
 * - Popular courses listing with search
 * - Activity statistics and progress metrics
 * 
 * @route /academy-dashboard
 */

export default function AcademyDashboardPage() {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Academy</h1>
      </div>
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
      <div className="mt-4 gap-4 space-y-4 xl:grid xl:grid-cols-2 xl:space-y-0">
        <CourseProgressByMonth />
        <CoursesListTable />
      </div>
    </div>
  );
}
