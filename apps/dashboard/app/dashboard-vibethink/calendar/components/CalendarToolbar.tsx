/**
 * Calendar Toolbar - Navigation and View Controls
 * 
 * VThink 1.0 Implementation providing:
 * - Calendar navigation (previous, next, today)
 * - View switching (Month, Week, Day, List)
 * - Date display and quick navigation
 * - Responsive design for mobile and desktop
 * - Integration with calendar state management
 */

'use client';

import React, { useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Search,
  Settings,
  Download,
  Printer,
} from 'lucide-react';

import { Button } from '@vibethink/ui';
import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, } from '@vibethink/ui';
import { Input } from '@vibethink/ui';
import { DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger, } from '@vibethink/ui';
import { Badge } from '@vibethink/ui';

import { useCalendarActions, useCalendarViewState } from '../hooks/useCalendarStore';
import { CalendarView } from '../types';

interface CalendarToolbarProps {
  calendarRef: React.RefObject<FullCalendar>;
  className?: string;
}

/**
 * Calendar View Options
 */
const calendarViews: Array<{ value: CalendarView; label: string; shortLabel: string }> = [
  { value: 'dayGridMonth', label: 'Month View', shortLabel: 'Month' },
  { value: 'timeGridWeek', label: 'Week View', shortLabel: 'Week' },
  { value: 'timeGridDay', label: 'Day View', shortLabel: 'Day' },
  { value: 'listWeek', label: 'Agenda View', shortLabel: 'Agenda' },
];

/**
 * Calendar Toolbar Component
 * 
 * Provides comprehensive calendar navigation and control options:
 * - Date navigation with previous/next/today buttons
 * - View switching between Month, Week, Day, and List views
 * - Quick event creation
 * - Search and filter capabilities
 * - Export and print options
 * - Responsive design for all screen sizes
 */
const CalendarToolbar: React.FC<CalendarToolbarProps> = ({ 
  calendarRef,
  className = '',
}) => {
  const { currentView, currentDate } = useCalendarViewState();
  const { setCurrentView, setCurrentDate, setEventSheetOpen, setSelectedEvent } = useCalendarActions();

  /**
   * Format current date display based on view
   */
  const formattedDate = useMemo(() => {
    const date = new Date(currentDate);
    
    switch (currentView) {
      case 'dayGridMonth':
        return date.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
      case 'timeGridWeek':
      case 'listWeek':
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${startOfWeek.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric' 
          })} - ${endOfWeek.toLocaleDateString('en-US', { 
            day: 'numeric', 
            year: 'numeric' 
          })}`;
        } else {
          return `${startOfWeek.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })} - ${endOfWeek.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric' 
          })}`;
        }
      case 'timeGridDay':
        return date.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long', 
          day: 'numeric',
          year: 'numeric' 
        });
      default:
        return date.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
    }
  }, [currentDate, currentView]);

  /**
   * Navigation Handlers
   */
  const handlePrevious = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      setCurrentDate(calendarApi.getDate());
    }
  }, [calendarRef, setCurrentDate]);

  const handleNext = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
      setCurrentDate(calendarApi.getDate());
    }
  }, [calendarRef, setCurrentDate]);

  const handleToday = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }
  }, [calendarRef, setCurrentDate]);

  /**
   * View Change Handler
   */
  const handleViewChange = useCallback((newView: CalendarView) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(newView);
      setCurrentView(newView);
    }
  }, [calendarRef, setCurrentView]);

  /**
   * Create New Event Handler
   */
  const handleCreateEvent = useCallback(() => {
    const newEventTemplate = {
      id: `temp_${Date.now()}`,
      title: 'New Event',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      color: 'blue',
      priority: 'medium',
      status: 'scheduled',
      company_id: 'company_123', // This should come from auth context
    };

    setSelectedEvent(newEventTemplate as any);
    setEventSheetOpen(true);
  }, [setSelectedEvent, setEventSheetOpen]);

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Top Row - Main Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Section - Navigation */}
        <div className="flex items-center space-x-2">
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="h-8 px-3 text-xs font-medium"
            >
              Today
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Date Display */}
          <div className="flex items-center space-x-2 ml-4">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">
              {formattedDate}
            </h2>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {/* View Selector */}
          <Select
            value={currentView}
            onValueChange={(value) => handleViewChange(value as CalendarView)}
          >
            <SelectTrigger className="w-[110px] h-8">
              <SelectValue>
                {calendarViews.find(v => v.value === currentView)?.shortLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {calendarViews.map((view) => (
                <SelectItem key={view.value} value={view.value}>
                  {view.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Create Event Button */}
          <Button
            onClick={handleCreateEvent}
            size="sm"
            className="h-8 px-3"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">New Event</span>
          </Button>

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Filter className="h-4 w-4 mr-2" />
                Filter Events
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Search className="h-4 w-4 mr-2" />
                Search Events
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="h-4 w-4 mr-2" />
                Print Calendar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Calendar Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom Row - Search and Filters (Optional) */}
      <div className="flex items-center justify-between">
        {/* Search Input */}
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="flex items-center space-x-2">
          {/* Example filter badges - these would be dynamic based on active filters */}
          <Badge variant="secondary" className="text-xs">
            All Events
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default CalendarToolbar;
