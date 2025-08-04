/**
 * Calendar App - Main Calendar Interface
 * 
 * VThink 1.0 Implementation following DashboardLayout pattern:
 * - NO app-specific sidebar - follows CRM/Kanban pattern
 * - Calendar controls and quick actions in main content area
 * - FullCalendar integration with multi-view support
 * - Multi-tenant security with company_id filtering
 * - Drag & drop event management
 * - Real-time event synchronization
 * - Responsive design for all device sizes
 * - HSL color theming with shadcn/ui compatibility
 */

'use client';

import React, { useRef, useCallback, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, {
  DateClickArg,
  EventDragStopArg,
  EventResizeStopArg
} from '@fullcalendar/interaction';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import { toast } from 'sonner';

import { useCalendarData } from '../hooks/useCalendarData';
import { useCalendarStore, useCalendarActions, useCalendarViewState } from '../hooks/useCalendarStore';
import { VThinkCalendarEvent, CalendarEventColor } from '../types';
import CalendarToolbar from './CalendarToolbar';
import { CalendarHeader } from './CalendarHeader';
import { Card, CardContent } from '../../../../../src/shared/components/bundui-premium/components/ui/card';
import { Skeleton } from '../../../../../src/shared/components/bundui-premium/components/ui/skeleton';
import { Alert, AlertDescription } from '../../../../../src/shared/components/bundui-premium/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

/**
 * Event Color Mapping - Using HSL format for theme compatibility
 * Following VThink DOI principle for shadcn/ui compatibility
 */
const eventColorClasses: Record<CalendarEventColor, string> = {
  blue: 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600',
  red: 'bg-red-500 border-red-600 text-white hover:bg-red-600',
  green: 'bg-green-500 border-green-600 text-white hover:bg-green-600',
  purple: 'bg-purple-500 border-purple-600 text-white hover:bg-purple-600',
  orange: 'bg-orange-500 border-orange-600 text-white hover:bg-orange-600',
  teal: 'bg-teal-500 border-teal-600 text-white hover:bg-teal-600',
  indigo: 'bg-indigo-500 border-indigo-600 text-white hover:bg-indigo-600',
  pink: 'bg-pink-500 border-pink-600 text-white hover:bg-pink-600',
  gray: 'bg-gray-500 border-gray-600 text-white hover:bg-gray-600',
};

/**
 * Calendar Categories Configuration
 */
const calendarCategories = [
  { id: 'personal', name: 'Personal', color: 'blue' as CalendarEventColor, visible: true },
  { id: 'work', name: 'Work', color: 'green' as CalendarEventColor, visible: true },
  { id: 'meetings', name: 'Meetings', color: 'purple' as CalendarEventColor, visible: true },
  { id: 'deadlines', name: 'Deadlines', color: 'red' as CalendarEventColor, visible: true },
  { id: 'events', name: 'Events', color: 'orange' as CalendarEventColor, visible: true },
  { id: 'holidays', name: 'Holidays', color: 'teal' as CalendarEventColor, visible: false },
];

/**
 * Calendar App Component
 * 
 * Main calendar interface providing:
 * - Multiple calendar views (Month, Week, Day, List)
 * - Interactive event management
 * - Drag & drop functionality
 * - Real-time event updates
 * - Multi-tenant security
 * - Calendar controls in header (no sidebar)
 */
const CalendarApp: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  
  // Calendar data and state management
  const { events, isLoading, error, updateEvent } = useCalendarData();
  const { currentView, currentDate } = useCalendarViewState();
  const { setSelectedEvent, setEventSheetOpen, setCurrentDate } = useCalendarActions();

  // Get upcoming events for header display
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= now && eventDate <= nextWeek && event.status === 'scheduled';
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5); // Show only next 5 events
  }, [events]);

  /**
   * Format events for FullCalendar
   * Applies color styling and ensures proper data structure
   */
  const formattedEvents: EventInput[] = useMemo(() => {
    return events.map((event: VThinkCalendarEvent) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay || false,
      classNames: [
        eventColorClasses[event.color || 'blue'],
        'rounded-md',
        'px-2',
        'py-1',
        'text-xs',
        'font-medium',
        'transition-colors',
        'duration-200',
        'cursor-pointer',
        'shadow-sm',
        'border',
        'border-l-4',
        // Priority indicators
        event.priority === 'urgent' ? 'ring-2 ring-red-400' : '',
        event.priority === 'high' ? 'ring-1 ring-orange-300' : '',
        // Status indicators
        event.status === 'completed' ? 'opacity-60' : '',
        event.status === 'cancelled' ? 'opacity-40 line-through' : '',
      ].filter(Boolean).join(' '),
      // Pass additional data for event handling
      extendedProps: {
        description: event.description,
        location: event.location,
        priority: event.priority,
        status: event.status,
        attendees: event.attendees,
        company_id: event.company_id, // Maintain multi-tenant context
      },
    }));
  }, [events]);

  /**
   * Handle Date Click - Create new event
   */
  const handleDateClick = useCallback((arg: DateClickArg) => {
    // Create a new event template with the clicked date
    const newEventTemplate: Partial<VThinkCalendarEvent> = {
      title: 'New Event',
      start: arg.date.toISOString(),
      end: new Date(arg.date.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
      allDay: arg.allDay,
      color: 'blue',
      priority: 'medium',
      status: 'scheduled',
      description: '',
      location: '',
    };

    setSelectedEvent(newEventTemplate as VThinkCalendarEvent);
    setEventSheetOpen(true);
  }, [setSelectedEvent, setEventSheetOpen]);

  /**
   * Handle Event Click - Edit existing event
   */
  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const eventId = clickInfo.event.id;
    const event = events.find((e) => e.id === eventId);
    
    if (event) {
      setSelectedEvent(event);
      setEventSheetOpen(true);
    } else {
      toast.error('Event not found');
    }
  }, [events, setSelectedEvent, setEventSheetOpen]);

  /**
   * Handle Event Drag & Drop
   */
  const handleEventDrop = useCallback(async (dropInfo: EventDragStopArg) => {
    const eventId = dropInfo.event.id;
    const event = events.find((e) => e.id === eventId);
    
    if (!event) {
      toast.error('Event not found');
      dropInfo.revert();
      return;
    }

    try {
      const updatedEvent = {
        ...event,
        start: dropInfo.event.start?.toISOString() || event.start,
        end: dropInfo.event.end?.toISOString() || event.end,
      };

      await updateEvent(eventId, updatedEvent);
      toast.success('Event moved successfully');
    } catch (error) {
      console.error('Error moving event:', error);
      toast.error('Failed to move event');
      dropInfo.revert();
    }
  }, [events, updateEvent]);

  /**
   * Handle Event Resize
   */
  const handleEventResize = useCallback(async (resizeInfo: EventResizeStopArg) => {
    const eventId = resizeInfo.event.id;
    const event = events.find((e) => e.id === eventId);
    
    if (!event) {
      toast.error('Event not found');
      resizeInfo.revert();
      return;
    }

    try {
      const updatedEvent = {
        ...event,
        start: resizeInfo.event.start?.toISOString() || event.start,
        end: resizeInfo.event.end?.toISOString() || event.end,
      };

      await updateEvent(eventId, updatedEvent);
      toast.success('Event duration updated');
    } catch (error) {
      console.error('Error resizing event:', error);
      toast.error('Failed to update event duration');
      resizeInfo.revert();
    }
  }, [events, updateEvent]);

  /**
   * Handle Date Navigation
   */
  const handleDatesSet = useCallback((dateInfo: any) => {
    setCurrentDate(dateInfo.start);
  }, [setCurrentDate]);

  /**
   * Handle Create New Event
   */
  const handleCreateEvent = useCallback(() => {
    const newEventTemplate = {
      id: `temp_${Date.now()}`,
      title: 'New Event',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      color: 'blue' as CalendarEventColor,
      priority: 'medium' as const,
      status: 'scheduled' as const,
      company_id: 'company_123', // This should come from auth context
    };

    setSelectedEvent(newEventTemplate as any);
    setEventSheetOpen(true);
  }, [setSelectedEvent, setEventSheetOpen]);

  /**
   * Handle Event Selection from Header
   */
  const handleEventSelect = useCallback((event: VThinkCalendarEvent) => {
    setSelectedEvent(event);
    setEventSheetOpen(true);
  }, [setSelectedEvent, setEventSheetOpen]);

  /**
   * Loading State
   */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Card className="h-[600px]">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * Error State
   */
  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Manage your events and schedule</p>
        </div>
        <Card className="h-[400px]">
          <CardContent className="p-6 flex items-center justify-center">
            <Alert variant="destructive" className="max-w-md">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * Main Calendar Render
   */
  return (
    <div className="space-y-6">
      {/* Calendar Header with controls and upcoming events */}
      <CalendarHeader
        totalEvents={events.length}
        upcomingEvents={upcomingEvents}
        calendarCategories={calendarCategories}
        onCreateEvent={handleCreateEvent}
        onEventSelect={handleEventSelect}
      />

      {/* Main Calendar View */}
      <Card className="h-[700px] flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Calendar Toolbar */}
          <div className="p-4 border-b bg-muted/30">
            <CalendarToolbar calendarRef={calendarRef} />
          </div>

          {/* FullCalendar Component */}
          <div className="flex-1 p-4">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView={currentView}
              initialDate={currentDate}
              headerToolbar={false} // We use custom toolbar
              height="100%"
              
              // Event data
              events={formattedEvents}
              
              // Interaction settings
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              
              // Event handlers
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}
              eventResize={handleEventResize}
              datesSet={handleDatesSet}
              
              // Drag & drop settings
              eventStartEditable={true}
              eventDurationEditable={true}
              eventResizableFromStart={true}
              
              // Display settings
              nowIndicator={true}
              scrollTime="08:00:00"
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={true}
              
              // Week settings
              firstDay={1} // Start week on Monday
              weekNumbers={false}
              
              // Responsive settings
              aspectRatio={1.35}
              contentHeight="auto"
              
              // Styling
              themeSystem="standard"
              eventClassNames="fc-event-vibethink"
              
              // Localization
              locale="en"
              timeZone="local"
              
              // Business hours (optional)
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
                startTime: '09:00',
                endTime: '18:00',
              }}
              
              // View-specific settings
              views={{
                dayGridMonth: {
                  fixedWeekCount: false,
                },
                timeGridWeek: {
                  slotDuration: '00:30:00',
                  snapDuration: '00:15:00',
                },
                timeGridDay: {
                  slotDuration: '00:30:00',
                  snapDuration: '00:15:00',
                },
                listWeek: {
                  listDayFormat: { weekday: 'long' },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarApp;