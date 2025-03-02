/**
 * Permission middleware for Geaux HelpED
 * Created: 2025-03-01 23:50:04 by evopimp
 * 
 * This file defines the permission system used throughout the application
 * for role-based access control.
 */

// Define all possible permissions in the system
const PERMISSIONS = {
  // User management permissions
  USER_VIEW_SELF: 'user:view:self',
  USER_EDIT_SELF: 'user:edit:self',
  USER_VIEW_ANY: 'user:view:any',
  USER_EDIT_ANY: 'user:edit:any',
  USER_CREATE: 'user:create',
  USER_DELETE: 'user:delete',
  USER_MANAGE_ROLES: 'user:manage:roles',
  
  // Care relationship permissions
  RELATION_VIEW_SELF: 'relation:view:self',
  RELATION_VIEW_ANY: 'relation:view:any',
  RELATION_CREATE: 'relation:create',
  RELATION_EDIT: 'relation:edit',
  RELATION_DELETE: 'relation:delete',
  
  // Task management permissions
  TASK_VIEW_SELF: 'task:view:self',
  TASK_VIEW_ASSIGNED: 'task:view:assigned',
  TASK_VIEW_ANY: 'task:view:any',
  TASK_CREATE: 'task:create',
  TASK_EDIT_SELF: 'task:edit:self',
  TASK_EDIT_ASSIGNED: 'task:edit:assigned',
  TASK_EDIT_ANY: 'task:edit:any',
  TASK_DELETE: 'task:delete',
  
  // Health metrics permissions
  HEALTH_VIEW_SELF: 'health:view:self',
  HEALTH_VIEW_ASSIGNED: 'health:view:assigned',
  HEALTH_VIEW_ANY: 'health:view:any',
  HEALTH_CREATE: 'health:create',
  HEALTH_EDIT: 'health:edit',
  HEALTH_DELETE: 'health:delete',
  
  // Medication permissions
  MED_VIEW_SELF: 'med:view:self',
  MED_VIEW_ASSIGNED: 'med:view:assigned',
  MED_VIEW_ANY: 'med:view:any',
  MED_CREATE: 'med:create',
  MED_EDIT: 'med:edit',
  MED_DELETE: 'med:delete',
  
  // Appointment permissions
  APPT_VIEW_SELF: 'appt:view:self',
  APPT_VIEW_ASSIGNED: 'appt:view:assigned',
  APPT_VIEW_ANY: 'appt:view:any',
  APPT_CREATE: 'appt:create',
  APPT_EDIT: 'appt:edit',
  APPT_DELETE: 'appt:delete',
  
  // Note permissions
  NOTE_VIEW_SELF: 'note:view:self',
  NOTE_VIEW_ASSIGNED: 'note:view:assigned',
  NOTE_VIEW_ANY: 'note:view:any',
  NOTE_CREATE: 'note:create',
  NOTE_EDIT_SELF: 'note:edit:self',
  NOTE_EDIT_ASSIGNED: 'note:edit:assigned',
  NOTE_EDIT_ANY: 'note:edit:any',
  NOTE_DELETE: 'note:delete',
  
  // AI assistance permissions
  AI_USE: 'ai:use',
  AI_ADMIN: 'ai:admin',
  
  // System permissions
  SYSTEM_VIEW_LOGS: 'system:view:logs',
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_VIEW_ANALYTICS: 'system:view:analytics'
};

// Define role-based permissions
const ROLE_PERMISSIONS = {
  // Care recipient permissions
  care_recipient: [
    PERMISSIONS.USER_VIEW_SELF,
    PERMISSIONS.USER_EDIT_SELF,
    PERMISSIONS.RELATION_VIEW_SELF,
    PERMISSIONS.TASK_VIEW_SELF,
    PERMISSIONS.TASK_EDIT_SELF,
    PERMISSIONS.HEALTH_VIEW_SELF,
    PERMISSIONS.MED_VIEW_SELF,
    PERMISSIONS.APPT_VIEW_SELF,
    PERMISSIONS.APPT_CREATE,
    PERMISSIONS.NOTE_VIEW_SELF,
    PERMISSIONS.NOTE_CREATE,
    PERMISSIONS.NOTE_EDIT_SELF,
    PERMISSIONS.AI_USE
  ],
  
  // Caregiver permissions
  caregiver: [
    // Self-management permissions
    PERMISSIONS.USER_VIEW_SELF,
    PERMISSIONS.USER_EDIT_SELF,
    
    // Relationship permissions
    PERMISSIONS.RELATION_VIEW_SELF,
    
    // Task permissions
    PERMISSIONS.TASK_VIEW_SELF,
    PERMISSIONS.TASK_VIEW_ASSIGNED,
    PERMISSIONS.TASK_CREATE,
    PERMISSIONS.TASK_EDIT_SELF,
    PERMISSIONS.TASK_EDIT_ASSIGNED,
    
    // Health permissions
    PERMISSIONS.HEALTH_VIEW_SELF,
    PERMISSIONS.HEALTH_VIEW_ASSIGNED,
    PERMISSIONS.HEALTH_CREATE,
    PERMISSIONS.HEALTH_EDIT,
    
    // Medication permissions
    PERMISSIONS.MED_VIEW_SELF,
    PERMISSIONS.MED_VIEW_ASSIGNED,
    PERMISSIONS.MED_CREATE,
    PERMISSIONS.MED_EDIT,
    
    // Appointment permissions
    PERMISSIONS.APPT_VIEW_SELF,
    PERMISSIONS.APPT_VIEW_ASSIGNED,
    PERMISSIONS.APPT_CREATE,
    PERMISSIONS.APPT_EDIT,
    
    // Note permissions
    PERMISSIONS.NOTE_VIEW_SELF,
    PERMISSIONS.NOTE_VIEW_ASSIGNED,
    PERMISSIONS.NOTE_CREATE,
    PERMISSIONS.NOTE_EDIT_SELF,
    PERMISSIONS.NOTE_EDIT_ASSIGNED,
    
    // AI permissions
    PERMISSIONS.AI_USE
  ],
  
  // Admin permissions (has all permissions)
  admin: Object.values(PERMISSIONS)
};

/**
 * Check if a user has required permission
 * @param {string} userRole - The user's role
 * @param {string} permission - The permission to check
 * @returns {boolean} - True if the user has permission
 */
export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

/**
 * Middleware to check if user has required permission
 * @param {string|Array} requiredPermission - Permission(s) required for access
 * @returns {Function} - Express middleware function
 */
export function checkPermission(requiredPermission) {
  return async (req, res, next) => {
    // Get user from previous authentication middleware
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    // Convert single permission to array for consistent checking
    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    
    // Check if user has at least one of the required permissions
    const hasRequiredPermission = permissions.some(permission => 
      hasPermission(user.role, permission)
    );
    
    if (!hasRequiredPermission) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: insufficient permissions' 
      });
    }
    
    next();
  };
}

/**
 * Export constants and functions
 */
export { PERMISSIONS, ROLE_PERMISSIONS };