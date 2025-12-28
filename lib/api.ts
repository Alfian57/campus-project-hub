import { ApiResponse } from "@/types/api";
import { getApiUrl } from "@/lib/env";

const API_BASE_URL = getApiUrl();

// Token management
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAuthTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearAuthTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Try to refresh token on 401
    if (response.status === 401 && getRefreshToken()) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        // Retry the request with new token
        const newToken = getAuthToken();
        if (newToken) {
          (headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
        }
        const retryResponse = await fetch(url, { ...options, headers });
        const retryData = await retryResponse.json();
        
        if (!retryResponse.ok) {
          throw new ApiError(
            retryResponse.status,
            retryData.message || retryData.error || "Request failed",
            retryData.errors
          );
        }
        return retryData;
      }
    }
    
    throw new ApiError(
      response.status,
      data.message || data.error || "Request failed",
      data.errors
    );
  }

  return data;
}

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${getApiUrl()}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearAuthTokens();
      return false;
    }

    const data = await response.json();
    if (data.success && data.data?.token) {
      setAuthTokens(data.data.token.accessToken, data.data.token.refreshToken);
      return true;
    }
    
    clearAuthTokens();
    return false;
  } catch {
    clearAuthTokens();
    return false;
  }
}

// HTTP method helpers
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: "DELETE" }),

  download: async (endpoint: string, filename: string, options?: RequestInit) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = { ...options?.headers };
    
    const token = getAuthToken();
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    try {
      let response = await fetch(url, { ...options, headers });

      if (response.status === 401 && getRefreshToken()) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          const newToken = getAuthToken();
          if (newToken) {
             (headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
          }
          response = await fetch(url, { ...options, headers });
        }
      }

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  },
};

// Query string builder
export function buildQueryString(params: Record<string, unknown>): string {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
  return query ? `?${query}` : "";
}
