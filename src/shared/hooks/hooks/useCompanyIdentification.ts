import { useState, useEffect } from 'react';
import { CompanyIdentifiers, identifyCompany } from '@/shared/utils/companyIdentification';

/**
 * Hook para identificar la empresa actual basado en múltiples criterios
 * @returns { company, loading, error }
 * 
 * @example
 * const { company, loading, error } = useCompanyIdentification();
 * // company = { id: "uuid", slug: "hospital-san-jose", ... }
 */
export const useCompanyIdentification = () => {
  const [company, setCompany] = useState<CompanyIdentifiers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        
        const companyData = await identifyCompany();
        
        if (companyData) {
          setCompany(companyData);
        } else {
          setError('No se pudo identificar la empresa');
        }
      } catch (err) {
        setError('Error identificando la empresa');
        console.error('Error en identificación de empresa:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCompany();
  }, []);
  
  return { company, loading, error };
}; 