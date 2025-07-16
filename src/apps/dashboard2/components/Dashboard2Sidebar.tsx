import DashboardSidebar from '@/shared/components/dashboard/DashboardSidebar';

const Dashboard2Sidebar = (props: { onClose?: () => void }) => (
  <DashboardSidebar
    {...props}
    links={[
      { label: 'Ir a Dashboard 1', to: '/dashboard' },
      { label: 'Ir a Dashboard 3', to: '/dashboard3' },
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

export default Dashboard2Sidebar; 