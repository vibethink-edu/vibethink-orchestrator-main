/**
 * Module Registry - Registro de Módulos y Componentes Migrados
 * 
 * Este archivo mantiene un registro de todos los módulos y componentes
 * que han sido migrados desde fuentes externas (Bundui Premium, etc.)
 * a nuestro monorepo.
 * 
 * Propósito:
 * - Tracking de qué módulos están migrados
 * - Control de versiones de importación
 * - Validación de compatibilidad con el stack
 * - Referencia histórica de migraciones
 * 
 * @see docs/architecture/MODULE_REGISTRY_PROTOCOL.md - Protocolo completo
 */

export type MigrationSource = 
  | "bundui-premium"           // Bundui Premium Dashboard Templates
  | "bundui-original"          // Bundui Original Source Code
  | "shadcn-ui-kit"            // shadcnuikit.com/components/
  | "react-flow"               // reactflow.dev / @xyflow/react
  | "tiptap"                   // github.com/ueberdosis/tiptap
  | "shadcn-ui"                // ui.shadcn.com (base components)
  | "custom"                   // Componente custom desarrollado internamente
  | "other";                   // Otra fuente externa

export type ModuleStatus = "complete" | "partial" | "deprecated" | "experimental";
export type ComponentType = "dashboard" | "component" | "hook" | "utility" | "layout" | "extension" | "library";

export interface StackCompatibility {
  react: string;
  nextjs: string;
  typescript: string;
  tailwind: string;
  shadcn?: string;
  other?: Record<string, string>;
}

export interface ModuleRegistryEntry {
  /**
   * Identificador único del módulo
   */
  id: string;
  
  /**
   * Nombre del módulo
   */
  name: string;
  
  /**
   * Ruta en el monorepo (ej: /dashboard-bundui/hotel)
   */
  path: string;
  
  /**
   * Tipo de componente
   */
  type: ComponentType;
  
  /**
   * Fuente de migración
   */
  source: MigrationSource;
  
  /**
   * Ruta original en la fuente (ej: /dashboard/(auth)/hotel)
   */
  sourcePath?: string;
  
  /**
   * Versión de la fuente al momento de migración
   * Ejemplo: "2.22.3" para TipTap, "12.10.0" para React Flow
   */
  sourceVersion?: string;
  
  /**
   * URL de la fuente original (para referencia)
   */
  sourceUrl?: string;
  
  /**
   * Adaptaciones realizadas para nuestro monorepo
   */
  adaptations?: {
    /**
     * Cambios realizados para adaptar al monorepo
     */
    monorepo?: string[];
    /**
     * Adaptaciones de i18n/multilang
     */
    i18n?: string[];
    /**
     * Otras adaptaciones específicas
     */
    other?: string[];
  };
  
  /**
   * Fecha de migración (ISO 8601)
   */
  migratedAt: string;
  
  /**
   * Última actualización (ISO 8601)
   */
  updatedAt: string;
  
  /**
   * Estado del módulo
   */
  status: ModuleStatus;
  
  /**
   * Compatibilidad con el stack actual
   */
  stackCompatibility: StackCompatibility;
  
  /**
   * Componentes incluidos en el módulo
   */
  components: string[];
  
  /**
   * Subopciones/rutas del módulo (si aplica)
   */
  subRoutes?: Array<{
    title: string;
    path: string;
  }>;
  
  /**
   * Dependencias específicas requeridas
   */
  dependencies?: string[];
  
  /**
   * Notas adicionales
   */
  notes?: string;
  
  /**
   * Issues conocidos o limitaciones
   */
  issues?: string[];
  
  /**
   * i18n: Namespace de traducción (si aplica)
   */
  i18nNamespace?: string;
  
  /**
   * i18n: Porcentaje de traducción (0-100)
   */
  i18nCoverage?: number;
  
  /**
   * i18n: Estado detallado de traducción
   */
  i18nStatus?: {
    total: number;              // Total de strings identificados
    translated: number;         // Strings traducidos
    pending: number;            // Strings pendientes
    categories?: {
      navigation?: number;
      components?: number;
      header?: number;
      footer?: number;
      toolbar?: number;
      forms?: number;
      messages?: number;
      validation?: number;
    };
  };
}

/**
 * Registro de Módulos Migrados
 * 
 * Este registro se actualiza cada vez que se migra un nuevo módulo.
 * Sigue el protocolo definido en MODULE_REGISTRY_PROTOCOL.md
 */
