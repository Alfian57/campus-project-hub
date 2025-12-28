"use client";

import { useState, useEffect } from "react";
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
import { Edit, Trash2, Eye, Loader2, Search, Filter, FileText, Plus, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthContext";
import { articlesService } from "@/lib/services/articles";
import { ArticleApiResponse } from "@/types/api";
import { toast } from "sonner";
import { ACTION_POINTS } from "@/lib/config/gamification";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function UserArticlesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [articles, setArticles] = useState<ArticleApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<ArticleApiResponse | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchArticles();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (user) {
      fetchArticles();
    }
  }, [user, pagination.page, pagination.perPage, statusFilter]);

  const fetchArticles = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await articlesService.getArticles({
        userId: user.id,
        page: pagination.page,
        perPage: pagination.perPage,
        search: searchQuery,
        status: statusFilter || undefined,
      });
      setArticles(data.items);
      setPagination(prev => ({
        ...prev,
        totalItems: data.meta.total_items,
        totalPages: data.meta.total_pages,
      }));
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Gagal memuat artikel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (article: ArticleApiResponse) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    
    try {
      await articlesService.deleteArticle(articleToDelete.id);
      setArticles(articles.filter(a => a.id !== articleToDelete.id));
      toast.success("Artikel berhasil dihapus");
      setShowDeleteModal(false);
      setArticleToDelete(null);
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Gagal menghapus artikel");
    }
  };

  // Calculate stats
  const totalViews = articles.reduce((sum, a) => sum + (a.viewCount || 0), 0);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Artikel Saya
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Kelola semua artikel Anda
          </p>
        </div>
        <Link href="/dashboard/articles/new">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" />
            Buat Artikel
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Artikel</p>
              <p className="text-2xl font-bold text-zinc-50">{pagination.totalItems}</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Views</p>
              <p className="text-2xl font-bold text-zinc-50">{totalViews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Cari artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="relative">
            <select 
              className="h-10 w-full md:w-[150px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none dark:text-zinc-100"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            >
              <option value="" className="dark:bg-zinc-900 dark:text-zinc-100">Semua Status</option>
              <option value="published" className="dark:bg-zinc-900 dark:text-zinc-100">Terbit</option>
              <option value="draft" className="dark:bg-zinc-900 dark:text-zinc-100">Draft</option>
              <option value="blocked" className="dark:bg-zinc-900 dark:text-zinc-100">Diblokir</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Articles Table */}
      {isLoading && articles.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : articles.length > 0 ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artikel</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={article.thumbnailUrl || "/placeholder.jpg"}
                        alt={article.title}
                        className="w-16 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-50 line-clamp-1">
                          {article.title}
                        </div>
                        <div className="text-sm text-zinc-500 line-clamp-1">
                          {article.excerpt?.slice(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {article.category || "Umum"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      👁️ {article.viewCount || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        article.status === "published" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : article.status === "blocked"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }
                    >
                      {article.status === "published" ? "Terbit" : article.status === "blocked" ? "Diblokir" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/articles/${article.id}`}>
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      {article.status !== "blocked" ? (
                        <Link href={`/dashboard/articles/${article.id}/edit`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled
                          className="opacity-50 cursor-not-allowed"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:text-red-600"
                        onClick={() => handleDeleteClick(article)}
                        disabled={article.status === "blocked"}
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
      ) : (
        <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-300 mb-2">
            {searchQuery || statusFilter ? "Tidak ada artikel yang cocok" : "Belum Ada Artikel"}
          </h3>
          <p className="text-zinc-500 mb-6">
            {searchQuery || statusFilter 
              ? "Coba ubah filter pencarian Anda"
              : "Mulai berbagi pengetahuan dengan menulis artikel pertamamu!"}
          </p>
          {!searchQuery && !statusFilter && (
            <Link href="/dashboard/articles/new">
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="w-4 h-4" />
                Buat Artikel Pertama
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalItems > 0 && (
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Baris per halaman:</span>
            <div className="relative">
              <select
                className="h-9 w-[70px] rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none dark:text-zinc-100"
                value={pagination.perPage}
                onChange={(e) => setPagination(prev => ({ ...prev, perPage: Number(e.target.value), page: 1 }))}
              >
                <option value="10" className="dark:bg-zinc-900">10</option>
                <option value="20" className="dark:bg-zinc-900">20</option>
                <option value="50" className="dark:bg-zinc-900">50</option>
                <option value="100" className="dark:bg-zinc-900">100</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tips Card */}
      <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl border border-blue-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-blue-400" />
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

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setArticleToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Artikel"
        itemName={articleToDelete?.title || ""}
      />
    </div>
  );
}
