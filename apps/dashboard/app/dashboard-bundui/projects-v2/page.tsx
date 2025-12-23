"use client";

import { useTranslation } from "@/lib/i18n";
import CalendarDateRangePicker from "@/shared/components/bundui-premium/components/custom-date-range-picker";
import { ExportButton } from "@/shared/components/CardActionMenus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vibethink/ui";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@vibethink/ui/components/resizable";
import { Button } from "@vibethink/ui/components/button";
import { Brain, PanelRightClose, PanelRightOpen } from "lucide-react";

import {
    SummaryCards,
    AchievementByYear,
    ChartProjectOverview,
    ChartProjectEfficiency,
    TableRecentProjects,
    Reminders,
    SuccessMetrics,
    Reports,
    ContextualSidePanel,
    TimelineEvent
} from "./components";

import { ContextualPanelProvider, useContextualPanel, PanelContextData } from "./context/contextual-panel-context";

// Mock Data for Timeline
const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
    {
        id: "evt-1",
        type: "email",
        status: "completed",
        title: "Client Requirements Received",
        description: "Scope document received via email.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        details: (
            <div className="space-y-2">
                <p><strong>From:</strong> sarah.jones@client.com</p>
                <p><strong>Subject:</strong> Re: Project Scope - v2</p>
                <p className="text-muted-foreground">"Attached is the final scope document. Please review sections 3.1 and 4.2 specifically regarding the AI integration timelines."</p>
            </div>
        ),
        user: { name: "Sarah Jones" }
    },
    {
        id: "evt-2",
        type: "system",
        status: "warning",
        title: "Dependency Alert",
        description: "New potential conflict detected in package.json",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        details: "Version mismatch detected for @vibethink/ui. Recommended: Upgrade to v0.2.1",
    },
    {
        id: "evt-3",
        type: "meeting",
        status: "completed",
        title: "Sprint Planning",
        description: "Weekly sync with engineering team.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        details: "Key takeaways: Focus on Side Panel implementation this sprint. Timeline component needs to support collapsible items.",
        user: { name: "Marcelo Escallón", avatar: "" }
    }
];

// Mock Context Data
const MOCK_CONTEXT_DATA: PanelContextData = {
    company: { id: "corp-1", name: "Acme Corp" },
    module: "Projects V2",
    activeEntity: { id: "proj-123", type: "project", name: "Redesign 2024" }
};

function PageContent() {
    const { t } = useTranslation('projects');
    const { isPanelOpen, setPanelOpen, setContextData, refreshTimeline } = useContextualPanel();

    const togglePanel = () => {
        if (!isPanelOpen) {
            setContextData(MOCK_CONTEXT_DATA);
            refreshTimeline();
        }
        setPanelOpen(!isPanelOpen);
    };

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[calc(100vh-12rem)] max-h-[calc(100vh-12rem)] rounded-none border-0 -m-4 w-[calc(100%+2rem)]"
        >
            {/* Main Content Panel */}
            <ResizablePanel defaultSize={100} minSize={30} className="transition-all duration-300 ease-in-out">
                <div className="h-full overflow-y-auto px-6 py-6 scrollbar-hide">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">{t('header.title')}</h1>
                            {!isPanelOpen && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 gap-2 h-7 rounded-full border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                                    onClick={togglePanel}
                                >
                                    <Brain className="w-3.5 h-3.5" />
                                    <span className="text-xs font-medium">{t('actions.consult_ai', 'Consultar Agente')}</span>
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <CalendarDateRangePicker />
                            <ExportButton />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={togglePanel}
                                className="ml-2"
                                title={isPanelOpen ? t('actions.close_panel', 'Close Side Panel') : t('actions.open_panel', 'Open Side Panel')}
                            >
                                {isPanelOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList className="z-10 w-full justify-start border-b rounded-none p-0 h-auto bg-transparent">
                            <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">{t('tabs.overview')}</TabsTrigger>
                            <TabsTrigger value="reports" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">{t('tabs.reports')}</TabsTrigger>
                            <TabsTrigger value="activities" disabled className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2">
                                {t('tabs.activities', 'Activities')}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="space-y-4 pt-4">
                            <SummaryCards />
                            <div className="mt-4 grid gap-4 lg:grid-cols-3">
                                <div className="lg:col-span-2">
                                    <ChartProjectOverview />
                                </div>
                                <SuccessMetrics />
                            </div>
                            <div className="mt-4 grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
                                <Reminders />
                                <AchievementByYear />
                                <ChartProjectEfficiency />
                            </div>
                            <TableRecentProjects />
                        </TabsContent>
                        <TabsContent value="reports" className="pt-4">
                            <Reports />
                        </TabsContent>
                    </Tabs>
                </div>
            </ResizablePanel>

            {/* Side Panel */}
            {isPanelOpen && (
                <>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="min-w-[320px] shadow-xl z-20 transition-all duration-300 ease-in-out">
                        <ContextualSidePanel
                            onClose={togglePanel}
                        />
                    </ResizablePanel>
                </>
            )}
        </ResizablePanelGroup>
    );
}

export default function Page() {
    return (
        <ContextualPanelProvider
            initialContextData={MOCK_CONTEXT_DATA}
            initialTimelineEvents={MOCK_TIMELINE_EVENTS}
        >
            <PageContent />
        </ContextualPanelProvider>
    );
}
