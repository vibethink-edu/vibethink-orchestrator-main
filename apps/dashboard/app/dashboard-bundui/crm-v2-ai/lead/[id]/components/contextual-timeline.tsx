"use client";

import { useState } from "react";
import { Clock12Icon, FileText, ChevronDown, ChevronUp, MoreHorizontal } from "@vibethink/ui/icons";
import { Badge } from "@vibethink/ui/components/badge";
import { Button } from "@vibethink/ui/components/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from "@vibethink/ui/components/extensions/timeline";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@vibethink/ui";
import { formatCivilDate, type CivilDate } from "@vibethink/utils";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/shared/lib/utils";
import type { EntityType } from "./ai-chat-assistant";

/**
 * Activity Type - Genérico para diferentes tipos de entidades
 */
type ActivityType =
  | "call"
  | "email"
  | "meeting"
  | "note"
  | "task"
  | "deal_created"
  | "deal_updated"
  | "status_changed"
  | "file_uploaded"
  | "integration_sync"
  | "ticket_created"
  | "ticket_updated"
  | "claim_submitted"
  | "claim_resolved";

/**
 * Activity - Genérico para cualquier tipo de entidad
 */
interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: CivilDate | string;
  createdBy: string;
  metadata?: {
    files?: Array<{ name: string; size: string; type: string }>;
    images?: Array<{ id: string; src: string }>;
    badge?: { text: string; color: string };
    dealId?: string;
    dealValue?: number;
    ticketId?: string;
    claimId?: string;
  };
}

/**
 * Mock activities - TODO: Replace with real data from API
 * El tipo de actividades depende del entityType
 */
function getMockActivities(entityType: EntityType, entityId: string): Activity[] {
  const baseActivities: Activity[] = [
    {
      id: "1",
      type: "call",
      title: "Initial discovery call completed",
      description: "Discussed project requirements and timeline",
      timestamp: "2025-12-21" as CivilDate,
      createdBy: "John Doe",
      metadata: {
        badge: { text: "Completed", color: "green" }
      }
    },
    {
      id: "2",
      type: "email",
      title: "Proposal sent",
      description: "Sent detailed proposal document",
      timestamp: "2025-12-20" as CivilDate,
      createdBy: "Jane Smith",
      metadata: {
        files: [
          { name: "proposal.pdf", size: "2.4MB", type: "pdf" }
        ]
      }
    }
  ];

  // Agregar actividades específicas según el tipo de entidad
  if (entityType === 'lead') {
    return [
      ...baseActivities,
      {
        id: "3",
        type: "deal_created",
        title: "Deal created: Q1 Opportunity",
        description: "New deal associated with this lead",
        timestamp: "2025-12-19" as CivilDate,
        createdBy: "System",
        metadata: {
          dealId: "deal_123",
          dealValue: 50000,
          badge: { text: "Active", color: "blue" }
        }
      },
      {
        id: "4",
        type: "status_changed",
        title: "Lead status updated",
        description: "Changed from 'New' to 'Qualified'",
        timestamp: "2025-12-17" as CivilDate,
        createdBy: "Jane Smith",
        metadata: {
          badge: { text: "Qualified", color: "cyan" }
        }
      }
    ];
  }

  if (entityType === 'ticket' || entityType === 'claim') {
    return [
      ...baseActivities,
      {
        id: "3",
        type: entityType === 'ticket' ? "ticket_created" : "claim_submitted",
        title: entityType === 'ticket' ? "Ticket created" : "Claim submitted",
        description: "Initial submission",
        timestamp: "2025-12-19" as CivilDate,
        createdBy: "System"
      },
      {
        id: "4",
        type: entityType === 'ticket' ? "ticket_updated" : "claim_resolved",
        title: entityType === 'ticket' ? "Status updated" : "Claim resolved",
        description: "Issue resolved",
        timestamp: "2025-12-18" as CivilDate,
        createdBy: "Support Team",
        metadata: {
          badge: { text: "Resolved", color: "green" }
        }
      }
    ];
  }

  return baseActivities;
}

