
import { useAppContext } from "@/contexts/AppContext";
import { User } from "@/types";

// Define role hierarchy
const roleHierarchy: Record<string, number> = {
  "product_manager": 4,
  "executive": 3,
  "developer": 2,
  "customer": 1
};

// Define permissions for each role
const rolePermissions: Record<string, Record<string, boolean>> = {
  "product_manager": {
    "create_goal": true,
    "edit_goal": true,
    "delete_goal": true,
    "create_release": true,
    "edit_release": true,
    "delete_release": true,
    "create_feature": true,
    "edit_feature": true,
    "delete_feature": true,
    "view_roadmap": true,
    "admin_access": true
  },
  "executive": {
    "create_goal": true,
    "edit_goal": true,
    "delete_goal": false,
    "create_release": false,
    "edit_release": false,
    "delete_release": false,
    "create_feature": false,
    "edit_feature": false,
    "delete_feature": false,
    "view_roadmap": true,
    "admin_access": false
  },
  "developer": {
    "create_goal": false,
    "edit_goal": false,
    "delete_goal": false,
    "create_release": false,
    "edit_release": false,
    "delete_release": false,
    "create_feature": true,
    "edit_feature": true,
    "delete_feature": false,
    "view_roadmap": true,
    "admin_access": false
  },
  "customer": {
    "create_goal": false,
    "edit_goal": false,
    "delete_goal": false,
    "create_release": false,
    "edit_release": false,
    "delete_release": false,
    "create_feature": false,
    "edit_feature": false,
    "delete_feature": false,
    "view_roadmap": true,
    "admin_access": false
  }
};

export function useRoleAccess() {
  const { currentUser } = useAppContext();

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return !!rolePermissions[currentUser.role]?.[permission];
  };

  // Check if user's role is equal or higher than specified role
  const hasRole = (requiredRole: User["role"]): boolean => {
    if (!currentUser) return false;
    const userRoleLevel = roleHierarchy[currentUser.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    return userRoleLevel >= requiredRoleLevel;
  };

  // Get current user's role
  const userRole = currentUser?.role || "customer";

  return { hasPermission, hasRole, userRole };
}
