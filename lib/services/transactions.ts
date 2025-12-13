import { api, buildQueryString } from "@/lib/api";
import { TransactionApiResponse, PaginatedData, CreateTransactionResponse, CheckPurchaseResponse } from "@/types/api";

export interface GetTransactionsParams {
  page?: number;
  perPage?: number;
  type?: "all" | "purchases" | "sales";
  status?: string;
}

export const transactionsService = {
  /**
   * Create transaction for project purchase
   */
  async createTransaction(projectId: string): Promise<CreateTransactionResponse> {
    const response = await api.post<CreateTransactionResponse>("/transactions", { projectId });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to create transaction");
  },

  /**
   * Get user's transactions
   */
  async getTransactions(params: GetTransactionsParams = {}): Promise<PaginatedData<TransactionApiResponse>> {
    const queryString = buildQueryString({
      page: params.page || 1,
      perPage: params.perPage || 12,
      type: params.type,
      status: params.status,
    });
    
    const response = await api.get<PaginatedData<TransactionApiResponse>>(`/transactions${queryString}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to fetch transactions");
  },

  /**
   * Check if user has purchased a project
   */
  async checkPurchase(projectId: string): Promise<boolean> {
    const response = await api.get<CheckPurchaseResponse>(`/transactions/check/${projectId}`);
    
    if (response.success && response.data) {
      return response.data.purchased;
    }
    
    return false;
  },

  /**
   * Get all transactions (admin only)
   */
  async getAdminTransactions(params: GetTransactionsParams = {}): Promise<PaginatedData<TransactionApiResponse>> {
    const queryString = buildQueryString({
      page: params.page || 1,
      perPage: params.perPage || 12,
      status: params.status,
    });
    
    const response = await api.get<PaginatedData<TransactionApiResponse>>(`/transactions/admin${queryString}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to fetch transactions");
  },
};
