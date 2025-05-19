
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Settings, 
  Copy, 
  ExternalLink, 
  MessageSquare, 
  ThumbsUp, 
  Users, 
  Filter, 
  Search,
  MoreHorizontal,
  Link
} from "lucide-react";

export const CustomerFeedbackPortal = () => {
  const [portalPreviewUrl, setPortalPreviewUrl] = useState("https://feedback.yourapp.com/portal");
  
  const feedbackItems = [
    {
      id: 1,
      title: "Add dark mode to the application",
      description: "Would love to see a dark mode option for easier use at night.",
      votes: 42,
      status: "under_review",
      comments: 8,
      customer: "Acme Corp",
      createdAt: "2 days ago"
    },
    {
      id: 2,
      title: "Enhance export functionality with PDF support",
      description: "Currently we can only export to CSV, but PDF would be much more useful for sharing.",
      votes: 36,
      status: "planned",
      comments: 12,
      customer: "TechGiant Inc",
      createdAt: "5 days ago"
    },
    {
      id: 3,
      title: "Improve mobile responsiveness",
      description: "The dashboard is difficult to use on mobile devices.",
      votes: 28,
      status: "in_progress",
      comments: 5,
      customer: "Startup Ltd",
      createdAt: "1 week ago"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "under_review":
        return <Badge variant="outline">Under Review</Badge>;
      case "planned":
        return <Badge className="bg-blue-500">Planned</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-500">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge>New</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback Portal</CardTitle>
          <CardDescription>
            Configure and manage your public feedback portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Portal URL</h3>
                <div className="flex gap-2">
                  <Input value={portalPreviewUrl} onChange={(e) => setPortalPreviewUrl(e.target.value)} />
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Portal
              </Button>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Portal Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold">152</div>
                    <p className="text-xs text-muted-foreground mt-1">Active Ideas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold">674</div>
                    <p className="text-xs text-muted-foreground mt-1">Total Votes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold">28</div>
                    <p className="text-xs text-muted-foreground mt-1">Companies</p>
                  </CardContent>
                </Card>
              </div>
              <Button className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configure Portal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Feedback</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px]"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {feedbackItems.map(item => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(item.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link className="h-4 w-4 mr-2" />
                        Link to Feature
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Respond
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View in Portal
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-between items-center text-sm">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    <span>{item.votes} votes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>{item.comments} comments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{item.customer}</span>
                  </div>
                </div>
                <span className="text-muted-foreground">Created {item.createdAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
