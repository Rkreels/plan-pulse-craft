
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTitle } from "@/components/common/PageTitle";
import { useAppContext } from "@/contexts/AppContext";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

const Roadmap = () => {
  const { roadmapViews, currentView, setCurrentView } = useAppContext();

  // Simple timeline view of goals, epics, and releases
  const renderTimelineView = () => {
    const { goals, initiatives, releases, epics } = useAppContext();
    
    // Sort items by date
    const sortedGoals = [...goals].sort((a, b) => {
      const dateA = a.targetDate ? new Date(a.targetDate).getTime() : 0;
      const dateB = b.targetDate ? new Date(b.targetDate).getTime() : 0;
      return dateA - dateB;
    });
    
    const sortedReleases = [...releases].sort((a, b) => {
      return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
    });
    
    // Create quarters for the next 12 months
    const now = new Date();
    const quarters = [];
    
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
        end: quarterEnd
      });
    }
    
    return (
      <div className="mt-6">
        <div className="grid grid-cols-4 gap-4 mb-2">
          {quarters.map((quarter, i) => (
            <div key={i} className="px-4 py-2 bg-muted rounded-md text-center">
              <h3 className="font-medium">{quarter.name}</h3>
            </div>
          ))}
        </div>
        
        <div className="space-y-8 mt-6">
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge className="bg-primary">Goals</Badge>
              Strategic Goals
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {quarters.map((quarter, i) => (
                <div key={i} className="border rounded-md p-3 h-full">
                  {sortedGoals
                    .filter(g => {
                      if (!g.targetDate) return i === 0;
                      const targetDate = new Date(g.targetDate);
                      return targetDate >= quarter.start && targetDate <= quarter.end;
                    })
                    .map(goal => (
                      <div key={goal.id} className="mb-2 p-2 bg-background rounded-md border">
                        <div className="font-medium text-sm">{goal.title}</div>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                          <span>{goal.status.replace('_', ' ')}</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-1 mt-1" />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge className="bg-green-600">Releases</Badge>
              Product Releases
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {quarters.map((quarter, i) => (
                <div key={i} className="border rounded-md p-3 h-full">
                  {sortedReleases
                    .filter(r => {
                      const releaseDate = new Date(r.releaseDate);
                      return releaseDate >= quarter.start && releaseDate <= quarter.end;
                    })
                    .map(release => (
                      <div key={release.id} className="mb-2 p-2 bg-background rounded-md border">
                        <div className="font-medium text-sm">{release.name} <span className="text-xs">v{release.version}</span></div>
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <Badge className={
                            release.status === "completed" ? "bg-green-500" :
                            release.status === "in_progress" ? "bg-blue-500" :
                            release.status === "delayed" ? "bg-red-500" :
                            "bg-slate-500"
                          }>
                            {release.status}
                          </Badge>
                          <span className="text-muted-foreground">{new Date(release.releaseDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge className="bg-blue-600">Epics</Badge>
              Development Epics
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {quarters.map((quarter, i) => (
                <div key={i} className="border rounded-md p-3 h-full">
                  {epics
                    .filter(e => {
                      if (!e.targetDate) return i === 0;
                      const targetDate = new Date(e.targetDate);
                      return targetDate >= quarter.start && targetDate <= quarter.end;
                    })
                    .map(epic => (
                      <div key={epic.id} className="mb-2 p-2 bg-background rounded-md border">
                        <div className="font-medium text-sm">{epic.title}</div>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                          <span>{epic.status.replace('_', ' ')}</span>
                          <span>{epic.progress}%</span>
                        </div>
                        <Progress value={epic.progress} className="h-1 mt-1" />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <PageTitle
        title="Product Roadmap"
        description="Strategic view of your product plan"
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Select
            value={currentView?.id || ""}
            onValueChange={(value) => {
              const view = roadmapViews.find(v => v.id === value);
              if (view) setCurrentView(view);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roadmap Views</SelectLabel>
                {roadmapViews.map(view => (
                  <SelectItem key={view.id} value={view.id}>
                    {view.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Badge variant="outline" className="capitalize">
            {currentView?.type || "timeline"}
          </Badge>
        </div>
      </div>
      
      {renderTimelineView()}
    </MainLayout>
  );
};

export default Roadmap;
