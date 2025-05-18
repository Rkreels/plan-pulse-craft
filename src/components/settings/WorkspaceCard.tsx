
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export const WorkspaceCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium">PlanPulseCraft</p>
        <p className="text-sm text-muted-foreground">
          Product Planning Demo
        </p>
      </CardContent>
    </Card>
  );
};
