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
import { VThinkCalendarEvent, CalendarView, CalendarState } from '../types';

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
  setSelectedEvent: (event: VThinkCalendarEvent | null) => void;
  
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
      (state) => {
        // Auto-clear selected event when closing sheet
        const updates: Partial<CalendarStore> = {
          isEventSheetOpen: isOpen,
        };
        
        if (!isOpen) {
          // Clear selected event after a delay to allow for animations
          setTimeout(() => {
            set(
              (currentState) => ({
                ...currentState,
                selectedEvent: null,
              }),
              false,
              'clearSelectedEvent'
            );
          }, 300);
        }
        
        return {
          ...state,
          ...updates,
        };
      },
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
 * Calendar Store with Persistence
 * 
 * Persists user preferences like:
 * - Calendar view preference
 * - Sidebar visibility
 * - Selected calendars
 * - Filter preferences (but not active filters)
 */
export const useCalendarStore = create<CalendarStore>()(
  devtools(
    persist(
      calendarStoreCreator,
      {
        name: 'vibethink-calendar-store',
        partialize: (state) => ({
          // Only persist user preferences, not transient state
          currentView: state.currentView,
          selectedCalendars: state.selectedCalendars,
        }),
        version: 1,
      }
    ),
    {
      name: 'CalendarStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

/**
 * Calendar Store Selectors
 * 
 * Optimized selectors for specific pieces of state
 */

// UI State Selectors
export const useCalendarUIState = () => 
  useCalendarStore((state) => ({
    isEventSheetOpen: state.isEventSheetOpen,
    isLoading: state.isLoading,
    error: state.error,
  }));

// Event State Selectors
export const useCalendarEventState = () =>
  useCalendarStore((state) => ({
    selectedEvent: state.selectedEvent,
    events: state.events,
  }));

// View State Selectors with proper caching
const viewStateSelector = (state: CalendarStore) => ({
  currentView: state.currentView,
  currentDate: state.currentDate,
});

export const useCalendarViewState = () =>
  useCalendarStore(viewStateSelector);

// Filter State Selectors with proper caching
const filterStateSelector = (state: CalendarStore) => ({
  filters: state.filters,
  selectedCalendars: state.selectedCalendars,
});

export const useCalendarFilterState = () =>
  useCalendarStore(filterStateSelector);

/**
 * Calendar Actions Hook with proper caching
 * 
 * Provides all calendar actions in a single hook for convenience
 */
const calendarActionsSelector = (state: CalendarStore) => ({
  setSelectedEvent: state.setSelectedEvent,
  setEventSheetOpen: state.setEventSheetOpen,
  setCurrentView: state.setCurrentView,
  setCurrentDate: state.setCurrentDate,
  setLoading: state.setLoading,
  setError: state.setError,
  setSelectedCalendars: state.setSelectedCalendars,
  updateFilters: state.updateFilters,
  clearFilters: state.clearFilters,  
  resetState: state.resetState,
});

export const useCalendarActions = () =>
  useCalendarStore(calendarActionsSelector);