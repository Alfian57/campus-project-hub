"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmLogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmLogoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
            <LogOut className="w-7 h-7 text-orange-600 dark:text-orange-400" />
          </div>
          <DialogTitle className="text-xl">Keluar dari Akun</DialogTitle>
          <DialogDescription className="text-center">
            Yakin ingin keluar dari akun Anda?
            <span className="block mt-2 text-zinc-500 dark:text-zinc-400">
              Anda perlu login kembali untuk mengakses dashboard.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 sm:justify-center gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLoading ? "Keluar..." : "Ya, Keluar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
