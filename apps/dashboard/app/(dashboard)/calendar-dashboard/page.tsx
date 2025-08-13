/**
 * Calendar Application - Main Page
 * 
 * VThink 1.0 Implementation following VibeThink patterns:
 * - Multi-tenant security with company_id filtering
 * - Uses DashboardLayout for consistent UI (following CRM pattern)
 * - HSL color variables for theme compatibility
 * - TypeScript strict mode compliance
 * - Responsive design implementation
 * 
 * Reference: /external/bundui-premium/app/dashboard/(auth)/apps/calendar/
 */

import React from 'react';
import { Metadata } from 'next';
import DashboardLayout from '@/shared/components/bundui-premium/components/layout/DashboardLayout';
import CalendarApp from './components/CalendarApp';
import EventSheet from './components/EventSheet';

export const metadata: Metadata = {
  title: 'Calendar - VibeThink Dashboard',
  description: 'Comprehensive calendar application with event management, scheduling, and multi-tenant support for business teams.',
};

/**
 * Calendar Page Component
 * 
 * Implements a comprehensive calendar system with:
 * - Multiple calendar views (Month, Week, Day, Agenda)
 * - Event creation, editing, and management
 * - Drag & drop functionality for event scheduling
 * - Multi-tenant security with company_id filtering
 * - Responsive design for all device sizes
 * - Integration with VibeThink dashboard ecosystem
 */
export default function CalendarPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CalendarApp />
        <EventSheet />
      </div>
    </DashboardLayout>
  );
}