import { api, setAuthTokens, clearAuthTokens } from "@/lib/api";
import {
  LoginResponse,
  RegisterResponse,
  MeResponse,
  TokenPair,
  UserApiResponse,
} from "@/types/api";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  university?: string;
  major?: string;
}

export const authService = {
  /**
   * Login with email and password
   */
  async login(input: LoginInput): Promise<{ user: UserApiResponse; token: TokenPair }> {
    const response = await api.post<LoginResponse>("/auth/login", input);
    
    if (response.success && response.data) {
      setAuthTokens(response.data.token.accessToken, response.data.token.refreshToken);
      return response.data;
    }
    
    throw new Error(response.message || "Login failed");
  },

  /**
   * Register new user
   */
  async register(input: RegisterInput): Promise<{ user: UserApiResponse; token: TokenPair }> {
    const response = await api.post<RegisterResponse>("/auth/register", input);
    
    if (response.success && response.data) {
      setAuthTokens(response.data.token.accessToken, response.data.token.refreshToken);
      return response.data;
    }
    
    throw new Error(response.message || "Registration failed");
  },

  /**
   * Get current authenticated user
   */
  async getMe(): Promise<MeResponse> {
    const response = await api.get<MeResponse>("/auth/me");
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to get user");
  },

  /**
   * Logout - clear tokens
   */
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAuthTokens();
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const response = await api.post<{ token: TokenPair }>("/auth/refresh", { refreshToken });
    
    if (response.success && response.data) {
      setAuthTokens(response.data.token.accessToken, response.data.token.refreshToken);
      return response.data.token;
    }
    
    throw new Error(response.message || "Token refresh failed");
  },
};
