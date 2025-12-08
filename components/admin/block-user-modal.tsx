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
      toast.error("Please provide a reason for blocking");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    onBlock(userId, reason);
    toast.success(`User ${userName} has been blocked`);
    
    setIsLoading(false);
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block User</DialogTitle>
          <DialogDescription>
            Are you sure you want to block <strong>{userName}</strong>? This will prevent them from accessing the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for blocking</Label>
            <Input
              id="reason"
              placeholder="e.g., Spam content, inappropriate behavior"
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
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={handleBlock}
            disabled={isLoading}
          >
            {isLoading ? "Blocking..." : "Block User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
