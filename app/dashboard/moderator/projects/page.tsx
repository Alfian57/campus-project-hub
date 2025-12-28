"use client";

import { useState, useEffect, useCallback } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { projectsService } from "@/lib/services/projects";
import { ProjectApiResponse } from "@/types/api";
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

export default function ModeratorProjectsPage() {
  const [projects, setProjects] = useState<ProjectApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalItems, setTotalItems] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Block modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectApiResponse | null>(null);

  // Hooks
  const { page, perPage, setPage } = usePagination({ initialPerPage: 20 });
  const debouncedSearch = useDebounce(searchQuery);
  const totalPages = Math.ceil(totalItems / perPage);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await projectsService.getProjects({
        page,
        perPage,
        search: debouncedSearch,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setProjects(data.items);
      setTotalItems(data.meta.total_items);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Gagal memuat data proyek");
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openBlockModal = (project: ProjectApiResponse) => {
    setSelectedProject(project);
    setShowBlockModal(true);
  };

  const handleBlock = async (reason: string) => {
    if (!selectedProject) return;
    setActionLoading(selectedProject.id);
    try {
      await projectsService.blockProject(selectedProject.id, reason);
      toast.success("Proyek berhasil diblokir");
      fetchProjects();
    } catch (error) {
      console.error("Error blocking project:", error);
      toast.error("Gagal memblokir proyek");
    } finally {
      setActionLoading(null);
      setShowBlockModal(false);
      setSelectedProject(null);
    }
  };

  const handleUnblock = async (projectId: string) => {
    setActionLoading(projectId);
    try {
      await projectsService.unblockProject(projectId);
      toast.success("Proyek berhasil dibuka blokirnya");
      fetchProjects();
    } catch (error) {
      console.error("Error unblocking project:", error);
      toast.error("Gagal membuka blokir proyek");
    } finally {
      setActionLoading(null);
    }
  };

  // Table columns definition
  const columns = [
    {
      key: "project",
      header: "Proyek",
      render: (project: ProjectApiResponse) => (
        <div className="flex items-center gap-3">
          <img
            src={getAssetUrl(project.thumbnailUrl) || "/placeholder.jpg"}
            alt={project.title}
            className="w-16 h-10 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium text-zinc-100 line-clamp-1">{project.title}</p>
            <p className="text-sm text-zinc-500 line-clamp-1">{project.description?.slice(0, 50)}...</p>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      header: "Pemilik",
      render: (project: ProjectApiResponse) => (
        <span className="text-zinc-400">{project.author?.name || "-"}</span>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      render: (project: ProjectApiResponse) => (
        <Badge variant="secondary">{project.category?.name || "-"}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (project: ProjectApiResponse) => (
        <ContentStatusBadge status={project.status} />
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName: "text-zinc-400 text-right",
      render: (project: ProjectApiResponse) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/dashboard/moderator/projects/${project.id}`}>
            <Button size="sm" variant="ghost">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          {project.status === "blocked" ? (
            <Button
              size="sm"
              variant="outline"
              className="text-green-500 hover:text-green-400 border-green-500/30"
              onClick={() => handleUnblock(project.id)}
              disabled={actionLoading === project.id}
            >
              {actionLoading === project.id ? (
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
              onClick={() => openBlockModal(project)}
              disabled={actionLoading === project.id}
            >
              {actionLoading === project.id ? (
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
            <h1 className="text-2xl font-bold text-zinc-50">Moderasi Proyek</h1>
            <p className="text-zinc-400">Kelola dan moderasi konten proyek</p>
          </div>
        </div>

        {/* Search & Filters */}
        <SearchFilter
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari proyek..."
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
          data={projects}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="Tidak ada proyek ditemukan"
          keyExtractor={(project) => project.id}
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={perPage}
          onPageChange={setPage}
        />
      </div>

      {/* Block Reason Modal */}
      {selectedProject && (
        <BlockReasonModal
          isOpen={showBlockModal}
          onClose={() => {
            setShowBlockModal(false);
            setSelectedProject(null);
          }}
          onConfirm={handleBlock}
          title="Blokir Proyek"
          itemName={selectedProject.title}
          itemType="proyek"
          isLoading={actionLoading === selectedProject.id}
        />
      )}
    </RoleGuard>
  );
}
