"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { projectsService } from "@/lib/services/projects";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter, Loader2 } from "lucide-react";
import { ProjectApiResponse } from "@/types/api";
import { Project } from "@/types";

type FilterType = "all" | "free" | "paid";

// Convert API response to Project type
function mapApiToProject(apiProject: ProjectApiResponse): Project {
  return {
    id: apiProject.id,
    title: apiProject.title,
    description: apiProject.description || "",
    thumbnailUrl: apiProject.thumbnailUrl || "",
    images: apiProject.images,
    techStack: apiProject.techStack || [],
    links: apiProject.links,
    stats: apiProject.stats,
    type: apiProject.type,
    price: apiProject.price,
    author: {
      id: apiProject.author.id,
      name: apiProject.author.name,
      avatarUrl: apiProject.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiProject.author.name}`,
      university: apiProject.author.university || undefined,
      major: apiProject.author.major || undefined,
    },
  };
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [freeCount, setFreeCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await projectsService.getProjects({
        perPage: 50,
        type: filter,
        search: debouncedSearch || undefined,
      });
      
      setProjects(data.items.map(mapApiToProject));
      setTotalCount(data.total);
      
      // Count free and paid for filters
      if (filter === "all" && !debouncedSearch) {
        const freeData = await projectsService.getProjects({ type: "free", perPage: 1 });
        const paidData = await projectsService.getProjects({ type: "paid", perPage: 1 });
        setFreeCount(freeData.total);
        setPaidCount(paidData.total);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter, debouncedSearch]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-zinc-800">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-zinc-50">
                Semua Proyek
              </h1>
              <p className="text-sm text-zinc-400">
                {isLoading ? "Memuat..." : `${projects.length} proyek ditemukan`}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Cari proyek berdasarkan judul, deskripsi, atau teknologi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Filter className="w-4 h-4" />
              <span>Filter:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={
                  filter === "all"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : ""
                }
              >
                Semua ({totalCount || freeCount + paidCount})
              </Button>
              <Button
                variant={filter === "free" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("free")}
                className={
                  filter === "free"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
              >
                Gratis ({freeCount})
              </Button>
              <Button
                variant={filter === "paid" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("paid")}
                className={
                  filter === "paid"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : ""
                }
              >
                Berbayar ({paidCount})
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-zinc-50 mb-2">
              Tidak ada proyek ditemukan
            </h3>
            <p className="text-zinc-400 mb-6">
              Coba ubah kata kunci pencarian atau filter Anda
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
              }}
            >
              Reset Filter
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
