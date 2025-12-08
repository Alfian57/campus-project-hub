"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Coffee } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTransaction } from "@/actions/transactions";
import { toast } from "sonner";

const donationSchema = z.object({
  amount: z.coerce
    .number()
    .min(10000, "Minimum donation is IDR 10,000")
    .max(10000000, "Maximum donation is IDR 10,000,000"),
});

type DonationFormData = z.infer<typeof donationSchema>;

interface DonationModalProps {
  projectId: string;
  projectTitle: string;
  children?: React.ReactNode;
}

// Declare Midtrans Snap type
declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: any) => void;
          onPending: (result: any) => void;
          onError: (result: any) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}

export function DonationModal({
  projectId,
  projectTitle,
  children,
}: DonationModalProps) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 50000,
    },
  });

  const onSubmit = async (data: DonationFormData) => {
    setIsProcessing(true);

    try {
      // Create transaction and get Snap token
      const result = await createTransaction(projectId, data.amount);

      if (!result.success || !result.token) {
        toast.error(result.error || "Failed to create payment");
        setIsProcessing(false);
        return;
      }

      // Check if Snap is loaded
      if (!window.snap) {
        toast.error(
          "Payment system not loaded. Please refresh and try again."
        );
        setIsProcessing(false);
        return;
      }

      // Open Midtrans Snap popup
      window.snap.pay(result.token, {
        onSuccess: (result) => {
          console.log("Payment success:", result);
          toast.success("Thank you for supporting this project! 🎉");
          setOpen(false);
          reset();
          setIsProcessing(false);
        },
        onPending: (result) => {
          console.log("Payment pending:", result);
          toast.info("Payment is being processed...");
          setIsProcessing(false);
        },
        onError: (result) => {
          console.error("Payment error:", result);
          toast.error("Payment failed. Please try again.");
          setIsProcessing(false);
        },
        onClose: () => {
          console.log("Payment popup closed");
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            className="border-blue-400 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950"
          >
            <Coffee className="w-4 h-4 mr-2" />
            Support Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Coffee className="w-6 h-6 text-blue-500" />
            Support This Creator
          </DialogTitle>
          <DialogDescription>
            Show your appreciation for <strong>{projectTitle}</strong> with a
            donation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Amount (IDR)
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="50000"
              {...register("amount")}
              className="text-lg"
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[25000, 50000, 100000].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const event = new Event("input", { bubbles: true });
                    const input = document.getElementById(
                      "amount"
                    ) as HTMLInputElement;
                    if (input) {
                      input.value = amount.toString();
                      input.dispatchEvent(event);
                    }
                  }}
                  className="text-xs"
                >
                  {(amount / 1000).toFixed(0)}K
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            size="lg"
          >
            {isProcessing ? "Processing..." : "Proceed to Payment"}
          </Button>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
            Secure payment powered by Midtrans
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
