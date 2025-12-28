"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UserApiResponse } from "@/types/api";

type UserRole = "admin" | "moderator" | "user";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserApiResponse;
  onUpdate: (userId: string, data: any) => Promise<void>;
}

export function EditUserModal({
  isOpen,
  onClose,
  user,
  onUpdate,
}: EditUserModalProps) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<UserRole>(user.role as UserRole);
  const [university, setUniversity] = useState(user.university || "");
  const [major, setMajor] = useState(user.major || "");
  const [isLoading, setIsLoading] = useState(false);

  // Update state when user prop changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setRole(user.role as UserRole);
      setUniversity(user.university || "");
      setMajor(user.major || "");
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData: any = {
        name,
        role,
      };

      if (role === "user") {
        updateData.university = university;
        updateData.major = major;
      }

      await onUpdate(user.id, updateData);
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <div className="flex gap-2">
              {(["user", "admin", "moderator"] as UserRole[]).map((r) => (
                <Button
                  key={r}
                  type="button"
                  variant={role === r ? "default" : "outline"}
                  onClick={() => setRole(r)}
                  disabled={user.role === "admin" && role === "admin" /* Prevent un-admining self if implemented later, but simpler logic is fine */} 
                  className={`flex-1 capitalize ${role === r ? "bg-blue-600 hover:bg-blue-700" : ""} cursor-pointer`}
                >
                  {r}
                </Button>
              ))}
            </div>
            {user.role === "admin" && (
                <p className="text-xs text-red-500">Role Admin tidak dapat diubah.</p>
            )}
          </div>

          {role === "user" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="university">Universitas</Label>
                <Input
                  id="university"
                  placeholder="Nama Universitas"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">Jurusan</Label>
                <Input
                  id="major"
                  placeholder="Nama Jurusan"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer" 
                disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
