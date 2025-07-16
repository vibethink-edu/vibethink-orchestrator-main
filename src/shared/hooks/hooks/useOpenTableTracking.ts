import { useCallback } from 'react';
import { useApiIntegrationTracking } from './useApiIntegrationTracking';

// Tipos de agentes usando las siglas definidas
type AgentId = 'AG_LEGAL' | 'AG_CONT' | 'AG_VENT' | 'AG_DEV' | 'AG_MKT' | 'AG_HR' | 'AG_OPS' | 'AG_MGR';

// Tipos de módulos usando las siglas definidas
type ModuleId = 'CRM' | 'HD' | 'PQRS' | 'PORTAL-GOV' | 'PORTAL-EMP' | 'ATX' | 'TTX' | 'NTX' | 'AGNO';

// Interfaces para OpenTable
interface OpenTableReservation {
  restaurant_name: string;
  restaurant_id: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  special_requests?: string;
  occasion?: string;
  table_preference?: string;
}

interface OpenTableAvailability {
  restaurant_id: string;
  date: string;
  party_size: number;
  time_slots: string[];
}

interface OpenTableRestaurant {
  restaurant_id: string;
  restaurant_name: string;
  cuisine: string;
  location: string;
  rating: number;
  price_range: string;
  availability: boolean;
}

interface OpenTableReservationResult {
  reservation_id: string;
  confirmation_number: string;
  restaurant_name: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  revenue?: number; // Ingreso estimado de la reserva
}

/**
 * Hook específico para tracking de integraciones con OpenTable
 * 
 * Proporciona funciones para trackear automáticamente todas las
 * operaciones con OpenTable (reservas, disponibilidad, etc.)
 */
