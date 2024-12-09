import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAdminStore } from '../store/adminStore';
import type { AdminProfile } from '../types/admin';

export function useAdminSubscription() {
  const { addAdmin, updateAdmin, deleteAdmin } = useAdminStore();

  useEffect(() => {
    // Subscribe to changes in admin_profiles table
    const subscription = supabase
      .channel('admin_profiles_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_profiles'
        },
        (payload) => {
          // Handle new admin creation
          const newAdmin = payload.new as AdminProfile;
          addAdmin(newAdmin);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'admin_profiles'
        },
        (payload) => {
          // Handle admin updates
          const updatedAdmin = payload.new as AdminProfile;
          updateAdmin(updatedAdmin.id, updatedAdmin);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'admin_profiles'
        },
        (payload) => {
          // Handle admin deletion
          const deletedAdmin = payload.old as AdminProfile;
          deleteAdmin(deletedAdmin.id);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [addAdmin, updateAdmin, deleteAdmin]);
}