/**
 * Calendar Hooks - Export Index
 * 
 * VThink 1.0 Hook exports for the Calendar Application
 * Provides clean imports for all calendar-related hooks and state management
 */

// Data Management Hooks
export { useCalendarData } from './useCalendarData';

// State Management Hooks
export { 
  useCalendarStore,
  useCalendarUIState,
  useCalendarEventState,
  useCalendarViewState,
  useCalendarFilterState,
  useCalendarActions,
} from './useCalendarStore';

// Future hooks to be added:
// export { useCalendarFilters } from './useCalendarFilters';
// export { useCalendarSync } from './useCalendarSync';
// export { useEventRecurrence } from './useEventRecurrence';
// export { useAttendeeManagement } from './useAttendeeManagement';
// export { useCalendarNotifications } from './useCalendarNotifications';
// export { useCalendarExport } from './useCalendarExport';