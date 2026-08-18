import axios from "axios";
import { API_URL } from "./constants";

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const RETRYABLE_CODES = new Set(["ERR_NETWORK", "ECONNABORTED", "ECONNRESET", "ETIMEDOUT"]);
const MAX_RETRIES = 2;

// Response interceptor - handle token refresh + transient network retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const isAuthError = error.response?.status === 401 && !originalRequest._retry;

    if (isAuthError) {
      originalRequest._retry = true;

      try {
        const refresh_token = localStorage.getItem("refresh_token");
        if (refresh_token) {
          const { data } = await axios.post(
            `${API_URL}/api/v1/auth/refresh`,
            { refresh_token }
          );

          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);

          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    const method = (originalRequest.method || "get").toLowerCase();
    const retries = originalRequest._retryCount ?? 0;
    const isRetryable =
      method === "get" &&
      retries < MAX_RETRIES &&
      !error.response &&
      (RETRYABLE_CODES.has(error.code) || error.message === "Network Error");

    if (isRetryable) {
      originalRequest._retryCount = retries + 1;
      await new Promise((resolve) => setTimeout(resolve, 2000 * (retries + 1)));
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
