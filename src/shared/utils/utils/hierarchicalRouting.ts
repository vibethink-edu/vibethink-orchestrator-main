/**
 * Utilidades para enrutamiento jerárquico
 * Basado en las mejores prácticas de Zoho y HubSpot
 */

import { HierarchicalContext } from '@/shared/hooks/useHierarchicalContext';

/**
 * Tipos de URL para diferentes niveles de contexto
 */
export type HierarchicalURL = 
  | `https://${string}.ai-pair.com`                    // Subdomain de organización
  | `https://ai-pair.com/${string}`                    // Path de organización
  | `https://ai-pair.com/${string}/${string}`          // Path de workspace
  | `https://ai-pair.com/${string}/client/${string}`   // Path de sub-organización
  | `https://ai-pair.com/${string}/client/${string}/${string}`; // Path de sub-workspace

/**
 * Configuración de enrutamiento por contexto
 */
export interface RoutingConfig {
  useSubdomains: boolean;      // Usar subdominios (ej: empresa.ai-pair.com)
  usePaths: boolean;           // Usar paths (ej: ai-pair.com/empresa)
  defaultDomain: string;       // Dominio por defecto
  customDomains: boolean;      // Permitir dominios personalizados
}

/**
 * Obtiene la URL base para un contexto específico
 */
export function getContextURL(
  context: HierarchicalContext,
  config: RoutingConfig = {
    useSubdomains: true,
    usePaths: true,
    defaultDomain: 'ai-pair.com',
    customDomains: false
  }
): string {
  const { organization_id, workspace_id, sub_organization_id, sub_workspace_id } = context;

  // Si hay sub-organización, usar path específico
  if (sub_organization_id) {
    if (sub_workspace_id) {
      return `https://${config.defaultDomain}/${organization_id}/client/${sub_organization_id}/${sub_workspace_id}`;
    }
    return `https://${config.defaultDomain}/${organization_id}/client/${sub_organization_id}`;
  }

  // Si hay workspace, usar path de workspace
  if (workspace_id) {
    return `https://${config.defaultDomain}/${organization_id}/${workspace_id}`;
  }

  // Si hay organización, usar subdomain o path
  if (organization_id) {
    if (config.useSubdomains) {
      return `https://${organization_id}.${config.defaultDomain}`;
    }
    return `https://${config.defaultDomain}/${organization_id}`;
  }

  // Plataforma por defecto
  return `https://${config.defaultDomain}`;
}

/**
 * Extrae el contexto de una URL
 */
export function extractContextFromURL(url: string): Partial<HierarchicalContext> {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    // Patrón: /organization/workspace
    if (pathParts.length >= 2 && pathParts[1] !== 'client') {
      return {
        organization_id: pathParts[0],
        workspace_id: pathParts[1]
      };
    }
    
    // Patrón: /organization/client/sub-organization/sub-workspace
    if (pathParts.length >= 4 && pathParts[1] === 'client') {
      return {
        organization_id: pathParts[0],
        sub_organization_id: pathParts[2],
        sub_workspace_id: pathParts[3] || undefined
      };
    }
    
    // Patrón: /organization/client/sub-organization
    if (pathParts.length >= 3 && pathParts[1] === 'client') {
      return {
        organization_id: pathParts[0],
        sub_organization_id: pathParts[2]
      };
    }
    
    // Patrón: /organization
    if (pathParts.length >= 1) {
      return {
        organization_id: pathParts[0]
      };
    }
    
    // Subdomain pattern
    const subdomain = urlObj.hostname.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'ai-pair') {
      return {
        organization_id: subdomain
      };
    }
    
    return {};
  } catch (error) {
    // TODO: log 'Error extracting context from URL:' error
    return {};
  }
}

/**
 * Genera un slug único para una organización
 */
export function generateOrganizationSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-')         // Reemplazar espacios con guiones
    .replace(/-+/g, '-')          // Remover guiones múltiples
    .trim();
}

/**
 * Valida si un slug está disponible
 */
export async function isSlugAvailable(
  slug: string,
  context: 'organization' | 'workspace' | 'sub_organization' | 'sub_workspace',
  parentId?: string
): Promise<boolean> {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    switch (context) {
      case 'organization':
        const { data: orgData } = await supabase
          .from('organizations')
          .select('id')
          .eq('slug', slug)
          .single();
        return !orgData;
        
      case 'workspace':
        if (!parentId) return false;
        const { data: wsData } = await supabase
          .from('workspaces')
          .select('id')
          .eq('organization_id', parentId)
          .eq('slug', slug)
          .single();
        return !wsData;
        
      case 'sub_organization':
        if (!parentId) return false;
        const { data: subOrgData } = await supabase
          .from('sub_organizations')
          .select('id')
          .eq('parent_organization_id', parentId)
          .eq('slug', slug)
          .single();
        return !subOrgData;
        
      case 'sub_workspace':
        if (!parentId) return false;
        const { data: subWsData } = await supabase
          .from('sub_workspaces')
          .select('id')
          .eq('sub_organization_id', parentId)
          .eq('slug', slug)
          .single();
        return !subWsData;
        
      default:
        return false;
    }
  } catch (error) {
    // TODO: log 'Error checking slug availability:' error
    return false;
  }
}

