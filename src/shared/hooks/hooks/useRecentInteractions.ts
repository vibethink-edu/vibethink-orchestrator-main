import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export interface RecentInteraction {
  id: string;
  type: 'CRM' | 'Email' | 'Calendar';
  title: string;
  description: string;
  timestamp: string;
}

export const useRecentInteractions = () => {
  const { user: currentUser } = useAuth();

  return useQuery({
    queryKey: ['recent-interactions', currentUser?.company?.id],
    queryFn: async () => {
      // Simular datos de ejemplo
      return [
        {
          id: '1',
          type: 'CRM',
          title: 'Cliente creado: Innovación Tech',
          description: 'Nuevo cliente registrado en el sistema',
          timestamp: '2 min',
        },
        {
          id: '2',
          type: 'Email',
          title: 'Plantilla generada: Seguimiento ventas',
          description: 'Email automatizado para seguimiento',
          timestamp: '5 min',
        },
        {
          id: '3',
          type: 'Calendar',
          title: 'Reunión agendada con IA',
          description: 'Coordinación automática completada',
          timestamp: '12 min',
        },
      ] as RecentInteraction[];
    },
    enabled: !!currentUser?.company?.id,
  });
};

// Función auxiliar para formatear timestamps
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Ahora';
  if (diffInMinutes < 60) return `${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} horas`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} días`;
  
  return date.toLocaleDateString();
}; 