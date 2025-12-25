'use client';

/**
 * Componente ejemplo demostrando 3 capas
 * 
 * CAPA 2: termSync() para terminology
 * CAPA 3A: useTranslation() para UI strings
 */

import { useTranslation } from 'react-i18next';
import { termSync, type ProductContext } from '@vibethink/utils';

interface BookingCardExampleProps {
  productContext: ProductContext;
}

export function BookingCardExample({ productContext }: BookingCardExampleProps) {
  // CAPA 3A: UI strings
  const { t, i18n } = useTranslation('booking');
  
  // CAPA 2: Terminology
  const resourceLabel = termSync('concept.booking.resource.room', {
    productContext,
    locale: i18n.language as any,
  });
  
  const actionLabel = termSync('concept.booking.action.reserve', {
    locale: i18n.language as any,
  });
  
  const statusLabel = termSync('concept.booking.status.confirmed', {
    locale: i18n.language as any,
  });

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <h3 className="text-lg font-bold">{t('title', { defaultValue: 'Bookings' })}</h3>
      
      <div className="space-y-1">
        <p className="text-sm">
          <span className="font-medium">Resource:</span> {resourceLabel}
        </p>
        <p className="text-sm">
          <span className="font-medium">Status:</span> {statusLabel}
        </p>
      </div>

      <button className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
        {actionLabel} {resourceLabel}
      </button>
      
      <p className="text-xs text-gray-500">
        Context: <code>{productContext}</code> | Locale: <code>{i18n.language}</code>
      </p>
    </div>
  );
}

