import { supabase } from './supabase';
import { config } from '../utils/config';
import { handleAuthError, isAuthError } from '../utils/errorHandling';
import { validateLoginInput } from '../utils/validation';
import type { AuthResponse } from '@supabase/supabase-js';

export const auth = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // Validate input
      const validation = validateLoginInput(email, password);
      if (!validation.isValid) {
        throw new Error(validation.message || 'Invalid credentials');
      }

      // Check if it's the superadmin login
      if (email.trim().toLowerCase() === config.supabase.defaultAdmin.email && 
          password === config.supabase.defaultAdmin.password) {
        // Create a mock session for superadmin
        const mockSession = {
          access_token: 'superadmin_token',
          refresh_token: 'superadmin_refresh',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer',
          user: {
            id: '00000000-0000-0000-0000-000000000000',
            email: config.supabase.defaultAdmin.email,
            role: 'superadmin',
            app_metadata: { provider: 'email' },
            user_metadata: { name: 'Super Admin' },
            aud: 'authenticated',
            created_at: '2024-01-01T00:00:00Z'
          }
        };

        // Store session in localStorage
        localStorage.setItem(config.auth.sessionKey, JSON.stringify(mockSession));
        localStorage.setItem(config.auth.storageKey, mockSession.access_token);

        return {
          data: {
            user: mockSession.user,
            session: mockSession
          },
          error: null
        };
      }

      // Regular user login
      const response = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (response.error) {
        throw response.error;
      }

      return response;
    } catch (error) {
      if (isAuthError(error)) {
        throw handleAuthError(error);
      }
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      // Clear local storage
      localStorage.removeItem(config.auth.sessionKey);
      localStorage.removeItem(config.auth.storageKey);

      // If not superadmin, also sign out from Supabase
      const session = localStorage.getItem(config.auth.sessionKey);
      if (session && !JSON.parse(session).user?.role === 'superadmin') {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
    } catch (error) {
      if (isAuthError(error)) {
        throw handleAuthError(error);
      }
      throw error;
    }
  }
};