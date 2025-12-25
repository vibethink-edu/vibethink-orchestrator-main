"use client";

import * as React from "react";
import {
    Sparkles,
    History,
    X,
} from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@vibethink/ui/components/tabs";
import { Button } from "@vibethink/ui/components/button";
import { Badge } from "@vibethink/ui/components/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@vibethink/ui/components/tooltip";

import { useTranslation } from "@/lib/i18n";

// Reuse existing AI Chat implementation
import { useAiChat } from "../../ai-chat/hooks/useAiChat";
import { ChatMessagesWrapper } from "./ChatMessagesWrapper";
import { ChatInput } from "../../ai-chat/components/ChatInput";

import { CollapsibleTimeline } from "./collapsible-timeline";
import { useContextualPanel } from "../context/contextual-panel-context";

export function ContextualSidePanel({
    onClose,
}: {
    onClose: () => void;
}) {
    const { t } = useTranslation('projects');
    const {
        activeTab,
        setActiveTab,
        contextData,
        timelineEvents,
        isLoadingTimeline
    } = useContextualPanel();

    // AI Chat Hook reuse
    const {
        messages,
        isLoading: isChatLoading,
        isTyping,
        sendMessage
    } = useAiChat();

    if (!contextData) return null;

    const handleSendMessage = async (content: string, attachments?: File[]) => {
        // Pass the context data along with the message
        // In a real Vercel AI SDK integration, this data would be passed in the body
        await sendMessage(content, attachments);
    };

    return (
        <div className="flex h-full flex-col border-l bg-background">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                    {activeTab === "agent" ? (
                        <>
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <h2 className="text-sm font-semibold">{t('sidepanel.agent_title', 'AI Assistant')}</h2>
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 ml-1">
                                Beta
                            </Badge>
                        </>
                    ) : (
                        <>
                            <History className="h-4 w-4 text-blue-500" />
                            <h2 className="text-sm font-semibold">{t('sidepanel.history_title', 'History')}</h2>
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 ml-1">
                                {timelineEvents.length} {t('sidepanel.verified', 'Verified')}
                            </Badge>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">{t('sidepanel.close', 'Close Panel')}</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t('sidepanel.close', 'Close Panel')}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Tabs & Content */}
            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "agent" | "timeline")}
                className="flex-1 flex flex-col min-h-0"
            >
                <div className="px-4 pt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="agent" className="gap-2 text-xs">
                            <Sparkles className="h-3.5 w-3.5" />
                            {t('sidepanel.tabs.agent', 'AI Assistant')}
                        </TabsTrigger>
                        <TabsTrigger value="timeline" className="gap-2 text-xs">
                            <History className="h-3.5 w-3.5" />
                            {t('sidepanel.tabs.timeline', 'Timeline')}
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab 1: Agent */}
                <TabsContent value="agent" className="flex-1 flex flex-col min-h-0 mt-0 data-[state=inactive]:hidden">
                    {/* Context Metadata Banner */}
                    <div className="px-4 py-2 bg-muted/30 border-b text-[10px] text-muted-foreground flex gap-2">
                        <span className="font-medium">{t('sidepanel.context', 'Context')}:</span>
                        <span>{contextData.company.name}</span>
                        <span>•</span>
                        <span>{contextData.module}</span>
                        {contextData.activeEntity && (
                            <>
                                <span>•</span>
                                <span className="truncate max-w-[150px]">{contextData.activeEntity.name}</span>
                            </>
                        )}
                    </div>

                    {/* Messages Area - Scrollable */}
                    <div className="flex-1 min-h-0">
                        <ChatMessagesWrapper
                            messages={messages}
                            isLoading={isChatLoading}
                            isTyping={isTyping}
                            // Provide empty/mock handlers if not implemented in useAiChat yet
                            onMessageEdit={() => { }}
                            onMessageDelete={() => { }}
                            onMessageCopy={(content) => navigator.clipboard.writeText(content)}
                        />
                    </div>

                    {/* Input Area - Sticky at bottom */}
                    <div className="border-t bg-background">
                        <ChatInput
                            onSendMessage={handleSendMessage}
                            placeholder={t('sidepanel.input_placeholder', 'Ask about this project or timeline...')}
                        />
                    </div>
                </TabsContent>

                {/* Tab 2: Timeline */}
                <TabsContent value="timeline" className="flex-1 min-h-0 mt-0 overflow-y-auto data-[state=inactive]:hidden">
                    <div className="px-4 py-6">
                        <CollapsibleTimeline
                            events={timelineEvents}
                            isLoading={isLoadingTimeline}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
