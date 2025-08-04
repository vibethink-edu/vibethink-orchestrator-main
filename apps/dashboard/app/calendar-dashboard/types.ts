/**
 * Calendar Application Types
 * 
 * TypeScript definitions for the Calendar system following VThink 1.0 patterns:
 * - Multi-tenant security with company_id
 * - Comprehensive event management types
 * - Integration with FullCalendar library types
 * - Strict type safety for all calendar operations
 */

import { EventInput, EventClickArg, DateClickArg } from '@fullcalendar/core';

// =============================================================================
// BASE TYPES
// =============================================================================

/**
 * Calendar Event Colors - Using HSL format for theme compatibility
 */
export type CalendarEventColor = 
  | 'blue' 
  | 'red' 
  | 'green' 
  | 'purple' 
  | 'orange' 
  | 'teal' 
  | 'indigo' 
  | 'pink' 
  | 'gray';

/**
 * Calendar View Types - Supported calendar display modes
 */
export type CalendarView = 
  | 'dayGridMonth' 
  | 'timeGridWeek' 
  | 'timeGridDay' 
  | 'listWeek'
  | 'listMonth';

/**
 * Event Priority Levels
 */
export type EventPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Event Status Types
 */
export type EventStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'postponed';

/**
 * Recurring Event Patterns
 */
export type RecurrencePattern = 
  | 'none'
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'yearly'
  | 'custom';

// =============================================================================
// MULTI-TENANT EVENT INTERFACE
// =============================================================================

/**
 * VibeThink Calendar Event - Extended with multi-tenant support
 * 
 * CRITICAL: ALL calendar events MUST include company_id for security
 */
export interface VThinkCalendarEvent extends Omit<EventInput, 'id'> {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  allDay?: boolean;
  
  // Multi-tenant security - REQUIRED
  company_id: string;
  
  // Extended event properties
  description?: string;
  location?: string;
  color?: CalendarEventColor;
  priority?: EventPriority;
  status?: EventStatus;
  
  // Recurrence support
  recurrence?: RecurrencePattern;
  recurrenceEnd?: string | Date;
  recurrenceCount?: number;
  
  // Attendees and collaboration
  attendees?: EventAttendee[];
  organizer_id?: string;
  
  // Meeting and resource management
  meeting_url?: string;
  meeting_room?: string;
  resources?: string[];
  
  // Reminders and notifications
  reminders?: EventReminder[];
  notifications_enabled?: boolean;
  
  // Metadata
  created_at?: string | Date;
  updated_at?: string | Date;
  created_by?: string;
  updated_by?: string;
  
  // Tags and categorization
  tags?: string[];
  category?: string;
  
  // Privacy and visibility
  is_private?: boolean;
  visibility?: 'public' | 'private' | 'team' | 'department';
}

/**
 * Event Attendee Information
 */
export interface EventAttendee {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
  is_organizer?: boolean;
  company_id: string; // Multi-tenant security
}

/**
 * Event Reminder Configuration
 */
export interface EventReminder {
  id: string;
  type: 'email' | 'notification' | 'sms';
  minutes_before: number;
  message?: string;
  is_active: boolean;
}

// =============================================================================
// CALENDAR CONFIGURATION
// =============================================================================

/**
 * Calendar Configuration for Multi-tenant Setup
 */
export interface CalendarConfig {
  company_id: string;
  default_view: CalendarView;
  working_hours: {
    start: string;
    end: string;
    days: number[]; // 0 = Sunday, 1 = Monday, etc.
  };
  time_zone: string;
  date_format: string;
  time_format: '12h' | '24h';
  first_day_of_week: number;
  
  // Feature toggles
  features: {
    drag_drop: boolean;
    event_creation: boolean;
    event_editing: boolean;
    event_deletion: boolean;
    recurring_events: boolean;
    attendee_management: boolean;
    resource_booking: boolean;
    reminders: boolean;
    integrations: boolean;
  };
  
  // Color scheme configuration
  colors: {
    primary: string;
    secondary: string;
    event_colors: Record<CalendarEventColor, string>;
  };
}

