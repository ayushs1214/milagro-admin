import { useAuthStore } from '../store/authStore';
import { can, getPermissions } from '../utils/permissions';

export function usePermissions() {
  const user = useAuthStore(state => state.user);

  return {
    can: (action: string, subject: string) => {
      if (!user) return false;
      return can(user.role, action, subject);
    },
    getPermissions: () => {
      if (!user) return [];
      return getPermissions(user.role);
    }
  };
}