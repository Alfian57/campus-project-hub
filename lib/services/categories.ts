import { api } from "@/lib/api";
import { CategoryApiResponse } from "@/types/api";

export interface CreateCategoryInput {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export interface GetCategoriesParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export const categoriesService = {
  // Get all categories (paginated)
  async getCategories(params: GetCategoriesParams = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.perPage) queryParams.append("perPage", params.perPage.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sort_by", params.sortBy);
    if (params.sortDirection) queryParams.append("sort_direction", params.sortDirection);

    const response = await api.get<{
        items: CategoryApiResponse[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>(`/categories?${queryParams.toString()}`);

    if (response.success && response.data) {
        return {
            items: response.data.items || [],
            meta: {
                current_page: response.data.page || 1,
                per_page: response.data.perPage || 10,
                total_items: response.data.total || 0,
                total_pages: response.data.totalPages || 1,
            }
        };
    }

    throw new Error(response.message || "Failed to fetch categories");
  },

  /**
   * Get single category by ID
   */
  async getCategory(id: string): Promise<CategoryApiResponse> {
    const response = await api.get<CategoryApiResponse>(`/categories/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to fetch category");
  },

  /**
   * Create new category (admin only)
   */
  async createCategory(input: CreateCategoryInput): Promise<CategoryApiResponse> {
    const response = await api.post<CategoryApiResponse>("/categories", input);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to create category");
  },

  /**
   * Update category (admin only)
   */
  async updateCategory(id: string, input: UpdateCategoryInput): Promise<CategoryApiResponse> {
    const response = await api.put<CategoryApiResponse>(`/categories/${id}`, input);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to update category");
  },

  /**
   * Delete category (admin only)
   */
  async deleteCategory(id: string): Promise<void> {
    const response = await api.delete(`/categories/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || "Failed to delete category");
    }
  },
};
