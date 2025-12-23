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

// Mock Data for Timeline - Uses i18n
const getMockTimelineEvents = (t: any): TimelineEvent[] => [
    {
        id: "evt-1",
        type: "email",
        status: "completed",
        title: t('timeline.events.client_requirements.title'),
        description: t('timeline.events.client_requirements.description'),
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        details: (
            <div className="space-y-2">
                <p><strong>{t('timeline.events.client_requirements.from')}:</strong> sarah.jones@client.com</p>
                <p><strong>{t('timeline.events.client_requirements.subject')}:</strong> Re: Project Scope - v2</p>
                <p className="text-muted-foreground">"{t('timeline.events.client_requirements.details')}"</p>
            </div>
        ),
        user: { name: "Sarah Jones" }
    },
    {
        id: "evt-2",
        type: "system",
        status: "warning",
        title: t('timeline.events.dependency_alert.title'),
        description: t('timeline.events.dependency_alert.description'),
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        details: t('timeline.events.dependency_alert.details'),
    },
    {
        id: "evt-3",
        type: "meeting",
        status: "completed",
        title: t('timeline.events.sprint_planning.title'),
        description: t('timeline.events.sprint_planning.description'),
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        details: t('timeline.events.sprint_planning.details'),
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
        <div className="flex gap-0 -m-4 w-[calc(100%+2rem)]">
            {/* Main Content Panel */}
            <div className={`flex-1 transition-all duration-300 ease-in-out ${isPanelOpen ? 'mr-0' : ''}`}>
                <div className="overflow-y-auto px-6 py-6">
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
            </div>

            {/* Side Panel - Fixed overlay */}
            {isPanelOpen && (
                <div className="fixed top-0 right-0 h-screen w-[400px] shadow-xl z-50 transition-transform duration-300 ease-in-out">
                    <ContextualSidePanel
                        onClose={togglePanel}
                    />
                </div>
            )}
        </div>
    );
}

export default function Page() {
    const { t } = useTranslation('projects');

    return (
        <ContextualPanelProvider
            initialContextData={MOCK_CONTEXT_DATA}
            initialTimelineEvents={getMockTimelineEvents(t)}
        >
            <PageContent />
        </ContextualPanelProvider>
    );
}
