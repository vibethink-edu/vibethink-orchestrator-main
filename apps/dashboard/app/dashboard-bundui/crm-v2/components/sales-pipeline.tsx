"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import { Progress } from "@vibethink/ui/components/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@vibethink/ui/components/tooltip";
import { useTranslation } from "@/lib/i18n";

type PipelineStage = {
  id: string;
  name: string;
  count: number;
  value: number;
  color: string;
};

const createPipelineData = (t: (key: string) => string): PipelineStage[] => [
  {
    id: "lead",
    name: t('pipeline.stages.prospecting'),
    count: 235,
    value: 420500,
    color: "bg-[var(--chart-1)]"
  },
  {
    id: "qualified",
    name: t('pipeline.stages.qualification'),
    count: 146,
    value: 267800,
    color: "bg-[var(--chart-2)]"
  },
  {
    id: "proposal",
    name: t('pipeline.stages.proposal'),
    count: 84,
    value: 192400,
    color: "bg-[var(--chart-3)]"
  },
  {
    id: "negotiation",
    name: t('pipeline.stages.negotiation'),
    count: 52,
    value: 129600,
    color: "bg-[var(--chart-4)]"
  },
  {
    id: "closed",
    name: t('pipeline.stages.closed'),
    count: 36,
    value: 87200,
    color: "bg-[var(--chart-5)]"
  }
];

export function SalesPipeline() {
  const { t } = useTranslation('crm-v2');
  const pipelineData = createPipelineData(t);
  const totalValue = pipelineData.reduce((sum, stage) => sum + stage.value, 0);
  const totalCount = pipelineData.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('cards.salesPipeline.title')}</CardTitle>
        <CardDescription>{t('cards.salesPipeline.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="mb-6 flex h-4 w-full overflow-hidden rounded-full">
            {pipelineData.map((stage) => (
              <Tooltip key={stage.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`${stage.color} h-full`}
                    style={{ width: `${(stage.value / totalValue) * 100}%` }}></div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-medium">{stage.name}</p>
                    <p className="text-muted-foreground text-xs">{stage.count} {t('pipeline.deals')}</p>
                    <p className="text-muted-foreground text-xs">${stage.value.toLocaleString()}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        <div className="space-y-4">
          {pipelineData.map((stage) => (
            <div key={stage.id} className="flex items-center gap-4">
              <div className={`h-3 w-3 rounded-full ${stage.color}`}></div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{stage.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {stage.count} {t('pipeline.deals')} · ${stage.value.toLocaleString()}
                  </p>
                </div>
                <div className="flex w-24 items-center gap-2">
                  <Progress
                    value={(stage.count / totalCount) * 100}
                    className="h-2"
                    indicatorColor={stage.color}
                  />
                  <span className="text-muted-foreground w-10 text-right text-xs">
                    {Math.round((stage.value / totalValue) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
