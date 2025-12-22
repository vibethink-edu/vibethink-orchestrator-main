import { generateMeta } from "@/shared/lib/utils";
import { LeadDetailHeader } from "./components/lead-detail-header";
import { ContextualTimeline } from "./components/contextual-timeline";
import { AIChatAssistant } from "./components/ai-chat-assistant";
import { LeadInfo } from "./components/lead-info";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return generateMeta({
    title: `Lead ${params.id} - CRM AI`,
    description: `View and manage lead details with AI-powered assistance. Track lead history, activities, and interactions.`,
    canonical: `/crm-v2-ai/lead/${params.id}`
  });
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  // TODO: Fetch lead data from API/database
  // const lead = await getLeadById(params.id);
  
  return (
    <div className="space-y-4">
      {/* Lead Header */}
      <LeadDetailHeader leadId={params.id} />

      <div className="grid gap-4 lg:grid-cols-[400px_1fr_400px]">
        {/* Left Sidebar: Lead Info */}
        <div className="space-y-4">
          <LeadInfo leadId={params.id} />
        </div>

        {/* Main Content: Timeline (colapsable, hacia abajo) */}
        <div className="space-y-4">
          {/* Timeline contextual - se colapsa hacia abajo */}
          <ContextualTimeline 
            entityType="lead" 
            entityId={params.id} 
          />
        </div>

        {/* Right Sidebar: AI Chat Assistant (como Cursor) + Timeline debajo */}
        <div className="space-y-4 flex flex-col">
          {/* AI Chat Assistant arriba */}
          <AIChatAssistant 
            entityType="lead" 
            entityId={params.id} 
          />
          
          {/* Timeline contextual debajo del chat (colapsable hacia abajo) */}
          <ContextualTimeline 
            entityType="lead" 
            entityId={params.id} 
            compact={true}
          />
        </div>
      </div>
    </div>
  );
}
