import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Users, Target, Star } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { AddEditFeatureDialog } from "@/components/dialogs/AddEditFeatureDialog";
import { Feature } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { features, addFeature, goals, epics, releases } = useAppContext();
  const [newIdeaDialogOpen, setNewIdeaDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddIdea = (feature: Feature) => {
    const newIdea: Feature = {
      ...feature,
      id: feature.id || uuidv4(),
      status: "idea" as const, // Fix: explicitly cast to the correct type
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    addFeature(newIdea);
    toast.success("New idea added successfully");
  };

  const stats = [
    {
      title: "Active Features",
      value: features.filter(f => f.status === "in_progress").length,
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Goals",
      value: goals.length,
      icon: Target,
      color: "text-green-600"
    },
    {
      title: "Epics",
      value: epics.length,
      icon: Star,
      color: "text-purple-600"
    },
    {
      title: "Team Members",
      value: 8,
      icon: Users,
      color: "text-orange-600"
    }
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your product management workspace
            </p>
          </div>
          <Button onClick={() => setNewIdeaDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            New Feature Idea
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Features */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Features</CardTitle>
            <CardDescription>
              Latest updates on your product features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {features.slice(0, 5).map((feature) => (
                <div key={feature.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {feature.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
              {features.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No features yet. Create your first feature to get started!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddEditFeatureDialog
        open={newIdeaDialogOpen}
        onOpenChange={setNewIdeaDialogOpen}
        onSave={handleAddIdea}
      />
    </>
  );
};

export default Index;
