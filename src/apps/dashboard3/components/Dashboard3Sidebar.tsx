import DashboardSidebar from '@/shared/components/dashboard/DashboardSidebar';

const Dashboard3Sidebar = (props: { onClose: () => void }) => (
  <DashboardSidebar
    {...props}
    links={[
      { label: 'Ir a Dashboard 1', to: '/dashboard' },
      { label: 'Ir a Dashboard 2', to: '/dashboard2' },
    ]}
    modules={[
      'Dashboard',
      'CRM & Sales',
      'AI & Automation',
      'Documentos',
      'Comunicación',
      'Administración',
    ]}
  />
);

export default Dashboard3Sidebar; 