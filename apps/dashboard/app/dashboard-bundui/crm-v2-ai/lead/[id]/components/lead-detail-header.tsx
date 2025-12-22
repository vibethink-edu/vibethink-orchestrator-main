"use client";

import { Button } from "@vibethink/ui/components/button";
import { Badge } from "@vibethink/ui/components/badge";
import { ArrowLeft, Edit, MoreHorizontal, Phone, Mail, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * LeadDetailHeader Component
 * 
 * Header for lead detail page with navigation and actions.
 */
export function LeadDetailHeader({ leadId }: { leadId: string }) {
  const router = useRouter();
  
  // TODO: Fetch lead data
  const lead = {
    id: leadId,
    name: "Acme Inc.",
    email: "contact@acme.com",
    phone: "+1 (555) 123-4567",
    status: "qualified",
    value: 50000,
    company: "Acme Corporation"
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{lead.name}</h1>
          <p className="text-sm text-muted-foreground">{lead.company}</p>
        </div>
        <Badge variant="secondary">{lead.status}</Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Phone className="mr-2 h-4 w-4" />
          Call
        </Button>
        <Button variant="outline" size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule
        </Button>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="ghost" size="icon">
          <MoreHorizontal />
        </Button>
      </div>
    </div>
  );
}

