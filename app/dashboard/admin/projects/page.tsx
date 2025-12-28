"use client";

import { useState, useEffect } from "react";
import { projectsService } from "@/lib/services/projects";
import { categoriesService } from "@/lib/services/categories";
import { ProjectApiResponse, CategoryApiResponse } from "@/types/api";
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
import { Ban, CheckCircle, Eye, Trash2, Search, Loader2, ArrowUpDown, Filter } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";
import { BlockProjectModal } from "@/components/admin/block-project-modal";
import { formatCurrency } from "@/lib/utils/format";

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<ProjectApiResponse[]>([]);
  const [categories, setCategories] = useState<CategoryApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "free" | "paid">("all");

  // Pagination & Sort
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Modals
  const [selectedProject, setSelectedProject] = useState<ProjectApiResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchProjects();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchProjects();
  }, [pagination.page, pagination.perPage, categoryFilter, statusFilter, typeFilter, sortConfig]);

  const fetchCategories = async () => {
    try {
        const data = await categoriesService.getCategories({ perPage: 100 });
        setCategories(data.items);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectsService.getProjects({
        page: pagination.page,
        perPage: pagination.perPage,
        search: searchQuery,
        category: categoryFilter,
        status: statusFilter,
        type: typeFilter,
        sortBy: sortConfig?.key,
        sortDirection: sortConfig?.direction,
      });
      setProjects(data.items);
      setPagination(prev => ({
        ...prev,
        totalItems: data.meta.total_items,
        totalPages: data.meta.total_pages,
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Gagal memuat proyek");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string) => {
    const validKeys = ["title", "author.name"];
    if (!validKeys.includes(key)) return;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
    }
    setSortConfig({ key, direction });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
        return <ArrowUpDown className={`w-4 h-4 ml-1 inline ${sortConfig.direction === 'asc' ? 'text-blue-500' : 'text-blue-500'}`} />
    }
    return <ArrowUpDown className="w-4 h-4 ml-1 inline text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
  };

  const openBlockModal = (project: ProjectApiResponse) => {
    setSelectedProject(project);
    setIsBlockModalOpen(true);
  };

  const handleBlockProject = async (projectId: string, reason: string) => {
    try {
      await projectsService.blockProject(projectId, reason);
      fetchProjects(); 
      toast.success("Proyek berhasil diblokir");
    } catch (error) {
      console.error("Error blocking project:", error);
      toast.error("Gagal memblokir proyek");
    }
  };

  const handleUnblockProject = async (projectId: string, projectTitle: string) => {
    try {
      await projectsService.unblockProject(projectId);
      fetchProjects();
      toast.success(`Proyek "${projectTitle}" telah dibuka blokirnya`);
    } catch (error) {
      console.error("Error unblocking project:", error);
      toast.error("Gagal membuka blokir proyek");
    }
  };

  const openDeleteModal = (project: ProjectApiResponse) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    
    console.log("diluar")
    try {
      console.log(selectedProject)
      await projectsService.deleteProject(selectedProject.id);
      fetchProjects();
      toast.success(`Proyek "${selectedProject.title}" telah dihapus`);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Gagal menghapus proyek");
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Manajemen Proyek
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Kelola semua proyek yang diunggah
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full md:max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
           <Input
             placeholder="Cari proyek..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="pl-10"
           />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
             {/* Category Filter */}
             <div className="relative">
                <select 
                    className="h-10 w-full md:w-[150px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
             </div>

             {/* Status Filter */}
             <div className="relative">
                <select 
                    className="h-10 w-full md:w-[150px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Semua Status</option>
                    <option value="published">Terpublikasi</option>
                    <option value="blocked">Diblokir</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
             </div>

             {/* Type Filter */}
             <div className="relative">
                <select 
                    className="h-10 w-full md:w-[150px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                >
                    <option value="all">Semua Tipe</option>
                    <option value="free">Gratis</option>
                    <option value="paid">Berbayar</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
             </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer group select-none"
                onClick={() => handleSort("title")}
              >
                Proyek {getSortIcon("title")}
              </TableHead>
              <TableHead 
                className="cursor-pointer group select-none"
                onClick={() => handleSort("author.name")}
              >
                Pembuat {getSortIcon("author.name")}
              </TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Komentar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={project.thumbnailUrl || "/placeholder-project.jpg"}
                      alt={project.title}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-50">
                        {project.title}
                      </div>
                      <div className="text-sm text-zinc-500">
                        {project.type === "free" ? "Gratis" : formatCurrency(project.price)} • {project.type === "free" ? "Free" : "Paid"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={project.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.author.name}`}
                      alt={project.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm">{project.author.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {project.category?.name || "Tidak Ada"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {project.type === "free" ? "Gratis" : formatCurrency(project.price)}
                  </span>
                </TableCell>
                <TableCell>{project.stats?.commentCount || 0}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      project.status === "published"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }
                  >
                    {project.status === "published" ? "Terpublikasi" : "Diblokir"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/admin/projects/${project.id}`}>
                      <Button size="sm" variant="ghost" className="hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    {project.status === "published" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openBlockModal(project)}
                        className="hover:text-red-600"
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUnblockProject(project.id, project.title)}
                        className="hover:text-green-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDeleteModal(project)}
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

      {projects.length === 0 && !isLoading && (
        <div className="text-center py-12 text-zinc-500">
          Tidak ada proyek yang ditemukan sesuai pencarian Anda.
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600">Baris per halaman:</span>
            <div className="relative">
                <select
                    className="h-9 w-[70px] rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none"
                    value={pagination.perPage}
                    onChange={(e) => setPagination(prev => ({ ...prev, perPage: Number(e.target.value), page: 1 }))}
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600">
                Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            <div className="flex gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page <= 1}
                    className="cursor-pointer"
                >
                    Prev
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="cursor-pointer"
                >
                    Next
                </Button>
            </div>
        </div>
      </div>

      {/* Modals */}
      {selectedProject && (
        <>
          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteProject}
            title="Hapus Proyek"
            itemName={selectedProject.title}
          />
          <BlockProjectModal
            isOpen={isBlockModalOpen}
            onClose={() => setIsBlockModalOpen(false)}
            projectId={selectedProject.id}
            projectTitle={selectedProject.title}
            onBlock={handleBlockProject}
          />
        </>
      )}
    </div>
  );
}
