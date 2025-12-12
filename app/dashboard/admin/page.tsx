import { StatsCard } from "@/components/dashboard/stats-card";
import { mockAdminStats, mockUsers, mockTransactions } from "@/lib/mock-dashboard-data";
import { Users, FolderKanban, Tags, DollarSign, UserCheck, UserX, Shield, TrendingUp } from "lucide-react";

export default function AdminPage() {
  const stats = mockAdminStats;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Dashboard Admin
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Ringkasan platform dan administrasi
        </p>
      </div>

      {/* Main Stats */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Ringkasan Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Pengguna"
            value={stats.totalUsers}
            iconName="Users"
            description={`${stats.activeUsers} pengguna aktif`}
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Proyek"
            value={stats.totalProjects}
            iconName="FolderKanban"
            description={`${stats.activeProjects} terpublikasi`}
            color="purple"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Kategori"
            value={stats.totalCategories}
            iconName="Tags"
            description="Kategori aktif"
            color="yellow"
          />
          <StatsCard
            title="Total Pendapatan"
            value={`Rp ${(stats.totalRevenue / 1000).toFixed(0)}K`}
            iconName="DollarSign"
            description={`Rp ${(stats.revenueThisMonth / 1000).toFixed(0)}K bulan ini`}
            color="green"
            trend={{ value: 15, isPositive: true }}
          />
        </div>
      </div>

      {/* User Stats */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Statistik Pengguna
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Pengguna Aktif"
            value={stats.activeUsers}
            iconName="UserCheck"
            description="Sedang aktif"
            color="green"
          />
          <StatsCard
            title="Pengguna Diblokir"
            value={stats.blockedUsers}
            iconName="UserX"
            description="Akun diblokir"
            color="red"
          />
          <StatsCard
            title="Moderator"
            value={mockUsers.filter(u => u.role === "moderator").length}
            iconName="Shield"
            description="Moderator konten"
            color="purple"
          />
          <StatsCard
            title="Tingkat Pertumbuhan"
            value="+18%"
            iconName="TrendingUp"
            description="Pengguna baru bulan ini"
            color="blue"
            trend={{ value: 18, isPositive: true }}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Transaksi Terbaru
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
                      {transaction.buyerName}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {transaction.projectTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.status === "success" ? "text-green-600" : "text-yellow-600"
                    }`}>
                      Rp {(transaction.amount / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-zinc-500 capitalize">
                      {transaction.status === "success" ? "Berhasil" : transaction.status === "pending" ? "Menunggu" : "Gagal"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Pengguna Terbaru
          </h2>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <div className="space-y-4">
              {mockUsers.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        {user.name}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {user.university}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium px-2 py-1 rounded ${
                      user.status === "active" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }`}>
                      {user.status === "active" ? "Aktif" : "Diblokir"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
