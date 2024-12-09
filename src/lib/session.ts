import { supabase } from './supabase';
import { config } from '../utils/config';
import type { Session, User } from '@supabase/supabase-js';

export const session = {
  async getCurrentSession(): Promise<Session | null> {
    try {
      // Check for superadmin session
      const storedSession = localStorage.getItem(config.auth.sessionKey);
      if (storedSession) {
        const session = JSON.parse(storedSession);
        if (session.user?.role === 'superadmin') {
          return session;
        }
      }

      // For regular users, get session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<{ data: User | null; error: Error | null }> {
    try {
      // Check for superadmin session
      const storedSession = localStorage.getItem(config.auth.sessionKey);
      if (storedSession) {
        const session = JSON.parse(storedSession);
        if (session.user?.role === 'superadmin') {
          return {
            data: {
              ...session.user,
              avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
              permissions: ['all'],
              status: 'active',
              last_login: new Date().toISOString()
            },
            error: null
          };
        }
      }

      // For regular users
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      if (!user) {
        return { data: null, error: new Error('User not found') };
      }

      // Get profile from database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return { data: null, error: new Error(profileError.message) };
      }

      return { 
        data: { ...user, ...profile },
        error: null 
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Unknown error occurred') 
      };
    }
  }
};