/**
 * BookingCard - Componente Reutilizable IA First
 * 
 * Funciona para hotel/studio/cowork sin cambiar código, solo cambiando context.
 * Auto-detecta contexto desde ruta si no se pasa explícitamente.
 * 
 * @example
 * // En /dashboard-bundui/hotel/bookings
 * <BookingCard booking={hotelBooking} />
 * // → Auto-detecta context='hotel'
 * // → Muestra "Reserva de Habitación", "habitación", "3 noches"
 * 
 * // En /dashboard-bundui/studio/bookings
 * <BookingCard booking={studioBooking} />
 * // → Auto-detecta context='studio'
 * // → Muestra "Reserva de Sala", "sala", "2 horas"
 */

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@vibethink/ui';
import { useAutoDetectContext } from '@/hooks/use-auto-detect-context';
import { term } from '@vibethink/utils';
import { useTranslation } from '@/lib/i18n';
import { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon } from '@vibethink/ui/icons';

export interface Booking {
  id: string;
  spaceNumber: string;
  count: number;
  unit: 'night' | 'hour' | 'day';
  startDate: Date | string;
  endDate: Date | string;
  guestName?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  amount?: number;
  currency?: string;
}

export interface BookingCardProps {
  /** Contexto explícito (opcional - se auto-detecta si no se pasa) */
  context?: 'hotel' | 'studio' | 'cowork' | 'coliving' | null;
  /** Datos del booking */
  booking: Booking;
  /** Locale (opcional - se obtiene del I18nProvider) */
  locale?: string;
  /** Mostrar acciones (opcional) */
  showActions?: boolean;
  /** Callback cuando se confirma */
  onConfirm?: (bookingId: string) => void;
  /** Callback cuando se cancela */
  onCancel?: (bookingId: string) => void;
}

/**
 * Helper para obtener tipo de espacio según contexto
 */
function getSpaceType(context: string): string {
  const mapping: Record<string, string> = {
    hotel: 'room',
    studio: 'studio',
    cowork: 'space',
    coliving: 'bedroom',
  };
  return mapping[context] || 'space';
}

/**
 * Helper para formatear fecha
 */
function formatDate(date: Date | string, locale: string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function BookingCard({
  context: explicitContext,
  booking,
  locale,
  showActions = false,
  onConfirm,
  onCancel,
}: BookingCardProps) {
  // Auto-detectar contexto si no se pasa explícitamente
  const autoContext = useAutoDetectContext();
  const finalContext = explicitContext || autoContext;

  const { locale: currentLocale } = useTranslation('common');
  const finalLocale = locale || currentLocale;

  // Resolver terminología según contexto
  const [terminology, setTerminology] = useState({
    spaceLabel: '',
    bookingLabel: '',
    durationLabel: '',
    statusLabel: '',
    guestLabel: '',
    amountLabel: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTerminology() {
      if (!finalContext) {
        setIsLoading(false);
        return;
      }

      try {
        // Resolver terminología según contexto
        const spaceType = getSpaceType(finalContext);
        const spaceLabel = await term(
          `concept.resource.${spaceType}`,
          {},
          finalLocale,
          finalContext
        );

        const bookingLabel = await term(
          'concept.booking.label',
          { context: finalContext },
          finalLocale,
          finalContext
        );

        const durationLabel = await term(
          `concept.unit.${booking.unit}`,
          { count: booking.count },
          finalLocale,
          finalContext
        );

        // Status labels desde concept namespace
        const statusLabel = await term(
          `concept.status.${booking.status || 'pending'}`,
          {},
          finalLocale,
          finalContext
        );

        // Guest label según contexto
        const guestLabel = await term(
          `concept.guest.${finalContext}`,
          {},
          finalLocale,
          finalContext
        ).catch(() => term('concept.guest.default', {}, finalLocale, finalContext));

        const amountLabel = await term(
          'concept.amount.label',
          {},
          finalLocale,
          finalContext
        );

        setTerminology({
          spaceLabel,
          bookingLabel,
          durationLabel,
          statusLabel: await statusLabel,
          guestLabel: await guestLabel,
          amountLabel: await amountLabel,
        });
      } catch (error) {
        console.error('[BookingCard] Error loading terminology:', error);
        // Fallback a valores por defecto
        setTerminology({
          spaceLabel: 'Espacio',
          bookingLabel: 'Reserva',
          durationLabel: `${booking.count} ${booking.unit}`,
          statusLabel: 'Pendiente',
          guestLabel: 'Cliente',
          amountLabel: 'Monto',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadTerminology();
  }, [finalContext, finalLocale, booking.unit, booking.count, booking.status]);

  if (!finalContext) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Contexto no disponible</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{terminology.bookingLabel}</CardTitle>
          {booking.status && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : booking.status === 'cancelled'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}
            >
              {terminology.statusLabel}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Espacio */}
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
          <div>
            <span className="text-sm text-muted-foreground">
              {terminology.spaceLabel}:
            </span>
            <span className="ml-2 font-medium">{booking.spaceNumber}</span>
          </div>
        </div>

        {/* Duración */}
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
          <div>
            <span className="text-sm text-muted-foreground">Duración: </span>
            <span className="ml-2 font-medium">
              {booking.count} {terminology.durationLabel}
            </span>
          </div>
        </div>

        {/* Fechas */}
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">Desde:</div>
            <div className="font-medium">
              {formatDate(booking.startDate, finalLocale)}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">Hasta:</div>
            <div className="font-medium">
              {formatDate(booking.endDate, finalLocale)}
            </div>
          </div>
        </div>

        {/* Huésped/Cliente */}
        {booking.guestName && (
          <div>
            <span className="text-sm text-muted-foreground">
              {terminology.guestLabel}:
            </span>
            <span className="ml-2 font-medium">{booking.guestName}</span>
          </div>
        )}

        {/* Monto */}
        {booking.amount && (
          <div>
            <span className="text-sm text-muted-foreground">
              {terminology.amountLabel}:
            </span>
            <span className="ml-2 font-medium">
              {new Intl.NumberFormat(finalLocale, {
                style: 'currency',
                currency: booking.currency || 'USD',
              }).format(booking.amount)}
            </span>
          </div>
        )}

        {/* Acciones */}
        {showActions && (
          <div className="flex gap-2 pt-2 border-t">
            {booking.status === 'pending' && onConfirm && (
              <button
                onClick={() => onConfirm(booking.id)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Confirmar
              </button>
            )}
            {booking.status !== 'cancelled' && onCancel && (
              <button
                onClick={() => onCancel(booking.id)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

