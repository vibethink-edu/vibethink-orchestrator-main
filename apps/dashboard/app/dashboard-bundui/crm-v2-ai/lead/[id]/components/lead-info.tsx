"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import { Badge } from "@vibethink/ui/components/badge";
import { Mail, Phone, Building2, MapPin, DollarSign, Calendar } from "lucide-react";

/**
 * LeadInfo Component
 * 
 * Sidebar component showing lead information and details.
 */
export function LeadInfo({ leadId }: { leadId: string }) {
  // TODO: Fetch lead data from API
  const lead = {
    id: leadId,
    name: "Acme Inc.",
    email: "contact@acme.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corporation",
    industry: "Technology",
    location: "San Francisco, CA",
    status: "qualified",
    value: 50000,
    source: "Website",
    createdAt: "2025-12-01",
    assignedTo: "John Doe"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{lead.company}</p>
              <p className="text-xs text-muted-foreground">{lead.industry}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{lead.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{lead.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{lead.location}</span>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="secondary">{lead.status}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Value</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span className="text-sm font-medium">{lead.value.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Source</span>
            <span className="text-sm">{lead.source}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Assigned To</span>
            <span className="text-sm">{lead.assignedTo}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm">{lead.createdAt}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



