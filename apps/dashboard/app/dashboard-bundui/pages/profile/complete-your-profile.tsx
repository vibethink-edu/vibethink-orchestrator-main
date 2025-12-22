import { Progress } from "@vibethink/ui/components/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@vibethink/ui/components/card";

export function CompleteYourProfileCard() {
  const progressValue = 66;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Progress value={progressValue} />
        <div className="text-muted-foreground text-sm">%{progressValue}</div>
      </CardContent>
    </Card>
  );
}






