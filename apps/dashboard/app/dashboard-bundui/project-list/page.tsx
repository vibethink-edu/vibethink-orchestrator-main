"use client";

import { ProjectCardsGrid } from "@/app/dashboard-bundui/projects-v2/components";
import { useTranslation } from "@/lib/i18n";

/**
 * Project List Dashboard Page
 * VibeThink Orchestrator
 * 
 * Complete project management dashboard with visual project cards,
 * progress tracking, team member display, and comprehensive
 * project administration tools.
 * 
 * Features:
 * - Project cards with progress indicators
 * - Team member avatars
 * - Time remaining badges
 * - Project status tracking
 * - Responsive grid layout
 * 
 * @route /project-list-dashboard
 */

export default function ProjectListDashboardPage() {
  const { t } = useTranslation('projects');

  return (
    <>
      <div className="mb-8 flex flex-row items-center justify-between space-y-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{t('header.title')}</h1>
          <p className="text-muted-foreground text-sm">{t('header.subtitle', 'List of your ongoing projects')}</p>
        </div>
      </div>

      <div className="space-y-4">
        <ProjectCardsGrid />
      </div>
    </>
  );
}

