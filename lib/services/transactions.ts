import { api, buildQueryString } from "@/lib/api";
import { TransactionApiResponse, PaginatedData, CreateTransactionResponse, CheckPurchaseResponse } from "@/types/api";

export interface GetTransactionsParams {
  page?: number;
  perPage?: number;
  type?: "all" | "purchases" | "sales";
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
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
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.perPage) queryParams.append("perPage", params.perPage.toString());
    if (params.type) queryParams.append("type", params.type);
    if (params.status) queryParams.append("status", params.status);

    const response = await api.get<{
        items: TransactionApiResponse[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>(`/transactions?${queryParams.toString()}`);
    
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
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.perPage) queryParams.append("perPage", params.perPage.toString());
    if (params.status) queryParams.append("status", params.status);
    if (params.startDate) queryParams.append("start_date", params.startDate);
    if (params.endDate) queryParams.append("end_date", params.endDate);
    if (params.sortBy) queryParams.append("sort_by", params.sortBy);
    if (params.sortDirection) queryParams.append("sort_direction", params.sortDirection);

    const response = await api.get<{
        items: TransactionApiResponse[];
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    }>(`/transactions/admin?${queryParams.toString()}`);
    
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
    
    throw new Error(response.message || "Failed to fetch transactions");
  },

  /**
   * Export transactions to CSV (admin only)
   */
  async exportTransactions(params: GetTransactionsParams = {}): Promise<void> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.startDate) queryParams.append("start_date", params.startDate);
    if (params.endDate) queryParams.append("end_date", params.endDate);

    await api.download(`/transactions/export?${queryParams.toString()}`, "transactions.csv");
  },
};
