"use client";

import { useState } from "react";
import { mockProjects } from "@/lib/mock-data";
import { mockCategories } from "@/lib/mock-dashboard-data";
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
import { Ban, CheckCircle, Eye, Trash2, Search, Star } from "lucide-react";
import { Project } from "@/types";
import { toast } from "sonner";
import Link from "next/link";

type ProjectWithStatus = Project & { status: "published" | "blocked" };

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<ProjectWithStatus[]>(
    mockProjects.map((p) => ({ ...p, status: "published" as const }))
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlockProject = (projectId: string, projectTitle: string) => {
    const reason = prompt(`Mengapa Anda memblokir "${projectTitle}"?`);
    if (reason) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: "blocked" } : p))
      );
      toast.success(`Proyek "${projectTitle}" telah diblokir`);
    }
  };

  const handleUnblockProject = (projectId: string, projectTitle: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: "published" } : p))
    );
    toast.success(`Proyek "${projectTitle}" telah dibuka blokirnya`);
  };

  const handleDeleteProject = (projectId: string, projectTitle: string) => {
    if (
      confirm(
        `Yakin ingin menghapus "${projectTitle}"? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success(`Proyek "${projectTitle}" telah dihapus`);
    }
  };

  const handleToggleFeatured = (projectId: string) => {
    // Mock implementation
    toast.success("Status unggulan diubah");
  };

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
        <select className="h-10 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <option value="">Semua Kategori</option>
          {mockCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Total Proyek
          </p>
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
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-50">
                        {project.title}
                      </div>
                      <div className="text-sm text-zinc-500">
                        {project.description.slice(0, 40)}...
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={project.author.avatarUrl}
                      alt={project.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium">
                        {project.author.name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {project.author.university}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {project.techStack.slice(0, 2).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.techStack.length - 2}
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
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:text-blue-600"
                        title="Lihat Proyek"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleFeatured(project.id)}
                      className="hover:text-yellow-600"
                      title="Jadikan Unggulan"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                    {project.status === "published" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleBlockProject(project.id, project.title)
                        }
                        className="hover:text-red-600"
                        title="Blokir Proyek"
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleUnblockProject(project.id, project.title)
                        }
                        className="hover:text-green-600"
                        title="Buka Blokir"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleDeleteProject(project.id, project.title)
                      }
                      className="hover:text-red-600"
                      title="Hapus Proyek"
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
    </div>
  );
}