export const moduleRegistry: ModuleRegistryEntry[] = [
  {
    id: "hotel-dashboard",
    name: "Hotel Dashboard",
    path: "/dashboard-bundui/hotel",
    type: "dashboard",
    source: "bundui-premium",
    sourcePath: "/dashboard/(auth)/hotel",
    migratedAt: "2025-12-20T00:00:00Z",
    updatedAt: "2025-12-20T00:00:00Z",
    status: "complete",
    stackCompatibility: {
      react: "19.0.0",
      nextjs: "15.3.4",
      typescript: "5.9.2",
      tailwind: "4.1.10"
    },
    components: [
      "StatCards",
      "ReservationsCard",
      "CampaignOverview",
      "RecentActivities",
      "RevenueStat",
      "BookingsCard",
      "BookingList",
      "MeetingRoomSchedule",
      "BookingFormSheet"
    ],
    subRoutes: [
      { title: "Dashboard", path: "/dashboard-bundui/hotel" },
      { title: "Bookings", path: "/dashboard-bundui/hotel/bookings" }
    ],
    dependencies: ["recharts", "date-fns", "@tanstack/react-table"],
    notes: "Módulo completo con todas las subopciones. Requiere 'use client' en page.tsx debido a imports de @vibethink/ui. i18n aplicado parcialmente según protocolo (65% cobertura).",
    issues: [],
    i18nNamespace: "hotel",
    i18nCoverage: 65,
    i18nStatus: {
      total: 210,
      translated: 135,
      pending: 75,
      categories: {
        navigation: 4,
        components: 90,
        forms: 45,
        toolbar: 8,
        messages: 10,
        validation: 13
      }
    }
  },
  {
    id: "ai-chat-v2",
    name: "AI Chat V2",
    path: "/dashboard-bundui/ai-chat-v2",
    type: "dashboard",
    source: "bundui-premium",
    sourcePath: "/dashboard/(auth)/ai-chat-v2",
    migratedAt: "2025-12-20T00:00:00Z",
    updatedAt: "2025-12-20T00:00:00Z",
    status: "complete",
    stackCompatibility: {
      react: "19.0.0",
      nextjs: "15.3.4",
      typescript: "5.9.2",
      tailwind: "4.1.10"
    },
    components: [
      "AIChatInterface",
      "AIChatSidebar",
      "AIUpgradeModal"
    ],
    dependencies: ["lottie-react"],
    notes: "Recuperado del commit 1929140. Requiere lottie-react con --legacy-peer-deps",
    issues: [],
    i18nNamespace: "ai-chat",
    i18nCoverage: 100
  },
  {
    id: "crm-v2",
    name: "CRM V2",
    path: "/dashboard-bundui/crm-v2",
    type: "dashboard",
    source: "bundui-premium",
    migratedAt: "2025-12-20T00:00:00Z",
    updatedAt: "2025-12-20T00:00:00Z",
    status: "complete",
    stackCompatibility: {
      react: "19.0.0",
      nextjs: "15.3.4",
      typescript: "5.9.2",
      tailwind: "4.1.10"
    },
    components: [
      "LeadsBySource",
      "Leads",
      "RecentTasks",
      "SalesPipeline",
      "TargetCard",
      "TotalCustomers",
      "TotalDeals",
      "TotalRevenue"
    ],
    dependencies: ["recharts"],
    i18nNamespace: undefined,
    i18nCoverage: 0
  },
  {
    id: "crypto-v2",
    name: "Crypto V2",
    path: "/dashboard-bundui/crypto-v2",
    type: "dashboard",
    source: "bundui-premium",
    migratedAt: "2025-12-20T00:00:00Z",
    updatedAt: "2025-12-20T00:00:00Z",
    status: "complete",
    stackCompatibility: {
      react: "19.0.0",
      nextjs: "15.3.4",
      typescript: "5.9.2",
      tailwind: "4.1.10"
    },
    components: [
      "ChartBalanceSummary",
      "DigitalWallets",
      "OverviewCard",
      "RecentActivities",
      "TradingCard"
    ],
    dependencies: ["recharts"],
    i18nNamespace: "crypto",
    i18nCoverage: 100
  },
  {
    id: "finance-v2",
    name: "Finance V2",
    path: "/dashboard-bundui/finance-v2",
    type: "dashboard",
    source: "bundui-premium",
    migratedAt: "2025-12-20T00:00:00Z",
    updatedAt: "2025-12-20T00:00:00Z",
    status: "complete",
    stackCompatibility: {
      react: "19.0.0",
      nextjs: "15.3.4",
      typescript: "5.9.2",
      tailwind: "4.1.10"
    },
    components: [
      "KPICards",
      "MonthlyExpenses",
      "MyWallet",
      "Revenue",
      "SavingGoal",
      "Summary",
      "Transactions"
    ],
    dependencies: ["recharts", "date-fns"],
    i18nNamespace: "finance",
    i18nCoverage: 100
  },
  {
    id: "social-media",
    name: "Social Media",
    path: "/dashboard-bundui/social-media",
    type: "dashboard",
    source: "bundui-premium",
    migratedAt: "2025-12-20T00:00:00Z",
    updatedAt: "2025-12-20T00:00:00Z",
    status: "complete",
    stackCompatibility: {
      react: "19.0.0",
      nextjs: "15.3.4",
      typescript: "5.9.2",
      tailwind: "4.1.10"
    },
    components: [
      "SocialMediaStories",
      "SocialMediaSidebar",
      "CreatePostDialog",
      "PostItem"
    ],
    dependencies: ["@vibethink/ui"],
    notes: "Requiere imports corregidos desde @vibethink/ui (no @vibethink/ui/components)",
    issues: [],
    i18nNamespace: undefined,
    i18nCoverage: 0
  },
  {
    id: "file-manager",
    name: "File Manager",
    path: "/dashboard-bundui/file-manager",
    type: "dashboard",
    source: "bundui-premium",
    migratedAt: "2025-12-20T00:00:00Z",
    updatedAt: "2025-12-20T00:00:00Z",
    status: "complete",
    stackCompatibility: {
      react: "19.0.0",
      nextjs: "15.3.4",
      typescript: "5.9.2",
      tailwind: "4.1.10"
    },
    components: [
      "FileManagerGrid",
      "FileManagerList",
      "FileUploadDialog",
      "FolderList"
    ],
    dependencies: ["@vibethink/ui"],
    i18nNamespace: "file-manager",
    i18nCoverage: 100
  },
  {
    id: "minimal-tiptap-editor",
    name: "Minimal TipTap Editor",
    path: "packages/ui/src/components/extensions/minimal-tiptap",
    type: "extension",
    source: "tiptap",
    sourceUrl: "https://github.com/ueberdosis/tiptap",
    sourceVersion: "2.22.3",
    migratedAt: "2025-12-20T00:00:00Z",
    updatedAt: "2025-12-20T00:00:00Z",
    status: "complete",
    stackCompatibility: {
      react: "19.0.0",
      nextjs: "15.3.4",
      typescript: "5.9.2",
      tailwind: "4.1.10"
    },
    components: [
      "MinimalTiptapEditor",
      "TiptapEditorProvider",
      "TiptapToolbar",
      "TiptapBubbleMenu"
    ],
    dependencies: [
      "@tiptap/react@2.22.3",
      "@tiptap/starter-kit@2.22.3",
      "@tiptap/extension-image@2.22.3",
      "@tiptap/extension-link@2.22.3",
      "@tiptap/extension-color@2.22.3",
      "@tiptap/extension-text-style@2.22.3",
      "@tiptap/extension-placeholder@2.22.3",
      "@tiptap/extension-code-block-lowlight@2.22.3",
      "lowlight@3.3.0"
    ],
    adaptations: {
      monorepo: [
        "Wrapped en @vibethink/ui para exportación centralizada",
        "Agregados 'use client' directives a hooks (use-container-size, use-throttle, use-drag-resize)",
        "Integrado con sistema de componentes del monorepo"
      ],
      i18n: [
        "TODO: Agregar soporte i18n para toolbar labels",
        "Placeholder text debería ser traducible"
      ],
      other: [
        "Exportado como MinimalTiptapEditor desde packages/ui/src/index.ts",
        "Usado en dashboard-vibethink/notes-v2 y dashboard-bundui/notes"
      ]
    },
    notes: "Editor rich text basado en TipTap. Integrado en nuestro monorepo como extensión de @vibethink/ui. Requiere 'use client' en varios hooks.",
    issues: [
      "Pendiente: i18n para toolbar y placeholders",
      "Pendiente: Validar compatibilidad completa con React 19"
    ],
    i18nNamespace: undefined,
    i18nCoverage: 0
  },
  {
    id: "react-flow-workflow",
    name: "React Flow Workflow Editor",
    path: "apps/dashboard/app/dashboard-vibethink/workflow",
    type: "component",
    source: "react-flow",
    sourceUrl: "https://reactflow.dev/",
    sourceVersion: "12.10.0",
    migratedAt: "2025-12-20T00:00:00Z",
    updatedAt: "2025-12-20T00:00:00Z",
    status: "complete",
    stackCompatibility: {
      react: "19.0.0",
      nextjs: "15.3.4",
      typescript: "5.9.2",
      tailwind: "4.1.10",
      other: {
        "@xyflow/react": "12.10.0"
      }
    },
    components: [
      "WorkflowCanvas",
      "CustomNode",
      "WorkflowToolbar"
    ],
    dependencies: [
      "@xyflow/react@12.10.0"
    ],
    adaptations: {
      monorepo: [
        "Integrado en dashboard-vibethink como módulo workflow",
        "Custom nodes adaptados a nuestro diseño system",
        "Tipado con TypeScript estricto"
      ],
      i18n: [
        "TODO: Traducir labels de nodos personalizados",
        "TODO: Traducir mensajes del toolbar"
      ],
      other: [
        "CSS importado: @xyflow/react/dist/style.css",
        "Usado para editor visual de workflows"
      ]
    },
    notes: "Editor visual de workflows usando React Flow. Compatible con React 19 y Next.js 15. Requiere importar CSS de @xyflow/react.",
    issues: [
      "Pendiente: i18n para labels y mensajes",
      "Verificar compatibilidad completa con React Flow 12.10.0 y React 19"
    ],
    i18nNamespace: undefined,
    i18nCoverage: 0
  }
];

