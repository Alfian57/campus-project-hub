"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RoleGuard } from "@/components/auth/role-guard";
import { useAuth } from "@/components/providers/AuthContext";
import { projectsService } from "@/lib/services/projects";
import { transactionsService } from "@/lib/services/transactions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { Loader2 } from "lucide-react";
import { ProjectApiResponse, TransactionApiResponse } from "@/types/api";
import { Project } from "@/types";

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

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<TransactionApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalLikes: 0,
    totalSales: 0,
  });

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      try {
        // Fetch user's projects
        const projectsData = await projectsService.getProjects({ 
          userId: user.id,
          perPage: 10 
        });
        const mappedProjects = projectsData.items.map(mapApiToProject);
        setProjects(mappedProjects);
        
        // Calculate stats from projects
        const totalLikes = mappedProjects.reduce((sum, p) => sum + p.stats.likes, 0);
        
        // Fetch transactions
        const transactionsData = await transactionsService.getTransactions({ 
          type: "sales",
          perPage: 10 
        });
        setTransactions(transactionsData.items);
        
        const totalSales = transactionsData.items
          .filter(t => t.status === "success")
          .reduce((sum, t) => sum + t.amount, 0);
        
        setStats({
          totalProjects: projectsData.meta.total_items,
          totalLikes,
          totalSales,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <RoleGuard allowedRoles={["user"]}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Selamat Datang, {user.name}! 👋
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Ini adalah overview dari aktivitas proyek Anda
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Proyek"
            value={stats.totalProjects}
            iconName="FolderKanban"
            description="Proyek yang telah dibuat"
            color="blue"
          />
          <StatsCard
            title="Total Suka"
            value={stats.totalLikes}
            iconName="Heart"
            description="Suka dari semua proyek"
            color="red"
          />
          <StatsCard
            title="Total Penjualan"
            value={`Rp ${(stats.totalSales / 1000).toFixed(0)}K`}
            iconName="DollarSign"
            description="Penjualan yang diterima"
            color="green"
          />
          <StatsCard
            title="Level"
            value={user.level || 1}
            iconName="TrendingUp"
            description={`${user.totalExp || 0} EXP`}
            color="purple"
          />
        </div>


        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Proyek Saya
            </h2>
            <Link href="/dashboard/projects">
              <Button variant="ghost" size="sm">
                Lihat Semua →
              </Button>
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} href={`/dashboard/projects/${project.id}`} />
              ))}
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

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            Aktivitas Terbaru
          </h2>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        Pembelian {transaction.status === "success" ? "berhasil" : transaction.status === "pending" ? "pending" : "gagal"}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {transaction.buyerName} • {transaction.projectTitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.status === "success" ? "text-green-600" : "text-zinc-500"}`}>
                        {transaction.status === "success" ? "+" : ""}Rp {(transaction.amount / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(transaction.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-zinc-500 py-8">
                Belum ada aktivitas transaksi
              </p>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
