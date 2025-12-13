import { api } from "@/lib/api";
import { GamificationStats, GamificationConfig } from "@/types/api";

export const gamificationService = {
  /**
   * Get gamification configuration (public)
   */
  async getConfig(): Promise<GamificationConfig> {
    const response = await api.get<GamificationConfig>("/gamification/config");
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to fetch gamification config");
  },

  /**
   * Get current user's gamification stats (auth required)
   */
  async getStats(): Promise<GamificationStats> {
    const response = await api.get<GamificationStats>("/gamification/stats");
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to fetch gamification stats");
  },
};
