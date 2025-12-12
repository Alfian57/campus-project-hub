"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  description?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  description,
}: ConfirmDeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onConfirm();
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            Yakin ingin menghapus <strong className="text-zinc-900 dark:text-zinc-100">&quot;{itemName}&quot;</strong>?
            {description ? (
              <span className="block mt-2 text-red-600 dark:text-red-400">{description}</span>
            ) : (
              <span className="block mt-2 text-red-600 dark:text-red-400">
                Tindakan ini tidak dapat dibatalkan.
              </span>
            )}
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
            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
