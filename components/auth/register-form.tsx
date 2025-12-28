"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Github, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { ApiError } from "@/lib/api";

import { getApiUrl } from "@/lib/env";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[0-9]/, "Password harus mengandung angka"),
  confirmPassword: z.string(),
  university: z.string().optional(),
  major: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui syarat dan ketentuan",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: "" };
    if (pwd.length < 6) return { strength: 1, label: "Lemah", color: "bg-red-500" };
    if (pwd.length < 8) return { strength: 2, label: "Sedang", color: "bg-yellow-500" };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd))
      return { strength: 3, label: "Kuat", color: "bg-green-500" };
    return { strength: 2, label: "Sedang", color: "bg-yellow-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        university: data.university,
        major: data.major,
      });
      toast.success("Pendaftaran berhasil! Silakan login untuk melanjutkan.");
      router.push("/login");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors) {
          Object.entries(error.errors).forEach(([field, message]) => {
            setError(field as keyof RegisterFormData, { message });
          });
        } else {
          toast.error(error.message || "Pendaftaran gagal");
        }
      } else {
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: "google" | "github") => {
    window.location.href = `${getApiUrl()}/auth/${provider}`;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name")}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* University */}
        <div className="space-y-2">
          <Label htmlFor="university">Universitas (Opsional)</Label>
          <Input
            id="university"
            type="text"
            placeholder="Universitas Indonesia"
            {...register("university")}
            disabled={isLoading}
          />
        </div>

        {/* Major */}
        <div className="space-y-2">
          <Label htmlFor="major">Jurusan (Opsional)</Label>
          <Input
            id="major"
            type="text"
            placeholder="Ilmu Komputer"
            {...register("major")}
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
            />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
              >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          
          {/* Password Strength */}
          {password && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full ${
                      level <= passwordStrength.strength
                        ? passwordStrength.color
                        : "bg-zinc-200 dark:bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-zinc-500">
                Kekuatan password: {passwordStrength.label}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="agreeTerms"
            {...register("agreeTerms")}
            disabled={isLoading}
            className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="agreeTerms" className="text-sm text-zinc-600 dark:text-zinc-400">
            Saya setuju dengan{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Kebijakan Privasi
            </Link>
          </label>
        </div>
        {errors.agreeTerms && (
          <p className="text-sm text-red-500">{errors.agreeTerms.message}</p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500">
            Atau daftar dengan
          </span>
        </div>
      </div>

      {/* Social Register */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialRegister("google")}
          disabled={isLoading}
        >
          <Mail className="w-4 h-4 mr-2" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialRegister("github")}
          disabled={isLoading}
        >
          <Github className="w-4 h-4 mr-2" />
          GitHub
        </Button>
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
