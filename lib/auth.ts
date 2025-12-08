import { UserRole, User } from "@/types/dashboard";

// Mock current user - in production, this would come from session/JWT
let mockCurrentUser: User | null = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "admin", // Change to "user" or "moderator" to test different roles
  status: "active",
  university: "Universitas Indonesia",
  major: "Computer Science",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  joinedAt: new Date("2024-01-15"),
  projectCount: 3,
  totalLikes: 45,
  totalDonations: 250000,
};

/**
 * Get the currently logged-in user
 * In production, this would validate session/JWT token
 */
export function getCurrentUser(): User | null {
  return mockCurrentUser;
}

/**
 * Set mock user for testing (development only)
 */
export function setMockUser(user: User | null) {
  mockCurrentUser = user;
}

/**
 * Check if current user has a specific role
 */
export function hasRole(role: UserRole): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Admin has access to everything
  if (user.role === "admin") return true;
  
  return user.role === role;
}

/**
 * Check if current user has any of the specified roles
 */
export function hasAnyRole(roles: UserRole[]): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Admin has access to everything
  if (user.role === "admin") return true;
  
  return roles.includes(user.role);
}

/**
 * Require authentication for a page
 * Returns user if authenticated, null otherwise
 */
export function requireAuth(): User | null {
  const user = getCurrentUser();
  if (!user) {
    // In production, redirect to login
    return null;
  }
  return user;
}

/**
 * Require specific role for a page
 * Returns user if authorized, null otherwise
 */
export function requireRole(role: UserRole): User | null {
  const user = requireAuth();
  if (!user) return null;
  
  if (!hasRole(role)) {
    // In production, redirect to unauthorized page
    return null;
  }
  
  return user;
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "admin";
}

/**
 * Check if user is moderator or admin
 */
export function canModerate(): boolean {
  const user = getCurrentUser();
  return user?.role === "admin" || user?.role === "moderator";
}

/**
 * Log out current user
 */
export function logout() {
  mockCurrentUser = null;
  // In production, clear session/JWT and redirect to login
}
