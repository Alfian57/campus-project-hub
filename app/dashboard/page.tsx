import { StatsCard } from "@/components/dashboard/stats-card";
import { getCurrentUser } from "@/lib/auth";
import { mockProjects } from "@/lib/mock-data";
import { mockTransactions } from "@/lib/mock-dashboard-data";
import { FolderKanban, Heart, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";

export default function DashboardPage() {
  const user = getCurrentUser();

  if (!user) return null;

  // Get user's projects (mock: first 3 projects)
  const userProjects = mockProjects.slice(0, 3);

  // Calculate user stats
  const totalLikes = userProjects.reduce((sum, p) => sum + p.stats.likes, 0);
  const userDonations = mockTransactions
    .filter((t) =>
      userProjects.some((p) => p.id === t.projectId && t.status === "success")
    )
    .reduce((sum, t) => sum + t.amount, 0);

  return (
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
          value={userProjects.length}
          iconName="FolderKanban"
          description="Proyek yang telah dibuat"
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Suka"
          value={totalLikes}
          iconName="Heart"
          description="Suka dari semua proyek"
          color="red"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Donasi"
          value={`Rp ${(userDonations / 1000).toFixed(0)}K`}
          iconName="DollarSign"
          description="Donasi yang diterima"
          color="green"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Tingkat Interaksi"
          value="23%"
          iconName="TrendingUp"
          description="Engagement rate"
          color="purple"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Unggah Proyek Baru
          </Button>
        </Link>
        <Link href="/dashboard/projects">
          <Button variant="outline">Kelola Proyek</Button>
        </Link>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
          Aktivitas Terbaru
        </h2>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <div className="space-y-4">
            {mockTransactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    Donasi diterima
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {transaction.donorName} • {transaction.projectTitle}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    +Rp {(transaction.amount / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-zinc-500">
                    {transaction.createdAt.toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
