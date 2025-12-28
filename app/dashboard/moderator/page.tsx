"use client";

import { RoleGuard } from "@/components/auth/role-guard";

export default function ModeratorPage() {
  return (
    <RoleGuard allowedRoles={["moderator"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Dashboard Moderator
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Kelola konten dan moderasi platform
          </p>
        </div>
        
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
           <p className="text-zinc-600 dark:text-zinc-400">
             Selamat datang di panel moderator. Fitur moderasi akan segera hadir.
           </p>
        </div>
      </div>
    </RoleGuard>
  );
}
