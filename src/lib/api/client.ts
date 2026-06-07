import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getValidAccessToken, refreshAccessToken } from "@/lib/token-refresh";
import { clearAuthTokens } from "@/lib/auth-tokens";
import { isPublicPageRoute } from "../public-routes";

/**
 * API Client Configuration
 *
 * Centralized axios instance with authentication and error handling.
 * Automatically attaches access tokens to all requests and handles token refresh.
 */

export interface ApiErrorRespons {
  message: string;
  statusCode: number;
  error?: string;
}

class ApiClient {
  public instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - attach valid auth token
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (!config.url || !config.url.startsWith("/auth")) {
          const token = await getValidAccessToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor - handle errors and retry on 401
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAccessToken();

            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to sign-in (only for protected routes)
            clearAuthTokens();
            if (typeof window !== "undefined") {
              const currentPath = window.location.pathname;
              // Don't redirect if on auth pages or public routes
              if (
                !currentPath.startsWith("/auth/") &&
                !isPublicPageRoute(currentPath)
              ) {
                window.location.href = `/login?redirect_url=${encodeURIComponent(window.location.href)}`;
              }
            }
            return Promise.reject(refreshError);
          }
        }

        if (error.response) {
          // Server responded with error status
          const errorMessage =
            error.response.data?.message || "An error occurred";
          const statusCode = error.response.status;

          // Handle specific status codes
          if (statusCode === 401) {
            // Unauthorized - potentially redirect to login
            console.error("Unauthorized access - token may be invalid");
          } else if (statusCode === 403) {
            // Forbidden - user doesn't have permission
            console.error("Forbidden - insufficient permissions");
          } else if (statusCode === 404) {
            // Not found
            console.error("Resource not found");
          }

          return Promise.reject({
            message: errorMessage,
            statusCode,
            error: error.response.data?.error,
          });
        } else if (error.request) {
          // Request made but no response received
          return Promise.reject({
            message: "Network error - please check your connection",
            statusCode: 0,
          });
        } else {
          // Something else happened
          return Promise.reject({
            message: error.message || "An unexpected error occurred",
            statusCode: 0,
          });
        }
      },
    );
  }

  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export const api = apiClient.getAxiosInstance();
