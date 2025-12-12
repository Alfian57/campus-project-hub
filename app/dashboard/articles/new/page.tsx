"use client";

import { useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as LucideIcons from "lucide-react";
import { ACTION_POINTS } from "@/lib/config/gamification";
import { toast } from "sonner";

// Article categories
const articleCategories = [
  { value: "karier", label: "Karier" },
  { value: "teknologi", label: "Teknologi" },
  { value: "produktivitas", label: "Produktivitas" },
  { value: "pengembangan", label: "Pengembangan" },
  { value: "mobile", label: "Mobile" },
  { value: "keamanan", label: "Keamanan" },
];

export default function NewArticlePage() {
  const user = getCurrentUser();
  const router = useRouter();

  if (!user) {
    redirect("/login");
  }

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "",
    thumbnailUrl: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleSubmit = async (e: React.FormEvent, saveAsDraft: boolean = false) => {
    e.preventDefault();
    setIsDraft(saveAsDraft);
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Judul artikel harus diisi");
      setIsSubmitting(false);
      return;
    }

    if (!formData.category) {
      toast.error("Kategori harus dipilih");
      setIsSubmitting(false);
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Konten artikel harus diisi");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, this would call an API to create the article
    console.log("Creating article:", {
      ...formData,
      readingTime: calculateReadingTime(formData.content),
      status: saveAsDraft ? "draft" : "published",
    });

    if (saveAsDraft) {
      toast.success("Artikel disimpan sebagai draft");
    } else {
      toast.success(
        <div>
          <p>Artikel berhasil dipublikasikan!</p>
          <p className="text-green-400 text-sm">+{ACTION_POINTS.CREATE_ARTICLE} EXP</p>
        </div>
      );
    }

    setIsSubmitting(false);
    router.push("/dashboard/articles");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/articles">
          <Button variant="ghost" size="icon" className="shrink-0">
            <LucideIcons.ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-zinc-50">Buat Artikel Baru</h1>
          <p className="text-zinc-400 mt-1">
            Bagikan pengetahuan dan pengalamanmu
          </p>
        </div>
        <div className="bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
          <span className="text-green-400 text-sm font-medium">
            +{ACTION_POINTS.CREATE_ARTICLE} EXP
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <LucideIcons.FileText className="w-5 h-5 text-zinc-400" />
            Informasi Artikel
          </h3>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Judul Artikel <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Masukkan judul artikel yang menarik"
                className="mt-1.5 bg-zinc-800/50 border-zinc-700"
                required
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Ringkasan</Label>
              <Input
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Deksripsi singkat artikel (opsional)"
                className="mt-1.5 bg-zinc-800/50 border-zinc-700"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Akan ditampilkan di daftar artikel
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Kategori <span className="text-red-500">*</span></Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full mt-1.5 h-10 px-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="">Pilih kategori</option>
                  {articleCategories.map((cat) => (
                    <option key={cat.value} value={cat.label}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="thumbnailUrl">URL Thumbnail</Label>
                <Input
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="mt-1.5 bg-zinc-800/50 border-zinc-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
              <LucideIcons.Edit3 className="w-5 h-5 text-zinc-400" />
              Konten Artikel
            </h3>
            {formData.content && (
              <span className="text-sm text-zinc-500">
                ~{calculateReadingTime(formData.content)} menit baca
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="content">
              Konten <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Tulis konten artikel Anda di sini...&#10;&#10;Tips:&#10;- Gunakan baris baru untuk paragraf baru&#10;- Mulai dengan heading utama (# Judul)&#10;- Gunakan ## untuk sub-heading&#10;- Format kode dengan ``` untuk code block"
              rows={16}
              required
              className="w-full mt-1.5 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none font-mono text-sm"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Mendukung format Markdown
            </p>
          </div>
        </div>

        {/* Preview Thumbnail */}
        {formData.thumbnailUrl && (
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
            <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
              <LucideIcons.Image className="w-5 h-5 text-zinc-400" />
              Preview Thumbnail
            </h3>
            <div className="relative aspect-video max-w-md rounded-lg overflow-hidden bg-zinc-800">
              <img
                src={formData.thumbnailUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/800x400?text=Gambar+tidak+valid";
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            <span className="text-red-500">*</span> Wajib diisi
          </p>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e as any, true)}
              className="gap-2"
            >
              <LucideIcons.Save className="w-4 h-4" />
              Simpan Draft
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              {isSubmitting && !isDraft ? (
                <>
                  <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                  Mempublikasikan...
                </>
              ) : (
                <>
                  <LucideIcons.Send className="w-4 h-4" />
                  Publikasikan
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
