"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ban, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface BlockArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  articleTitle: string;
  onBlock: (articleId: string, reason: string) => void;
}

export function BlockArticleModal({
  isOpen,
  onClose,
  articleId,
  articleTitle,
  onBlock,
}: BlockArticleModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast.error("Alasan blokir harus diisi");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    onBlock(articleId, reason);
    toast.success(`Artikel "${articleTitle}" telah diblokir`);
    
    setIsSubmitting(false);
    setReason("");
    onClose();
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-100">
            <Ban className="w-5 h-5 text-red-500" />
            Blokir Artikel
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Anda akan memblokir artikel ini. Artikel yang diblokir tidak akan
            dapat dilihat oleh pengguna lain.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Warning */}
          <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">
                Blokir: {articleTitle}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Tindakan ini akan menyembunyikan artikel dari publik.
              </p>
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-zinc-300">
              Alasan Blokir <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masukkan alasan mengapa artikel diblokir..."
              className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              required
            />
            <p className="text-xs text-zinc-500">
              Alasan ini akan dicatat dalam log moderasi.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Memblokir..." : "Blokir Artikel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
