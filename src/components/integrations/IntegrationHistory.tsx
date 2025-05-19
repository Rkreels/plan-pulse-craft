
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Github, Trello, MessageSquare } from "lucide-react";

export const IntegrationHistory = () => {
  const activities = [
    {
      id: 1,
      integration: "github",
      action: "Issue created",
      details: "Feature #123 linked to GitHub issue #456",
      status: "success",
      timestamp: "Today, 10:23 AM"
    },
    {
      id: 2,
      integration: "jira",
      action: "Ticket updated",
      details: "Status changed from 'In Progress' to 'Ready for QA'",
      status: "success",
      timestamp: "Today, 9:45 AM"
    },
    {
      id: 3,
      integration: "trello",
      action: "Card moved",
      details: "Card 'Mobile Login Screen' moved to 'In Progress'",
      status: "success",
      timestamp: "Yesterday, 4:30 PM"
    },
    {
      id: 4,
      integration: "slack",
      action: "Notification sent",
      details: "Release announcement posted to #product channel",
      status: "success",
      timestamp: "Yesterday, 2:15 PM"
    },
    {
      id: 5,
      integration: "github",
      action: "Pull request linked",
      details: "Feature #124 linked to GitHub PR #789",
      status: "failed",
      timestamp: "Yesterday, 11:05 AM"
    }
  ];

  const getIntegrationIcon = (integration: string) => {
    switch (integration) {
      case "github":
        return <Github className="h-4 w-4" />;
      case "jira":
        return <GitBranch className="h-4 w-4" />;
      case "trello":
        return <Trello className="h-4 w-4" />;
      case "slack":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <GitBranch className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Integration</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getIntegrationIcon(activity.integration)}
                    <span className="capitalize">{activity.integration}</span>
                  </div>
                </TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.details}</TableCell>
                <TableCell>{getStatusBadge(activity.status)}</TableCell>
                <TableCell className="text-right">{activity.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
