import { supabase } from '@/shared/lib/supabase';

/**
 * Interfaz para identificadores únicos de empresa
 */
export interface CompanyIdentifiers {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  external_id: string;
  tenant_id: string;
}

/**
 * Interfaz para configuración de branding
 */
export interface CompanyBranding {
  branding_config: {
    logoUrl?: string;
    primaryColor?: string;
    welcomeMessage?: string;
    customFields?: Record<string, string>;
  };
  custom_locales?: Record<string, any>;
}

/**
 * Genera un slug único basado en el nombre de la empresa
 * @param name - Nombre de la empresa
 * @returns Promise<string> - Slug único
 * 
 * @example
 * generateUniqueSlug("Hospital San José") // "hospital-san-jose"
 * generateUniqueSlug("Hospital San José") // "hospital-san-jose-1"
 * generateUniqueSlug("Hospital San José") // "hospital-san-jose-2"
 */
export const generateUniqueSlug = async (name: string): Promise<string> => {
  // 1. Normalizar el nombre
  let baseSlug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .replace(/^-|-$/g, ''); // Remover guiones al inicio/final
  
  // 2. Verificar unicidad con sufijo incremental
  let slug = baseSlug;
  let counter = 1;
  const maxAttempts = 100; // Prevenir loops infinitos
  
  while (counter <= maxAttempts) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', slug)
        .single();
      
      // Si no existe, el slug es único
      if (error && error.code === 'PGRST116') {
        return slug;
      }
      
      // Si existe, agregar sufijo
      slug = `${baseSlug}-${counter}`;
      counter++;
    } catch (error) {
      // TODO: log en cada punto donde había console.log, console.error o console.warn
      throw new Error('No se pudo generar un slug único');
    }
  }
  
  throw new Error('No se pudo generar un slug único después de 100 intentos');
};

/**
 * Identifica la empresa actual basado en múltiples criterios
 * @returns Promise<CompanyIdentifiers | null>
 */
export const identifyCompany = async (): Promise<CompanyIdentifiers | null> => {
  try {
    // 1. Intentar identificación por subdomain
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('subdomain', subdomain)
        .single();
      
      if (data && !error) {
        return data;
      }
    }
    
    // 2. Intentar identificación por slug en path
    const pathSlug = window.location.pathname.split('/')[1];
    if (pathSlug && pathSlug.length > 0) {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('slug', pathSlug)
        .single();
      
      if (data && !error) {
        return data;
      }
    }
    
    // 3. Intentar identificación por usuario autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      if (data?.company_id) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', data.company_id)
          .single();
        
        if (companyData && !companyError) {
          return companyData;
        }
      }
    }
    
    return null;
  } catch (error) {
    // TODO: log en cada punto donde había console.log, console.error o console.warn
    return null;
  }
};

/**
 * Crea una nueva empresa con identificadores únicos
 * @param name - Nombre de la empresa
 * @param externalId - ID externo opcional
 * @returns Promise<CompanyIdentifiers>
 */
export const createCompany = async (
  name: string, 
  externalId?: string
): Promise<CompanyIdentifiers> => {
  try {
    // 1. Generar slug único
    const slug = await generateUniqueSlug(name);
    
    // 2. Crear empresa en base de datos
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name,
        slug,
        subdomain: slug,
        external_id: externalId,
        status: 'active'
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error creando empresa: ${error.message}`);
    }
    
    // 3. Crear configuración de branding por defecto
    await supabase
      .from('company_branding')
      .insert({
        company_id: data.id,
        branding_config: {
          logoUrl: '',
          primaryColor: '#0055A4',
          welcomeMessage: `Bienvenido a ${name}`,
          customFields: {}
        },
        custom_locales: {},
        permissions_config: {}
      });
    
    return data;
  } catch (error) {
    // TODO: log en cada punto donde había console.log, console.error o console.warn
    throw error;
  }
};

/**
 * Valida que un identificador sea único
 * @param type - Tipo de identificador ('slug', 'subdomain', 'external_id')
 * @param value - Valor a validar
 * @param excludeId - ID a excluir de la validación (para updates)
 * @returns Promise<boolean>
 */
export const validateUniqueIdentifier = async (
  type: 'slug' | 'subdomain' | 'external_id',
  value: string,
  excludeId?: string
): Promise<boolean> => {
  try {
    let query = supabase
      .from('companies')
      .select('id')
      .eq(type, value);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query.single();
    
    // Si no existe, es único
    if (error && error.code === 'PGRST116') {
      return true;
    }
    
    // Si existe, no es único
    return false;
  } catch (error) {
    // TODO: log en cada punto donde había console.log, console.error o console.warn
    return false;
  }
}; 