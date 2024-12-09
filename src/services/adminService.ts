import { supabase } from '../lib/supabase';
import type { Admin, AdminPermission } from '../types';

export const adminService = {
  async createAdmin(adminData: Omit<Admin, 'id' | 'createdAt' | 'lastLogin'> & { password: string }) {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminData.email,
        password: adminData.password,
        email_confirm: true,
        user_metadata: {
          name: adminData.name,
          role: adminData.role,
          department: adminData.department,
          phone: adminData.phone
        }
      });

      if (authError) throw authError;

      // Then create profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: adminData.name,
          email: adminData.email,
          role: adminData.role,
          status: 'active',
          avatar_url: adminData.avatar,
          department: adminData.department,
          phone: adminData.phone,
          permissions: adminData.permissions
        })
        .select()
        .single();

      if (error) {
        // Cleanup auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw error;
      }

      // Log activity
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: authData.user.id,
          action: 'admin_created',
          details: {
            role: adminData.role,
            department: adminData.department
          }
        });

      return data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  async getAllAdmins() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'superadmin'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  async updateAdmin(id: string, updates: Partial<Admin>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          avatar_url: updates.avatar,
          role: updates.role,
          status: updates.status,
          department: updates.department,
          phone: updates.phone,
          permissions: updates.permissions
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: id,
          action: 'admin_updated',
          details: updates
        });

      return data;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  },

  async updatePermissions(id: string, permissions: AdminPermission[]) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ permissions })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: id,
          action: 'permissions_updated',
          details: { permissions }
        });

      return data;
    } catch (error) {
      console.error('Error updating permissions:', error);
      throw error;
    }
  },

  async deleteAdmin(id: string) {
    try {
      // Log activity before deletion
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: id,
          action: 'admin_deleted',
          details: {}
        });

      // Delete auth user - this will cascade to profile due to ON DELETE CASCADE
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) throw authError;

    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  }
};