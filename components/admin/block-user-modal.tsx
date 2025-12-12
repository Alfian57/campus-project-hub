"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onBlock: (userId: string, reason: string) => void;
}

export function BlockUserModal({
  isOpen,
  onClose,
  userId,
  userName,
  onBlock,
}: BlockUserModalProps) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBlock = async () => {
    if (!reason.trim()) {
      toast.error("Silakan berikan alasan pemblokiran");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    onBlock(userId, reason);
    toast.success(`Pengguna ${userName} telah diblokir`);
    
    setIsLoading(false);
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Blokir Pengguna</DialogTitle>
          <DialogDescription>
            Yakin ingin memblokir <strong>{userName}</strong>? Ini akan mencegah mereka mengakses platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Alasan pemblokiran</Label>
            <Input
              id="reason"
              placeholder="Contoh: Konten spam, perilaku tidak pantas"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={handleBlock}
            disabled={isLoading}
          >
            {isLoading ? "Memblokir..." : "Blokir Pengguna"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
