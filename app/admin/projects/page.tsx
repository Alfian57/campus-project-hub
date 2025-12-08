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
    const reason = prompt(`Why are you blocking "${projectTitle}"?`);
    if (reason) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: "blocked" } : p))
      );
      toast.success(`Project "${projectTitle}" has been blocked`);
    }
  };

  const handleUnblockProject = (projectId: string, projectTitle: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: "published" } : p))
    );
    toast.success(`Project "${projectTitle}" has been unblocked`);
  };

  const handleDeleteProject = (projectId: string, projectTitle: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`
      )
    ) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success(`Project "${projectTitle}" has been deleted`);
    }
  };

  const handleToggleFeatured = (projectId: string) => {
    // Mock implementation
    toast.success("Featured status toggled");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Project Management
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Manage all platform projects
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select className="h-10 px-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <option value="">All Categories</option>
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
            Total Projects
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {projects.length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {projects.filter((p) => p.status === "published").length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Blocked</p>
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
              <TableHead>Project</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/project/${project.id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:text-blue-600"
                        title="View Project"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleFeatured(project.id)}
                      className="hover:text-yellow-600"
                      title="Feature Project"
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
                        title="Block Project"
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
                        title="Unblock Project"
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
                      title="Delete Project"
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
          No projects found matching your search.
        </div>
      )}
    </div>
  );
}
