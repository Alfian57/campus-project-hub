export type UserRole = "user" | "admin" | "moderator";

export type UserStatus = "active" | "blocked";

export type ProjectStatus = "published" | "blocked" | "draft";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  university: string;
  major: string;
  avatarUrl: string;
  joinedAt: Date;
  projectCount: number;
  totalLikes: number;
  totalDonations: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  projectCount: number;
  createdAt: Date;
}

export interface BlockRecord {
  id: string;
  targetType: "user" | "project";
  targetId: string;
  targetName: string;
  reason: string;
  blockedBy: string;
  blockedByName: string;
  blockedAt: Date;
}

export interface Transaction {
  id: string;
  projectId: string;
  projectTitle: string;
  donorName: string;
  amount: number;
  status: "success" | "pending" | "failed";
  createdAt: Date;
}

export interface DashboardStats {
  totalProjects: number;
  totalLikes: number;
  totalDonations: number;
  totalRevenue: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalProjects: number;
  activeProjects: number;
  blockedProjects: number;
  totalCategories: number;
  totalRevenue: number;
  revenueThisMonth: number;
}

export interface Report {
  id: string;
  reporterName: string;
  targetType: "project" | "comment" | "user";
  targetId: string;
  targetName: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}
