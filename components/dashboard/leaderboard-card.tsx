"use client";

import { cn } from "@/lib/cn";
import { getLevelFromExp, getLevelColor } from "@/lib/config/gamification";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { LevelBadge } from "./level-badge";

interface LeaderboardUser {
  id: string;
  name: string;
  avatarUrl: string;
  university?: string;
  totalExp: number;
}

interface LeaderboardCardProps {
  user: LeaderboardUser;
  rank: number;
  isCurrentUser?: boolean;
  className?: string;
}

export function LeaderboardCard({ 
  user, 
  rank, 
  isCurrentUser = false,
  className 
}: LeaderboardCardProps) {
  const level = getLevelFromExp(user.totalExp);
  const colors = getLevelColor(level);

  // Medal colors for top 3
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-amber-500";
      case 2:
        return "from-zinc-300 to-zinc-400";
      case 3:
        return "from-orange-400 to-orange-600";
      default:
        return "from-zinc-600 to-zinc-700";
    }
  };

  const getMedalIcon = (rank: number) => {
    if (rank <= 3) {
      return LucideIcons.Medal;
    }
    return null;
  };

  const MedalIcon = getMedalIcon(rank);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={cn(
        "relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
        isCurrentUser
          ? "bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10"
          : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900",
        rank <= 3 && "ring-1",
        rank === 1 && "ring-yellow-500/30",
        rank === 2 && "ring-zinc-400/30",
        rank === 3 && "ring-orange-500/30",
        className
      )}
    >
      {/* Rank Badge */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
          "bg-gradient-to-br text-white shadow-md",
          getMedalColor(rank)
        )}
      >
        {MedalIcon ? (
          <MedalIcon className="w-5 h-5" />
        ) : (
          rank
        )}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="relative">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700"
          />
          {isCurrentUser && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <LucideIcons.Star className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-zinc-100 truncate">
            {user.name}
            {isCurrentUser && <span className="text-blue-400 ml-1">(Anda)</span>}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <LevelBadge totalExp={user.totalExp} size="sm" />
          {user.university && (
            <span className="text-xs text-zinc-500 truncate">{user.university}</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 text-right">
        <div className={cn("text-lg font-bold", colors.text)}>
          {user.totalExp.toLocaleString()} EXP
        </div>
        <div className="text-sm text-zinc-500">
          Level {level}
        </div>
      </div>
    </motion.div>
  );
}