/**
 * ContextualTimeline Component
 * 
 * Timeline vertical genérico que se adapta al tipo de entidad.
 * 
 * Features:
 * - Colapsable hacia abajo
 * - Contextual según entityType (lead, deal, ticket, claim, etc.)
 * - Items individuales colapsables
 * - Botón "Collapse All" / "Expand All"
 * 
 * @see docs/architecture/CRM_AI_AGENT_CONTEXT_DESIGN_REVIEW.md
 */
export function ContextualTimeline({
  entityType,
  entityId,
  compact = false
}: {
  entityType: EntityType;
  entityId: string;
  compact?: boolean;
}) {
  const { locale } = useTranslation('crm');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["1", "2", "3"])); // First 3 expanded by default
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Obtener actividades según el tipo de entidad
  const activities = getMockActivities(entityType, entityId);

  // Título contextual según el tipo de entidad
  const timelineTitle = {
    lead: "Lead History",
    deal: "Deal History",
    contact: "Contact History",
    account: "Account History",
    ticket: "Ticket History",
    claim: "Claim History"
  }[entityType] || "Activity Timeline";

  return (
    <Card className={cn("overflow-hidden", compact && "max-h-[400px] flex flex-col")}>
      <CardHeader className={compact ? "flex-shrink-0 pb-2" : ""}>
        <div className="flex items-center justify-between">
          <CardTitle className={compact ? "text-base" : ""}>{timelineTitle}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
              className={compact ? "h-7 text-xs" : ""}
            >
              {isTimelineCollapsed ? (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  {!compact && "Expand All"}
                </>
              ) : (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  {!compact && "Collapse All"}
                </>
              )}
            </Button>
            {!compact && (
              <CardAction>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal />
                </Button>
              </CardAction>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn(compact && "flex-1 overflow-y-auto")}>
        <Timeline defaultValue={activities.length}>
          {activities.map((activity) => {
            const isExpanded = expandedItems.has(activity.id) && !isTimelineCollapsed;

            return (
              <TimelineItem key={activity.id} step={Number(activity.id)} className="space-y-2">
                <TimelineHeader>
                  <TimelineSeparator />
                  <Collapsible open={isExpanded} onOpenChange={() => toggleItem(activity.id)}>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                        <TimelineTitle className="-mt-0.5 flex-1">{activity.title}</TimelineTitle>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <TimelineIndicator />
                  </Collapsible>
                </TimelineHeader>

                {isExpanded && (
                  <TimelineContent className="space-y-4">
                    {activity.description && (
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    )}

                    {activity.metadata?.badge && (
                      <Badge variant="secondary" className={activity.metadata.badge.color}>
                        {activity.metadata.badge.text}
                      </Badge>
                    )}

                    {activity.metadata?.files && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {activity.metadata.files.map((file, idx) => (
                          <a
                            href="#"
                            key={idx}
                            className="bg-muted/30 hover:bg-muted flex items-center gap-3 rounded-lg border p-4">
                            <FileText className="text-muted-foreground size-5" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{file.name}</p>
                              <p className="text-muted-foreground text-xs">{file.size}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}

                    {activity.metadata?.images && (
                      <div className="grid gap-3 sm:grid-cols-3">
                        {activity.metadata.images.map((img) => (
                          <figure key={img.id}>
                            <img className="aspect-video w-full rounded-lg" src={img.src} alt="..." />
                          </figure>
                        ))}
                      </div>
                    )}

                    {activity.metadata?.dealId && (
                      <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="text-sm font-medium">Deal: {activity.metadata.dealId}</p>
                        {activity.metadata.dealValue && (
                          <p className="text-xs text-muted-foreground">
                            Value: ${activity.metadata.dealValue.toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <TimelineDate className="mt-2 mb-0 flex items-center gap-1.5">
                        <Clock12Icon className="size-3" />
                        {typeof activity.timestamp === 'string' && activity.timestamp.includes('-')
                          ? formatCivilDate(activity.timestamp as CivilDate, locale)
                          : activity.timestamp}
                      </TimelineDate>
                      <span className="text-xs text-muted-foreground">by {activity.createdBy}</span>
                    </div>
                  </TimelineContent>
                )}
              </TimelineItem>
            );
          })}
        </Timeline>
      </CardContent>
      {!compact && (
        <CardContent className="border-t pt-4">
          <Button variant="ghost" className="w-full">
            View more activities
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

