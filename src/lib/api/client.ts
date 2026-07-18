import { ApiReject } from "@/types";
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retried?: boolean;
};

// Middleware only refreshes on page navigations — a client-rendered page
// left open past access-token expiry (or resumed after the tab was asleep)
// gets a 401 on its next query with nothing to recover it, until the vendor
// happens to navigate somewhere. This calls the same rotating-refresh route
// middleware uses, then retries once. Single-flighted here too so the three
// concurrent overview queries share one refresh call instead of each racing
// their own against the one-time-use refresh token.
let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post("/api/auth/refresh", null, { withCredentials: true })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

class ApiClient {
  public instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 30000,
      withCredentials: true, // ← tells axios to include cookies on cross-origin requests
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Response interceptor — normalise errors for the UI
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiReject>) => {
        const originalRequest = error.config as
          | RetriableRequestConfig
          | undefined;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retried
        ) {
          originalRequest._retried = true;

          const refreshed = await refreshSession();
          if (refreshed) {
            return this.instance(originalRequest);
          }

          // Refresh token is dead too — no client-side recovery possible
          if (typeof window !== "undefined") {
            window.location.replace("/login");
          }
        }

        if (error.response) {
          return Promise.reject({
            message: error.response.data?.message || "An error occurred",
            statusCode: error.response.status,
            error: error,
          });
        }

        if (error.request) {
          return Promise.reject({
            message: "Network error - please check your connection",
            statusCode: 0,
          });
        }

        return Promise.reject({
          message: error.message || "An unexpected error occurred",
          statusCode: 0,
        });
      },
    );
  }
}

export const apiClient = new ApiClient();
export const api = apiClient.instance;
