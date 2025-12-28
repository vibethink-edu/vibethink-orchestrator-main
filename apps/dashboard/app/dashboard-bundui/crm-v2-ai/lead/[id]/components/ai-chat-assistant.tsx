"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import { Button } from "@vibethink/ui/components/button";
import { Input } from "@vibethink/ui/components/input";
import { Badge } from "@vibethink/ui/components/badge";
import { ScrollArea } from "@vibethink/ui/components/scroll-area";
import { Brain, Send, X, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Alert, AlertDescription } from "@vibethink/ui/components/alert";

/**
 * Entity Type - Genérico para diferentes tipos de entidades CRM
 */
export type EntityType = 'lead' | 'deal' | 'contact' | 'account' | 'ticket' | 'claim';

/**
 * Message Type
 */
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  contextSwitched?: boolean;
  newEntity?: {
    type: EntityType;
    id: string;
    name: string;
  };
}

/**
 * AIChatAssistant Component
 * 
 * Chat de asistencia AI (estilo Cursor) a la derecha.
 * 
 * Features:
 * - Chat contextual a la entidad actual
 * - Mantiene contexto a menos que se ordene cambiar
 * - Sistema de permisos para cambiar contexto
 * - Historial de conversación
 * 
 * @see docs/architecture/CRM_AI_AGENT_CONTEXT_DESIGN_REVIEW.md
 */
export function AIChatAssistant({ 
  entityType, 
  entityId 
}: { 
  entityType: EntityType;
  entityId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [contextSwitched, setContextSwitched] = useState(false);
  const [hasPermission, setHasPermission] = useState(true); // TODO: Check real permissions
  const [currentContext, setCurrentContext] = useState<{
    type: EntityType;
    id: string;
    name: string;
  }>({
    type: entityType,
    id: entityId,
    name: `${entityType} ${entityId}` // TODO: Fetch real name
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    // TODO: Process message and check for context switch commands
    // Example commands that switch context:
    // - "Show me deal 123"
    // - "Switch to contact John Doe"
    // - "Let's look at account Acme Inc"
    // - "Show me ticket #456"
    
    setTimeout(() => {
      // Mock: Simulate context switch detection
      const lowerInput = userMessage.content.toLowerCase();
      let contextSwitchedThisMessage = false;
      let newEntity: Message['newEntity'] | undefined;

      if ((lowerInput.includes("deal") || lowerInput.includes("show me deal")) && hasPermission) {
        contextSwitchedThisMessage = true;
        newEntity = {
          type: 'deal',
          id: 'deal_123',
          name: 'Q1 Opportunity'
        };
      } else if ((lowerInput.includes("contact") || lowerInput.includes("switch to contact")) && hasPermission) {
        contextSwitchedThisMessage = true;
        newEntity = {
          type: 'contact',
          id: 'contact_456',
          name: 'John Doe'
        };
      } else if ((lowerInput.includes("ticket") || lowerInput.includes("show me ticket")) && hasPermission) {
        contextSwitchedThisMessage = true;
        newEntity = {
          type: 'ticket',
          id: 'ticket_789',
          name: 'Support Request #789'
        };
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: contextSwitchedThisMessage
          ? `I've switched context to ${newEntity?.name}. How can I help you with this ${newEntity?.type}?`
          : `I understand you're asking about ${currentContext.name}. Here's what I found...`,
        timestamp: new Date(),
        contextSwitched: contextSwitchedThisMessage,
        newEntity
      };

      if (contextSwitchedThisMessage && newEntity) {
        setContextSwitched(true);
        setCurrentContext({
          type: newEntity.type,
          id: newEntity.id,
          name: newEntity.name
        });
      }

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleReturnToOriginal = () => {
    setCurrentContext({
      type: entityType,
      id: entityId,
      name: `${entityType} ${entityId}`
    });
    setContextSwitched(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // TODO: Fetch entity name
  const entityName = `${entityType} ${entityId}`;

  return (
    <Card className="flex h-[calc(100vh-200px)] flex-col">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Assistant</CardTitle>
          </div>
          <Badge variant="secondary" className="gap-1">
            <span className="text-xs">Context:</span>
            <span className="font-medium">{currentContext.name}</span>
          </Badge>
        </div>
        <CardDescription>
          Ask questions about {entityName} or switch to other entities.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 p-4">
        {/* Context Switch Alert */}
        {contextSwitched && (
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <AlertDescription className="flex items-center justify-between">
              <span className="text-sm text-amber-800 dark:text-amber-200">
                Context switched to {currentContext.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReturnToOriginal}
                className="h-auto py-1 text-amber-800 hover:text-amber-900 dark:text-amber-200"
              >
                Return to {entityName}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Permission Warning */}
        {!hasPermission && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertDescription className="text-sm text-red-800 dark:text-red-200">
              You don't have permission to switch context to other entities.
            </AlertDescription>
          </Alert>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="space-y-2">
                  <Brain className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Start a conversation about <strong>{entityName}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Try: "What's the status?" or "Show me recent activities"
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.contextSwitched && message.newEntity && (
                      <div className="mt-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                        Switched to: {message.newEntity.name}
                      </div>
                    )}
                    <p className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <span className="text-xs font-medium">U</span>
                    </div>
                  )}
                </div>
              ))
            )}
            {isProcessing && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div className="rounded-lg bg-muted px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex-shrink-0 space-y-2 border-t pt-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask about ${currentContext.name}...`}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              size="icon"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Focused on: <strong>{currentContext.name}</strong>
            {hasPermission && " • Say 'show me [entity]' to switch context"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}









