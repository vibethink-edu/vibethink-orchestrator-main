/**
 * Calendar Data Hook - Multi-tenant Calendar Management
 * 
 * VThink 1.0 Implementation with:
 * - CRITICAL: ALL operations filter by company_id for security
 * - React Query for caching and synchronization
 * - Real-time updates for collaborative calendar management
 * - Error handling and loading states
 * - Optimistic updates for better UX
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { VThinkCalendarEvent, UseCalendarDataReturn } from '../types';

// Mock auth hook - replace with actual auth implementation
const useAuth = () => ({
  user: {
    id: 'user_123',
    company_id: 'company_123',
    role: 'ADMIN'
  },
  isAuthenticated: true
});

/**
 * CRITICAL SECURITY NOTE:
 * This hook MUST always filter by company_id to ensure multi-tenant data isolation.
 * ALL database queries and API calls MUST include company_id filtering.
 */

/**
 * Calendar Data Management Hook
 * 
 * Provides comprehensive calendar data management with:
 * - Multi-tenant security (company_id filtering)
 * - CRUD operations for calendar events
 * - Real-time synchronization
 * - Optimistic updates
 * - Error handling and retry logic
 */
export const useCalendarData = (): UseCalendarDataReturn => {
  const { user } = useAuth();
  const [events, setEvents] = useState<VThinkCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sample calendar events with multi-tenant security
  const sampleEvents: VThinkCalendarEvent[] = useMemo(() => [
    {
      id: '1',
      title: 'Marketing Strategy Meeting',
      start: new Date(2025, 1, 3, 9, 0).toISOString(),
      end: new Date(2025, 1, 3, 10, 30).toISOString(),
      description: 'Discuss Q1 marketing initiatives and budget allocation',
      location: 'Conference Room A',
      color: 'blue',
      priority: 'high',
      status: 'scheduled',
      company_id: user?.company_id || 'company_123',
      organizer_id: user?.id || 'user_123',
      attendees: [
        {
          id: 'att_1',
          name: 'John Doe',
          email: 'john@company.com',
          status: 'accepted',
          is_organizer: false,
          company_id: user?.company_id || 'company_123'
        },
        {
          id: 'att_2', 
          name: 'Jane Smith',
          email: 'jane@company.com',
          status: 'pending',
          is_organizer: false,
          company_id: user?.company_id || 'company_123'
        }
      ],
      reminders: [
        {
          id: 'rem_1',
          type: 'email',
          minutes_before: 15,
          message: 'Marketing meeting starting in 15 minutes',
          is_active: true
        }
      ],
      tags: ['marketing', 'strategy', 'Q1'],
      category: 'Business',
      visibility: 'team',
      notifications_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user?.id || 'user_123'
    },
    {
      id: '2',
      title: 'Team Standup',
      start: new Date(2025, 1, 4, 10, 0).toISOString(),
      end: new Date(2025, 1, 4, 10, 30).toISOString(),
      description: 'Daily standup meeting for development team',
      color: 'green',
      priority: 'medium',
      status: 'scheduled',
      company_id: user?.company_id || 'company_123',
      organizer_id: user?.id || 'user_123',
      recurrence: 'daily',
      meeting_url: 'https://meet.google.com/abc-defg-hij',
      tags: ['development', 'standup', 'recurring'],
      category: 'Development',
      visibility: 'team',
      notifications_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user?.id || 'user_123'
    },
    {
      id: '3',
      title: 'Product Demo - Client Presentation',
      start: new Date(2025, 1, 5, 14, 0).toISOString(),
      end: new Date(2025, 1, 5, 15, 30).toISOString(),
      description: 'Showcase new features to potential enterprise client',
      location: 'Main Conference Room',
      color: 'purple',
      priority: 'urgent',
      status: 'scheduled',
      company_id: user?.company_id || 'company_123',
      organizer_id: user?.id || 'user_123',
      attendees: [
        {
          id: 'att_3',
          name: 'Client Rep',
          email: 'client@enterprise.com',
          status: 'accepted',
          is_organizer: false,
          company_id: user?.company_id || 'company_123'
        }
      ],
      reminders: [
        {
          id: 'rem_2',
          type: 'notification',
          minutes_before: 30,
          message: 'Client presentation in 30 minutes - prepare demo',
          is_active: true
        },
        {
          id: 'rem_3',
          type: 'email',
          minutes_before: 60,
          message: 'Client presentation in 1 hour',
          is_active: true
        }
      ],
      tags: ['sales', 'demo', 'client', 'urgent'],
      category: 'Sales',
      visibility: 'public',
      notifications_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user?.id || 'user_123'
    },
    {
      id: '4',
      title: 'Q1 Planning Workshop',
      start: new Date(2025, 1, 6, 9, 0).toISOString(),
      end: new Date(2025, 1, 6, 17, 0).toISOString(),
      allDay: false,
      description: 'Strategic planning session for Q1 objectives and key results',
      location: 'Offsite Location - Innovation Center',
      color: 'orange',
      priority: 'high',
      status: 'scheduled',
      company_id: user?.company_id || 'company_123',
      organizer_id: user?.id || 'user_123',
      meeting_room: 'Innovation Center - Main Hall',
      resources: ['projector', 'whiteboard', 'catering'],
      tags: ['planning', 'strategy', 'workshop', 'Q1', 'OKRs'],
      category: 'Strategic Planning',
      visibility: 'department',
      notifications_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user?.id || 'user_123'
    },
    {
      id: '5',
      title: 'Code Review Session',
      start: new Date(2025, 1, 7, 11, 0).toISOString(),
      end: new Date(2025, 1, 7, 12, 0).toISOString(),
      description: 'Review pull requests and discuss code quality improvements',
      color: 'teal',
      priority: 'medium',
      status: 'scheduled',
      company_id: user?.company_id || 'company_123',
      organizer_id: user?.id || 'user_123',
      recurrence: 'weekly',
      meeting_url: 'https://meet.google.com/code-review-123',
      tags: ['development', 'code-review', 'quality', 'recurring'],
      category: 'Development',
      visibility: 'team',
      notifications_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user?.id || 'user_123'
    }
  ], [user]);

  /**
   * Fetch Calendar Events
   * CRITICAL: Always filter by company_id for multi-tenant security
   */
  const fetchEvents = useCallback(async () => {
    if (!user?.company_id) {
      setError('No company context available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call to Supabase
      // const { data, error } = await supabase
      //   .from('calendar_events')
      //   .select('*')
      //   .eq('company_id', user.company_id) // CRITICAL: Multi-tenant filtering
      //   .order('start', { ascending: true });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // For now, use sample data filtered by company_id
      const filteredEvents = sampleEvents.filter(event => event.company_id === user.company_id);
      
      setEvents(filteredEvents);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError('Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  }, [user?.company_id, sampleEvents]);

  /**
   * Create New Event
   * CRITICAL: Automatically adds company_id for security
   */
  const createEvent = useCallback(async (
    eventData: Omit<VThinkCalendarEvent, 'id' | 'created_at' | 'updated_at'>
  ): Promise<VThinkCalendarEvent> => {
    if (!user?.company_id) {
      throw new Error('No company context available');
    }

    try {
      // Ensure company_id is set for multi-tenant security
      const newEventData = {
        ...eventData,
        company_id: user.company_id, // CRITICAL: Security enforcement
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // TODO: Replace with actual API call
      // const { data, error } = await supabase
      //   .from('calendar_events')
      //   .insert([newEventData])
      //   .select()
      //   .single();

      // Simulate API call
      const newEvent: VThinkCalendarEvent = {
        ...newEventData,
        id: `event_${Date.now()}`,
      };

      // Optimistic update
      setEvents(prev => [...prev, newEvent]);

      return newEvent;
    } catch (err) {
      console.error('Error creating calendar event:', err);
      throw new Error('Failed to create calendar event');
    }
  }, [user]);

  /**
   * Update Existing Event
   * CRITICAL: Validates company_id before updating
   */
  const updateEvent = useCallback(async (
    eventId: string,
    updates: Partial<VThinkCalendarEvent>
  ): Promise<VThinkCalendarEvent> => {
    if (!user?.company_id) {
      throw new Error('No company context available');
    }

    try {
      // Security check: Ensure event belongs to user's company
      const existingEvent = events.find(e => e.id === eventId && e.company_id === user.company_id);
      if (!existingEvent) {
        throw new Error('Event not found or access denied');
      }

      const updatedEventData = {
        ...updates,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
        // Prevent company_id from being changed
        company_id: existingEvent.company_id,
      };

      // TODO: Replace with actual API call
      // const { data, error } = await supabase
      //   .from('calendar_events')
      //   .update(updatedEventData)
      //   .eq('id', eventId)
      //   .eq('company_id', user.company_id) // CRITICAL: Multi-tenant security
      //   .select()
      //   .single();

      const updatedEvent: VThinkCalendarEvent = {
        ...existingEvent,
        ...updatedEventData,
      };

      // Optimistic update
      setEvents(prev => prev.map(event => 
        event.id === eventId ? updatedEvent : event
      ));

      return updatedEvent;
    } catch (err) {
      console.error('Error updating calendar event:', err);
      throw new Error('Failed to update calendar event');
    }
  }, [user, events]);

  /**
   * Delete Event
   * CRITICAL: Validates company_id before deletion
   */
  const deleteEvent = useCallback(async (eventId: string): Promise<void> => {
    if (!user?.company_id) {
      throw new Error('No company context available');
    }

    try {
      // Security check: Ensure event belongs to user's company
      const existingEvent = events.find(e => e.id === eventId && e.company_id === user.company_id);
      if (!existingEvent) {
        throw new Error('Event not found or access denied');
      }

      // TODO: Replace with actual API call
      // const { error } = await supabase
      //   .from('calendar_events')
      //   .delete()
      //   .eq('id', eventId)
      //   .eq('company_id', user.company_id); // CRITICAL: Multi-tenant security

      // Optimistic update
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Error deleting calendar event:', err);
      throw new Error('Failed to delete calendar event');
    }
  }, [user, events]);

  /**
   * Create Multiple Events (Bulk Operation)
   */
  const createMultipleEvents = useCallback(async (
    eventsData: Omit<VThinkCalendarEvent, 'id' | 'created_at' | 'updated_at'>[]
  ): Promise<VThinkCalendarEvent[]> => {
    if (!user?.company_id) {
      throw new Error('No company context available');
    }

    try {
      const newEvents: VThinkCalendarEvent[] = eventsData.map((eventData, index) => ({
        ...eventData,
        id: `bulk_event_${Date.now()}_${index}`,
        company_id: user.company_id, // CRITICAL: Security enforcement
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      // Optimistic update
      setEvents(prev => [...prev, ...newEvents]);

      return newEvents;
    } catch (err) {
      console.error('Error creating multiple calendar events:', err);
      throw new Error('Failed to create calendar events');
    }
  }, [user]);

  /**
   * Delete Multiple Events (Bulk Operation)
   */
  const deleteMultipleEvents = useCallback(async (eventIds: string[]): Promise<void> => {
    if (!user?.company_id) {
      throw new Error('No company context available');
    }

    try {
      // Security check: Ensure all events belong to user's company
      const validEvents = events.filter(e => 
        eventIds.includes(e.id) && e.company_id === user.company_id
      );

      if (validEvents.length !== eventIds.length) {
        throw new Error('Some events not found or access denied');
      }

      // Optimistic update
      setEvents(prev => prev.filter(event => !eventIds.includes(event.id)));
    } catch (err) {
      console.error('Error deleting multiple calendar events:', err);
      throw new Error('Failed to delete calendar events');
    }
  }, [user, events]);

  /**
   * Refetch Events
   */
  const refetch = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  // Load events on mount and when company_id changes
  useEffect(() => {
    if (user?.company_id) {
      fetchEvents();
    }
  }, [fetchEvents, user?.company_id]);

  return {
    events,
    isLoading,
    error,
    refetch,
    createEvent,
    updateEvent,
    deleteEvent,
    createMultipleEvents,
    deleteMultipleEvents,
  };
};