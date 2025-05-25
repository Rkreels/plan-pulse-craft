
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface NotificationRule {
  id: string;
  name: string;
  trigger: string;
  method: string;
  recipients: string[];
  template: string;
  enabled: boolean;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    { id: "1", title: "New feedback received", message: "Dark mode feature request", time: "2 min ago", read: false },
    { id: "2", title: "Feedback status updated", message: "Export to PDF moved to In Progress", time: "1 hour ago", read: true },
    { id: "3", title: "High priority feedback", message: "Critical bug report received", time: "3 hours ago", read: false },
  ]);

  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: "1",
      name: "New Feedback Alert",
      trigger: "new_feedback",
      method: "email",
      recipients: ["admin@company.com"],
      template: "default",
      enabled: true
    },
    {
      id: "2",
      name: "High Priority Items",
      trigger: "high_votes",
      method: "slack",
      recipients: ["#product-team"],
      template: "urgent",
      enabled: true
    }
  ]);

  const [newRule, setNewRule] = useState({
    name: "",
    trigger: "",
    method: "",
    recipients: "",
    template: ""
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const toggleRule = (id: string) => {
    setRules(prev => 
      prev.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)
    );
  };

  const addRule = () => {
    if (!newRule.name || !newRule.trigger) {
      toast.error("Please fill in required fields");
      return;
    }

    const rule: NotificationRule = {
      id: Date.now().toString(),
      ...newRule,
      recipients: newRule.recipients.split(",").map(r => r.trim()),
      enabled: true
    };

    setRules(prev => [...prev, rule]);
    setNewRule({ name: "", trigger: "", method: "", recipients: "", template: "" });
    toast.success("Notification rule added");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-3 rounded-md border ${
                  !notification.read ? "bg-blue-50 border-blue-200" : "bg-muted/20"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rules.map(rule => (
              <div key={rule.id} className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <h4 className="font-medium">{rule.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {rule.trigger} → {rule.method}
                  </p>
                </div>
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule.id)}
                />
              </div>
            ))}

            <div className="border-t pt-4 space-y-3">
              <h4 className="font-medium">Add New Rule</h4>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Rule name"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                />
                <Select value={newRule.trigger} onValueChange={(value) => setNewRule(prev => ({ ...prev, trigger: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_feedback">New Feedback</SelectItem>
                    <SelectItem value="high_votes">High Votes</SelectItem>
                    <SelectItem value="status_change">Status Change</SelectItem>
                    <SelectItem value="weekly_summary">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select value={newRule.method} onValueChange={(value) => setNewRule(prev => ({ ...prev, method: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Recipients (comma separated)"
                  value={newRule.recipients}
                  onChange={(e) => setNewRule(prev => ({ ...prev, recipients: e.target.value }))}
                />
              </div>
              <Button onClick={addRule} className="w-full">Add Rule</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
