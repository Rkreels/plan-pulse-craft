
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Feature, Release, Epic } from "@/types";
import { Calendar, Clock, Users, Target } from "lucide-react";

interface RoadmapTimelineProps {
  features: Feature[];
  releases: Release[];
  epics: Epic[];
  timeRange?: string;
  groupBy?: string;
  onFeatureUpdate: (featureId: string, updates: Partial<Feature>) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  features,
  releases,
  epics,
  onFeatureUpdate
}) => {
  const getQuarterData = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    const quarters = [
      { name: "Q1", start: new Date(currentYear, 0, 1), end: new Date(currentYear, 2, 31) },
      { name: "Q2", start: new Date(currentYear, 3, 1), end: new Date(currentYear, 5, 30) },
      { name: "Q3", start: new Date(currentYear, 6, 1), end: new Date(currentYear, 8, 30) },
      { name: "Q4", start: new Date(currentYear, 9, 1), end: new Date(currentYear, 11, 31) }
    ];

    return quarters.map(quarter => {
      const quarterFeatures = features.filter(feature => {
        const featureDate = new Date(feature.createdAt);
        return featureDate >= quarter.start && featureDate <= quarter.end;
      });

      const quarterReleases = releases.filter(release => {
        const releaseDate = new Date(release.releaseDate);
        return releaseDate >= quarter.start && releaseDate <= quarter.end;
      });

      return {
        ...quarter,
        features: quarterFeatures,
        releases: quarterReleases,
        progress: quarterFeatures.length > 0 
          ? (quarterFeatures.filter(f => f.status === "completed").length / quarterFeatures.length) * 100 
          : 0
      };
    });
  };

  const quarterData = getQuarterData();

  const handleStatusChange = (featureId: string, newStatus: Feature["status"]) => {
    onFeatureUpdate(featureId, { status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "review": return "bg-purple-100 text-purple-800";
      case "planned": return "bg-yellow-100 text-yellow-800";
      case "backlog": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {quarterData.map(quarter => (
          <Card key={quarter.name} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{quarter.name} {quarter.start.getFullYear()}</CardTitle>
                <Badge variant="outline">
                  {quarter.features.length} features
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {quarter.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                  {quarter.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Quarter Progress</span>
                  <span>{Math.round(quarter.progress)}%</span>
                </div>
                <Progress value={quarter.progress} className="h-2" />
              </div>

              {quarter.releases.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Releases
                  </h4>
                  <div className="space-y-1">
                    {quarter.releases.map(release => (
                      <div key={release.id} className="text-xs p-2 bg-blue-50 rounded">
                        <div className="font-medium">{release.name}</div>
                        <div className="text-muted-foreground">
                          {new Date(release.releaseDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Features
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {quarter.features.map(feature => (
                    <div key={feature.id} className="p-2 border rounded-sm bg-background">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-medium text-xs line-clamp-2">{feature.title}</h5>
                        <Badge className={`${getPriorityColor(feature.priority)} text-xs`}>
                          {feature.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {feature.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <select
                          value={feature.status}
                          onChange={(e) => handleStatusChange(feature.id, e.target.value as Feature["status"])}
                          className="text-xs border rounded px-1 py-0.5"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="planned">Planned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="completed">Completed</option>
                        </select>
                        <span className="text-xs text-muted-foreground">
                          {feature.progress}%
                        </span>
                      </div>
                      <div className="mt-1">
                        <Progress value={feature.progress} className="h-1" />
                      </div>
                    </div>
                  ))}
                  {quarter.features.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      No features planned
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
