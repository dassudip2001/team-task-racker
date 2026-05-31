import { GetUserProfileResponse } from "@/schema/login";
import { create } from "zustand";

interface UserState {
  user: GetUserProfileResponse | null;
  setUser: (user: GetUserProfileResponse) => void;
  clearUser: () => void;
  hasRole: (roles: string) => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  hasRole: (roles: string) => {
    const user = get().user;

    if (!user?.user?.role) return false;
    return user.user.role === roles;

    // return user.user.org.some((org) => roles.includes(org.role));
  },
}));
