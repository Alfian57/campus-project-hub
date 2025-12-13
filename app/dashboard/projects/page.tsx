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
import { Edit, Trash2, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthContext";
import { projectsService } from "@/lib/services/projects";
import { ProjectApiResponse } from "@/types/api";
import { toast } from "sonner";

export default function MyProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      
      try {
        const data = await projectsService.getProjects({ 
          userId: user.id,
          perPage: 50 
        });
        setProjects(data.items);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Gagal memuat proyek");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [user]);

  const handleDelete = async (projectId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;
    
    try {
      await projectsService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success("Proyek berhasil dihapus");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Proyek Saya
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Kelola semua proyek Anda
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Unggah Proyek Baru
          </Button>
        </Link>
      </div>

      {/* Projects Table */}
      {projects.length > 0 ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyek</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Suka</TableHead>
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
                        src={project.thumbnailUrl || "/placeholder.jpg"}
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">
                          {project.title}
                        </div>
                        <div className="text-sm text-zinc-500">
                          {project.description?.slice(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.type === "free" ? "secondary" : "default"}>
                      {project.type === "free" ? "Gratis" : `Rp ${project.price?.toLocaleString("id-ID")}`}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      ❤️ {project.stats.likes}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      💬 {project.stats.commentCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        project.status === "published" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : project.status === "blocked"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }
                    >
                      {project.status === "published" ? "Terpublikasi" : project.status === "blocked" ? "Diblokir" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/project/${project.id}`}>
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:text-red-600"
                        onClick={() => handleDelete(project.id)}
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
        <div className="text-center py-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-zinc-500 mb-4">
            Anda belum membuat proyek apapun
          </p>
          <Link href="/dashboard/projects/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Buat Proyek Pertama Anda
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
