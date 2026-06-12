import axios, { AxiosInstance, AxiosError } from "axios";

export interface ApiErrorResponse {
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
      withCredentials: true, // ← tells axios to include cookies on cross-origin requests
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Response interceptor — normalise errors for the UI
    // No token logic here — middleware owns the auth lifecycle
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorResponse>) => {
        if (error.response) {
          return Promise.reject({
            message: error.response.data?.message || "An error occurred",
            statusCode: error.response.status,
            error: error.response.data?.error,
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
