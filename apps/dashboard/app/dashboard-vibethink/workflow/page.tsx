/**
 * Workflow Dashboard Page
 * 
 * Server Component que renderiza el dashboard de workflows.
 * La lógica interactiva está en WorkflowPageContent (Client Component).
 * 
 * Características:
 * - Editor visual de workflows con drag & drop
 * - Diferentes tipos de nodos (inicio, proceso, decisión, acción, fin)
 * - Ejecución simulada de workflows
 * - Panel de propiedades para editar nodos
 * - Exportar/importar workflows
 * 
 * Arquitectura:
 * - React Flow para el canvas visual
 * - Shadcn UI para componentes de interfaz
 * - TypeScript estricto con tipos bien definidos
 * - Separación de responsabilidades (components, hooks, types)
 * - Datos mock para desarrollo inicial
 */

import { generateMeta } from '@/lib/utils';
import { WorkflowPageContent } from './components/workflow-page-content';

export async function generateMetadata() {
  return generateMeta({
    title: 'Workflow Editor',
    description:
      'Editor visual de workflows con React Flow. Crea, edita y ejecuta flujos de trabajo de forma visual.',
    canonical: '/dashboard-vibethink/workflow',
  });
}

export default function WorkflowPage() {
  return <WorkflowPageContent />;
}

