
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

interface SyncEvent {
  id: string;
  integration: string;
  timestamp: string;
  status: "success" | "failed" | "pending";
  itemsProcessed: number;
  details: string;
  duration: string;
}

export const IntegrationHistory = () => {
  const syncHistory: SyncEvent[] = [
    {
      id: "1",
      integration: "GitHub",
      timestamp: "2025-01-15 14:30:00",
      status: "success",
      itemsProcessed: 25,
      details: "Synced 15 issues, 10 pull requests",
      duration: "2.3s"
    },
    {
      id: "2",
      integration: "Slack",
      timestamp: "2025-01-15 14:25:00",
      status: "success",
      itemsProcessed: 3,
      details: "Sent 3 notifications",
      duration: "0.8s"
    },
    {
      id: "3",
      integration: "Trello",
      timestamp: "2025-01-15 14:20:00",
      status: "failed",
      itemsProcessed: 0,
      details: "Authentication failed",
      duration: "1.2s"
    },
    {
      id: "4",
      integration: "GitHub",
      timestamp: "2025-01-15 13:30:00",
      status: "success",
      itemsProcessed: 18,
      details: "Synced 12 issues, 6 pull requests",
      duration: "1.9s"
    },
    {
      id: "5",
      integration: "Figma",
      timestamp: "2025-01-15 13:15:00",
      status: "pending",
      itemsProcessed: 0,
      details: "Sync in progress...",
      duration: "-"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Successful Syncs</span>
            </div>
            <div className="text-2xl font-bold mt-2">127</div>
            <div className="text-sm text-muted-foreground">Last 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="font-medium">Failed Syncs</span>
            </div>
            <div className="text-2xl font-bold mt-2">8</div>
            <div className="text-sm text-muted-foreground">Last 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Items Synced</span>
            </div>
            <div className="text-2xl font-bold mt-2">2,451</div>
            <div className="text-sm text-muted-foreground">Total items</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Avg Duration</span>
            </div>
            <div className="text-2xl font-bold mt-2">1.8s</div>
            <div className="text-sm text-muted-foreground">Per sync</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Activity</CardTitle>
          <CardDescription>Latest integration synchronization events</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Integration</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {syncHistory.map(event => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.integration}</TableCell>
                  <TableCell>{event.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(event.status)}
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{event.itemsProcessed}</TableCell>
                  <TableCell>{event.duration}</TableCell>
                  <TableCell className="max-w-xs truncate">{event.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync Controls</CardTitle>
          <CardDescription>Manage synchronization processes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button>Sync All Integrations</Button>
            <Button variant="outline">Clear History</Button>
            <Button variant="outline">Export Logs</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
