"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/cn";
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Password strength calculation
  const calculateStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength <= 25) return "Lemah";
    if (strength <= 50) return "Sedang";
    if (strength <= 75) return "Kuat";
    return "Sangat Kuat";
  };

  const getStrengthColor = (strength: number): string => {
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-orange-500";
    if (strength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const passwordStrength = calculateStrength(formData.newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.newPassword.length < 8) {
      setError("Password baru minimal 8 karakter");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Password baru dan konfirmasi tidak cocok");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Call API to change password when endpoint is available
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      toast.success("Password berhasil diperbarui");

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/profile");
      }, 1500);
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Gagal mengubah password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <LucideIcons.Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/profile">
          <Button variant="ghost" size="icon" className="shrink-0">
            <LucideIcons.ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">Ubah Password</h1>
          <p className="text-zinc-400 mt-1">
            Perbarui password akun Anda
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
          <LucideIcons.CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400">
            Password berhasil diperbarui! Mengalihkan...
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <LucideIcons.AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-5">
          {/* Current Password */}
          <div>
            <Label htmlFor="currentPassword">Password Saat Ini</Label>
            <div className="relative mt-1.5">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Masukkan password saat ini"
                className="bg-zinc-800/50 border-zinc-700 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPasswords.current ? (
                  <LucideIcons.EyeOff className="w-4 h-4" />
                ) : (
                  <LucideIcons.Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <hr className="border-zinc-800" />

          {/* New Password */}
          <div>
            <Label htmlFor="newPassword">Password Baru</Label>
            <div className="relative mt-1.5">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Masukkan password baru"
                className="bg-zinc-800/50 border-zinc-700 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPasswords.new ? (
                  <LucideIcons.EyeOff className="w-4 h-4" />
                ) : (
                  <LucideIcons.Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-300 rounded-full",
                        getStrengthColor(passwordStrength)
                      )}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500 w-24 text-right">
                    {getStrengthLabel(passwordStrength)}
                  </span>
                </div>
                <ul className="text-xs text-zinc-500 space-y-1">
                  <li className={cn(formData.newPassword.length >= 8 && "text-green-400")}>
                    • Minimal 8 karakter
                  </li>
                  <li className={cn(/[a-z]/.test(formData.newPassword) && "text-green-400")}>
                    • Mengandung huruf kecil
                  </li>
                  <li className={cn(/[A-Z]/.test(formData.newPassword) && "text-green-400")}>
                    • Mengandung huruf besar
                  </li>
                  <li className={cn((/[0-9]/.test(formData.newPassword) || /[^a-zA-Z0-9]/.test(formData.newPassword)) && "text-green-400")}>
                    • Mengandung angka atau simbol
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
            <div className="relative mt-1.5">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Konfirmasi password baru"
                className={cn(
                  "bg-zinc-800/50 border-zinc-700 pr-10",
                  formData.confirmPassword &&
                    formData.newPassword !== formData.confirmPassword &&
                    "border-red-500/50 focus:ring-red-500/40"
                )}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPasswords.confirm ? (
                  <LucideIcons.EyeOff className="w-4 h-4" />
                ) : (
                  <LucideIcons.Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {formData.confirmPassword &&
              formData.newPassword !== formData.confirmPassword && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <LucideIcons.AlertCircle className="w-3 h-3" />
                  Password tidak cocok
                </p>
              )}
            {formData.confirmPassword &&
              formData.newPassword === formData.confirmPassword && (
                <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                  <LucideIcons.CheckCircle className="w-3 h-3" />
                  Password cocok
                </p>
              )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <LucideIcons.Shield className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-400 mb-1">Tips Keamanan</h4>
              <p className="text-sm text-zinc-400">
                Gunakan password yang unik dan tidak dipakai di layanan lain.
                Jangan bagikan password Anda kepada siapapun.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard/profile">
            <Button type="button" variant="outline">
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {isSubmitting ? (
              <>
                <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <LucideIcons.Lock className="w-4 h-4" />
                Ubah Password
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
