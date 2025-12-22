import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@vibethink/ui/components/card";
import { Button } from "@vibethink/ui/components/button";
import { Progress } from "@vibethink/ui/components/progress";

export default function SavingGoal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saving Goal</CardTitle>
        <CardDescription>75% Progress</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            View Report
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="font-display text-4xl">
            $1052.98
            <span className="text-muted-foreground ml-2 text-sm font-normal">of $1,200</span>
          </div>
          <Progress
            value={75}
            className="h-3"
            indicatorColor="bg-linear-to-r from-chart-1 to-chart-3"
          />
        </div>
      </CardContent>
    </Card>
  );
}
