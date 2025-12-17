import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { useTranslation } from 'react-i18next';

// =====================================================
// TIPOS Y INTERFACES
// =====================================================

interface CountrySelectorProps {
  value: string;
  onChange: (countryCode: string) => void;
  variant?: 'dropdown' | 'buttons' | 'cards' | 'grid';
  showFlag?: boolean;
  showName?: boolean;
  showCurrency?: boolean;
  showRegion?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  filterByRegion?: 'LATAM' | 'NA' | 'EU' | 'ALL';
}

interface CountryData {
  country_code: string;
  country_name: string;
  region: 'LATAM' | 'NA' | 'EU';
  default_currency: string;
  currency_symbol: string;
  default_language: string;
}

// =====================================================
// UTILIDADES
// =====================================================

// Función para obtener bandera por código de país
const getCountryFlag = (countryCode: string): string => {
  const flagEmojis: Record<string, string> = {
    'CO': '🇨🇴', // Colombia
    'MX': '🇲🇽', // México
    'BR': '🇧🇷', // Brasil
    'AR': '🇦🇷', // Argentina
    'CL': '🇨🇱', // Chile
    'PE': '🇵🇪', // Perú
    'US': '🇺🇸', // Estados Unidos
    'CA': '🇨🇦', // Canadá
    'ES': '🇪🇸', // España
    'DE': '🇩🇪', // Alemania
    'FR': '🇫🇷', // Francia
    'IT': '🇮🇹', // Italia
    'GB': '🇬🇧', // Reino Unido
  };
  
  return flagEmojis[countryCode] || '🌍';
};

// Función para obtener nombre de región
const getRegionName = (region: string): string => {
  const regionNames: Record<string, string> = {
    'LATAM': 'Latinoamérica',
    'NA': 'Norteamérica',
    'EU': 'Europa'
  };
  
  return regionNames[region] || region;
};

