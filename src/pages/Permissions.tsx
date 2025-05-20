
import { useState } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermission {
  roleId: string;
  permissionId: string;
  granted: boolean;
}

const Permissions = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "role-admin",
      name: "Administrator",
      description: "Full access to all features and settings",
      isDefault: false,
      userCount: 1
    },
    {
      id: "role-pm",
      name: "Product Manager",
      description: "Manage product features and roadmap",
      isDefault: true,
      userCount: 2
    },
    {
      id: "role-exec",
      name: "Executive",
      description: "View-only access to all features and reports",
      isDefault: false,
      userCount: 1
    },
    {
      id: "role-dev",
      name: "Developer",
      description: "Access to development-related features",
      isDefault: false,
      userCount: 3
    },
    {
      id: "role-customer",
      name: "Customer",
      description: "Limited access to feedback and feature voting",
      isDefault: false,
      userCount: 5
    }
  ]);

  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "perm-featcreate",
      name: "Create Feature",
      description: "Create new product features",
      category: "Features"
    },
    {
      id: "perm-featedit",
      name: "Edit Feature",
      description: "Modify existing features",
      category: "Features"
    },
    {
      id: "perm-featdelete",
      name: "Delete Feature",
      description: "Remove features from the system",
      category: "Features"
    },
    {
      id: "perm-releasecreate",
      name: "Create Release",
      description: "Create new releases",
      category: "Releases"
    },
    {
      id: "perm-releaseedit",
      name: "Edit Release",
      description: "Modify existing releases",
      category: "Releases"
    },
    {
      id: "perm-feedbackcreate",
      name: "Submit Feedback",
      description: "Submit new feedback",
      category: "Feedback"
    },
    {
      id: "perm-inviteuser",
      name: "Invite Users",
      description: "Invite new users to the system",
      category: "Users"
    },
    {
      id: "perm-settings",
      name: "Manage Settings",
      description: "Access and modify system settings",
      category: "Administration"
    }
  ]);

  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([
    // Admin permissions
    { roleId: "role-admin", permissionId: "perm-featcreate", granted: true },
    { roleId: "role-admin", permissionId: "perm-featedit", granted: true },
    { roleId: "role-admin", permissionId: "perm-featdelete", granted: true },
    { roleId: "role-admin", permissionId: "perm-releasecreate", granted: true },
    { roleId: "role-admin", permissionId: "perm-releaseedit", granted: true },
    { roleId: "role-admin", permissionId: "perm-feedbackcreate", granted: true },
    { roleId: "role-admin", permissionId: "perm-inviteuser", granted: true },
    { roleId: "role-admin", permissionId: "perm-settings", granted: true },
    
    // Product Manager permissions
    { roleId: "role-pm", permissionId: "perm-featcreate", granted: true },
    { roleId: "role-pm", permissionId: "perm-featedit", granted: true },
    { roleId: "role-pm", permissionId: "perm-featdelete", granted: true },
    { roleId: "role-pm", permissionId: "perm-releasecreate", granted: true },
    { roleId: "role-pm", permissionId: "perm-releaseedit", granted: true },
    { roleId: "role-pm", permissionId: "perm-feedbackcreate", granted: true },
    { roleId: "role-pm", permissionId: "perm-inviteuser", granted: true },
    { roleId: "role-pm", permissionId: "perm-settings", granted: false },
    
    // Executive permissions
    { roleId: "role-exec", permissionId: "perm-featcreate", granted: false },
    { roleId: "role-exec", permissionId: "perm-featedit", granted: false },
    { roleId: "role-exec", permissionId: "perm-featdelete", granted: false },
    { roleId: "role-exec", permissionId: "perm-releasecreate", granted: false },
    { roleId: "role-exec", permissionId: "perm-releaseedit", granted: false },
    { roleId: "role-exec", permissionId: "perm-feedbackcreate", granted: true },
    { roleId: "role-exec", permissionId: "perm-inviteuser", granted: false },
    { roleId: "role-exec", permissionId: "perm-settings", granted: false },
    
    // Developer permissions
    { roleId: "role-dev", permissionId: "perm-featcreate", granted: false },
    { roleId: "role-dev", permissionId: "perm-featedit", granted: true },
    { roleId: "role-dev", permissionId: "perm-featdelete", granted: false },
    { roleId: "role-dev", permissionId: "perm-releasecreate", granted: false },
    { roleId: "role-dev", permissionId: "perm-releaseedit", granted: true },
    { roleId: "role-dev", permissionId: "perm-feedbackcreate", granted: true },
    { roleId: "role-dev", permissionId: "perm-inviteuser", granted: false },
    { roleId: "role-dev", permissionId: "perm-settings", granted: false },
    
    // Customer permissions
    { roleId: "role-customer", permissionId: "perm-featcreate", granted: false },
    { roleId: "role-customer", permissionId: "perm-featedit", granted: false },
    { roleId: "role-customer", permissionId: "perm-featdelete", granted: false },
    { roleId: "role-customer", permissionId: "perm-releasecreate", granted: false },
    { roleId: "role-customer", permissionId: "perm-releaseedit", granted: false },
    { roleId: "role-customer", permissionId: "perm-feedbackcreate", granted: true },
    { roleId: "role-customer", permissionId: "perm-inviteuser", granted: false },
    { roleId: "role-customer", permissionId: "perm-settings", granted: false }
  ]);

  const [selectedRole, setSelectedRole] = useState<string>("role-pm");

  const handleCreateRole = () => {
    toast.success("Create role dialog would open here");
  };

  const handleTogglePermission = (permissionId: string) => {
    setRolePermissions(prev => 
      prev.map(rp => 
        rp.roleId === selectedRole && rp.permissionId === permissionId
          ? { ...rp, granted: !rp.granted }
          : rp
      )
    );
    
    const permission = permissions.find(p => p.id === permissionId);
    const role = roles.find(r => r.id === selectedRole);
    
    if (permission && role) {
      const granted = !rolePermissions.find(
        rp => rp.roleId === selectedRole && rp.permissionId === permissionId
      )?.granted;
      
      toast.success(
        granted
          ? `Granted "${permission.name}" permission to ${role.name} role`
          : `Revoked "${permission.name}" permission from ${role.name} role`
      );
    }
  };

  const isPermissionGranted = (permissionId: string) => {
    return rolePermissions.find(
      rp => rp.roleId === selectedRole && rp.permissionId === permissionId
    )?.granted || false;
  };

  // Group permissions by category
  const permissionsByCategory: Record<string, Permission[]> = {};
  permissions.forEach(permission => {
    if (!permissionsByCategory[permission.category]) {
      permissionsByCategory[permission.category] = [];
    }
    permissionsByCategory[permission.category].push(permission);
  });

  return (
    <>
      <PageTitle
        title="Role-Based Permissions"
        description="Configure access control for different user roles"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Select a role to configure permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roles.map(role => (
                <div
                  key={role.id}
                  className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                    selectedRole === role.id ? "bg-primary/10 border border-primary/20" : "hover:bg-accent"
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div>
                    <div className="font-medium">{role.name}</div>
                    <div className="text-sm text-muted-foreground">{role.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {role.isDefault && <Badge variant="outline">Default</Badge>}
                    <Badge>{role.userCount} user{role.userCount !== 1 ? 's' : ''}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full" onClick={handleCreateRole}>Create New Role</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Permissions: {roles.find(r => r.id === selectedRole)?.name}
            </CardTitle>
            <CardDescription>Toggle permissions for this role</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.entries(permissionsByCategory).map(([category, perms]) => (
              <div key={category} className="mb-6">
                <h3 className="font-medium mb-2">{category}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Granted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perms.map(permission => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">{permission.name}</TableCell>
                        <TableCell>{permission.description}</TableCell>
                        <TableCell className="text-right">
                          <Switch
                            checked={isPermissionGranted(permission.id)}
                            onCheckedChange={() => handleTogglePermission(permission.id)}
                            disabled={
                              // Admin always has all permissions
                              selectedRole === "role-admin" || 
                              // Only admin can manage settings
                              (permission.id === "perm-settings" && selectedRole !== "role-admin")
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Permissions;