/**
 * Genera un slug único disponible
 */
export async function generateUniqueSlug(
  name: string,
  context: 'organization' | 'workspace' | 'sub_organization' | 'sub_workspace',
  parentId?: string
): Promise<string> {
  let baseSlug = generateOrganizationSlug(name);
  let slug = baseSlug;
  let counter = 1;
  
  while (!(await isSlugAvailable(slug, context, parentId))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Obtiene la ruta de navegación para un contexto
 */
export function getNavigationPath(context: HierarchicalContext): Array<{
  level: string;
  id: string;
  name: string;
  url: string;
}> {
  const path = [];
  
  if (context.platform_id) {
    path.push({
      level: 'platform',
      id: context.platform_id,
      name: 'VibeThink Platform',
      url: 'https://ai-pair.com'
    });
  }
  
  if (context.organization_id) {
    path.push({
      level: 'organization',
      id: context.organization_id,
      name: context.organization_id, // Se debería obtener el nombre real
      url: `https://ai-pair.com/${context.organization_id}`
    });
  }
  
  if (context.workspace_id) {
    path.push({
      level: 'workspace',
      id: context.workspace_id,
      name: context.workspace_id, // Se debería obtener el nombre real
      url: `https://ai-pair.com/${context.organization_id}/${context.workspace_id}`
    });
  }
  
  if (context.sub_organization_id) {
    path.push({
      level: 'sub_organization',
      id: context.sub_organization_id,
      name: context.sub_organization_id, // Se debería obtener el nombre real
      url: `https://ai-pair.com/${context.organization_id}/client/${context.sub_organization_id}`
    });
  }
  
  if (context.sub_workspace_id) {
    path.push({
      level: 'sub_workspace',
      id: context.sub_workspace_id,
      name: context.sub_workspace_id, // Se debería obtener el nombre real
      url: `https://ai-pair.com/${context.organization_id}/client/${context.sub_organization_id}/${context.sub_workspace_id}`
    });
  }
  
  return path;
}

/**
 * Verifica si una URL es válida para el contexto actual
 */
export function isValidContextURL(
  url: string,
  currentContext: HierarchicalContext
): boolean {
  const extractedContext = extractContextFromURL(url);
  
  // Verificar que la URL no acceda a contextos no autorizados
  if (extractedContext.organization_id && 
      currentContext.organization_id && 
      extractedContext.organization_id !== currentContext.organization_id) {
    return false;
  }
  
  if (extractedContext.workspace_id && 
      currentContext.workspace_id && 
      extractedContext.workspace_id !== currentContext.workspace_id) {
    return false;
  }
  
  if (extractedContext.sub_organization_id && 
      currentContext.sub_organization_id && 
      extractedContext.sub_organization_id !== currentContext.sub_organization_id) {
    return false;
  }
  
  if (extractedContext.sub_workspace_id && 
      currentContext.sub_workspace_id && 
      extractedContext.sub_workspace_id !== currentContext.sub_workspace_id) {
    return false;
  }
  
  return true;
}

/**
 * Obtiene la configuración de enrutamiento recomendada
 */
export function getRecommendedRoutingConfig(
  contextLevel: 'platform' | 'organization' | 'workspace' | 'sub_organization' | 'sub_workspace'
): RoutingConfig {
  switch (contextLevel) {
    case 'platform':
      return {
        useSubdomains: false,
        usePaths: false,
        defaultDomain: 'ai-pair.com',
        customDomains: false
      };
      
    case 'organization':
      return {
        useSubdomains: true,
        usePaths: true,
        defaultDomain: 'ai-pair.com',
        customDomains: true
      };
      
    case 'workspace':
    case 'sub_organization':
    case 'sub_workspace':
      return {
        useSubdomains: false,
        usePaths: true,
        defaultDomain: 'ai-pair.com',
        customDomains: false
      };
      
    default:
      return {
        useSubdomains: true,
        usePaths: true,
        defaultDomain: 'ai-pair.com',
        customDomains: true
      };
  }
} 