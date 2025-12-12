import { User, Category, BlockRecord, Transaction, AdminStats } from "@/types/dashboard";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@ui.ac.id",
    role: "admin",
    status: "active",
    university: "Universitas Indonesia",
    major: "Computer Science",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    joinedAt: new Date("2024-01-15"),
    projectCount: 3,
    totalLikes: 45,
    totalSales: 250000,
    totalExp: 1250,
    bio: "Passionate developer specializing in web and mobile development.",
    phone: "+62812345678",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@itb.ac.id",
    role: "user",
    status: "active",
    university: "Institut Teknologi Bandung",
    major: "Software Engineering",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    joinedAt: new Date("2024-02-20"),
    projectCount: 2,
    totalLikes: 32,
    totalSales: 175000,
    totalExp: 850,
    bio: "Software engineer focused on clean code and best practices.",
    phone: "+62887654321",
  },
  {
    id: "3",
    name: "Ahmad Rizki",
    email: "ahmad@ugm.ac.id",
    role: "moderator",
    status: "active",
    university: "Universitas Gadjah Mada",
    major: "Information Systems",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    joinedAt: new Date("2024-03-10"),
    projectCount: 4,
    totalLikes: 67,
    totalSales: 320000,
    totalExp: 2100,
    bio: "Information systems enthusiast with a passion for data analytics.",
    phone: "+62811223344",
  },
  {
    id: "4",
    name: "Siti Nurhaliza",
    email: "siti@unpad.ac.id",
    role: "user",
    status: "blocked",
    university: "Universitas Padjadjaran",
    major: "Computer Engineering",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    joinedAt: new Date("2024-01-25"),
    projectCount: 1,
    totalLikes: 12,
    totalSales: 50000,
    totalExp: 320,
    bio: "Hardware and software integration specialist.",
    phone: "+62899887766",
  },
  {
    id: "5",
    name: "Budi Santoso",
    email: "budi@its.ac.id",
    role: "user",
    status: "active",
    university: "Institut Teknologi Sepuluh Nopember",
    major: "Informatics",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    joinedAt: new Date("2024-04-05"),
    projectCount: 5,
    totalLikes: 89,
    totalSales: 450000,
    totalExp: 3500,
    bio: "Full-stack developer with expertise in React and Node.js.",
    phone: "+62822334455",
  },
];

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Web Development",
    slug: "web-development",
    description: "Full-stack and frontend web applications",
    color: "blue",
    projectCount: 12,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Mobile Apps",
    slug: "mobile-apps",
    description: "iOS and Android applications",
    color: "green",
    projectCount: 8,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "AI & ML",
    slug: "ai-ml",
    description:  "Artificial Intelligence and Machine Learning projects",
    color: "purple",
    projectCount: 6,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "IoT",
    slug: "iot",
    description: "Internet of Things and embedded systems",
    color: "yellow",
    projectCount: 4,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    name: "Game Development",
    slug: "game-development",
    description: "2D and 3D games",
    color: "red",
    projectCount: 3,
    createdAt: new Date("2024-01-01"),
  },
];

// Mock Block Records
export const mockBlockRecords: BlockRecord[] = [
  {
    id: "1",
    targetType: "user",
    targetId: "4",
    targetName: "Siti Nurhaliza",
    reason: "Spam content and inappropriate behavior",
    blockedBy: "1",
    blockedByName: "John Doe",
    blockedAt: new Date("2024-11-15"),
  },
  {
    id: "2",
    targetType: "project",
    targetId: "5",
    targetName: "Fake Project",
    reason: "Misleading information and plagiarized content",
    blockedBy: "3",
    blockedByName: "Ahmad Rizki",
    blockedAt: new Date("2024-11-20"),
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: "1",
    projectId: "1",
    projectTitle: "EcoTrack - Waste Management App",
    buyerName: "Anonymous",
    amount: 50000,
    status: "success",
    createdAt: new Date("2024-12-01"),
  },
  {
    id: "2",
    projectId: "2",
    projectTitle: "SmartClass - Attendance System",
    buyerName: "Alumni Network",
    amount: 100000,
    status: "success",
    createdAt: new Date("2024-12-02"),
  },
  {
    id: "3",
    projectId: "1",
    projectTitle: "EcoTrack - Waste Management App",
    buyerName: "Environmental Fund",
    amount: 200000,
    status: "success",
    createdAt: new Date("2024-12-03"),
  },
  {
    id: "4",
    projectId: "3",
    projectTitle: "HealthBot - Medical Chatbot",
    buyerName: "Anonymous",
    amount: 75000,
    status: "pending",
    createdAt: new Date("2024-12-05"),
  },
  {
    id: "5",
    projectId: "2",
    projectTitle: "SmartClass - Attendance System",
    buyerName: "Tech Startup",
    amount: 150000,
    status: "success",
    createdAt: new Date("2024-12-06"),
  },
];

// Mock Admin Stats
export const mockAdminStats: AdminStats = {
  totalUsers: 5,
  activeUsers: 4,
  blockedUsers: 1,
  totalProjects: 6,
  activeProjects: 5,
  blockedProjects: 1,
  totalCategories: 5,
  totalRevenue: 575000,
  revenueThisMonth: 250000,
};

// Helper functions
export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find((cat) => cat.id === id);
}

export function getTransactionsByProjectId(projectId: string): Transaction[] {
  return mockTransactions.filter((t) => t.projectId === projectId);
}

export function getBlockRecordByTargetId(
  targetId: string
): BlockRecord | undefined {
  return mockBlockRecords.find((r) => r.targetId === targetId);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
