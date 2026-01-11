/**
 * Copied from: apps/dashboard/app/dashboard-bundui/projects-v2/components/collapsible-timeline.tsx
 * Last synced: 2026-01-10
 * Adaptations: Adapted for Admin Audit Logs (Simpler views, focused on system events)
 */
"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import {
    ShieldAlert,
    UserCog,
    Settings,
    CreditCard,
    Power,
    ChevronRight,
    Terminal
} from "@vibethink/ui/icons";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@vibethink/ui/components/collapsible";
import { Button } from "@vibethink/ui/components/button";
import { Skeleton } from "@vibethink/ui/components/skeleton";

// !IMPORTANT: Removing 'cn' utils import dependency to avoid circular deps if not needed
// Using template literals for simplicity where possible, but better to use `cn` if available
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export type AuditEventType = "security" | "user" | "config" | "billing" | "system";
export type AuditLevel = "info" | "warning" | "critical";

export interface AuditEvent {
    id: string;
    type: AuditEventType;
    level: AuditLevel;
    action: string;
    description: string;
    timestamp: Date;
    actor: string;
    metadata?: Record<string, any>;
}

interface AuditTimelineProps {
    events: AuditEvent[];
    isLoading?: boolean;
    className?: string;
}

const getEventIcon = (type: AuditEventType) => {
    switch (type) {
        case "security": return ShieldAlert;
        case "user": return UserCog;
        case "config": return Settings;
        case "billing": return CreditCard;
        case "system": return Power;
        default: return Terminal;
    }
};

export function AuditTimeline({
    events,
    isLoading = false,
    className
}: AuditTimelineProps) {
    if (isLoading) {
        return (
            <div className={cn("space-y-6 pl-2", className)}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="h-full w-0.5 bg-muted mt-2" />
                        </div>
                        <div className="space-y-2 pb-6 w-full">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <p className="text-sm">No audit logs found.</p>
            </div>
        );
    }

    return (
        <div className={cn("relative ml-3 border-l text-sm border-muted pb-4 pl-8", className)}>
            {events.map((event) => {
                const Icon = getEventIcon(event.type);
                const [isOpen, setIsOpen] = React.useState(false);

                return (
                    <Collapsible
                        key={event.id}
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        className="mb-6 relative"
                    >
                        {/* Timeline Node */}
                        <span className={cn(
                            "absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-background z-10",
                            "bg-background border border-muted",
                            event.level === 'critical' && "border-destructive text-destructive bg-destructive/10"
                        )}>
                            <Icon className={cn("h-4 w-4", !event.level && "text-muted-foreground")} />
                        </span>

                        {/* Trigger / Header */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-mono">
                                    {event.timestamp.toLocaleString()} ({formatDistanceToNow(event.timestamp, { addSuffix: true })})
                                </span>
                                {event.metadata && (
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted/50 rounded-full">
                                            <ChevronRight className={cn(
                                                "h-4 w-4 transition-transform duration-200",
                                                isOpen && "rotate-90"
                                            )} />
                                            <span className="sr-only">Toggle details</span>
                                        </Button>
                                    </CollapsibleTrigger>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{event.action}</span>
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold",
                                    event.level === 'critical' ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"
                                )}>
                                    {event.level}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="font-mono text-xs bg-muted px-1 rounded">
                                    {event.actor}
                                </span>
                                <span>{event.description}</span>
                            </div>
                        </div>

                        {/* Details Content */}
                        {event.metadata && (
                            <CollapsibleContent className="mt-3 space-y-2 overflow-hidden transition-all">
                                <div className="rounded-md bg-muted/50 p-3 text-xs font-mono border border-muted shadow-sm overflow-x-auto">
                                    <pre>{JSON.stringify(event.metadata, null, 2)}</pre>
                                </div>
                            </CollapsibleContent>
                        )}
                    </Collapsible>
                );
            })}
        </div>
    );
}
