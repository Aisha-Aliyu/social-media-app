import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("chillax_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally and force logout if token expired. Sign-in and sign-up are
// skipped: a 401 there means a wrong password, and reloading the page would hide
// the error message from the user.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith("/auth/");
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("chillax_token");
      localStorage.removeItem("chillax_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
