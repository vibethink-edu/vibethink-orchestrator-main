/**
 * Calendar Header - Calendar Controls and Quick Actions
 * 
 * VThink 1.0 Implementation moving sidebar functionality to main content area:
 * - Quick event creation and controls
 * - Calendar categories with visibility toggles
 * - Upcoming events preview
 * - Search and filter capabilities
 * - Follows DashboardLayout pattern (no sidebar)
 */

'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Users,
  MapPin,
  Search,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Settings,
} from 'lucide-react';

import { Button } from '../../../../../src/shared/components/bundui-premium/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../src/shared/components/bundui-premium/components/ui/card';
import { Input } from '../../../../../src/shared/components/bundui-premium/components/ui/input';
import { Badge } from '../../../../../src/shared/components/bundui-premium/components/ui/badge';
import { Checkbox } from '../../../../../src/shared/components/bundui-premium/components/ui/checkbox';
import { ScrollArea } from '../../../../../src/shared/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../../../src/shared/components/bundui-premium/components/ui/collapsible';

import { VibeThinkCalendarEvent, CalendarEventColor } from '../types';

interface CalendarCategory {
  id: string;
  name: string;
  color: CalendarEventColor;
  visible: boolean;
}

interface CalendarHeaderProps {
  totalEvents: number;
  upcomingEvents: VibeThinkCalendarEvent[];
  calendarCategories: CalendarCategory[];
  onCreateEvent: () => void;
  onEventSelect: (event: VibeThinkCalendarEvent) => void;
}

/**
 * Calendar Header Component
 * 
 * Provides comprehensive calendar header functionality:
 * - Title and quick actions
 * - Event search and quick create
 * - Calendar categories with visibility toggles
 * - Upcoming events preview
 * - Statistics and overview
 */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  totalEvents,
  upcomingEvents,
  calendarCategories,
  onCreateEvent,
  onEventSelect,
}) => {
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [showControls, setShowControls] = useState(false);
  const [calendarsExpanded, setCalendarsExpanded] = useState(false);
  const [upcomingExpanded, setUpcomingExpanded] = useState(true);

  /**
   * Filter events based on search query
   */
  const filteredEvents = useMemo(() => {
    if (!searchQuery) return upcomingEvents;
    
    return upcomingEvents.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [upcomingEvents, searchQuery]);

  /**
   * Format event time for display
   */
  const formatEventTime = (event: VibeThinkCalendarEvent) => {
    const start = new Date(event.start);
    const end = event.end ? new Date(event.end) : null;
    
    if (event.allDay) {
      return 'All day';
    }
    
    const startTime = start.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    if (end) {
      const endTime = end.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      return `${startTime} - ${endTime}`;
    }
    
    return startTime;
  };

  /**
   * Format event date for display
   */
  const formatEventDate = (event: VibeThinkCalendarEvent) => {
    const date = new Date(event.start);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  /**
   * Get color class for event color
   */
  const getColorClass = (color: CalendarEventColor) => {
    const colorMap = {
      blue: 'bg-blue-500',
      red: 'bg-red-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      teal: 'bg-teal-500',
      indigo: 'bg-indigo-500',
      pink: 'bg-pink-500',
      gray: 'bg-gray-500',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              {totalEvents} events
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {upcomingEvents.length} upcoming
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowControls(!showControls)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Controls</span>
          </Button>

          <Button
            onClick={onCreateEvent}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </div>
      </div>

      {/* Search and Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 md:col-span-2">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{upcomingEvents.length}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{calendarCategories.filter(c => c.visible).length}</p>
                <p className="text-xs text-muted-foreground">Active Calendars</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Expanded Controls */}
      {showControls && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Calendar Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Calendar Categories */}
              <Collapsible open={calendarsExpanded} onOpenChange={setCalendarsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>My Calendars ({calendarCategories.length})</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${calendarsExpanded ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <Card className="p-3">
                    <div className="space-y-3">
                      {calendarCategories.map((calendar) => (
                        <div
                          key={calendar.id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={calendar.id}
                            checked={calendar.visible}
                            className="h-4 w-4"
                          />
                          <div
                            className={`w-3 h-3 rounded-full ${getColorClass(calendar.color)}`}
                          />
                          <label
                            htmlFor={calendar.id}
                            className="text-sm font-medium cursor-pointer flex-1"
                          >
                            {calendar.name}
                          </label>
                          {calendar.visible ? (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Upcoming Events */}
              <Collapsible open={upcomingExpanded} onOpenChange={setUpcomingExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Upcoming Events</span>
                      <Badge variant="secondary" className="text-xs">
                        {filteredEvents.length}
                      </Badge>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${upcomingExpanded ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <Card className="p-3">
                    <ScrollArea className="h-48">
                      {filteredEvents.length === 0 ? (
                        <div className="text-center py-8">
                          <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {searchQuery ? 'No events found' : 'No upcoming events'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredEvents.map((event) => (
                            <div
                              key={event.id}
                              className="p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                              onClick={() => onEventSelect(event)}
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`w-3 h-3 rounded-full mt-1 ${getColorClass(event.color || 'blue')}`}
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium truncate">
                                    {event.title}
                                  </h4>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {formatEventDate(event)}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {formatEventTime(event)}
                                    </span>
                                  </div>
                                  {event.location && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <MapPin className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground truncate">
                                        {event.location}
                                      </span>
                                    </div>
                                  )}
                                  {event.attendees && event.attendees.length > 0 && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <Users className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">
                                        {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};