// Función para obtener color de región
const getRegionColor = (region: string): string => {
  const regionColors: Record<string, string> = {
    'LATAM': 'bg-green-100 text-green-800 border-green-200',
    'NA': 'bg-blue-100 text-blue-800 border-blue-200',
    'EU': 'bg-purple-100 text-purple-800 border-purple-200'
  };
  
  return regionColors[region] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  variant = 'dropdown',
  showFlag = true,
  showName = true,
  showCurrency = true,
  showRegion = false,
  disabled = false,
  className = '',
  placeholder = 'Seleccionar país',
  filterByRegion = 'ALL'
}) => {
  const { t } = useTranslation();
  
  // Obtener países disponibles
  const { data: countries, isLoading } = useQuery({
    queryKey: ['available-countries'],
    queryFn: async () => {
      // TODO: log '🌍 Cargando países disponibles...'
      
      let query = supabase
        .from('country_configurations')
        .select('country_code, country_name, region, default_currency, currency_symbol, default_language')
        .eq('is_active', true)
        .order('country_name');
      
      // Filtrar por región si se especifica
      if (filterByRegion !== 'ALL') {
        query = query.eq('region', filterByRegion);
      }
      
      const { data, error } = await query;
      
      if (error) {
        // TODO: log '❌ Error cargando países:' error
        throw error;
      }
      
      // TODO: log '✅ Países cargados:' data?.length || 0
      return data as CountryData[];
    },
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
  
  // Filtrar países si es necesario
  const filteredCountries = countries?.filter(country => {
    if (filterByRegion === 'ALL') return true;
    return country.region === filterByRegion;
  }) || [];
  
  // =====================================================
  // VARIANTE DROPDOWN
  // =====================================================
  
  if (variant === 'dropdown') {
    return (
      <div className={className}>
        <Select value={value} onValueChange={onChange} disabled={disabled || isLoading}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoading ? 'Cargando...' : placeholder}>
              {value && countries && (
                <div className="flex items-center gap-2">
                  {showFlag && <span className="text-lg">{getCountryFlag(value)}</span>}
                  {showName && (
                    <span>
                      {countries.find(c => c.country_code === value)?.country_name || value}
                    </span>
                  )}
                  {showCurrency && (
                    <span className="text-muted-foreground">
                      ({countries.find(c => c.country_code === value)?.default_currency})
                    </span>
                  )}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {filteredCountries.map(country => (
              <SelectItem key={country.country_code} value={country.country_code}>
                <div className="flex items-center gap-2">
                  {showFlag && <span className="text-lg">{getCountryFlag(country.country_code)}</span>}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {showName && <span className="font-medium">{country.country_name}</span>}
                      {showCurrency && (
                        <span className="text-muted-foreground text-sm">
                          {country.currency_symbol} {country.default_currency}
                        </span>
                      )}
                    </div>
                    {showRegion && (
                      <Badge variant="outline" className={`text-xs ${getRegionColor(country.region)}`}>
                        {getRegionName(country.region)}
                      </Badge>
                    )}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  
  // =====================================================
  // VARIANTE BUTTONS
  // =====================================================
  
  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {filteredCountries.map(country => (
          <Button
            key={country.country_code}
            variant={value === country.country_code ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(country.country_code)}
            disabled={disabled || isLoading}
            className="flex items-center gap-2"
          >
            {showFlag && <span className="text-lg">{getCountryFlag(country.country_code)}</span>}
            {showName && <span>{country.country_name}</span>}
            {showCurrency && (
              <span className="text-xs opacity-75">
                {country.currency_symbol} {country.default_currency}
              </span>
            )}
          </Button>
        ))}
      </div>
    );
  }
  
  // =====================================================
  // VARIANTE CARDS
  // =====================================================
  
  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {filteredCountries.map(country => (
          <Card
            key={country.country_code}
            className={`cursor-pointer transition-all hover:shadow-md ${
              value === country.country_code ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onChange(country.country_code)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {showFlag && <span className="text-2xl">{getCountryFlag(country.country_code)}</span>}
                <div className="flex-1">
                  {showName && (
                    <h3 className="font-semibold text-lg">{country.country_name}</h3>
                  )}
                  {showCurrency && (
                    <p className="text-sm text-muted-foreground">
                      {country.currency_symbol} {country.default_currency}
                    </p>
                  )}
                  {showRegion && (
                    <Badge variant="outline" className={`text-xs mt-1 ${getRegionColor(country.region)}`}>
                      {getRegionName(country.region)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // =====================================================
  // VARIANTE GRID
  // =====================================================
  
  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 ${className}`}>
        {filteredCountries.map(country => (
          <Button
            key={country.country_code}
            variant={value === country.country_code ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(country.country_code)}
            disabled={disabled || isLoading}
            className="flex flex-col items-center gap-1 p-2 h-auto"
          >
            {showFlag && <span className="text-xl">{getCountryFlag(country.country_code)}</span>}
            {showName && (
              <span className="text-xs font-medium text-center leading-tight">
                {country.country_name}
              </span>
            )}
            {showCurrency && (
              <span className="text-xs opacity-75">
                {country.currency_symbol}
              </span>
            )}
          </Button>
        ))}
      </div>
    );
  }
  
  return null;
};

// =====================================================
// COMPONENTES ADICIONALES
// =====================================================

export const CountryPreview: React.FC<{ countryCode: string }> = ({ countryCode }) => {
  const { data: countries } = useQuery({
    queryKey: ['available-countries'],
    queryFn: async () => {
      const { data } = await supabase
        .from('country_configurations')
        .select('country_code, country_name, region, default_currency, currency_symbol')
        .eq('is_active', true);
      return data;
    },
  });
  
  const country = countries?.find(c => c.country_code === countryCode);
  
  if (!country) return null;
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{getCountryFlag(countryCode)}</span>
      <div>
        <div className="font-medium">{country.country_name}</div>
        <div className="text-sm text-muted-foreground">
          {country.currency_symbol} {country.default_currency}
        </div>
      </div>
    </div>
  );
};

export const RegionSelector: React.FC<{
  value: 'LATAM' | 'NA' | 'EU' | 'ALL';
  onChange: (region: 'LATAM' | 'NA' | 'EU' | 'ALL') => void;
}> = ({ value, onChange }) => {
  const regions = [
    { code: 'ALL', name: 'Todos', flag: '🌍' },
    { code: 'LATAM', name: 'Latinoamérica', flag: '🌎' },
    { code: 'NA', name: 'Norteamérica', flag: '🌎' },
    { code: 'EU', name: 'Europa', flag: '🌍' },
  ] as const;
  
  return (
    <div className="flex gap-2">
      {regions.map(region => (
        <Button
          key={region.code}
          variant={value === region.code ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(region.code)}
          className="flex items-center gap-2"
        >
          <span>{region.flag}</span>
          <span className="hidden sm:inline">{region.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default CountrySelector; 
