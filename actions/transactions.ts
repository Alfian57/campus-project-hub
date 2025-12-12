"use server";

import { TransactionResult } from "@/types";

export async function createTransaction(
  projectId: string,
  amount: number
): Promise<TransactionResult> {
  try {
    // Check if environment variables are set
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

    if (!serverKey) {
      console.error("MIDTRANS_SERVER_KEY not configured");
      return {
        success: false,
        error: "Payment system not configured. Please check environment variables."
      };
    }

    // Import Midtrans client
    const midtransClient = require("midtrans-client");

    // Create Snap API instance
    const snap = new midtransClient.Snap({
      isProduction: isProduction,
      serverKey: serverKey,
    });

    // Generate unique order ID
    const orderId = `PURCHASE-${projectId}-${Date.now()}`;

    // Create transaction parameters
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      item_details: [
        {
          id: projectId,
          price: amount,
          quantity: 1,
          name: "Project Source Code",
        },
      ],
      customer_details: {
        first_name: "Buyer",
        email: "buyer@campus-hub.com",
      },
    };

    // Create transaction and get token
    const transaction = await snap.createTransaction(parameter);
    
    return {
      success: true,
      token: transaction.token,
    };
  } catch (error) {
    console.error("Midtrans transaction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create transaction",
    };
  }
}
