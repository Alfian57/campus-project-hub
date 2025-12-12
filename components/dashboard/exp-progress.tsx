"use client";

import { cn } from "@/lib/cn";
import { 
  getLevelFromExp, 
  getLevelProgress, 
  getRequiredExpForLevel,
  getExpToNextLevel,
  getLevelColor
} from "@/lib/config/gamification";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface ExpProgressProps {
  totalExp: number;
  showDetails?: boolean;
  className?: string;
}

export function ExpProgress({ 
  totalExp, 
  showDetails = true,
  className 
}: ExpProgressProps) {
  const level = getLevelFromExp(totalExp);
  const progress = getLevelProgress(totalExp);
  const expToNext = getExpToNextLevel(totalExp);
  const currentLevelExp = getRequiredExpForLevel(level);
  const nextLevelExp = getRequiredExpForLevel(level + 1);
  const colors = getLevelColor(level);

  return (
    <div className={cn("space-y-2", className)}>
      {showDetails && (
        <div className="flex items-center justify-between text-sm">
          <span className={cn("font-medium", colors.text)}>
            {totalExp.toLocaleString()} EXP
          </span>
          <span className="text-zinc-500">
            {expToNext.toLocaleString()} EXP ke Level {level + 1}
          </span>
        </div>
      )}
      
      <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            "bg-gradient-to-r from-blue-500 to-cyan-500"
          )}
        />
        {/* Glow effect */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500/50 to-cyan-500/50 blur-sm"
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Level {level}</span>
          <span>{progress}%</span>
          <span>Level {level + 1}</span>
        </div>
      )}
    </div>
  );
}
