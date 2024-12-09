import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Admin } from '../types';

interface AdminState {
  admins: Admin[];
  selectedAdmin: Admin | null;
  isLoading: boolean;
  error: string | null;
  fetchAdmins: () => Promise<void>;
  createAdmin: (admin: Omit<Admin, 'id'>) => Promise<void>;
  updateAdmin: (id: string, updates: Partial<Admin>) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
  setSelectedAdmin: (admin: Admin | null) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      admins: [],
      selectedAdmin: null,
      isLoading: false,
      error: null,

      fetchAdmins: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .in('role', ['admin', 'superadmin'])
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ admins: data || [] });
        } catch (error) {
          set({ error: 'Failed to fetch admins' });
        } finally {
          set({ isLoading: false });
        }
      },

      createAdmin: async (admin) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('profiles')
            .insert([admin])
            .select()
            .single();

          if (error) throw error;
          set(state => ({ admins: [data, ...state.admins] }));
        } catch (error) {
          set({ error: 'Failed to create admin' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateAdmin: async (id, updates) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          set(state => ({
            admins: state.admins.map(admin => 
              admin.id === id ? { ...admin, ...data } : admin
            ),
            selectedAdmin: state.selectedAdmin?.id === id 
              ? { ...state.selectedAdmin, ...data }
              : state.selectedAdmin
          }));
        } catch (error) {
          set({ error: 'Failed to update admin' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteAdmin: async (id) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

          if (error) throw error;
          set(state => ({
            admins: state.admins.filter(admin => admin.id !== id),
            selectedAdmin: state.selectedAdmin?.id === id ? null : state.selectedAdmin
          }));
        } catch (error) {
          set({ error: 'Failed to delete admin' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      setSelectedAdmin: (admin) => {
        set({ selectedAdmin: admin });
      }
    }),
    {
      name: 'admin-storage',
      getStorage: () => localStorage
    }
  )
);