import { Sidebar } from "@/components/dashboard/sidebar";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = requireAuth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0">
        <Sidebar role={user.role} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
