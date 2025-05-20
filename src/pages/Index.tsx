
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, CalendarDays, Goal, LightbulbIcon, Users } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { AddEditFeatureDialog } from "@/components/dialogs/AddEditFeatureDialog";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addFeature } = useAppContext();
  const navigate = useNavigate();

  const handleAddFeatureIdea = () => {
    setIsDialogOpen(true);
  };

  const handleSaveFeature = (feature) => {
    addFeature({ ...feature, status: "idea" });
    // Navigate to ideas page after adding a feature idea
    navigate("/ideas");
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome to PlanPulseCraft</h2>
            <p className="text-muted-foreground">
              Your product planning workspace
            </p>
          </div>
          <div>
            <Button className="flex gap-2" onClick={handleAddFeatureIdea}>
              <LightbulbIcon className="h-4 w-4" />
              New Feature Idea
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Features</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                +6 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <Goal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                3 near completion
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Release</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">v1.2</div>
              <p className="text-xs text-muted-foreground">
                Due in 12 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                3 pending invites
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>
                Latest customer feedback and feature requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Improved export functionality</h4>
                    <span className="text-xs bg-blue-100 text-blue-600 rounded px-2 py-1">customer</span>
                  </div>
                  <p className="text-sm text-muted-foreground">We need the ability to export our roadmaps as PDF...</p>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Add Jira integration</h4>
                    <span className="text-xs bg-purple-100 text-purple-600 rounded px-2 py-1">internal</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Would love to have two-way sync with Jira...</p>
                </div>
                <div className="pb-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Custom fields for features</h4>
                    <span className="text-xs bg-orange-100 text-orange-600 rounded px-2 py-1">sales</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Customers are asking for custom fields...</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Prioritized Features</CardTitle>
              <CardDescription>
                Top features by priority score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b pb-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">1</div>
                  <div className="flex-1">
                    <h4 className="font-medium">Kanban board view</h4>
                    <p className="text-sm text-muted-foreground">Visual feature management</p>
                  </div>
                  <div className="text-sm font-medium">92</div>
                </div>
                <div className="flex items-center gap-4 border-b pb-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">2</div>
                  <div className="flex-1">
                    <h4 className="font-medium">AI feature suggestions</h4>
                    <p className="text-sm text-muted-foreground">Smart feature grouping</p>
                  </div>
                  <div className="text-sm font-medium">85</div>
                </div>
                <div className="flex items-center gap-4 pb-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">3</div>
                  <div className="flex-1">
                    <h4 className="font-medium">Slack integration</h4>
                    <p className="text-sm text-muted-foreground">Real-time notifications</p>
                  </div>
                  <div className="text-sm font-medium">78</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <AddEditFeatureDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSaveFeature}
        />
      </div>
  );
};

export default Index;
