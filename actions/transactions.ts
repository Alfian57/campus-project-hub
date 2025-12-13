"use server";

import { TransactionResult } from "@/types";
import { transactionsService } from "@/lib/services/transactions";

export async function createTransaction(
  projectId: string,
  amount: number
): Promise<TransactionResult> {
  try {
    // Note: For authenticated requests, the token needs to be passed
    // This server action will use the BE API which handles Midtrans
    const result = await transactionsService.createTransaction(projectId);
    
    return {
      success: true,
      token: result.token,
    };
  } catch (error) {
    console.error("Transaction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create transaction",
    };
  }
}
