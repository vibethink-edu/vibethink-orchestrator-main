import { Award, Briefcase, DollarSign, FileClock } from "@vibethink/ui/icons";
import { useTranslation } from "@/lib/i18n";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@vibethink/ui";

export function SummaryCards() {
    const { t } = useTranslation('projects');

    return (
        <div className="*:data-[slot=card]:from-primary/10 grid gap-4 *:data-[slot=card]:bg-gradient-to-t md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader>
                    <CardTitle>{t('v2.summaryCards.totalRevenue')}</CardTitle>
                    <CardDescription>
                        <span className="text-green-600">+20.1% </span>{t('summary.fromLastMonth')}
                    </CardDescription>
                    <CardAction>
                        <DollarSign className="text-muted-foreground/50 size-4 lg:size-6" />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="font-display text-2xl lg:text-3xl">$45,231.89</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('v2.summaryCards.activeProjects')}</CardTitle>
                    <CardDescription>
                        <span className="text-green-600">+5.02%</span> {t('summary.fromLastMonth')}
                    </CardDescription>
                    <CardAction>
                        <Briefcase className="text-muted-foreground/50 size-4 lg:size-6" />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="font-display text-2xl lg:text-3xl">1.423</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('v2.summaryCards.newLeads')}</CardTitle>
                    <CardDescription>
                        <span className="text-red-600">-3.58%</span> {t('summary.fromLastMonth')}
                    </CardDescription>
                    <CardAction>
                        <Award className="text-muted-foreground/50 size-4 lg:size-6" />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="font-display text-2xl lg:text-3xl">3.500</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t('v2.summaryCards.timeSpent')}</CardTitle>
                    <CardDescription>
                        <span className="text-red-600">-3.58%</span> {t('summary.fromLastMonth')}
                    </CardDescription>
                    <CardAction>
                        <FileClock className="text-muted-foreground/50 size-4 lg:size-6" />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="font-display text-2xl lg:text-3xl">168h 40m</div>
                </CardContent>
            </Card>
        </div>
    );
}
