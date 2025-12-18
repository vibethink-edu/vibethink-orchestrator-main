"use client";

/**
 * Dashboard Header - Enhanced AI Consensus
 * 
 * Header del dashboard con controles de AI Consensus Framework
 * y herramientas de colaboración multi-AI.
 */

import React from 'react';
import { Button } from '@vibethink/ui';
import { Input } from '@vibethink/ui';
import { Badge } from '@vibethink/ui';
import { DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger, } from '@vibethink/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@vibethink/ui';
import { ThemeCustomizerPanel } from '@vibethink/ui';
import { 
  Bell, 
  Search, 
  Brain, 
  Users, 
  Zap,
  Activity
} from 'lucide-react';

const DashboardHeader: React.FC = () => {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-6">
        {/* Search */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search AI insights..."
              className="pl-8 w-full"
            />
          </div>
        </div>

        {/* AI Status Indicators */}
        <div className="flex items-center space-x-4">
          {/* AI Consensus Status */}
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-blue-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Consensus Active
            </Badge>
          </div>

          {/* Active AIs */}
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">3 AIs</span>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                  2
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>AI Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-3 w-3 text-blue-600" />
                    <span className="text-sm font-medium">New Consensus Reached</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Claude, GitHub Copilot, and Cursor agreed on dashboard architecture
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-3 w-3 text-orange-600" />
                    <span className="text-sm font-medium">Workflow Optimized</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    AI team improved efficiency by 34%
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Settings */}
          <ThemeCustomizerPanel />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/user.png" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">AI Dashboard</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Multi-AI Collaboration
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Activity className="mr-2 h-4 w-4" />
                <span>AI Activity</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Activity className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
