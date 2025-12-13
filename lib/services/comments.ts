import { api, buildQueryString } from "@/lib/api";
import { CommentApiResponse, PaginatedData } from "@/types/api";

export interface GetCommentsParams {
  page?: number;
  perPage?: number;
}

export interface CreateCommentInput {
  content: string;
}

export const commentsService = {
  /**
   * Get comments for a project
   */
  async getComments(projectId: string, params: GetCommentsParams = {}): Promise<PaginatedData<CommentApiResponse>> {
    const queryString = buildQueryString({
      page: params.page || 1,
      perPage: params.perPage || 20,
    });
    
    const response = await api.get<PaginatedData<CommentApiResponse>>(`/projects/${projectId}/comments${queryString}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to fetch comments");
  },

  /**
   * Create a comment on a project
   */
  async createComment(projectId: string, input: CreateCommentInput): Promise<CommentApiResponse> {
    const response = await api.post<CommentApiResponse>(`/projects/${projectId}/comments`, input);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to create comment");
  },

  /**
   * Delete a comment
   */
  async deleteComment(id: string): Promise<void> {
    const response = await api.delete(`/comments/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || "Failed to delete comment");
    }
  },
};
