import { Button } from "@vibethink/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import { Progress } from "@vibethink/ui/components/progress";

export default function UpgradePlanCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Plan</CardTitle>
        <div className="flex justify-end -mt-8">
          <Button variant="outline" size="sm">
            Upgrade Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={25} />
        <div className="text-muted-foreground text-sm">You used 215 of 2000 of your API</div>
      </CardContent>
    </Card>
  );
}





