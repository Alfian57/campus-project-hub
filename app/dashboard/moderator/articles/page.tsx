"use client";

import { useState, useEffect, useCallback } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { articlesService } from "@/lib/services/articles";
import { ArticleApiResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlockReasonModal } from "@/components/moderator/block-reason-modal";
import { 
  DataTable, 
  SearchFilter, 
  ContentStatusBadge,
  STATUS_FILTER_OPTIONS 
} from "@/components/shared";
import { usePagination, useDebounce } from "@/hooks";
import { 
  ArrowLeft, 
  Lock,
  Unlock,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { getAssetUrl } from "@/lib/env";

export default function ModeratorArticlesPage() {
  const [articles, setArticles] = useState<ArticleApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalItems, setTotalItems] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Block modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ArticleApiResponse | null>(null);

  // Hooks
  const { page, perPage, setPage } = usePagination({ initialPerPage: 20 });
  const debouncedSearch = useDebounce(searchQuery);
  const totalPages = Math.ceil(totalItems / perPage);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await articlesService.getArticles({
        page,
        perPage,
        search: debouncedSearch,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setArticles(data.items);
      setTotalItems(data.meta.total_items);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Gagal memuat data artikel");
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const openBlockModal = (article: ArticleApiResponse) => {
    setSelectedArticle(article);
    setShowBlockModal(true);
  };

  const handleBlock = async (_reason: string) => {
    if (!selectedArticle) return;
    setActionLoading(selectedArticle.id);
    try {
      await articlesService.blockArticle(selectedArticle.id);
      toast.success("Artikel berhasil diblokir");
      fetchArticles();
    } catch (error) {
      console.error("Error blocking article:", error);
      toast.error("Gagal memblokir artikel");
    } finally {
      setActionLoading(null);
      setShowBlockModal(false);
      setSelectedArticle(null);
    }
  };

  const handleUnblock = async (articleId: string) => {
    setActionLoading(articleId);
    try {
      await articlesService.unblockArticle(articleId);
      toast.success("Artikel berhasil dibuka blokirnya");
      fetchArticles();
    } catch (error) {
      console.error("Error unblocking article:", error);
      toast.error("Gagal membuka blokir artikel");
    } finally {
      setActionLoading(null);
    }
  };

  // Table columns definition
  const columns = [
    {
      key: "article",
      header: "Artikel",
      render: (article: ArticleApiResponse) => (
        <div className="flex items-center gap-3">
          <img
            src={getAssetUrl(article.thumbnailUrl) || "/placeholder.jpg"}
            alt={article.title}
            className="w-16 h-10 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium text-zinc-100 line-clamp-1">{article.title}</p>
            <p className="text-sm text-zinc-500 line-clamp-1">{article.excerpt?.slice(0, 50)}...</p>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      header: "Penulis",
      render: (article: ArticleApiResponse) => (
        <span className="text-zinc-400">{article.author?.name || "-"}</span>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      render: (article: ArticleApiResponse) => (
        <Badge variant="secondary">{article.category || "-"}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (article: ArticleApiResponse) => (
        <ContentStatusBadge status={article.status} />
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName: "text-zinc-400 text-right",
      render: (article: ArticleApiResponse) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/dashboard/moderator/articles/${article.id}`}>
            <Button size="sm" variant="ghost">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          {article.status === "blocked" ? (
            <Button
              size="sm"
              variant="outline"
              className="text-green-500 hover:text-green-400 border-green-500/30"
              onClick={() => handleUnblock(article.id)}
              disabled={actionLoading === article.id}
            >
              {actionLoading === article.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Unlock className="w-4 h-4 mr-1" />
              )}
              Buka Blokir
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="text-red-500 hover:text-red-400 border-red-500/30"
              onClick={() => openBlockModal(article)}
              disabled={actionLoading === article.id}
            >
              {actionLoading === article.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4 mr-1" />
              )}
              Blokir
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <RoleGuard allowedRoles={["moderator", "admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/moderator">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-50">Moderasi Artikel</h1>
            <p className="text-zinc-400">Kelola dan moderasi konten artikel</p>
          </div>
        </div>

        {/* Search & Filters */}
        <SearchFilter
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari artikel..."
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: STATUS_FILTER_OPTIONS,
            },
          ]}
        />

        {/* Data Table */}
        <DataTable
          data={articles}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="Tidak ada artikel ditemukan"
          keyExtractor={(article) => article.id}
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={perPage}
          onPageChange={setPage}
        />
      </div>

      {/* Block Reason Modal */}
      {selectedArticle && (
        <BlockReasonModal
          isOpen={showBlockModal}
          onClose={() => {
            setShowBlockModal(false);
            setSelectedArticle(null);
          }}
          onConfirm={handleBlock}
          title="Blokir Artikel"
          itemName={selectedArticle.title}
          itemType="artikel"
          isLoading={actionLoading === selectedArticle.id}
        />
      )}
    </RoleGuard>
  );
}
