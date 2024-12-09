export type AdminPermission = 
  | 'users.view' 
  | 'users.create' 
  | 'users.edit' 
  | 'users.delete'
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'orders.view'
  | 'orders.process'
  | 'orders.edit'
  | 'inventory.view'
  | 'inventory.manage'
  | 'samples.view'
  | 'samples.manage'
  | 'expo.view'
  | 'expo.manage'
  | 'payments.view'
  | 'payments.manage'
  | 'analytics.view'
  | 'settings.view'
  | 'settings.manage'
  | 'admins.manage';

export interface PermissionGroup {
  name: string;
  permissions: AdminPermission[];
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  avatar: string;
  status: 'active' | 'inactive';
  permissions: AdminPermission[];
  lastLogin: string;
  createdAt: string;
  phone?: string;
  department?: string;
  signature?: string;
}

export type AdminStore = {
  admins: AdminProfile[];
  addAdmin: (admin: AdminProfile) => void;
  updateAdmin: (id: string, updates: Partial<AdminProfile>) => void;
  deleteAdmin: (id: string) => void;
  getAdmin: (id: string) => AdminProfile | undefined;
  getAdminByEmail: (email: string) => AdminProfile | undefined;
};