/**
 * Calendar State Management Interface
 */
export interface CalendarState {
  events: VThinkCalendarEvent[];
  selectedEvent: VThinkCalendarEvent | null;
  currentDate: Date;
  currentView: CalendarView;
  isLoading: boolean;
  error: string | null;
  
  // UI State
  isEventSheetOpen: boolean;
  isSidebarOpen: boolean;
  selectedCalendars: string[];
  
  // Filters
  filters: {
    status?: EventStatus[];
    priority?: EventPriority[];
    categories?: string[];
    attendees?: string[];
    date_range?: {
      start: Date;
      end: Date;
    };
  };
}

// =============================================================================
// HOOK INTERFACES
// =============================================================================

/**
 * Calendar Data Hook Return Type
 */
export interface UseCalendarDataReturn {
  events: VThinkCalendarEvent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  
  // CRUD operations with multi-tenant security
  createEvent: (event: Omit<VThinkCalendarEvent, 'id' | 'created_at' | 'updated_at'>) => Promise<VThinkCalendarEvent>;
  updateEvent: (id: string, updates: Partial<VThinkCalendarEvent>) => Promise<VThinkCalendarEvent>;
  deleteEvent: (id: string) => Promise<void>;
  
  // Bulk operations
  createMultipleEvents: (events: Omit<VThinkCalendarEvent, 'id' | 'created_at' | 'updated_at'>[]) => Promise<VThinkCalendarEvent[]>;
  deleteMultipleEvents: (ids: string[]) => Promise<void>;
}

/**
 * Calendar Filters Hook Return Type
 */
export interface UseCalendarFiltersReturn {
  filters: CalendarState['filters'];
  setStatusFilter: (status: EventStatus[]) => void;
  setPriorityFilter: (priority: EventPriority[]) => void;
  setCategoryFilter: (categories: string[]) => void;
  setAttendeeFilter: (attendees: string[]) => void;
  setDateRangeFilter: (start: Date, end: Date) => void;
  clearFilters: () => void;
  
  // Filtered data
  filteredEvents: VThinkCalendarEvent[];
}

// =============================================================================
// COMPONENT PROP INTERFACES
// =============================================================================

/**
 * Calendar App Component Props
 */
export interface CalendarAppProps {
  className?: string;
  initialView?: CalendarView;
  height?: string | number;
  onEventClick?: (event: VThinkCalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onEventDrop?: (event: VThinkCalendarEvent, newStart: Date, newEnd?: Date) => void;
  onEventResize?: (event: VThinkCalendarEvent, newStart: Date, newEnd: Date) => void;
}

/**
 * Calendar Sidebar Component Props
 */
export interface CalendarSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

/**
 * Event Sheet Component Props  
 */
export interface EventSheetProps {
  event?: VThinkCalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: VThinkCalendarEvent) => Promise<void>;
  onDelete?: (eventId: string) => Promise<void>;
  mode?: 'create' | 'edit' | 'view';
}

// =============================================================================
// API INTERFACES
// =============================================================================

/**
 * Calendar API Response Types
 */
export interface CalendarApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Calendar Events API Endpoints
 */
export interface CalendarApiEndpoints {
  getEvents: (companyId: string, filters?: Partial<CalendarState['filters']>) => Promise<CalendarApiResponse<VThinkCalendarEvent[]>>;
  getEvent: (companyId: string, eventId: string) => Promise<CalendarApiResponse<VThinkCalendarEvent>>;
  createEvent: (event: Omit<VThinkCalendarEvent, 'id' | 'created_at' | 'updated_at'>) => Promise<CalendarApiResponse<VThinkCalendarEvent>>;
  updateEvent: (companyId: string, eventId: string, updates: Partial<VThinkCalendarEvent>) => Promise<CalendarApiResponse<VThinkCalendarEvent>>;  
  deleteEvent: (companyId: string, eventId: string) => Promise<CalendarApiResponse<void>>;
}

// =============================================================================
// EXPORT ALL TYPES
// =============================================================================

export type {
  EventInput,
  EventClickArg,
  DateClickArg,
};