"use client";

import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName: keyof typeof LucideIcons;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "red" | "yellow" | "purple";
}

const colorClasses = {
  blue: {
    icon: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-100 dark:border-blue-900/30",
    text: "text-blue-600 dark:text-blue-400"
  },
  green: {
    icon: "bg-gradient-to-br from-green-500 to-emerald-500 text-white",
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-100 dark:border-green-900/30",
    text: "text-green-600 dark:text-green-400"
  },
  red: {
    icon: "bg-gradient-to-br from-red-500 to-rose-500 text-white",
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-100 dark:border-red-900/30",
    text: "text-red-600 dark:text-red-400"
  },
  yellow: {
    icon: "bg-gradient-to-br from-yellow-500 to-orange-500 text-white",
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    border: "border-yellow-100 dark:border-yellow-900/30",
    text: "text-yellow-600 dark:text-yellow-400"
  },
  purple: {
    icon: "bg-gradient-to-br from-purple-500 to-pink-500 text-white",
    bg: "bg-purple-50 dark:bg-purple-950/20",
    border: "border-purple-100 dark:border-purple-900/30",
    text: "text-purple-600 dark:text-purple-400"
  },
};

export function StatsCard({
  title,
  value,
  iconName,
  description,
  trend,
  color = "blue",
}: StatsCardProps) {
  const Icon = LucideIcons[iconName] as LucideIcons.LucideIcon;
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-2xl border ${colors.border} ${colors.bg} p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.05 }}
            className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center shadow-md`}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
          
          {trend && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              trend.isPositive 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}>
              <LucideIcons.TrendingUp className={`w-3 h-3 ${!trend.isPositive && "rotate-180"}`} />
              {trend.isPositive ? "+" : ""}{trend.value}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 tracking-wide uppercase text-[11px]">
            {title}
          </p>
          <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {value}
          </p>
          {description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-500 pt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
