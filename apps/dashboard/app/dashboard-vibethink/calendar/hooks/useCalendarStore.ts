/**
 * Calendar Store - Global State Management
 * 
 * VThink 1.0 Implementation using Zustand for:
 * - Calendar UI state management
 * - Event selection and editing state
 * - Calendar view and filter state
 * - Real-time state synchronization
 * - Multi-tenant security compliance
 */

'use client';

import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { VibeThinkCalendarEvent, CalendarView, CalendarState } from '../types';

/**
 * Calendar Store Interface
 * 
 * Manages global calendar state including:
 * - Selected events and UI state
 * - Calendar view preferences
 * - Filter and search state
 * - Modal and sidebar visibility
 */
interface CalendarStore extends CalendarState {
  // Event Management Actions
  setSelectedEvent: (event: VibeThinkCalendarEvent | null) => void;
  
  // UI State Actions
  setEventSheetOpen: (isOpen: boolean) => void;
  setCurrentView: (view: CalendarView) => void;
  setCurrentDate: (date: Date) => void;
  
  // Loading and Error State
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filter Actions
  setSelectedCalendars: (calendars: string[]) => void;
  updateFilters: (filters: Partial<CalendarState['filters']>) => void;
  clearFilters: () => void;
  
  // Utility Actions
  resetState: () => void;
}

/**
 * Initial Calendar State
 */
const initialState: CalendarState = {
  events: [],
  selectedEvent: null,
  currentDate: new Date(),
  currentView: 'dayGridMonth',
  isLoading: false,
  error: null,
  
  // UI State
  isEventSheetOpen: false,
  isSidebarOpen: true,
  selectedCalendars: ['default'],
  
  // Filters
  filters: {
    status: undefined,
    priority: undefined,
    categories: undefined,
    attendees: undefined,
    date_range: undefined,
  },
};

/**
 * Calendar Store Implementation
 */
const calendarStoreCreator: StateCreator<
  CalendarStore,
  [['zustand/devtools', never], ['zustand/persist', Partial<CalendarStore>]],
  [],
  CalendarStore
> = (set, get) => ({
  ...initialState,

  // Event Management Actions
  setSelectedEvent: (event) => {
    set(
      (state) => ({
        ...state,
        selectedEvent: event,
      }),
      false,
      'setSelectedEvent'
    );
  },

  // UI State Actions
  setEventSheetOpen: (isOpen) => {
    set(
      (state) => ({
        ...state,
        isEventSheetOpen: isOpen,
        // Clear selected event immediately when closing (no timeout to avoid loops)
        selectedEvent: isOpen ? state.selectedEvent : null,
      }),
      false,
      'setEventSheetOpen'
    );
  },


  setCurrentView: (view) => {
    set(
      (state) => ({
        ...state,
        currentView: view,
      }),
      false,
      'setCurrentView'
    );
  },

  setCurrentDate: (date) => {
    set(
      (state) => ({
        ...state,
        currentDate: date,
      }),
      false,
      'setCurrentDate'
    );
  },

  // Loading and Error State
  setLoading: (isLoading) => {
    set(
      (state) => ({
        ...state,
        isLoading,
      }),
      false,
      'setLoading'
    );
  },

  setError: (error) => {
    set(
      (state) => ({
        ...state,
        error,
      }),
      false,
      'setError'
    );
  },

  // Filter Actions
  setSelectedCalendars: (calendars) => {
    set(
      (state) => ({
        ...state,
        selectedCalendars: calendars,
      }),
      false,
      'setSelectedCalendars'
    );
  },

  updateFilters: (newFilters) => {
    set(
      (state) => ({
        ...state,
        filters: {
          ...state.filters,
          ...newFilters,
        },
      }),
      false,
      'updateFilters'
    );
  },

  clearFilters: () => {
    set(
      (state) => ({
        ...state,
        filters: initialState.filters,
      }),
      false,
      'clearFilters'
    );
  },

  // Utility Actions
  resetState: () => {
    set(
      () => ({
        ...initialState,
        // Preserve some user preferences
        currentView: get().currentView,
      }),
      false,
      'resetState'
    );
  },
});

/**
 * Calendar Store - TEMPORARILY DISABLED PERSISTENCE
 *
 * NOTE: Persistence disabled to fix hydration error in Server Components
 * TODO: Re-enable persistence with proper client-side wrapper
 */
export const useCalendarStore = create<CalendarStore>()(
  devtools(calendarStoreCreator, {
    name: 'CalendarStore',
    enabled: process.env.NODE_ENV === 'development',
  })
);

/**
 * Calendar Store Selectors
 * 
 * Optimized selectors for specific pieces of state
 */

// UI State Selectors - direct access to avoid selector issues
export const useCalendarUIState = () => {
  const isEventSheetOpen = useCalendarStore((state) => state.isEventSheetOpen);
  const isLoading = useCalendarStore((state) => state.isLoading);
  const error = useCalendarStore((state) => state.error);

  return { isEventSheetOpen, isLoading, error };
};

// Event State Selectors - direct access to avoid selector issues
export const useCalendarEventState = () => {
  const selectedEvent = useCalendarStore((state) => state.selectedEvent);
  const events = useCalendarStore((state) => state.events);

  return { selectedEvent, events };
};

// View State Selectors - direct access to avoid selector issues
export const useCalendarViewState = () => {
  const currentView = useCalendarStore((state) => state.currentView);
  const currentDate = useCalendarStore((state) => state.currentDate);

  return { currentView, currentDate };
};

// Filter State Selectors - direct access to avoid selector issues
export const useCalendarFilterState = () => {
  const filters = useCalendarStore((state) => state.filters);
  const selectedCalendars = useCalendarStore((state) => state.selectedCalendars);

  return { filters, selectedCalendars };
};

/**
 * Calendar Actions Hook - direct access to avoid selector issues
 *
 * Provides all calendar actions in a single hook for convenience
 */
export const useCalendarActions = () => {
  const setSelectedEvent = useCalendarStore((state) => state.setSelectedEvent);
  const setEventSheetOpen = useCalendarStore((state) => state.setEventSheetOpen);
  const setCurrentView = useCalendarStore((state) => state.setCurrentView);
  const setCurrentDate = useCalendarStore((state) => state.setCurrentDate);
  const setLoading = useCalendarStore((state) => state.setLoading);
  const setError = useCalendarStore((state) => state.setError);
  const setSelectedCalendars = useCalendarStore((state) => state.setSelectedCalendars);
  const updateFilters = useCalendarStore((state) => state.updateFilters);
  const clearFilters = useCalendarStore((state) => state.clearFilters);
  const resetState = useCalendarStore((state) => state.resetState);

  return {
    setSelectedEvent,
    setEventSheetOpen,
    setCurrentView,
    setCurrentDate,
    setLoading,
    setError,
    setSelectedCalendars,
    updateFilters,
    clearFilters,
    resetState,
  };
};