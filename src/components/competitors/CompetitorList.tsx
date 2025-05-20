
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Globe, 
  Users, 
  LineChart,
  Download,
  FileUp
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Competitor {
  id: string;
  name: string;
  description: string;
  website: string;
  marketShare: string;
  strength: string;
  weakness: string;
  threatLevel: string;
}

export const CompetitorList = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([
    {
      id: "1",
      name: "CompeteX",
      description: "Leading product management platform with AI capabilities",
      website: "https://competex.example.com",
      marketShare: "32%",
      strength: "Enterprise scalability",
      weakness: "Limited integrations",
      threatLevel: "high"
    },
    {
      id: "2",
      name: "ProdRival",
      description: "Affordable PM tool focusing on startups and small teams",
      website: "https://prodrival.example.com",
      marketShare: "14%",
      strength: "User-friendly interface",
      weakness: "Limited reporting capabilities",
      threatLevel: "medium"
    },
    {
      id: "3",
      name: "RoadmapGuru",
      description: "Specialized in visual roadmapping and strategy planning",
      website: "https://roadmapguru.example.com",
      marketShare: "8%",
      strength: "Visual roadmapping features",
      weakness: "Lacks comprehensive PM features",
      threatLevel: "low"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCompetitor, setCurrentCompetitor] = useState<Competitor>({
    id: "",
    name: "",
    description: "",
    website: "",
    marketShare: "",
    strength: "",
    weakness: "",
    threatLevel: "medium"
  });

  const getThreatBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge className="bg-red-500">High Threat</Badge>;
      case "medium":
        return <Badge className="bg-orange-500">Medium Threat</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low Threat</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const handleOpenDialog = (competitor?: Competitor) => {
    if (competitor) {
      setCurrentCompetitor({ ...competitor });
      setIsEditMode(true);
    } else {
      setCurrentCompetitor({
        id: Math.random().toString(36).substring(2, 9),
        name: "",
        description: "",
        website: "",
        marketShare: "",
        strength: "",
        weakness: "",
        threatLevel: "medium"
      });
      setIsEditMode(false);
    }
    setIsDialogOpen(true);
  };

  const handleSaveCompetitor = () => {
    if (!currentCompetitor.name) {
      toast.error("Competitor name is required");
      return;
    }

    if (isEditMode) {
      setCompetitors(prev => 
        prev.map(c => c.id === currentCompetitor.id ? currentCompetitor : c)
      );
      toast.success("Competitor updated successfully");
    } else {
      setCompetitors(prev => [...prev, currentCompetitor]);
      toast.success("Competitor added successfully");
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteCompetitor = (id: string) => {
    setCompetitors(prev => prev.filter(c => c.id !== id));
    toast.success("Competitor deleted successfully");
  };

  const handleExportCompetitors = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(competitors, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "competitors.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast.success("Competitors data exported successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Competitors</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCompetitors}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" /> Add Competitor
          </Button>
        </div>
      </div>

      {competitors.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {competitors.map(competitor => (
            <Card key={competitor.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{competitor.name}</CardTitle>
                    <CardDescription>{competitor.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getThreatBadge(competitor.threatLevel)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(competitor)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => window.open(competitor.website, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" /> Visit Website
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteCompetitor(competitor.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {competitor.website}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Market share: {competitor.marketShare}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Tracked since 2023</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Key Strengths</h4>
                    <p className="text-sm text-muted-foreground">{competitor.strength}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Key Weaknesses</h4>
                    <p className="text-sm text-muted-foreground">{competitor.weakness}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-10">
            <FileUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No competitors added yet</h3>
            <p className="text-muted-foreground mb-4">Track your competitors to understand the market better</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Competitor
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Competitor" : "Add New Competitor"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update details for this competitor." 
                : "Add details about a new competitor."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="competitor-name">Name</Label>
              <Input
                id="competitor-name"
                value={currentCompetitor.name}
                onChange={(e) => setCurrentCompetitor({...currentCompetitor, name: e.target.value})}
                placeholder="Competitor name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="competitor-desc">Description</Label>
              <Textarea
                id="competitor-desc"
                value={currentCompetitor.description}
                onChange={(e) => setCurrentCompetitor({...currentCompetitor, description: e.target.value})}
                placeholder="Brief description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="competitor-website">Website</Label>
                <Input
                  id="competitor-website"
                  value={currentCompetitor.website}
                  onChange={(e) => setCurrentCompetitor({...currentCompetitor, website: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="competitor-market">Market Share</Label>
                <Input
                  id="competitor-market"
                  value={currentCompetitor.marketShare}
                  onChange={(e) => setCurrentCompetitor({...currentCompetitor, marketShare: e.target.value})}
                  placeholder="e.g. 15%"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="competitor-strength">Key Strength</Label>
                <Input
                  id="competitor-strength"
                  value={currentCompetitor.strength}
                  onChange={(e) => setCurrentCompetitor({...currentCompetitor, strength: e.target.value})}
                  placeholder="Main strength"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="competitor-weakness">Key Weakness</Label>
                <Input
                  id="competitor-weakness"
                  value={currentCompetitor.weakness}
                  onChange={(e) => setCurrentCompetitor({...currentCompetitor, weakness: e.target.value})}
                  placeholder="Main weakness"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="competitor-threat">Threat Level</Label>
              <Select 
                value={currentCompetitor.threatLevel}
                onValueChange={(value) => setCurrentCompetitor({...currentCompetitor, threatLevel: value})}
              >
                <SelectTrigger id="competitor-threat">
                  <SelectValue placeholder="Select threat level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleSaveCompetitor}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
