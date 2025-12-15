"use client";

import { useState } from "react";
import { ShoppingCart, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { transactionsService } from "@/lib/services/transactions";
import { toast } from "sonner";

interface PurchaseModalProps {
  projectId: string;
  projectTitle: string;
  price: number;
  children?: React.ReactNode;
}

// Declare Midtrans Snap type
declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: unknown) => void;
          onPending: (result: unknown) => void;
          onError: (result: unknown) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}

export function PurchaseModal({
  projectId,
  projectTitle,
  price,
  children,
}: PurchaseModalProps) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);

    try {
      // Create transaction and get Snap token - call API directly from client
      // so localStorage auth token is accessible
      const result = await transactionsService.createTransaction(projectId);

      if (!result.token) {
        toast.error("Gagal membuat pembayaran");
        setIsProcessing(false);
        return;
      }

      // Check if Snap is loaded
      if (!window.snap) {
        toast.error(
          "Sistem pembayaran belum dimuat. Silakan refresh dan coba lagi."
        );
        setIsProcessing(false);
        return;
      }

      // Open Midtrans Snap popup
      window.snap.pay(result.token, {
        onSuccess: (result) => {
          console.log("Payment success:", result);
          toast.success("Pembelian berhasil! Anda sekarang dapat mengakses source code 🎉");
          setOpen(false);
          setIsProcessing(false);
          // In production, this would trigger a page refresh or state update
        },
        onPending: (result) => {
          console.log("Payment pending:", result);
          toast.info("Pembayaran sedang diproses...");
          setIsProcessing(false);
        },
        onError: (result) => {
          console.error("Payment error:", result);
          toast.error("Pembayaran gagal. Silakan coba lagi.");
          setIsProcessing(false);
        },
        onClose: () => {
          console.log("Payment popup closed");
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
      setIsProcessing(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Beli Sekarang - {formatPrice(price)}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-orange-500" />
            Beli Source Code
          </DialogTitle>
          <DialogDescription>
            Dapatkan akses penuh ke source code{" "}
            <strong>{projectTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Price Display */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Harga
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {formatPrice(price)}
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Yang Anda dapatkan:
            </p>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                </div>
                Akses penuh ke source code
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                </div>
                Dokumentasi teknis lengkap
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                </div>
                Dukungan kreator via komentar
              </li>
            </ul>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
            size="lg"
          >
            {isProcessing ? "Memproses..." : `Bayar ${formatPrice(price)}`}
          </Button>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Lock className="w-3 h-3" />
            <span>Pembayaran aman didukung oleh Midtrans</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
