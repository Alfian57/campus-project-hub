"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { usersService } from "@/lib/services/users";
import { projectsService } from "@/lib/services/projects";
import { transactionsService } from "@/lib/services/transactions";
import { categoriesService } from "@/lib/services/categories";
import { Loader2 } from "lucide-react";
import { UserApiResponse, TransactionApiResponse } from "@/types/api";
import { formatCurrency } from "@/lib/utils/format";

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalProjects: 0,
    totalCategories: 0,
    totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState<UserApiResponse[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<TransactionApiResponse[]>([]);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const [usersData, projectsData, categoriesData, transactionsData] = await Promise.all([
        usersService.getUsers({ perPage: 100 }),
        projectsService.getProjects({ perPage: 1 }),
        categoriesService.getCategories(),
        transactionsService.getAdminTransactions({ perPage: 10 }),
      ]);

      const activeUsers = usersData.items.filter(u => u.status === "active").length;
      const blockedUsers = usersData.items.filter(u => u.status === "blocked").length;
      const totalRevenue = transactionsData.items
        .filter(t => t.status === "success")
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalUsers: usersData.total,
        activeUsers,
        blockedUsers,
        totalProjects: projectsData.total,
        totalCategories: categoriesData.length,
        totalRevenue,
      });

      setRecentUsers(usersData.items.slice(0, 5));
      setRecentTransactions(transactionsData.items.slice(0, 5));
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setIsLoading(false);
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
          />
          <StatsCard
            title="Total Proyek"
            value={stats.totalProjects}
            iconName="FolderKanban"
            description="Proyek di platform"
            color="purple"
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
            value={formatCurrency(stats.totalRevenue)}
            iconName="DollarSign"
            description="Dari transaksi"
            color="green"
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
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
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
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-zinc-500 capitalize">
                        {transaction.status === "success" ? "Berhasil" : transaction.status === "pending" ? "Menunggu" : "Gagal"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-zinc-500 py-4">Belum ada transaksi</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Pengguna Terbaru
          </h2>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            {recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                          {user.name}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {user.university || "Belum diisi"}
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
            ) : (
              <p className="text-center text-zinc-500 py-4">Belum ada pengguna</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
