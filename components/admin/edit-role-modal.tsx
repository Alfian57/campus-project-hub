"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/types/dashboard";
import { toast } from "sonner";

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  currentRole: UserRole;
  onUpdate: (userId: string, newRole: UserRole) => void;
}

export function EditRoleModal({
  isOpen,
  onClose,
  userId,
  userName,
  currentRole,
  onUpdate,
}: EditRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [isLoading, setIsLoading] = useState(false);

  const roles: UserRole[] = ["user", "moderator", "admin"];

  const handleUpdate = async () => {
    if (selectedRole === currentRole) {
      toast.info("No changes made");
      onClose();
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    onUpdate(userId, selectedRole);
    toast.success(`User ${userName}'s role updated to ${selectedRole}`);
    
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
          <DialogDescription>
            Change the role for <strong>{userName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Role</Label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  disabled={isLoading}
                  className={`px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                    selectedRole === role
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="font-medium">{role}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedRole === "admin" && (
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                ⚠️ Admin role grants full access to all platform features
              </p>
            </div>
          )}
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
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
