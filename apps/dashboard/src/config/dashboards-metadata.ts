/**
 * 📋 DASHBOARDS METADATA
 * 
 * Sistema centralizado de metadata para identificar dashboards mock vs reales.
 * 
 * ⚠️ REGLA CRÍTICA: NO mover archivos físicamente - solo usar metadata.
 * 
 * @see docs/references/DASHBOARDS_MOCK_REFERENCE.md
 */

export type DashboardType = 'mock' | 'real' | 'hybrid';
export type DashboardCategory = 'reference' | 'production' | 'demo' | 'migration';

export interface DashboardMetadata {
  /** Tipo de dashboard: mock (solo datos simulados), real (conectado a CRM), hybrid (puede usar ambos) */
  type: DashboardType;
  /** Categoría: reference (para referencia), production (producción), demo (demo), migration (en migración) */
  category: DashboardCategory;
  /** Si está planificada migración a CRM real */
  migrationPlanned?: boolean;
  /** Fecha estimada de migración (opcional) */
  migrationDate?: string;
  /** Descripción del dashboard */
  description?: string;
  /** Si muestra badge visual de "Demo/Reference" */
  showBadge?: boolean;
}

/**
 * Metadata de todos los dashboards del sistema
 * 
 * ⚠️ IMPORTANTE: Mantener sincronizado con nav-main.tsx
 */
export const DASHBOARDS_METADATA: Record<string, DashboardMetadata> = {
  // ============================================
  // GRUPO: Dashboards
  // ============================================
  '/dashboard/default': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard principal con métricas generales',
    showBadge: true,
    migrationPlanned: false
  },
  '/dashboard/ecommerce': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard de e-commerce con productos y órdenes',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/sales': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard de ventas con pipeline y métricas',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/crm': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard CRM con clientes y deals',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/website-analytics': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard de analytics web con métricas de tráfico',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/project-management': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard de gestión de proyectos con kanban y métricas',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/file-manager': {
    type: 'mock',
    category: 'reference',
    description: 'Gestor de archivos con almacenamiento simulado',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/crypto': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard de criptomonedas con trading simulado',
    showBadge: true,
    migrationPlanned: false
  },
  '/academy-dashboard': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard académico con cursos y estudiantes',
    showBadge: true,
    migrationPlanned: false
  },
  '/hospital-management-dashboard': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard de gestión hospitalaria con pacientes',
    showBadge: true,
    migrationPlanned: false
  },
  '/hotel-dashboard': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard de gestión hotelera con reservas y huéspedes',
    showBadge: true,
    migrationPlanned: false
  },
  '/payment-dashboard': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard de pagos con balances y transacciones',
    showBadge: true,
    migrationPlanned: false
  },
  '/project-list-dashboard': {
    type: 'mock',
    category: 'reference',
    description: 'Lista de proyectos con progreso y equipos',
    showBadge: true,
    migrationPlanned: false
  },
  '/dashboard/finance': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard financiero con estados y presupuestos',
    showBadge: true,
    migrationPlanned: true
  },

  // ============================================
  // GRUPO: AI
  // ============================================
  '/dashboard/apps/ai-chat': {
    type: 'hybrid',
    category: 'demo',
    description: 'Chat AI con múltiples proveedores (OpenAI, Anthropic, etc.)',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/apps/ai-image-generator': {
    type: 'mock',
    category: 'demo',
    description: 'Generador de imágenes con IA',
    showBadge: true,
    migrationPlanned: false
  },

  // ============================================
  // GRUPO: Apps
  // ============================================
  '/kanban-dashboard': {
    type: 'mock',
    category: 'reference',
    description: 'Dashboard Kanban para gestión de tareas',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/apps/notes': {
    type: 'mock',
    category: 'reference',
    description: 'Aplicación de notas con etiquetas y carpetas',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/apps/chat': {
    type: 'mock',
    category: 'reference',
    description: 'Aplicación de chat con mensajes',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/apps/mail': {
    type: 'mock',
    category: 'reference',
    description: 'Cliente de correo electrónico',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/apps/todo-list-app': {
    type: 'mock',
    category: 'reference',
    description: 'Aplicación de lista de tareas',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/apps/tasks': {
    type: 'mock',
    category: 'reference',
    description: 'Gestor de tareas avanzado',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/apps/calendar': {
    type: 'mock',
    category: 'reference',
    description: 'Calendario con eventos',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/apps/api-keys': {
    type: 'mock',
    category: 'reference',
    description: 'Gestión de API keys',
    showBadge: true,
    migrationPlanned: true
  },
  '/dashboard/apps/pos-system': {
    type: 'mock',
    category: 'reference',
    description: 'Sistema POS (Point of Sale)',
    showBadge: true,
    migrationPlanned: false
  }
} as const;

/**
 * Obtiene metadata de un dashboard por su ruta
 */
export function getDashboardMetadata(path: string): DashboardMetadata | undefined {
  return DASHBOARDS_METADATA[path];
}

/**
 * Verifica si un dashboard es mock
 */
export function isMockDashboard(path: string): boolean {
  const metadata = getDashboardMetadata(path);
  return metadata?.type === 'mock' || metadata?.type === 'hybrid';
}

/**
 * Verifica si un dashboard debe mostrar badge
 */
export function shouldShowBadge(path: string): boolean {
  const metadata = getDashboardMetadata(path);
  return metadata?.showBadge ?? false;
}

/**
 * Obtiene todos los dashboards mock
 */
export function getMockDashboards(): Array<{ path: string; metadata: DashboardMetadata }> {
  return Object.entries(DASHBOARDS_METADATA)
    .filter(([_, metadata]) => metadata.type === 'mock' || metadata.type === 'hybrid')
    .map(([path, metadata]) => ({ path, metadata }));
}

/**
 * Obtiene todos los dashboards con migración planificada
 */
export function getDashboardsWithMigration(): Array<{ path: string; metadata: DashboardMetadata }> {
  return Object.entries(DASHBOARDS_METADATA)
    .filter(([_, metadata]) => metadata.migrationPlanned === true)
    .map(([path, metadata]) => ({ path, metadata }));
}


