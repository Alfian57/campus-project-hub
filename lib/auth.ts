import { UserApiResponse } from "@/types/api";
import { getAuthToken } from "@/lib/api";

export type UserRole = "user" | "admin" | "moderator";

// Helper type for components that need user data
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "blocked";
  university: string;
  major: string;
  avatarUrl: string;
  totalExp: number;
  bio?: string;
  phone?: string;
  createdAt: Date;
  // Dashboard stats - these will be fetched separately if needed
  projectCount?: number;
  totalLikes?: number;
  totalSales?: number;
}

/**
 * Convert API user response to AuthUser format
 */
export function mapApiUserToAuthUser(apiUser: UserApiResponse): AuthUser {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    status: apiUser.status,
    university: apiUser.university || "",
    major: apiUser.major || "",
    avatarUrl: apiUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiUser.name}`,
    totalExp: apiUser.totalExp,
    bio: apiUser.bio || undefined,
    phone: apiUser.phone || undefined,
    createdAt: new Date(apiUser.createdAt),
  };
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Check if user has a specific role
 * Note: Use useAuth() hook for reactive checks
 */
export function hasRole(user: AuthUser | null, role: UserRole): boolean {
  if (!user) return false;
  
  // Admin has access to everything
  if (user.role === "admin") return true;
  
  return user.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: AuthUser | null, roles: UserRole[]): boolean {
  if (!user) return false;
  
  // Admin has access to everything
  if (user.role === "admin") return true;
  
  return roles.includes(user.role);
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin";
}

/**
 * Check if user can moderate (admin or moderator)
 */
export function canModerate(user: AuthUser | null): boolean {
  return user?.role === "admin" || user?.role === "moderator";
}
