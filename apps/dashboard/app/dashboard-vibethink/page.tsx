/**
 * Dashboard VibeThink Root Page
 *
 * Redirects to /dashboard-vibethink/default
 * This ensures /dashboard-vibethink shows the same content as /dashboard-vibethink/default
 */

import { redirect } from 'next/navigation';

export default function DashboardVibeThinkRoot() {
  // Redirect to default dashboard
  redirect('/dashboard-vibethink/default');
}