export const useOpenTableTracking = () => {
  const { trackApiOperation } = useApiIntegrationTracking();

  /**
   * Trackea la creación de una reserva en OpenTable
   */
  const trackReservationCreation = useCallback(async (
    agentId: AgentId,
    module: ModuleId,
    reservation: OpenTableReservation
  ): Promise<OpenTableReservationResult> => {
    return await trackApiOperation(
      agentId,
      module,
      'opentable',
      'reservations',
      'reservation_created',
      reservation,
      async () => {
        // Simulación de llamada a OpenTable API
        const result: OpenTableReservationResult = {
          reservation_id: `ot_${Date.now()}`,
          confirmation_number: `OT${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          restaurant_name: reservation.restaurant_name,
          reservation_date: reservation.reservation_date,
          reservation_time: reservation.reservation_time,
          party_size: reservation.party_size,
          status: 'confirmed',
          revenue: reservation.party_size * 25 // Estimación de $25 por persona
        };
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return result;
      }
    );
  }, [trackApiOperation]);

  /**
   * Trackea la búsqueda de disponibilidad en OpenTable
   */
  const trackAvailabilitySearch = useCallback(async (
    agentId: AgentId,
    module: ModuleId,
    availability: OpenTableAvailability
  ): Promise<string[]> => {
    return await trackApiOperation(
      agentId,
      module,
      'opentable',
      'availability',
      'availability_searched',
      availability,
      async () => {
        // Simulación de búsqueda de disponibilidad
        const timeSlots = [
          '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
        ].filter(() => Math.random() > 0.3); // 70% de probabilidad de disponibilidad
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return timeSlots;
      }
    );
  }, [trackApiOperation]);

  /**
   * Trackea la búsqueda de restaurantes en OpenTable
   */
  const trackRestaurantSearch = useCallback(async (
    agentId: AgentId,
    module: ModuleId,
    searchCriteria: {
      location: string;
      cuisine?: string;
      date: string;
      party_size: number;
      price_range?: string;
    }
  ): Promise<OpenTableRestaurant[]> => {
    return await trackApiOperation(
      agentId,
      module,
      'opentable',
      'restaurants',
      'restaurants_searched',
      searchCriteria,
      async () => {
        // Simulación de búsqueda de restaurantes
        const restaurants: OpenTableRestaurant[] = [
          {
            restaurant_id: 'rest_001',
            restaurant_name: 'Restaurante A',
            cuisine: 'Italiana',
            location: 'Centro',
            rating: 4.5,
            price_range: '$$',
            availability: true
          },
          {
            restaurant_id: 'rest_002',
            restaurant_name: 'Restaurante B',
            cuisine: 'Mexicana',
            location: 'Zona Norte',
            rating: 4.2,
            price_range: '$',
            availability: true
          },
          {
            restaurant_id: 'rest_003',
            restaurant_name: 'Restaurante C',
            cuisine: 'Japonesa',
            location: 'Zona Sur',
            rating: 4.8,
            price_range: '$$$',
            availability: false
          }
        ];
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return restaurants;
      }
    );
  }, [trackApiOperation]);

  /**
   * Trackea la cancelación de una reserva en OpenTable
   */
  const trackReservationCancellation = useCallback(async (
    agentId: AgentId,
    module: ModuleId,
    reservationId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    return await trackApiOperation(
      agentId,
      module,
      'opentable',
      'reservations',
      'reservation_cancelled',
      { reservation_id: reservationId, reason },
      async () => {
        // Simulación de cancelación
        const success = Math.random() > 0.1; // 90% de éxito
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 600));
        
        return {
          success,
          message: success ? 'Reserva cancelada exitosamente' : 'Error al cancelar la reserva'
        };
      }
    );
  }, [trackApiOperation]);

  /**
   * Trackea la modificación de una reserva en OpenTable
   */
  const trackReservationModification = useCallback(async (
    agentId: AgentId,
    module: ModuleId,
    reservationId: string,
    modifications: Partial<OpenTableReservation>
  ): Promise<OpenTableReservationResult> => {
    return await trackApiOperation(
      agentId,
      module,
      'opentable',
      'reservations',
      'reservation_modified',
      { reservation_id: reservationId, modifications },
      async () => {
        // Simulación de modificación
        const result: OpenTableReservationResult = {
          reservation_id: reservationId,
          confirmation_number: `OT${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          restaurant_name: 'Restaurante Modificado',
          reservation_date: modifications.reservation_date || '2025-01-01',
          reservation_time: modifications.reservation_time || '19:00',
          party_size: modifications.party_size || 2,
          status: 'confirmed',
          revenue: (modifications.party_size || 2) * 25
        };
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 700));
        
        return result;
      }
    );
  }, [trackApiOperation]);

  /**
   * Trackea múltiples reservas en batch
   */
  const trackBatchReservations = useCallback(async (
    agentId: AgentId,
    module: ModuleId,
    reservations: OpenTableReservation[]
  ): Promise<OpenTableReservationResult[]> => {
    const operations = reservations.map(reservation => ({
      data: reservation,
      operation: async () => {
        // Simulación de reserva individual
        const result: OpenTableReservationResult = {
          reservation_id: `ot_${Date.now()}_${Math.random()}`,
          confirmation_number: `OT${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          restaurant_name: reservation.restaurant_name,
          reservation_date: reservation.reservation_date,
          reservation_time: reservation.reservation_time,
          party_size: reservation.party_size,
          status: 'confirmed',
          revenue: reservation.party_size * 25
        };
        
        await new Promise(resolve => setTimeout(resolve, 200));
        return result;
      }
    }));

    // Usar el hook de batch operations
    const { trackApiBatchOperation } = useApiIntegrationTracking();
    return await trackApiBatchOperation(
      agentId,
      module,
      'opentable',
      'reservations',
      'batch_reservations',
      operations
    );
  }, []);

  /**
   * Obtiene métricas específicas de OpenTable
   */
  const getOpenTableMetrics = useCallback(() => {
    // En un entorno real, esto obtendría métricas de la base de datos
    return {
      totalReservations: 234,
      successfulReservations: 228,
      failedReservations: 6,
      totalRevenue: 5850,
      averagePartySize: 3.2,
      topRestaurants: [
        { name: 'Restaurante A', reservations: 45, revenue: 1125 },
        { name: 'Restaurante B', reservations: 38, revenue: 950 },
        { name: 'Restaurante C', reservations: 32, revenue: 800 }
      ],
      timeSaved: 117, // horas
      apiCost: 58.50, // $0.25 por reserva
      roi: 1900 // %
    };
  }, []);

  return {
    trackReservationCreation,
    trackAvailabilitySearch,
    trackRestaurantSearch,
    trackReservationCancellation,
    trackReservationModification,
    trackBatchReservations,
    getOpenTableMetrics
  };
}; 