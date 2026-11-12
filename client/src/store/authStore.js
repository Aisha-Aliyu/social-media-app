import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

// The API sleeps on Render's free plan and takes up to a minute to wake, so sign-in and
// sign-up wait longer than other requests.
const AUTH_TIMEOUT_MS = 90000;

// Turn a failed request into a message that says what actually went wrong
const describeError = (error, fallback) => {
  if (error.response) {
    return (
      error.response.data?.message ||
      error.response.data?.errors?.[0]?.msg ||
      fallback
    );
  }
  if (error.code === "ECONNABORTED") {
    return "The server took too long to answer. Please try again.";
  }
  return "Couldn't reach the server. Please try again in a minute.";
};

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
          const { data } = await api.post("/auth/register", userData, {
            timeout: AUTH_TIMEOUT_MS,
          });
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
          return { success: false, message: describeError(error, "Registration failed") };
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/login", credentials, {
            timeout: AUTH_TIMEOUT_MS,
          });
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
          return { success: false, message: describeError(error, "Login failed") };
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
