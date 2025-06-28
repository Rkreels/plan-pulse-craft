
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, Users, Edit } from "lucide-react";
import { Goal, Release, Epic, Feature } from "@/types";

interface RoadmapTimelineProps {
  goals: Goal[];
  releases: Release[];
  epics: Epic[];
  features: Feature[];
  onEditGoal?: (goal: Goal) => void;
  onEditRelease?: (release: Release) => void;
  onEditEpic?: (epic: Epic) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  goals,
  releases,
  epics,
  features,
  onEditGoal,
  onEditRelease,
  onEditEpic
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState<number>(0);

  // Create quarters for the next 12 months
  const createQuarters = () => {
    const quarters = [];
    const now = new Date();
    
    for (let i = 0; i < 4; i++) {
      const quarterStart = new Date(now);
      quarterStart.setMonth(now.getMonth() + i * 3);
      quarterStart.setDate(1);
      
      const quarterEnd = new Date(quarterStart);
      quarterEnd.setMonth(quarterStart.getMonth() + 3);
      quarterEnd.setDate(0);
      
      quarters.push({
        name: `Q${Math.floor((quarterStart.getMonth() + 3) / 3)}/${quarterStart.getFullYear()}`,
        start: quarterStart,
        end: quarterEnd,
        index: i
      });
    }
    return quarters;
  };

  const quarters = createQuarters();

  const getItemsForQuarter = <T extends { targetDate?: Date | string }>(
    items: T[], 
    quarter: { start: Date; end: Date }
  ): T[] => {
    return items.filter(item => {
      if (!item.targetDate) return false;
      const targetDate = new Date(item.targetDate);
      return targetDate >= quarter.start && targetDate <= quarter.end;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500 text-white";
      case "in_progress": return "bg-blue-500 text-white";
      case "at_risk": 
      case "delayed": return "bg-red-500 text-white";
      case "review": return "bg-orange-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const renderGoalCard = (goal: Goal) => (
    <Card key={goal.id} className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm line-clamp-2">{goal.title}</h4>
          {onEditGoal && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEditGoal(goal);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {goal.description}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge className={getStatusColor(goal.status)}>
              {goal.status.replace('_', ' ')}
            </Badge>
            <span className="text-xs text-muted-foreground">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-1" />
          {goal.targetDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(goal.targetDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderReleaseCard = (release: Release) => (
    <Card key={release.id} className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-medium text-sm">{release.name}</h4>
            <span className="text-xs text-muted-foreground">v{release.version}</span>
          </div>
          {onEditRelease && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEditRelease(release);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {release.description}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge className={getStatusColor(release.status)}>
              {release.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {features.filter(f => f.releaseId === release.id).length} features
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Release: {new Date(release.releaseDate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEpicCard = (epic: Epic) => (
    <Card key={epic.id} className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm line-clamp-2">{epic.title}</h4>
          {onEditEpic && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEditEpic(epic);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {epic.description}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge className={getStatusColor(epic.status)}>
              {epic.status.replace('_', ' ')}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {features.filter(f => f.epicId === epic.id).length} features
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{epic.progress}%</span>
          </div>
          <Progress value={epic.progress} className="h-1" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Quarter Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quarters.map((quarter, index) => (
          <Button
            key={index}
            variant={selectedQuarter === index ? "default" : "outline"}
            className="p-4 h-auto flex-col"
            onClick={() => setSelectedQuarter(index)}
          >
            <div className="font-medium">{quarter.name}</div>
            <div className="text-xs text-muted-foreground">
              {quarter.start.toLocaleDateString()} - {quarter.end.toLocaleDateString()}
            </div>
          </Button>
        ))}
      </div>

      {/* Timeline Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Goals Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Goals</h3>
            <Badge variant="secondary">
              {getItemsForQuarter(goals, quarters[selectedQuarter]).length}
            </Badge>
          </div>
          <div className="space-y-3">
            {getItemsForQuarter(goals, quarters[selectedQuarter]).map(renderGoalCard)}
            {getItemsForQuarter(goals, quarters[selectedQuarter]).length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No goals this quarter
              </div>
            )}
          </div>
        </div>

        {/* Releases Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Releases</h3>
            <Badge variant="secondary">
              {releases.filter(r => {
                const releaseDate = new Date(r.releaseDate);
                const quarter = quarters[selectedQuarter];
                return releaseDate >= quarter.start && releaseDate <= quarter.end;
              }).length}
            </Badge>
          </div>
          <div className="space-y-3">
            {releases
              .filter(r => {
                const releaseDate = new Date(r.releaseDate);
                const quarter = quarters[selectedQuarter];
                return releaseDate >= quarter.start && releaseDate <= quarter.end;
              })
              .map(renderReleaseCard)}
            {releases.filter(r => {
              const releaseDate = new Date(r.releaseDate);
              const quarter = quarters[selectedQuarter];
              return releaseDate >= quarter.start && releaseDate <= quarter.end;
            }).length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No releases this quarter
              </div>
            )}
          </div>
        </div>

        {/* Epics Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Epics</h3>
            <Badge variant="secondary">
              {getItemsForQuarter(epics, quarters[selectedQuarter]).length}
            </Badge>
          </div>
          <div className="space-y-3">
            {getItemsForQuarter(epics, quarters[selectedQuarter]).map(renderEpicCard)}
            {getItemsForQuarter(epics, quarters[selectedQuarter]).length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No epics this quarter
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
