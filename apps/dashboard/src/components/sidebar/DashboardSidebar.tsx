"use client";

/**
 * Dashboard Sidebar - Enhanced Implementation
 * 
 * Sidebar que resuelve los problemas de layout push 
 * implementando un sistema modular completamente funcional.
 */

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@vibethink/ui/components/sidebar';
import DashboardNavigation from '@/components/navigation/DashboardNavigation';
import { Button } from '@vibethink/ui/components/button';
import { Card, CardContent } from '@vibethink/ui/components/card';
import { Avatar, AvatarFallback, AvatarImage } from '@vibethink/ui/components/avatar';
import { Badge } from '@vibethink/ui/components/badge';
import {
  Brain,
  Zap,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DashboardSidebar: React.FC = () => {
  const { open, setOpen } = useSidebar();

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            {open && (
              <div>
                <h1 className="text-lg font-semibold">AI Dashboard</h1>
                <p className="text-xs text-muted-foreground">Consensus Dashboard</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2">
        <DashboardNavigation />

        {/* AI Status Card */}
        {open && (
          <div className="mt-6 px-2">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">AI Status</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Consensus Rate</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      94.2%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Active AIs</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Decisions Today</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/avatars/ai-avatar.png" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                {open && (
                  <div>
                    <p className="text-sm font-medium">AI Team</p>
                    <p className="text-xs text-muted-foreground">3 Active Agents</p>
                  </div>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {open && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
