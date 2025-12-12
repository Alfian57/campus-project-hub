import { getCurrentUser } from "@/lib/auth";
import { mockArticles } from "@/lib/mock-data";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import { ACTION_POINTS } from "@/lib/config/gamification";

export default function UserArticlesPage() {
  const user = getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Filter articles by current user (mock: using author name match)
  const userArticles = mockArticles.filter(
    (article) => article.author.name === user.name || article.author.id === user.id
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50">Artikel Saya</h1>
          <p className="text-zinc-400 mt-1">
            Kelola artikel yang telah Anda tulis
          </p>
        </div>
        <Link href="/dashboard/articles/new">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <LucideIcons.Plus className="w-4 h-4" />
            Buat Artikel
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <LucideIcons.FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Artikel</p>
              <p className="text-2xl font-bold text-zinc-50">{userArticles.length}</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <LucideIcons.Sparkles className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">EXP per Artikel</p>
              <p className="text-2xl font-bold text-green-400">+{ACTION_POINTS.CREATE_ARTICLE}</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <LucideIcons.Eye className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Views</p>
              <p className="text-2xl font-bold text-zinc-50">
                {userArticles.length * 120}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Articles List */}
      {userArticles.length > 0 ? (
        <div className="space-y-4">
          {userArticles.map((article) => (
            <div
              key={article.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
            >
              {/* Thumbnail */}
              <img
                src={article.thumbnailUrl}
                alt={article.title}
                className="w-24 h-16 rounded-lg object-cover flex-shrink-0"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-zinc-100 truncate">
                    {article.title}
                  </h3>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {article.category}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-400 truncate">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <LucideIcons.Calendar className="w-3.5 h-3.5" />
                    {formatDate(article.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <LucideIcons.Clock className="w-3.5 h-3.5" />
                    {article.readingTime} menit baca
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/articles/${article.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <LucideIcons.Eye className="w-4 h-4" />
                    Lihat
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <LucideIcons.FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-300 mb-2">
            Belum Ada Artikel
          </h3>
          <p className="text-zinc-500 mb-6">
            Mulai berbagi pengetahuan dengan menulis artikel pertamamu!
          </p>
          <Link href="/dashboard/articles/new">
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <LucideIcons.Plus className="w-4 h-4" />
              Buat Artikel Pertama
            </Button>
          </Link>
        </div>
      )}

      {/* Tips Card */}
      <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl border border-blue-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
            <LucideIcons.Lightbulb className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100 mb-2">Tips Menulis Artikel</h3>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li>• Tulis judul yang menarik dan deskriptif</li>
              <li>• Gunakan struktur yang jelas dengan heading dan paragraf</li>
              <li>• Sertakan contoh kode atau gambar untuk memperjelas</li>
              <li>• Dapatkan <span className="text-green-400 font-semibold">+{ACTION_POINTS.CREATE_ARTICLE} EXP</span> untuk setiap artikel yang dipublikasikan!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
