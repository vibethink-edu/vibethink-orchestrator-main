import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/shared/hooks/useAuth';
import { toast } from 'sonner';

// =====================================================
// TIPOS Y INTERFACES
// =====================================================

export interface CountryConfiguration {
  id: string;
  countryCode: string;
  countryName: string;
  region: 'LATAM' | 'NA' | 'EU';
  
  // Configuración de idioma
  defaultLanguage: string;
  supportedLanguages: string[];
  
  // Configuración monetaria
  defaultCurrency: string;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  
  // Configuración de formatos
  dateFormat: string;
  timeFormat: '12h' | '24h';
  numberFormat: {
    decimalSeparator: string;
    thousandsSeparator: string;
    decimalPlaces: number;
  };
  
  // Configuración fiscal
  taxRates: {
    standard: number;
    reduced: number;
    zero: number;
  };
  
  // Configuración legal
  legalRequirements: {
    requiresTaxId: boolean;
    requiresAddress: boolean;
    requiresPhone: boolean;
  };
  
  // Configuración de pagos
  paymentMethods: {
    creditCard: boolean;
    debitCard: boolean;
    bankTransfer: boolean;
    digitalWallets: string[];
    localMethods: string[];
  };
  
  // Configuración de contacto
  contactInfo: {
    supportEmail: string;
    supportPhone: string;
    businessHours: string;
    timezone: string;
  };
  
