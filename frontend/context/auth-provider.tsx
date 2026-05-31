"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import api from "@/lib/axios";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setTokens } = useAuthStore();
  const { setUser, user } = useUserStore();

  useEffect(() => {
    const initializeAuth = async () => {
      // Helper to parse cookies
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      };

      const access = getCookie("access_token");
      const refresh = getCookie("refresh_token");

      if (access && refresh) {
        // Hydrate the zustand store so axios interceptor can use the token
        setTokens(access, refresh);

        if (!user) {
          try {
            const userRes = await api.get("/profile/");
            setUser(userRes.data);
          } catch (e) {
            console.error("Failed to fetch user on refresh", e);
          }
        }
      }
    };

    initializeAuth();
  }, [setTokens, setUser, user]);

  return <>{children}</>;
}
