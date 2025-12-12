"use client";

import { useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as LucideIcons from "lucide-react";

export default function EditProfilePage() {
  const user = getCurrentUser();
  const router = useRouter();

  if (!user) {
    redirect("/login");
  }

  const [formData, setFormData] = useState({
    name: user.name,
    university: user.university,
    major: user.major,
    bio: user.bio || "",
    phone: user.phone || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, this would call an API to update the user
    console.log("Updating profile:", formData);
    
    setIsSubmitting(false);
    setSuccess(true);

    // Redirect after success
    setTimeout(() => {
      router.push("/dashboard/profile");
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/profile">
          <Button variant="ghost" size="icon" className="shrink-0">
            <LucideIcons.ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">Edit Profil</h1>
          <p className="text-zinc-400 mt-1">
            Perbarui informasi profil Anda
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
          <LucideIcons.CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400">
            Profil berhasil diperbarui! Mengalihkan...
          </span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Preview */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <div className="flex items-center gap-6">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-xl bg-zinc-800 border-2 border-zinc-700"
            />
            <div>
              <h3 className="font-semibold text-zinc-100 mb-1">Foto Profil</h3>
              <p className="text-sm text-zinc-500 mb-3">
                Avatar dihasilkan otomatis berdasarkan nama
              </p>
              <p className="text-xs text-zinc-600">
                Fitur unggah foto akan tersedia segera
              </p>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <LucideIcons.User className="w-5 h-5 text-zinc-400" />
            Informasi Pribadi
          </h3>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="mt-1.5 bg-zinc-800/50 border-zinc-700"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="mt-1.5 bg-zinc-800/50 border-zinc-700 opacity-50"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Email tidak dapat diubah
              </p>
            </div>

            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+62..."
                className="mt-1.5 bg-zinc-800/50 border-zinc-700"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <LucideIcons.GraduationCap className="w-5 h-5 text-zinc-400" />
            Pendidikan
          </h3>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="university">Universitas</Label>
              <Input
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="Nama universitas"
                className="mt-1.5 bg-zinc-800/50 border-zinc-700"
              />
            </div>

            <div>
              <Label htmlFor="major">Jurusan</Label>
              <Input
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="Jurusan atau program studi"
                className="mt-1.5 bg-zinc-800/50 border-zinc-700"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <LucideIcons.FileText className="w-5 h-5 text-zinc-400" />
            Bio
          </h3>

          <div>
            <Label htmlFor="bio">Tentang Anda</Label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Ceritakan sedikit tentang diri Anda..."
              rows={4}
              className="w-full mt-1.5 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Maksimal 200 karakter
            </p>
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
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {isSubmitting ? (
              <>
                <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <LucideIcons.Check className="w-4 h-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
