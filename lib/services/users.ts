import { api, buildQueryString } from "@/lib/api";
import { UserApiResponse, PaginatedData, LeaderboardEntry } from "@/types/api";

export interface GetUsersParams {
  page?: number;
  perPage?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface UpdateUserInput {
  name?: string;
  university?: string;
  major?: string;
  bio?: string;
  phone?: string;
  avatarUrl?: string;
}

export const usersService = {
  /**
   * Get paginated list of users (admin only)
   */
  async getUsers(params: GetUsersParams = {}): Promise<PaginatedData<UserApiResponse>> {
    const queryString = buildQueryString({
      page: params.page || 1,
      perPage: params.perPage || 12,
      search: params.search,
      role: params.role,
      status: params.status,
    });
    
    const response = await api.get<PaginatedData<UserApiResponse>>(`/users${queryString}`);
    
    if (response.success && response.data) {
      return response.data;
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
