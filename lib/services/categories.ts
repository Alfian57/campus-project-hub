import { api } from "@/lib/api";
import { CategoryApiResponse } from "@/types/api";

export interface CreateCategoryInput {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export const categoriesService = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<CategoryApiResponse[]> {
    const response = await api.get<CategoryApiResponse[]>("/categories");
    
    if (response.success && response.data) {
      return response.data;
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
