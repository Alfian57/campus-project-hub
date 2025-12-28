"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { UserApiResponse } from "@/types/api";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserApiResponse["role"][];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login"); // Should be handled by layout, but safe double check
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      // Redirect based on actual role
      switch (user.role) {
        case "admin":
          router.replace("/dashboard/admin");
          break;
        case "moderator":
          router.replace("/dashboard/moderator");
          break;
        default:
          router.replace("/dashboard");
          break;
      }
    }
  }, [user, isLoading, allowedRoles, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
}
