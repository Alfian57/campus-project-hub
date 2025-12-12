"use client";

import { cn } from "@/lib/cn";
import { getLevelFromExp, getLevelTitle, getLevelColor } from "@/lib/config/gamification";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface LevelBadgeProps {
  totalExp: number;
  showTitle?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LevelBadge({ 
  totalExp, 
  showTitle = true, 
  size = "md",
  className 
}: LevelBadgeProps) {
  const level = getLevelFromExp(totalExp);
  const title = getLevelTitle(level);
  const colors = getLevelColor(level);
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center font-semibold rounded-full border",
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size],
        className
      )}
    >
      <LucideIcons.Sparkles className={iconSizes[size]} />
      <span>Level {level}</span>
      {showTitle && (
        <>
          <span className="opacity-50">•</span>
          <span>{title}</span>
        </>
      )}
    </motion.div>
  );
}
