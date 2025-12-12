import { getCurrentUser } from "@/lib/auth";
import { mockUsers } from "@/lib/mock-dashboard-data";
import { redirect } from "next/navigation";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";
import { LevelBadge } from "@/components/dashboard/level-badge";
import { ExpProgress } from "@/components/dashboard/exp-progress";
import * as LucideIcons from "lucide-react";

export default function LeaderboardPage() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  // Sort users by totalExp (descending)
  const rankedUsers = [...mockUsers]
    .filter((u) => u.status === "active")
    .sort((a, b) => b.totalExp - a.totalExp);

  // Find current user's rank
  const currentUserRank = rankedUsers.findIndex((u) => u.id === currentUser.id) + 1;

  // Top 3 users for podium
  const topThree = rankedUsers.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-50 mb-2 flex items-center gap-3">
          <LucideIcons.Trophy className="w-8 h-8 text-yellow-400" />
          Leaderboard
        </h1>
        <p className="text-zinc-400">
          Peringkat pengguna berdasarkan Experience Points (EXP)
        </p>
      </div>

      {/* Current User Stats */}
      <div className="bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 rounded-2xl border border-blue-500/30 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Rank Badge */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/30">
              #{currentUserRank}
            </div>
            <div>
              <p className="text-sm text-zinc-400">Peringkat Anda</p>
              <p className="text-xl font-bold text-zinc-100">{currentUser.name}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-zinc-700" />

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <LevelBadge totalExp={currentUser.totalExp} />
              <span className="text-zinc-400 text-sm">
                {currentUser.totalExp.toLocaleString()} EXP
              </span>
            </div>
            <ExpProgress totalExp={currentUser.totalExp} showDetails={false} />
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 0, 2].map((index) => {
          const user = topThree[index];
          if (!user) return null;

          const actualRank = index === 1 ? 1 : index === 0 ? 2 : 3;
          const heights = { 1: "h-36", 2: "h-28", 3: "h-24" };
          const colors = {
            1: "from-yellow-400 to-amber-500",
            2: "from-zinc-300 to-zinc-400",
            3: "from-orange-400 to-orange-600",
          };

          return (
            <div
              key={user.id}
              className="flex flex-col items-center"
            >
              {/* Avatar */}
              <div className="relative mb-4">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-16 h-16 rounded-full bg-zinc-800 border-4 border-zinc-700"
                />
                <div
                  className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${colors[actualRank as keyof typeof colors]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                >
                  {actualRank}
                </div>
              </div>

              {/* Name */}
              <p className="text-sm font-semibold text-zinc-100 text-center truncate max-w-full px-2">
                {user.name}
              </p>
              <p className="text-xs text-zinc-500 mb-2">
                {user.totalExp.toLocaleString()} EXP
              </p>

              {/* Podium */}
              <div
                className={`w-full ${heights[actualRank as keyof typeof heights]} rounded-t-xl bg-gradient-to-t ${colors[actualRank as keyof typeof colors]} opacity-80`}
              />
            </div>
          );
        })}
      </div>

      {/* Full Ranking List */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <LucideIcons.Users className="w-5 h-5 text-zinc-400" />
          Peringkat Lengkap
        </h2>

        <div className="space-y-2">
          {rankedUsers.map((user, index) => (
            <LeaderboardCard
              key={user.id}
              user={user}
              rank={index + 1}
              isCurrentUser={user.id === currentUser.id}
            />
          ))}
        </div>
      </div>

      {/* How to Earn EXP */}
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
        <h3 className="font-semibold text-zinc-100 flex items-center gap-2 mb-4">
          <LucideIcons.Sparkles className="w-5 h-5 text-yellow-400" />
          Cara Mendapatkan EXP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: "FolderPlus", label: "Buat proyek baru", exp: "+100 EXP" },
            { icon: "ShoppingCart", label: "Jual proyek", exp: "+150 EXP" },
            { icon: "ShoppingBag", label: "Beli proyek", exp: "+50 EXP" },
            { icon: "Heart", label: "Proyek disukai", exp: "+10 EXP" },
            { icon: "MessageSquare", label: "Proyek dikomentari", exp: "+5 EXP" },
            { icon: "Eye", label: "Proyek dilihat", exp: "+1 EXP" },
          ].map((item) => {
            const Icon = LucideIcons[item.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-zinc-300">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-green-400">
                  {item.exp}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
