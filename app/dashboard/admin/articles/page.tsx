"use client";

import { useState, useEffect } from "react";
import { articlesService } from "@/lib/services/articles";
import { ArticleApiResponse } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Ban, CheckCircle, Eye, Trash2, Search, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";
import { BlockArticleModal } from "@/components/admin/block-article-modal";
import { formatDate } from "@/lib/utils/format";

const articleCategories = [
  "Karier",
  "Teknologi",
  "Produktivitas",
  "Pengembangan",
  "Mobile",
  "Keamanan",
];

export default function ArticlesManagementPage() {
  const [articles, setArticles] = useState<ArticleApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<ArticleApiResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await articlesService.getArticles({ perPage: 100 });
      setArticles(data.items);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Gagal memuat artikel");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openBlockModal = (article: ArticleApiResponse) => {
    setSelectedArticle(article);
    setIsBlockModalOpen(true);
  };

  const handleBlockArticle = async (articleId: string, reason: string) => {
    try {
      // Assuming there's a block endpoint for articles
      setArticles((prev) =>
        prev.map((a) => (a.id === articleId ? { ...a, status: "blocked" } : a))
      );
      toast.success("Artikel berhasil diblokir");
    } catch (error) {
      console.error("Error blocking article:", error);
      toast.error("Gagal memblokir artikel");
    }
  };

  const handleUnblockArticle = async (articleId: string, articleTitle: string) => {
    try {
      setArticles((prev) =>
        prev.map((a) => (a.id === articleId ? { ...a, status: "published" } : a))
      );
      toast.success(`Artikel "${articleTitle}" telah dibuka blokirnya`);
    } catch (error) {
      console.error("Error unblocking article:", error);
      toast.error("Gagal membuka blokir artikel");
    }
  };

  const openDeleteModal = (article: ArticleApiResponse) => {
    setSelectedArticle(article);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteArticle = async () => {
    if (!selectedArticle) return;
    
    try {
      await articlesService.deleteArticle(selectedArticle.id);
      setArticles((prev) => prev.filter((a) => a.id !== selectedArticle.id));
      toast.success(`Artikel "${selectedArticle.title}" telah dihapus`);
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Gagal menghapus artikel");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Manajemen Artikel
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Kelola semua artikel platform
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Cari artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
        >
          <option value="">Semua Kategori</option>
          {articleCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Artikel</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {articles.length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Terpublikasi</p>
          <p className="text-2xl font-bold text-green-600">
            {articles.filter((a) => a.status === "published").length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Diblokir</p>
          <p className="text-2xl font-bold text-red-600">
            {articles.filter((a) => a.status === "blocked").length}
          </p>
        </div>
      </div>

      {/* Articles Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artikel</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Waktu Baca</TableHead>
              <TableHead>Diterbitkan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={article.thumbnailUrl || "/placeholder.jpg"}
                      alt={article.title}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                    <div className="max-w-xs">
                      <div className="font-medium text-zinc-900 dark:text-zinc-50 truncate">
                        {article.title}
                      </div>
                      <div className="text-sm text-zinc-500 truncate">
                        {article.excerpt.slice(0, 50)}...
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={article.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author.name}`}
                      alt={article.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium">{article.author.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {article.category || "Umum"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-zinc-500">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readingTime || 5} menit
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-zinc-500">
                    {formatDate(article.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      article.status === "published"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : article.status === "draft"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }
                  >
                    {article.status === "published"
                      ? "Terpublikasi"
                      : article.status === "draft"
                      ? "Draft"
                      : "Diblokir"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/articles/${article.id}`}>
                      <Button size="sm" variant="ghost" className="hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    {article.status === "published" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openBlockModal(article)}
                        className="hover:text-red-600"
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    ) : article.status === "blocked" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUnblockArticle(article.id, article.title)}
                        className="hover:text-green-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDeleteModal(article)}
                      className="hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          Tidak ada artikel yang ditemukan sesuai pencarian Anda.
        </div>
      )}

      {/* Modals */}
      {selectedArticle && (
        <>
          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteArticle}
            title="Hapus Artikel"
            itemName={selectedArticle.title}
          />
          <BlockArticleModal
            isOpen={isBlockModalOpen}
            onClose={() => setIsBlockModalOpen(false)}
            articleId={selectedArticle.id}
            articleTitle={selectedArticle.title}
            onBlock={handleBlockArticle}
          />
        </>
      )}
    </div>
  );
}
