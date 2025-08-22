import { Feature, Release, Epic } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface RoadmapTimelineProps {
  features: Feature[];
  releases: Release[];
  epics: Epic[];
  timeRange: string;
  groupBy: string;
  onFeatureUpdate: (featureId: string, updates: any) => void;
}

export function RoadmapTimeline({ 
  features, 
  releases, 
  epics, 
  timeRange, 
  groupBy, 
  onFeatureUpdate 
}: RoadmapTimelineProps) {
  const getGroupedFeatures = () => {
    switch (groupBy) {
      case "release":
        return releases.map(release => ({
          title: release.name,
          items: features.filter(f => f.releaseId === release.id)
        }));
      case "epic":
        return epics.map(epic => ({
          title: epic.title,
          items: features.filter(f => f.epicId === epic.id)
        }));
      case "quarter":
        return [
          { title: "Q1 2024", items: features.slice(0, Math.ceil(features.length / 4)) },
          { title: "Q2 2024", items: features.slice(Math.ceil(features.length / 4), Math.ceil(features.length / 2)) },
          { title: "Q3 2024", items: features.slice(Math.ceil(features.length / 2), Math.ceil(features.length * 3 / 4)) },
          { title: "Q4 2024", items: features.slice(Math.ceil(features.length * 3 / 4)) }
        ];
      default:
        return [{ title: "All Features", items: features }];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
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

  const groupedFeatures = getGroupedFeatures();

  return (
    <div className="space-y-6">
      {groupedFeatures.map((group, index) => (
        <div key={index} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
          
          {group.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No features in this group
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map(feature => (
                <Card key={feature.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium line-clamp-2">
                        {feature.title}
                      </CardTitle>
                      <Badge className={getPriorityColor(feature.priority)}>
                        {feature.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {feature.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className={getStatusColor(feature.status)}>
                        {feature.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {feature.progress}%
                      </span>
                    </div>
                    
                    <Progress value={feature.progress} className="h-2" />
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Effort: {feature.effort}/10</span>
                      <span>Value: {feature.value}/10</span>
                    </div>
                    
                    {feature.tags && feature.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {feature.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {feature.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{feature.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {groupedFeatures.every(group => group.items.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No features to display</h3>
          <p className="text-gray-500">
            Add features to your roadmap to see them here
          </p>
        </div>
      )}
    </div>
  );
}