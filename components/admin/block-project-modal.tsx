"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Ban } from "lucide-react";
import { toast } from "sonner";

interface BlockProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  onBlock: (projectId: string, reason: string) => void;
}

export function BlockProjectModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  onBlock,
}: BlockProjectModalProps) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBlock = async () => {
    if (!reason.trim()) {
      toast.error("Silakan berikan alasan pemblokiran");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    onBlock(projectId, reason);
    toast.success(`Proyek "${projectTitle}" telah diblokir`);
    
    setIsLoading(false);
    setReason("");
    onClose();
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <Ban className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-center text-xl">Blokir Proyek</DialogTitle>
          <DialogDescription className="text-center">
            Yakin ingin memblokir proyek <strong className="text-zinc-900 dark:text-zinc-100">&quot;{projectTitle}&quot;</strong>?
            <span className="block mt-1">Proyek ini tidak akan terlihat oleh publik.</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Alasan pemblokiran</Label>
            <Input
              id="reason"
              placeholder="Contoh: Konten melanggar, plagiarisme, dll."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Batal
          </Button>
          <Button
            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white"
            onClick={handleBlock}
            disabled={isLoading}
          >
            {isLoading ? "Memblokir..." : "Blokir Proyek"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
