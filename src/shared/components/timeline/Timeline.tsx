import React, { useMemo } from 'react';
import { useTimeline } from './hooks/useTimeline';
import { TimelineItem } from './TimelineItem';
import { TimelineFilters } from './TimelineFilters';
import { TimelineSkeleton } from './TimelineSkeleton';
import type { TimelineProps } from './types/timeline.types';

/**
 * Timeline Component - VThink 1.0
 * 
 * Componente cross-cutting que muestra todas las interacciones, eventos y actividades
 * relacionadas con una entidad específica, independientemente del módulo de origen.
 * 
 * @param entityId - ID de la entidad
 * @param entityType - Tipo de entidad (company, customer, employee, etc.)
 * @param className - Clases CSS adicionales
 * @param showFilters - Mostrar filtros del timeline
 * @param maxItems - Número máximo de items a mostrar
 */
export const Timeline: React.FC<TimelineProps> = ({
  entityId,
  entityType,
  className = '',
  showFilters = true,
  maxItems = 50
}) => {
  const {
    events,
    isLoading,
    filters,
    setFilters,
    activeModules,
    refresh
  } = useTimeline(entityId, entityType);

  // Eventos filtrados y limitados
  const displayEvents = useMemo(() => {
    if (!events) return [];
    return events.slice(0, maxItems);
  }, [events, maxItems]);

  if (isLoading) {
    return <TimelineSkeleton />;
  }

  return (
    <div className={`timeline-container ${className}`}>
      {/* Header del Timeline */}
      <div className="timeline-header">
        <div className="timeline-title">
          <h3 className="text-lg font-semibold text-gray-900">
            Timeline de {entityType || 'Entidad'}
          </h3>
          <span className="text-sm text-gray-500">
            {displayEvents.length} eventos
          </span>
        </div>
        
        <button
          onClick={refresh}
          className="timeline-refresh-btn"
          title="Actualizar timeline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Filtros del Timeline */}
      {showFilters && (
        <TimelineFilters
          filters={filters}
          onFiltersChange={setFilters}
          activeModules={activeModules}
        />
      )}
      
      {/* Lista de Eventos */}
      <div className="timeline-events">
        {displayEvents.length === 0 ? (
          <div className="timeline-empty">
            <div className="empty-icon">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="empty-title">No hay eventos</h3>
            <p className="empty-description">
              No se encontraron eventos para esta entidad en el período seleccionado.
            </p>
          </div>
        ) : (
          <div className="timeline-list">
            {displayEvents.map((event) => (
              <TimelineItem
                key={event.id}
                event={event}
                entityType={entityType}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer con información adicional */}
      {displayEvents.length > 0 && (
        <div className="timeline-footer">
          <div className="timeline-info">
            <span className="text-xs text-gray-500">
              Mostrando {displayEvents.length} de {events?.length || 0} eventos
            </span>
            {events && events.length > maxItems && (
              <button
                onClick={() => {/* Implementar paginación */}}
                className="timeline-load-more"
              >
                Ver más eventos
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline; 
