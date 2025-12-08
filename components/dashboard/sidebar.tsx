"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import * as LucideIcons from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { motion } from "framer-motion";

interface SidebarProps {
  role?: "user" | "admin" | "moderator";
}

interface NavLink {
  href: string;
  label: string;
  iconName: string;
}

export function Sidebar({ role = "user" }: SidebarProps) {
  const pathname = usePathname();
  const user = getCurrentUser();

  const userLinks: NavLink[] = [
    {
      href: "/dashboard",
      label: "Overview",
      iconName: "LayoutDashboard",
    },
    {
      href: "/dashboard/projects",
      label: "My Projects",
      iconName: "FolderKanban",
    },
    {
      href: "/dashboard/donations",
      label: "Donations",
      iconName: "DollarSign",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      iconName: "Settings",
    },
  ];

  const adminLinks: NavLink[] = [
    {
      href: "/admin",
      label: "Dashboard",
      iconName: "LayoutDashboard",
    },
    {
      href: "/admin/users",
      label: "Users",
      iconName: "Users",
    },
    {
      href: "/admin/projects",
      label: "Projects",
      iconName: "FolderKanban",
    },
    {
      href: "/admin/categories",
      label: "Categories",
      iconName: "Tags",
    },
    {
      href: "/admin/transactions",
      label: "Transactions",
      iconName: "DollarSign",
    },
    {
      href: "/admin/reports",
      label: "Reports",
      iconName: "BarChart3",
    },
  ];

  const moderatorLinks: NavLink[] = [
    {
      href: "/moderator",
      label: "Dashboard",
      iconName: "LayoutDashboard",
    },
    {
      href: "/moderator/queue",
      label: "Review Queue",
      iconName: "Flag",
    },
    {
      href: "/moderator/projects",
      label: "Projects",
      iconName: "FolderKanban",
    },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "moderator"
      ? moderatorLinks
      : userLinks;

  const LogoIcon = LucideIcons.Sparkles;
  const LogOutIcon = LucideIcons.LogOut;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 p-4">
      {/* Logo Card - Floating */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link href="/">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <LogoIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Campus Hub
                </h1>
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                  {role} Panel
                </p>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Navigation - Floating Card */}
      <nav className="flex-1 overflow-y-auto mb-4">
        <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1">
            {links.map((link, index) => {
              const isActive = pathname === link.href;
              const Icon = LucideIcons[link.iconName as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
              
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    )}
                  >
                    {/* Active indicator line */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                      isActive 
                        ? "bg-white/20" 
                        : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                    )}>
                      <Icon className={cn(
                        "w-4 h-4 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : ""
                      )} />
                    </div>
                    <span className="flex-1">{link.label}</span>
                    
                    {/* Hover arrow */}
                    <LucideIcons.ChevronRight className={cn(
                      "w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0",
                      isActive && "opacity-100 translate-x-0"
                    )} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Info Card - Floating */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800"
      >
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>
        
        <Link href="/">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-colors group">
            <LogOutIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
