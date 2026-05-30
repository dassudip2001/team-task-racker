import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

api.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/refresh/`,
          {
            refresh: refreshToken,
          },
        );

        const newAccess = response.data.access;

        useAuthStore.getState().setTokens(newAccess, refreshToken!);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
