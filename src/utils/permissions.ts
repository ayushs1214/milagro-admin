import type { AdminPermission, PermissionGroup } from '../types/admin';

export const permissionGroups: PermissionGroup[] = [
  {
    name: 'User Management',
    permissions: ['users.view', 'users.create', 'users.edit', 'users.delete']
  },
  {
    name: 'Product Management',
    permissions: ['products.view', 'products.create', 'products.edit', 'products.delete']
  },
  {
    name: 'Order Management',
    permissions: ['orders.view', 'orders.process', 'orders.edit']
  },
  {
    name: 'Inventory Management',
    permissions: ['inventory.view', 'inventory.manage']
  },
  {
    name: 'Sample Management',
    permissions: ['samples.view', 'samples.manage']
  },
  {
    name: 'Expo Management',
    permissions: ['expo.view', 'expo.manage']
  },
  {
    name: 'Payment Management',
    permissions: ['payments.view', 'payments.manage']
  },
  {
    name: 'Analytics',
    permissions: ['analytics.view']
  },
  {
    name: 'Settings',
    permissions: ['settings.view', 'settings.manage']
  },
  {
    name: 'Admin Management',
    permissions: ['admins.manage']
  }
];

export const getPermissionLabel = (permission: AdminPermission): string => {
  const [module, action] = permission.split('.');
  return `${action.charAt(0).toUpperCase() + action.slice(1)} ${module.charAt(0).toUpperCase() + module.slice(1)}`;
};

export const hasPermission = (userPermissions: AdminPermission[], requiredPermission: AdminPermission): boolean => {
  // If user has 'all' permission, they can do everything
  if (userPermissions.includes('all' as AdminPermission)) {
    return true;
  }

  // Check for specific permission
  return userPermissions.includes(requiredPermission);
};

export const can = (role: string, action: string, subject: string): boolean => {
  // Superadmin can do everything
  if (role === 'superadmin') {
    return true;
  }

  // Convert action and subject to permission format (e.g., "users.create")
  const permission = `${subject}.${action}` as AdminPermission;

  // For regular admins, check if they have the specific permission
  const adminPermissions = permissionGroups
    .flatMap(group => group.permissions);

  return adminPermissions.includes(permission);
};

export const getPermissions = (role: string): AdminPermission[] => {
  if (role === 'superadmin') {
    return ['all' as AdminPermission];
  }

  // Return all available permissions for admins
  return permissionGroups.flatMap(group => group.permissions);
};