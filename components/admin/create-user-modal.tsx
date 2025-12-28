"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/types/dashboard";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
}

const roleLabels: Record<UserRole, string> = {
  user: "Pengguna",
  moderator: "Moderator",
  admin: "Admin",
};

export function CreateUserModal({
  isOpen,
  onClose,
  onCreate,
}: CreateUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roles: UserRole[] = ["user", "moderator", "admin"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onCreate({ 
        name, 
        email, 
        password, 
        role,
        university: role === "user" ? university : undefined,
        major: role === "user" ? major : undefined
      });
      toast.success("Pengguna berhasil dibuat");
      onClose();
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setUniversity("");
      setMajor("");
    } catch (error) {
      // Error handling varies, usually handled by parent or toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna Baru</DialogTitle>
          <DialogDescription>
            Buat akun pengguna baru. Email harus unik.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Role Pengguna</Label>
            <div className="flex gap-2">
              {(["user", "moderator", "admin"] as UserRole[]).map((r) => (
                <Button
                  key={r}
                  type="button"
                  variant={role === r ? "default" : "outline"}
                  onClick={() => {
                    setRole(r);
                    if (r !== "user") {
                      setUniversity("");
                      setMajor("");
                    }
                  }}
                  className={`flex-1 capitalize ${role === r ? "bg-blue-600 hover:bg-blue-700" : ""} cursor-pointer`}
                  disabled={isLoading}
                >
                  {roleLabels[r]}
                </Button>
              ))}
            </div>
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
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            Batal
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Membuat..." : "Buat Pengguna"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
