export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  university?: string;
  major?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  images?: string[]; // Array of image URLs for carousel
  techStack: string[];
  // External Links
  links: {
    github: string; // URL to repo
    demo: string;   // URL to live site
  };
  // Social Stats
  stats: {
    views: number;
    likes: number; // Render with Optimistic UI
    commentCount: number;
  };
  // Monetization
  donationEnabled: boolean;
  // Project Type
  type: "free" | "paid";
  price?: number; // Harga dalam Rupiah (opsional, hanya jika type = "paid")
  author: UserProfile;
}

export interface Comment {
  id: string;
  user: UserProfile;
  content: string;
  createdAt: Date;
}

export interface TransactionResult {
  success: boolean;
  token?: string;
  error?: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  category: string;
  readingTime: number; // in minutes
  publishedAt: Date;
  author: UserProfile;
}
