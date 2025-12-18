import { Card, CardAction, CardDescription, CardHeader, Badge } from "@vibethink/ui";
import CountAnimation from "@/shared/components/ui/custom/count-animation";

export default function FailedConversionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Failed conversions</CardDescription>
        <CardAction>
          <Badge variant="destructive">-0.3%</Badge>
        </CardAction>
        <div className="font-display text-3xl">
          <CountAnimation number={23} />
        </div>
        <div className="text-muted-foreground text-sm">More than last month</div>
      </CardHeader>
    </Card>
  );
}
