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
import { Ban, CheckCircle, Eye, Trash2, Search, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";
import { BlockProjectModal } from "@/components/admin/block-project-modal";

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<ProjectApiResponse[]>([]);
  const [categories, setCategories] = useState<CategoryApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectApiResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsData, categoriesData] = await Promise.all([
        projectsService.getProjects({ perPage: 100 }),
        categoriesService.getCategories(),
      ]);
      setProjects(projectsData.items);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || project.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openBlockModal = (project: ProjectApiResponse) => {
    setSelectedProject(project);
    setIsBlockModalOpen(true);
  };

  const handleBlockProject = async (projectId: string, reason: string) => {
    try {
      await projectsService.blockProject(projectId, reason);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: "blocked" } : p))
      );
      toast.success("Proyek berhasil diblokir");
    } catch (error) {
      console.error("Error blocking project:", error);
      toast.error("Gagal memblokir proyek");
    }
  };

  const handleUnblockProject = async (projectId: string, projectTitle: string) => {
    try {
      await projectsService.unblockProject(projectId);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: "published" } : p))
      );
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
    
    try {
      await projectsService.deleteProject(selectedProject.id);
      setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      toast.success(`Proyek "${selectedProject.title}" telah dihapus`);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Gagal menghapus proyek");
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
          Manajemen Proyek
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Kelola semua proyek platform
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Cari proyek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Proyek</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {projects.length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Terpublikasi</p>
          <p className="text-2xl font-bold text-green-600">
            {projects.filter((p) => p.status === "published").length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Diblokir</p>
          <p className="text-2xl font-bold text-red-600">
            {projects.filter((p) => p.status === "blocked").length}
          </p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proyek</TableHead>
              <TableHead>Pembuat</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Suka</TableHead>
              <TableHead>Komentar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={project.thumbnailUrl || "/placeholder.jpg"}
                      alt={project.title}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-50">
                        {project.title}
                      </div>
                      <div className="text-sm text-zinc-500">
                        {(project.description || "").slice(0, 40)}...
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={project.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.author.name}`}
                      alt={project.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium">{project.author.name}</div>
                      <div className="text-xs text-zinc-500">{project.author.university || ""}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {(project.techStack || []).slice(0, 2).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {(project.techStack || []).length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{(project.techStack || []).length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{project.stats.likes}</TableCell>
                <TableCell>{project.stats.commentCount}</TableCell>
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
                    <Link href={`/project/${project.id}`}>
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

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          Tidak ada proyek yang ditemukan sesuai pencarian Anda.
        </div>
      )}

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
