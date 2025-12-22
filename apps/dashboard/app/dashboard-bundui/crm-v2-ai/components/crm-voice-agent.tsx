"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import { Button } from "@vibethink/ui/components/button";
import { Badge } from "@vibethink/ui/components/badge";
import { Mic, MicOff, Brain, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/**
 * CRM Voice Agent Component
 * 
 * AI-First voice agent for CRM interactions.
 * 
 * Features (to be implemented):
 * - Voice commands for CRM operations
 * - Context-aware conversation (maintains entity focus)
 * - Multi-step workflow support
 * - Integration with Google Workspace/Office 365
 * - Permission-aware actions
 * 
 * @see docs/architecture/CRM_AI_AGENT_CONTEXT_DESIGN_REVIEW.md
 */
export function CrmVoiceAgent() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [activeEntity, setActiveEntity] = useState<{
    type: string;
    name: string;
  } | null>(null);

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript("");
    // TODO: Integrate with voice agent hook
    // const { startRecording } = useVoiceAgent({ context: 'crm' });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    // TODO: Process transcript and execute action
    setTimeout(() => {
      setIsProcessing(false);
      // Mock: Set active entity after processing
      setActiveEntity({
        type: "deal",
        name: "Acme Inc. - Q1 Opportunity"
      });
    }, 2000);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Voice Agent</CardTitle>
          </div>
          {activeEntity && (
            <Badge variant="secondary" className="gap-1">
              <span className="text-xs">Focus:</span>
              <span className="font-medium">{activeEntity.name}</span>
            </Badge>
          )}
        </div>
        <CardDescription>
          Interact with your CRM using natural voice commands. Ask about deals, contacts, schedule meetings, and more.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Voice Control */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isProcessing}
              className={cn(
                "h-16 w-16 rounded-full",
                isRecording && "animate-pulse"
              )}
            >
              {isProcessing ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : isRecording ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">You said:</p>
              <p className="mt-1 font-medium">{transcript}</p>
            </div>
          )}

          {/* Status Messages */}
          {isRecording && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Listening... Speak your command</p>
            </div>
          )}

          {isProcessing && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Processing your request...</p>
            </div>
          )}

          {/* Quick Actions (Placeholder) */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" className="justify-start">
              <Brain className="mr-2 h-4 w-4" />
              Create Deal
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Brain className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Brain className="mr-2 h-4 w-4" />
              Sync Calendar
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Brain className="mr-2 h-4 w-4" />
              View Contacts
            </Button>
          </div>

          {/* Implementation Status */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <p className="font-medium">🚧 Implementation Status:</p>
            <p className="mt-1">
              This is a placeholder component. Full implementation will include:
            </p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Context-aware conversation management</li>
              <li>Entity focus tracking (deals, contacts, accounts)</li>
              <li>Multi-step workflow support</li>
              <li>Google Workspace/Office 365 integration</li>
              <li>Permission-aware actions</li>
            </ul>
            <p className="mt-2">
              See: <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900">docs/architecture/CRM_AI_AGENT_CONTEXT_DESIGN_REVIEW.md</code>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