/**
 * Obtener módulo por ID
 */
export function getModuleById(id: string): ModuleRegistryEntry | undefined {
  return moduleRegistry.find(m => m.id === id);
}

/**
 * Obtener módulo por ruta
 */
export function getModuleByPath(path: string): ModuleRegistryEntry | undefined {
  return moduleRegistry.find(m => m.path === path);
}

/**
 * Obtener todos los módulos de una fuente específica
 */
export function getModulesBySource(source: MigrationSource): ModuleRegistryEntry[] {
  return moduleRegistry.filter(m => m.source === source);
}

/**
 * Obtener módulos por estado
 */
export function getModulesByStatus(status: ModuleStatus): ModuleRegistryEntry[] {
  return moduleRegistry.filter(m => m.status === status);
}

/**
 * Validar compatibilidad del stack de un módulo con el stack actual
 */
export function validateStackCompatibility(entry: ModuleRegistryEntry): {
  compatible: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const currentStack = {
    react: "19.0.0",
    nextjs: "15.3.4",
    typescript: "5.9.2",
    tailwind: "4.1.10"
  };

  // Validar React
  if (entry.stackCompatibility.react !== currentStack.react) {
    issues.push(`React version mismatch: module requires ${entry.stackCompatibility.react}, current is ${currentStack.react}`);
  }

  // Validar Next.js
  if (entry.stackCompatibility.nextjs !== currentStack.nextjs) {
    issues.push(`Next.js version mismatch: module requires ${entry.stackCompatibility.nextjs}, current is ${currentStack.nextjs}`);
  }

  // Validar TypeScript (solo mayor.minor)
  const moduleTS = entry.stackCompatibility.typescript.split('.').slice(0, 2).join('.');
  const currentTS = currentStack.typescript.split('.').slice(0, 2).join('.');
  if (moduleTS !== currentTS) {
    issues.push(`TypeScript version mismatch: module requires ${moduleTS}.x, current is ${currentStack.typescript}`);
  }

  // Validar Tailwind (solo mayor.minor)
  const moduleTW = entry.stackCompatibility.tailwind.split('.').slice(0, 2).join('.');
  const currentTW = currentStack.tailwind.split('.').slice(0, 2).join('.');
  if (moduleTW !== currentTW) {
    issues.push(`Tailwind version mismatch: module requires ${moduleTW}.x, current is ${currentStack.tailwind}`);
  }

  return {
    compatible: issues.length === 0,
    issues
  };
}

