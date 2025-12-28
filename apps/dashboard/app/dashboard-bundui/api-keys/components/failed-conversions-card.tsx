import { Card, CardContent, CardDescription, CardHeader } from "@vibethink/ui/components/card";
import { Badge } from "@vibethink/ui/components/badge";
import CountAnimation from "@/shared/components/ui/custom/count-animation";

export default function FailedConversionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Failed conversions</CardDescription>
        <div className="flex justify-end -mt-8">
          <Badge variant="destructive">-0.3%</Badge>
        </div>
        <div className="font-display text-3xl">
          <CountAnimation number={23} />
        </div>
        <div className="text-muted-foreground text-sm">More than last month</div>
      </CardHeader>
    </Card>
  );
}
















