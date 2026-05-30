import api from "@/lib/axios";
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;

  setTokens: (access: string, refresh: string) => void;

  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,

  setTokens: (access, refresh) =>
    set({
      accessToken: access,
      refreshToken: refresh,
    }),

  logout: async () => {
    try {
      const refresh = get().refreshToken;
      await api.post(`/logout/`, { refresh });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      set({
        accessToken: null,
        refreshToken: null,
      });
      document.cookie = "access_token=; path=/; max-age=0;";
      document.cookie = "refresh_token=; path=/; max-age=0;";
    }
  },
}));
