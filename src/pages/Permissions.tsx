
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { 
  Shield, 
  Users, 
  Plus, 
  Check, 
  X, 
  PlusCircle,
  Settings,
  CircleDashed,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Permission definitions
interface Permission {
  id: string;
  name: string;
  description: string;
  group: string;
}

interface RolePermissions {
  role: User["role"];
  description: string;
  permissions: string[];
}

// Sample permissions
const permissions: Permission[] = [
  { id: "view_roadmap", name: "View Roadmap", description: "View product roadmap", group: "Roadmap" },
  { id: "edit_roadmap", name: "Edit Roadmap", description: "Edit product roadmap", group: "Roadmap" },
  { id: "create_feature", name: "Create Features", description: "Create new features", group: "Features" },
  { id: "edit_feature", name: "Edit Features", description: "Edit existing features", group: "Features" },
  { id: "delete_feature", name: "Delete Features", description: "Delete features", group: "Features" },
  { id: "create_release", name: "Create Releases", description: "Create new releases", group: "Releases" },
  { id: "edit_release", name: "Edit Releases", description: "Edit existing releases", group: "Releases" },
  { id: "delete_release", name: "Delete Releases", description: "Delete releases", group: "Releases" },
  { id: "view_analytics", name: "View Analytics", description: "View product analytics", group: "Analytics" },
  { id: "manage_team", name: "Manage Team", description: "Add/remove team members", group: "Admin" },
  { id: "manage_permissions", name: "Manage Permissions", description: "Edit roles and permissions", group: "Admin" },
];

// Sample role permissions
const initialRolePermissions: RolePermissions[] = [
  {
    role: "admin",
    description: "Full system access",
    permissions: permissions.map(p => p.id)
  },
  {
    role: "product_manager",
    description: "Manage product features and roadmap",
    permissions: ["view_roadmap", "edit_roadmap", "create_feature", "edit_feature", "delete_feature", 
                  "create_release", "edit_release", "delete_release", "view_analytics"]
  },
  {
    role: "executive",
    description: "View product data and analytics",
    permissions: ["view_roadmap", "view_analytics"]
  },
  {
    role: "developer",
    description: "Implement product features",
    permissions: ["view_roadmap", "create_feature", "edit_feature"]
  },
  {
    role: "customer",
    description: "Limited product access",
    permissions: ["view_roadmap"]
  }
];

const Permissions = () => {
  const { hasRole } = useRoleAccess();
  const { currentUser } = useAppContext();
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>(initialRolePermissions);
  const [selectedRole, setSelectedRole] = useState<User["role"] | null>(null);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newPermissions, setNewPermissions] = useState<string[]>([]);
  
  // Check if current user has permission to edit
  const canEditPermissions = currentUser?.role === 'admin';

  // Group permissions by category
  const permissionGroups = permissions.reduce((groups, permission) => {
    if (!groups[permission.group]) {
      groups[permission.group] = [];
    }
    groups[permission.group].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  const handlePermissionToggle = (permissionId: string) => {
    if (!selectedRole || !canEditPermissions) return;
    
    setRolePermissions(prev => 
      prev.map(rp => {
        if (rp.role === selectedRole) {
          return {
            ...rp,
            permissions: rp.permissions.includes(permissionId)
              ? rp.permissions.filter(id => id !== permissionId)
              : [...rp.permissions, permissionId]
          };
        }
        return rp;
      })
    );
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast.error("Role name is required");
      return;
    }
    
    // Convert to valid role format
    const roleId = newRoleName.toLowerCase().replace(/\s+/g, '_') as User["role"];
    
    // Check if role already exists
    if (rolePermissions.some(rp => rp.role === roleId)) {
      toast.error("Role already exists");
      return;
    }
    
    setRolePermissions(prev => [...prev, {
      role: roleId,
      description: newRoleDescription,
      permissions: newPermissions
    }]);
    
    setIsAddingRole(false);
    setNewRoleName("");
    setNewRoleDescription("");
    setNewPermissions([]);
    toast.success("New role created");
  };

  const handleSaveChanges = () => {
    toast.success("Permission changes saved successfully");
  };

  if (!canEditPermissions) {
    return (
      <>
        <PageTitle
          title="Permissions"
          description="Manage access control for your product"
        />
        
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Access Restricted</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                You don't have permission to view this page. Please contact your administrator for access.
              </p>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageTitle
        title="Permissions"
        description="Manage access control for your product"
        action={{
          label: "Save Changes",
          icon: <Shield className="h-4 w-4" />,
          onClick: handleSaveChanges
        }}
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Role list */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>
              Select a role to manage its permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rolePermissions.map((role) => (
                <div
                  key={role.role}
                  className={`p-3 rounded-md cursor-pointer flex justify-between items-center border ${
                    selectedRole === role.role ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedRole(role.role)}
                >
                  <div>
                    <div className="font-medium capitalize">{role.role.replace('_', ' ')}</div>
                    <div className="text-xs text-muted-foreground">{role.description}</div>
                  </div>
                  <CircleDashed className={`h-4 w-4 ${selectedRole === role.role ? "text-primary" : "text-muted-foreground"}`} />
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setIsAddingRole(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Role
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Permission settings */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedRole ? (
                <span className="capitalize">{selectedRole.replace('_', ' ')} Permissions</span>
              ) : (
                "Select a role"
              )}
            </CardTitle>
            <CardDescription>
              {selectedRole ? (
                `Configure permissions for the ${selectedRole.replace('_', ' ')} role`
              ) : (
                "Choose a role from the list to configure its permissions"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRole ? (
              <div className="space-y-6">
                <Tabs defaultValue="byGroup">
                  <TabsList>
                    <TabsTrigger value="byGroup">By Group</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="byGroup" className="space-y-6 pt-4">
                    {Object.entries(permissionGroups).map(([group, groupPermissions]) => (
                      <div key={group}>
                        <h3 className="text-md font-medium mb-3">{group}</h3>
                        <div className="space-y-2">
                          {groupPermissions.map(permission => {
                            const hasPermission = rolePermissions.find(rp => rp.role === selectedRole)?.permissions.includes(permission.id);
                            
                            return (
                              <div 
                                key={permission.id}
                                className="flex items-center justify-between py-2 border-b border-dashed last:border-0"
                              >
                                <div>
                                  <div className="font-medium">{permission.name}</div>
                                  <div className="text-sm text-muted-foreground">{permission.description}</div>
                                </div>
                                <Switch 
                                  checked={!!hasPermission}
                                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                                  disabled={selectedRole === 'admin' && permission.id === 'manage_permissions'}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="list" className="pt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Permission</TableHead>
                          <TableHead>Group</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[100px] text-right">Access</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permissions.map(permission => {
                          const hasPermission = rolePermissions.find(rp => rp.role === selectedRole)?.permissions.includes(permission.id);
                          
                          return (
                            <TableRow key={permission.id}>
                              <TableCell className="font-medium">{permission.name}</TableCell>
                              <TableCell>{permission.group}</TableCell>
                              <TableCell>{permission.description}</TableCell>
                              <TableCell className="text-right">
                                <Switch 
                                  checked={!!hasPermission}
                                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                                  disabled={selectedRole === 'admin' && permission.id === 'manage_permissions'}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Role Selected</h3>
                <p className="text-muted-foreground mt-2 text-center max-w-md">
                  Select a role from the list to view and configure its permissions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create New Role Dialog */}
      <Dialog open={isAddingRole} onOpenChange={setIsAddingRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Add a new role with custom permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input 
                id="role-name" 
                placeholder="e.g., Support Agent" 
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role-description">Description</Label>
              <Input 
                id="role-description" 
                placeholder="Describe this role's purpose" 
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Initial Permissions</Label>
              <div className="h-60 overflow-y-auto border rounded-md p-2 space-y-2">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between py-1">
                    <div>
                      <div className="font-medium">{permission.name}</div>
                      <div className="text-xs text-muted-foreground">{permission.description}</div>
                    </div>
                    <Switch 
                      checked={newPermissions.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewPermissions([...newPermissions, permission.id]);
                        } else {
                          setNewPermissions(newPermissions.filter(p => p !== permission.id));
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingRole(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Permissions;
