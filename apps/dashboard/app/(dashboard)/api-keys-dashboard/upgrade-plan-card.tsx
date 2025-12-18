import { Button, Card, CardAction, CardContent, CardHeader, CardTitle, Progress } from "@vibethink/ui";

export default function UpgradePlanCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Plan</CardTitle>
        <CardAction>
          <Button variant="outline" size="sm" className="-mt-3">
            Upgrade Plan
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={25} />
        <div className="text-muted-foreground text-sm">You used 215 of 2000 of your API</div>
      </CardContent>
    </Card>
  );
}
