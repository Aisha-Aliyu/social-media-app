import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/register", userData);
          localStorage.setItem("chillax_token", data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message ||
            error.response?.data?.errors?.[0]?.msg ||
            "Registration failed";
          return { success: false, message };
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/login", credentials);
          localStorage.setItem("chillax_token", data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message || "Login failed";
          return { success: false, message };
        }
      },

      logout: () => {
        localStorage.removeItem("chillax_token");
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },
    }),
    {
      name: "chillax_user",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
