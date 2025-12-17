"use client";

import React from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@vibethink/ui";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Clock, 
  User, 
  Terminal, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Power
} from "lucide-react";
import { PosView } from "../types";

interface PosSessionData {
  id: string;
  cashier_name: string;
  terminal_id: string;
  start_time: string;
  starting_cash: number;
  current_sales: number;
  transaction_count: number;
  status: 'active' | 'closed' | 'suspended';
  todaySales?: number;
  todayTransactions?: number;
  activeProducts?: number;
  todayCustomers?: number;
}

interface PosHeaderProps {
  activeView: PosView;
  sessionData: PosSessionData | null;
}

export function PosHeader({ activeView, sessionData }: PosHeaderProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionDuration = () => {
    if (!sessionData?.start_time) return "00:00";
    
    const start = new Date(sessionData.start_time);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'hsl(var(--success))';
      case 'suspended':
        return 'hsl(var(--warning))';
      case 'closed':
        return 'hsl(var(--muted-foreground))';
      default:
        return 'hsl(var(--muted-foreground))';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'suspended':
        return AlertCircle;
      case 'closed':
        return Power;
      default:
        return AlertCircle;
    }
  };

  const viewTitles: Record<PosView, string> = {
    pos: "Point of Sale Interface",
    products: "Product & Inventory Management",
    analytics: "Sales Analytics & Reports",
    settings: "POS Settings & Configuration"
  };

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {viewTitles[activeView]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete point-of-sale system for retail operations
          </p>
        </div>

        {/* Session Status */}
        {sessionData && (
          <div className="flex items-center space-x-4">
            <Badge 
              variant="outline" 
              className="px-3 py-1 text-sm font-medium"
              style={{ 
                borderColor: getStatusColor(sessionData.status),
                color: getStatusColor(sessionData.status)
              }}
            >
              {React.createElement(getStatusIcon(sessionData.status), { 
                className: "h-4 w-4 mr-2" 
              })}
              Session {sessionData.status.charAt(0).toUpperCase() + sessionData.status.slice(1)}
            </Badge>

            <Button 
              variant="outline" 
              size="sm"
              className="hidden md:flex items-center space-x-2"
            >
              <Power className="h-4 w-4" />
              <span>End Session</span>
            </Button>
          </div>
        )}
      </div>

      {/* Session Information Card */}
      {sessionData && activeView === "pos" && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Cashier Info */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cashier</p>
                <p className="font-semibold">{sessionData.cashier_name}</p>
              </div>
            </div>

            {/* Terminal Info */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Terminal className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Terminal</p>
                <p className="font-semibold">{sessionData.terminal_id}</p>
              </div>
            </div>

            {/* Session Duration */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="font-semibold">{getSessionDuration()}</p>
              </div>
            </div>

            {/* Session Sales */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Session Sales</p>
                <p className="font-semibold">{formatCurrency(sessionData.current_sales)}</p>
              </div>
            </div>
          </div>

          {/* Additional Session Stats */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>
                Started: {formatTime(sessionData.start_time)}
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span>
                Starting Cash: {formatCurrency(sessionData.starting_cash)}
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span>
                Transactions: {sessionData.transaction_count}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
