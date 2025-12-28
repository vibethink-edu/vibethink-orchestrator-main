/**
 * Dashboard BundUI Root Page
 *
 * Redirects to /dashboard-bundui/default
 * This ensures /dashboard-bundui shows the same content as /dashboard-bundui/default
 */

import { redirect } from 'next/navigation';

export default function DashboardBunduiRoot() {
  // Redirect to default dashboard
  redirect('/dashboard-bundui/default');
}
