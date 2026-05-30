import { create } from "zustand";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  organizations?: UserOrganization[];
}

export interface UserOrganization {
  organization_id: string;
  organization_name: string;
  role: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  hasRole: (roles: string[]) => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  hasRole: (roles: string[]) => {
    const user = get().user;

    if (!user?.organizations) return false;

    return user.organizations.some((org) => roles.includes(org.role));
  },
}));
