import { redirect } from 'next/navigation';

/**
 * Dashboard Root Page - VThink 1.0
 * 
 * Página raíz que redirige al enhanced dashboard
 * implementando nuestro AI Consensus Framework
 */
export default function DashboardRootPage() {
  redirect('/enhanced-dashboard');
}