  // Metadatos
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyCountrySettings {
  id: string;
  companyId: string;
  countryCode: string;
  
  // Configuración operativa
  operationalLanguage: string;
  operationalCurrency: string;
  operationalTimezone: string;
  
  // Configuración de facturación
  billingSettings: {
    currency: string;
    taxId: string;
    taxRate: number;
    invoicePrefix: string;
    autoNumbering: boolean;
  };
  
  // Configuración de contacto
  contactSettings: {
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    phone: string;
    email: string;
    website: string;
  };
  
  // Configuración de pagos
  paymentSettings: {
    primaryMethod: string;
    supportedMethods: string[];
    autoRenewal: boolean;
    gracePeriod: number;
  };
  
  // Configuración de soporte
  supportSettings: {
    language: string;
    timezone: string;
    responseTime: string;
    escalationLevels: number;
  };
  
  // Metadatos
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CountryPlan {
  id: string;
  countryCode: string;
  planName: string;
  basePrice: number;
  currency: string;
  billingCycle: string;
  limits: Record<string, any>;
  features: string[];
  discounts: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EffectiveConfiguration extends CountryConfiguration {
  // Configuración efectiva combinando país y empresa
  effectiveLanguage: string;
  effectiveCurrency: string;
  effectiveTimezone: string;
  effectiveTaxRate: number;
  effectivePaymentMethods: string[];
}

// =====================================================
// HOOK PRINCIPAL - useMultiCountryConfiguration
// =====================================================

export const useMultiCountryConfiguration = (countryCode?: string) => {
  const { user, company } = useAuth();
  const queryClient = useQueryClient();
  
  // Estado local
  const [currentCountryCode, setCurrentCountryCode] = useState<string>(countryCode || 'CO');
  
  // =====================================================
  // QUERIES - OBTENER DATOS
  // =====================================================
  
  // Obtener configuración del país
  const { data: countryConfig, isLoading: countryLoading } = useQuery({
    queryKey: ['country-configuration', currentCountryCode],
    queryFn: async () => {
      // TODO: log '🌍 Cargando configuración del país:' currentCountryCode
      
      const { data, error } = await supabase
        .from('country_configurations')
        .select('*')
        .eq('country_code', currentCountryCode)
        .eq('is_active', true)
        .single();
      
      if (error) {
        // TODO: log error loading country configuration
        throw error;
      }
      
      // Transformar datos de snake_case a camelCase
      const transformed = {
        id: data.id,
        countryCode: data.country_code,
        countryName: data.country_name,
        region: data.region,
        defaultLanguage: data.default_language,
        supportedLanguages: data.supported_languages,
        defaultCurrency: data.default_currency,
        currencySymbol: data.currency_symbol,
        currencyPosition: data.currency_position,
        dateFormat: data.date_format,
        timeFormat: data.time_format,
        numberFormat: data.number_format,
        taxRates: data.tax_rates,
        legalRequirements: data.legal_requirements,
        paymentMethods: data.payment_methods,
        contactInfo: data.contact_info,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      // TODO: log '✅ Configuración del país cargada:' transformed.countryName
      return transformed as CountryConfiguration;
    },
    enabled: !!currentCountryCode,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  
  // Obtener configuración de empresa por país
  const { data: companyCountrySettings, isLoading: companySettingsLoading } = useQuery({
    queryKey: ['company-country-settings', company?.id, currentCountryCode],
    queryFn: async () => {
      if (!company?.id) return null;
      
      // TODO: log '🏢 Cargando configuración de empresa para país:' currentCountryCode
      
      const { data, error } = await supabase
        .from('company_country_settings')
        .select('*')
        .eq('company_id', company.id)
        .eq('country_code', currentCountryCode)
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // TODO: log error loading company configuration
        throw error;
      }
      
      if (!data) {
        // TODO: log 'ℹ️ No hay configuración específica de empresa para este país'
        return null;
      }
      
      // Transformar datos de snake_case a camelCase
      const transformed = {
        id: data.id,
        companyId: data.company_id,
        countryCode: data.country_code,
        operationalLanguage: data.operational_language,
        operationalCurrency: data.operational_currency,
        operationalTimezone: data.operational_timezone,
        billingSettings: data.billing_settings,
        contactSettings: data.contact_settings,
        paymentSettings: data.payment_settings,
        supportSettings: data.support_settings,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      // TODO: log '✅ Configuración de empresa cargada'
      return transformed as CompanyCountrySettings;
    },
    enabled: !!company?.id && !!currentCountryCode,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  
  // Obtener planes del país
  const { data: countryPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['country-plans', currentCountryCode],
    queryFn: async () => {
      // TODO: log '📋 Cargando planes del país:' currentCountryCode
      
      const { data, error } = await supabase
        .from('country_plans')
        .select('*')
        .eq('country_code', currentCountryCode)
        .eq('is_active', true)
        .order('base_price', { ascending: true });
      
      if (error) {
        // TODO: log error loading country plans
        throw error;
      }
      
      // Transformar datos
      const transformed = data.map(plan => ({
        id: plan.id,
        countryCode: plan.country_code,
        planName: plan.plan_name,
        basePrice: plan.base_price,
        currency: plan.currency,
        billingCycle: plan.billing_cycle,
        limits: plan.limits,
        features: plan.features,
        discounts: plan.discounts,
        isActive: plan.is_active,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at
      }));
      
      // TODO: log '✅ Planes del país cargados:' transformed.length
      return transformed as CountryPlan[];
    },
    enabled: !!currentCountryCode,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
  
  // =====================================================
  // MUTATIONS - ACTUALIZAR DATOS
  // =====================================================
  
  // Actualizar configuración de empresa por país
  const updateCompanyCountrySettingsMutation = useMutation({
    mutationFn: async (settings: Partial<CompanyCountrySettings>) => {
      if (!company?.id) throw new Error('No hay empresa seleccionada');
      
      // TODO: log '🔄 Actualizando configuración de empresa para país:' currentCountryCode
      
      const updateData = {
        company_id: company.id,
        country_code: currentCountryCode,
        operational_language: settings.operationalLanguage,
        operational_currency: settings.operationalCurrency,
        operational_timezone: settings.operationalTimezone,
        billing_settings: settings.billingSettings,
        contact_settings: settings.contactSettings,
        payment_settings: settings.paymentSettings,
        support_settings: settings.supportSettings,
        updated_at: new Date().toISOString()
      };
      
      // Intentar actualizar primero
      const { data: updateResult, error: updateError } = await supabase
        .from('company_country_settings')
        .update(updateData)
        .eq('company_id', company.id)
        .eq('country_code', currentCountryCode)
        .select()
        .single();
      
      if (updateError && updateError.code === 'PGRST116') {
        // Si no existe, crear nuevo registro
        // TODO: log '📝 Creando nueva configuración de empresa para país'
        
        const { data: insertResult, error: insertError } = await supabase
          .from('company_country_settings')
          .insert(updateData)
          .select()
          .single();
        
        if (insertError) {
          // TODO: log error creating company configuration
          throw insertError;
        }
        
        return insertResult;
      }
      
      if (updateError) {
        // TODO: log error updating company configuration
        throw updateError;
      }
      
      return updateResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-country-settings', company?.id, currentCountryCode] });
      toast.success('Configuración de empresa actualizada exitosamente');
    },
    onError: (error) => {
      // TODO: log error updating company configuration
      toast.error('Error al actualizar la configuración de empresa');
    }
  });
  
  // =====================================================
  // FUNCIONES DE UTILIDAD
  // =====================================================
  
  // Obtener configuración efectiva (combinando país y empresa)
  const getEffectiveConfiguration = useCallback((): EffectiveConfiguration | null => {
    if (!countryConfig) return null;
    
    const effective: EffectiveConfiguration = {
      ...countryConfig,
      effectiveLanguage: companyCountrySettings?.operationalLanguage || countryConfig.defaultLanguage,
      effectiveCurrency: companyCountrySettings?.operationalCurrency || countryConfig.defaultCurrency,
      effectiveTimezone: companyCountrySettings?.operationalTimezone || countryConfig.contactInfo.timezone,
      effectiveTaxRate: companyCountrySettings?.billingSettings?.taxRate || countryConfig.taxRates.standard,
      effectivePaymentMethods: [
        ...(countryConfig.paymentMethods.creditCard ? ['creditCard'] : []),
        ...(countryConfig.paymentMethods.debitCard ? ['debitCard'] : []),
        ...(countryConfig.paymentMethods.bankTransfer ? ['bankTransfer'] : []),
        ...countryConfig.paymentMethods.digitalWallets,
        ...countryConfig.paymentMethods.localMethods
      ]
    };
    
    return effective;
  }, [countryConfig, companyCountrySettings]);
  
  // Cambiar país
  const changeCountry = useCallback((newCountryCode: string) => {
    // TODO: log '🌍 Cambiando país de' currentCountryCode 'a' newCountryCode
    setCurrentCountryCode(newCountryCode);
  }, [currentCountryCode]);
  
  // Obtener países disponibles
  const { data: availableCountries } = useQuery({
    queryKey: ['available-countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('country_configurations')
        .select('country_code, country_name, region, default_currency')
        .eq('is_active', true)
        .order('country_name');
      
      if (error) throw error;
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
  
  // =====================================================
  // RETORNO DEL HOOK
  // =====================================================
  
  return {
    // Datos
    countryConfig,
    companyCountrySettings,
    countryPlans,
    effectiveConfiguration: getEffectiveConfiguration(),
    availableCountries,
    currentCountryCode,
    
    // Estados de carga
    isLoading: countryLoading || companySettingsLoading || plansLoading,
    isUpdating: updateCompanyCountrySettingsMutation.isPending,
    
    // Acciones
    changeCountry,
    updateCompanyCountrySettings: updateCompanyCountrySettingsMutation.mutate,
    
    // Utilidades
    getEffectiveConfiguration
  };
};

// =====================================================
// HOOK ESPECIALIZADO - useLocalizedFormatting
// =====================================================

export const useLocalizedFormatting = (countryCode: string) => {
  const { countryConfig } = useMultiCountryConfiguration(countryCode);
  
  const formatCurrency = useCallback((amount: number, currency?: string) => {
    if (!countryConfig) return amount.toString();
    
    const targetCurrency = currency || countryConfig.defaultCurrency;
    const locale = countryConfig.defaultLanguage;
    
    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: targetCurrency,
        minimumFractionDigits: countryConfig.numberFormat.decimalPlaces,
        maximumFractionDigits: countryConfig.numberFormat.decimalPlaces
      });
      
      return formatter.format(amount);
    } catch (error) {
      console.warn('Error formateando moneda:', error);
      return `${countryConfig.currencySymbol}${amount.toFixed(countryConfig.numberFormat.decimalPlaces)}`;
    }
  }, [countryConfig]);
  
  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    if (!countryConfig) return date.toLocaleDateString();
    
    try {
      const formatter = new Intl.DateTimeFormat(countryConfig.defaultLanguage, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
      });
      
      return formatter.format(date);
    } catch (error) {
      console.warn('Error formateando fecha:', error);
      return date.toLocaleDateString();
    }
  }, [countryConfig]);
  
  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    if (!countryConfig) return number.toString();
    
    try {
      const formatter = new Intl.NumberFormat(countryConfig.defaultLanguage, {
        minimumFractionDigits: countryConfig.numberFormat.decimalPlaces,
        maximumFractionDigits: countryConfig.numberFormat.decimalPlaces,
        ...options
      });
      
      return formatter.format(number);
    } catch (error) {
      console.warn('Error formateando número:', error);
      return number.toString();
    }
  }, [countryConfig]);
  
  const formatTaxRate = useCallback((rate: number) => {
    if (!countryConfig) return `${rate}%`;
    
    return formatNumber(rate, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      style: 'percent'
    });
  }, [countryConfig, formatNumber]);
  
  return {
    formatCurrency,
    formatDate,
    formatNumber,
    formatTaxRate,
    countryConfig
  };
};

// =====================================================
// HOOK ESPECIALIZADO - useCountryPlans
// =====================================================

export const useCountryPlans = (countryCode: string) => {
  const { countryPlans, isLoading } = useMultiCountryConfiguration(countryCode);
  
  const getPlanByName = useCallback((planName: string) => {
    return countryPlans?.find(plan => plan.planName === planName);
  }, [countryPlans]);
  
  const getPlanByPrice = useCallback((price: number) => {
    return countryPlans?.find(plan => plan.basePrice === price);
  }, [countryPlans]);
  
  const getCheapestPlan = useCallback(() => {
    return countryPlans?.[0];
  }, [countryPlans]);
  
  const getMostExpensivePlan = useCallback(() => {
    return countryPlans?.[countryPlans.length - 1];
  }, [countryPlans]);
  
  const calculateAnnualPrice = useCallback((monthlyPrice: number, discount: number = 0) => {
    const annualPrice = monthlyPrice * 12;
    const discountAmount = annualPrice * (discount / 100);
    return annualPrice - discountAmount;
  }, []);
  
  return {
    plans: countryPlans,
    isLoading,
    getPlanByName,
    getPlanByPrice,
    getCheapestPlan,
    getMostExpensivePlan,
    calculateAnnualPrice
  };
}; 