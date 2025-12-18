import { Card, CardContent, CardDescription, CardHeader, Badge } from "@vibethink/ui";
import CountAnimation from "@/shared/components/ui/custom/count-animation";

export default function SuccessfulConversionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Successful conversions</CardDescription>
        <div className="flex justify-end -mt-8">
          <Badge variant="default" className="bg-green-500/10 text-green-600 dark:text-green-400">+10.3%</Badge>
        </div>
        <div className="font-display text-3xl">
          <CountAnimation number={1204} />
        </div>
        <div className="text-muted-foreground text-sm">Less than last month</div>
      </CardHeader>
    </Card>
  );
}

