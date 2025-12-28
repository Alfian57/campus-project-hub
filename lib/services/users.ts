import { api, buildQueryString } from "@/lib/api";
import { UserApiResponse, PaginatedData, LeaderboardEntry } from "@/types/api";

export interface GetUsersParams {
  page?: number;
  perPage?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface UpdateUserInput {
  name?: string;
  university?: string;
  major?: string;
  bio?: string;
  phone?: string;
  avatarUrl?: string;
  role?: string; // Admin only
  password?: string; // Admin only
}

export interface CreateUserParams {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin" | "moderator";
  university?: string;
  major?: string;
}

export const usersService = {
  /**
   * Create user (admin only)
   */
  async createUser(data: CreateUserParams): Promise<UserApiResponse> {
    const response = await api.post<UserApiResponse>("/users", data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to create user");
  },

  /**
   * Get paginated list of users (admin only)
   */
  async getUsers(params: GetUsersParams = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.perPage) queryParams.append("per_page", params.perPage.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.role && params.role !== "all") queryParams.append("role", params.role);
    if (params.status && params.status !== "all") queryParams.append("status", params.status);
    if (params.sortBy) queryParams.append("sort_by", params.sortBy);
    if (params.sortDirection) queryParams.append("sort_direction", params.sortDirection);

    // api.get returns the body directly: { success: true, data: { items: ..., total: ... } }
    const response = await api.get<{
      items: UserApiResponse[];
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    }>(`/users?${queryParams.toString()}`);

    if (response.success && response.data) {
        return {
            items: response.data.items,
            meta: {
                current_page: response.data.page,
                per_page: response.data.perPage,
                total_items: response.data.total,
                total_pages: response.data.totalPages,
            }
        };
    }

    throw new Error(response.message || "Failed to fetch users");
  },
  /**
   * Get single user by ID
   */
  async getUser(id: string): Promise<UserApiResponse> {
    const response = await api.get<UserApiResponse>(`/users/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to fetch user");
  },

  /**
   * Update user profile
   */
  async updateUser(id: string, input: UpdateUserInput): Promise<UserApiResponse> {
    const response = await api.put<UserApiResponse>(`/users/${id}`, input);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to update user");
  },

  /**
   * Delete user (admin only)
   */
  async deleteUser(id: string): Promise<void> {
    const response = await api.delete(`/users/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || "Failed to delete user");
    }
  },

  /**
   * Block user (moderator/admin only)
   */
  async blockUser(id: string, reason?: string): Promise<void> {
    const response = await api.post(`/users/${id}/block`, { reason });
    
    if (!response.success) {
      throw new Error(response.message || "Failed to block user");
    }
  },

  /**
   * Unblock user (moderator/admin only)
   */
  async unblockUser(id: string): Promise<void> {
    const response = await api.post(`/users/${id}/unblock`);
    
    if (!response.success) {
      throw new Error(response.message || "Failed to unblock user");
    }
  },

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await api.get<LeaderboardEntry[]>(`/users/leaderboard?limit=${limit}`);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Return empty array if data is not an array
      return [];
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  },
};
