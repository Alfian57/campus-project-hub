"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const resetSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

type ResetFormData = z.infer<typeof resetSchema>;

export function ResetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setEmailSent(true);
    toast.success("Email reset password telah dikirim!");
    setIsLoading(false);
    // TODO: Implement actual reset password logic
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Cek Email Anda
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          Kami telah mengirimkan link reset password ke email Anda. Silakan cek inbox atau folder spam.
        </p>
        <div className="pt-4">
          <Link href="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Lupa Password?
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset password
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          {isLoading ? "Mengirim..." : "Kirim Link Reset"}
        </Button>
      </form>

      {/* Back to Login */}
      <Link href="/login">
        <Button variant="ghost" className="w-full">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Login
        </Button>
      </Link>
    </div>
  );
}
