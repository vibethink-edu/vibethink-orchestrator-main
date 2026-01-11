"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import {
    Mail,
    Wrench,
    MessageSquare,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText,
    ChevronRight
} from "@vibethink/ui/icons";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@vibethink/ui/components/collapsible";
import { Button } from "@vibethink/ui/components/button";
import { Badge } from "@vibethink/ui/components/badge";
import { Skeleton } from "@vibethink/ui/components/skeleton";
import { cn } from "@/lib/utils";

export type TimelineEventType = "email" | "maintenance" | "chat" | "meeting" | "document" | "system";
export type TimelineEventStatus = "completed" | "pending" | "warning" | "error";

export interface TimelineEvent {
    id: string;
    type: TimelineEventType;
    status: TimelineEventStatus;
    title: string;
    description: string;
    timestamp: Date;
    details?: React.ReactNode; // For rich content like email body
    user?: {
        name: string;
        avatar?: string;
    };
}

interface CollapsibleTimelineProps {
    events: TimelineEvent[];
    isLoading?: boolean;
    className?: string;
}

const getEventIcon = (type: TimelineEventType) => {
    switch (type) {
        case "email": return Mail;
        case "maintenance": return Wrench;
        case "chat": return MessageSquare;
        case "meeting": return Clock;
        case "document": return FileText;
        case "system": return AlertCircle;
        default: return CheckCircle2;
    }
};

const getStatusColor = (status: TimelineEventStatus) => {
    switch (status) {
        case "completed": return "bg-primary text-primary-foreground";
        case "pending": return "bg-muted text-muted-foreground";
        case "warning": return "bg-yellow-500 text-white";
        case "error": return "bg-destructive text-destructive-foreground";
        default: return "bg-muted text-muted-foreground";
    }
};

export function CollapsibleTimeline({
    events,
    isLoading = false,
    className
}: CollapsibleTimelineProps) {
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
                            <Skeleton className="h-20 w-full mt-2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                <p className="text-sm">No recent activity.</p>
            </div>
        );
    }

    return (
        <div className={cn("relative ml-3 border-l md:border-l-2 border-muted pb-4 pl-6", className)}>
            {events.map((event, index) => {
                const Icon = getEventIcon(event.type);
                const [isOpen, setIsOpen] = React.useState(false);

                return (
                    <Collapsible
                        key={event.id}
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        className="mb-8 relative"
                    >
                        {/* Timeline Node */}
                        <span className={cn(
                            "absolute -left-[31px] md:-left-[33px] flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full ring-8 ring-background z-10",
                            "bg-background border border-muted"
                        )}>
                            <Icon className={cn("h-3 w-3 md:h-4 md:w-4 text-muted-foreground")} />
                        </span>

                        {/* Trigger / Header */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-medium">
                                    {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                                </span>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted/50 rounded-full">
                                        <ChevronRight className={cn(
                                            "h-4 w-4 transition-transform duration-200",
                                            isOpen && "rotate-90"
                                        )} />
                                        <span className="sr-only">Toggle details</span>
                                    </Button>
                                </CollapsibleTrigger>
                            </div>

                            <h3 className="text-sm font-semibold leading-none tracking-tight">
                                {event.title}
                            </h3>

                            <p className="text-sm text-muted-foreground mt-1">
                                {event.description}
                            </p>
                        </div>

                        {/* Details Content */}
                        <CollapsibleContent className="mt-3 space-y-2 overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                            <div className="rounded-md bg-muted/30 p-3 text-sm border border-muted/50 shadow-sm">
                                {event.details || (
                                    <p className="italic text-muted-foreground">No additional details.</p>
                                )}

                                {/* User info footer if present */}
                                {event.user && (
                                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-muted/50">
                                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                            {event.user.avatar ? (
                                                <img src={event.user.avatar} alt={event.user.name} className="rounded-full" />
                                            ) : (
                                                event.user.name.charAt(0)
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{event.user.name}</span>
                                    </div>
                                )}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                );
            })}
        </div>
    );
}
