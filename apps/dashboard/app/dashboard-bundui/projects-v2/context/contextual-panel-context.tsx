"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TimelineEvent } from '../components/collapsible-timeline';

// Define Context Data Structure
export interface PanelContextData {
    company: {
        id: string;
        name: string;
    };
    module: string;
    activeEntity?: {
        id: string;
        type: string;
        name: string;
    };
}

interface ContextualPanelContextType {
    // State
    activeTab: "agent" | "timeline";
    isPanelOpen: boolean;
    contextData: PanelContextData | null;
    timelineEvents: TimelineEvent[];
    isLoadingTimeline: boolean;

    // Actions
    setActiveTab: (tab: "agent" | "timeline") => void;
    setPanelOpen: (isOpen: boolean) => void;
    setContextData: (data: PanelContextData) => void;
    setTimelineEvents: (events: TimelineEvent[]) => void;
    setIsLoadingTimeline: (isLoading: boolean) => void;
    refreshTimeline: () => Promise<void>;
}

const ContextualPanelContext = createContext<ContextualPanelContextType | undefined>(undefined);

export function ContextualPanelProvider({
    children,
    initialContextData,
    initialTimelineEvents = []
}: {
    children: ReactNode;
    initialContextData?: PanelContextData;
    initialTimelineEvents?: TimelineEvent[];
}) {
    const [activeTab, setActiveTabState] = useState<"agent" | "timeline">("agent");
    const [isPanelOpen, setPanelOpen] = useState(false);
    const [contextData, setContextData] = useState<PanelContextData | null>(initialContextData || null);
    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(initialTimelineEvents);
    const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);

    const setActiveTab = useCallback((tab: "agent" | "timeline") => {
        setActiveTabState(tab);
    }, []);

    const refreshTimeline = useCallback(async () => {
        setIsLoadingTimeline(true);
        // Simulate fetch
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoadingTimeline(false);
    }, []);

    const value = {
        activeTab,
        isPanelOpen,
        contextData,
        timelineEvents,
        isLoadingTimeline,
        setActiveTab,
        setPanelOpen,
        setContextData,
        setTimelineEvents,
        setIsLoadingTimeline,
        refreshTimeline
    };

    return (
        <ContextualPanelContext.Provider value={value}>
            {children}
        </ContextualPanelContext.Provider>
    );
}

export function useContextualPanel() {
    const context = useContext(ContextualPanelContext);
    if (context === undefined) {
        throw new Error('useContextualPanel must be used within a ContextualPanelProvider');
    }
    return context;
}
