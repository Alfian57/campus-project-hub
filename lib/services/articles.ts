import { api, buildQueryString } from "@/lib/api";
import { ArticleApiResponse, PaginatedData } from "@/types/api";

export interface GetArticlesParams {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  status?: string;
  userId?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface CreateArticleInput {
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl?: string;
  category?: string;
  status?: string;
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {}

export const articlesService = {
  /**
   * Get paginated list of articles
   */
  async getArticles(params: GetArticlesParams = {}): Promise<PaginatedData<ArticleApiResponse>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.perPage) queryParams.append("perPage", params.perPage.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.status) queryParams.append("status", params.status);
    if (params.userId) queryParams.append("user_id", params.userId);
    if (params.sortBy) queryParams.append("sort_by", params.sortBy);
    if (params.sortDirection) queryParams.append("sort_direction", params.sortDirection);

    const response = await api.get<{
        items: ArticleApiResponse[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>(`/articles?${queryParams.toString()}`);
    
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
    
    throw new Error(response.message || "Failed to fetch articles");
  },

  /**
   * Get single article by ID
   */
  async getArticle(id: string): Promise<ArticleApiResponse> {
    const response = await api.get<ArticleApiResponse>(`/articles/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to fetch article");
  },

  /**
   * Create new article
   */
  async createArticle(input: CreateArticleInput): Promise<ArticleApiResponse> {
    const response = await api.post<ArticleApiResponse>("/articles", input);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to create article");
  },

  /**
   * Update existing article
   */
  async updateArticle(id: string, input: UpdateArticleInput): Promise<ArticleApiResponse> {
    const response = await api.put<ArticleApiResponse>(`/articles/${id}`, input);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to update article");
  },

  /**
   * Delete article
   */
  async deleteArticle(id: string): Promise<void> {
    const response = await api.delete(`/articles/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || "Failed to delete article");
    }
  },

  /**
   * Record article view
   */
  async recordView(id: string): Promise<void> {
    await api.post(`/articles/${id}/view`);
  },

  /**
   * Block article (admin only)
   */
  async blockArticle(id: string): Promise<void> {
    const response = await api.post(`/articles/${id}/block`);
    
    if (!response.success) {
      throw new Error(response.message || "Failed to block article");
    }
  },

  /**
   * Unblock article (admin only)
   */
  async unblockArticle(id: string): Promise<void> {
    const response = await api.post(`/articles/${id}/unblock`);
    
    if (!response.success) {
      throw new Error(response.message || "Failed to unblock article");
    }
  },
};
