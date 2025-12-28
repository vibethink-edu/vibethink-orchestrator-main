/**
 * Example: CrmHeader with i18n
 * 
 * This is an example of how to use the i18n system in components
 */

'use client';

import { Button, Input, Badge } from '@vibethink/ui';
import { Search, Plus, Filter, Download, X } from 'lucide-react';
import { useCrmFilters } from '../hooks/useCrmFilters';
import { useTranslation } from '@/lib/i18n';

export function CrmHeaderExample() {
  const { filters, updateFilter, resetFilters, hasActiveFilters, getFilterSummary } = useCrmFilters();
  const { t } = useTranslation('crm');
  const { t: tCommon } = useTranslation('common');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('searchQuery', e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('header.title')}</h1>
          <p className="text-muted-foreground">
            {t('header.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t('actions.export')}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {t('actions.filter')}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t('actions.addCustomer')}
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('actions.searchPlaceholder')} 
            className="pl-10"
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('filters.activeFilters')}:</span>
            {getFilterSummary().map((filter, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {filter}
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}














