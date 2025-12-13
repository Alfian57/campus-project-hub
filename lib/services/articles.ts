import { api, buildQueryString } from "@/lib/api";
import { ArticleApiResponse, PaginatedData } from "@/types/api";

export interface GetArticlesParams {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  status?: string;
  userId?: string;
}

export interface CreateArticleInput {
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl?: string;
  category?: string;
  status?: "published" | "draft";
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {}

export const articlesService = {
  /**
   * Get paginated list of articles
   */
  async getArticles(params: GetArticlesParams = {}): Promise<PaginatedData<ArticleApiResponse>> {
    const queryString = buildQueryString({
      page: params.page || 1,
      perPage: params.perPage || 12,
      search: params.search,
      category: params.category,
      status: params.status,
      userId: params.userId,
    });
    
    const response = await api.get<PaginatedData<ArticleApiResponse>>(`/articles${queryString}`);
    
    if (response.success && response.data) {
      return response.data;
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
};
