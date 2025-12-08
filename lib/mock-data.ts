import { Project, Comment } from "@/types";

// Mock user profiles
const users = [
  {
    id: "1",
    name: "Budi Santoso",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    university: "Universitas Indonesia",
    major: "Computer Science"
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    university: "Institut Teknologi Bandung",
    major: "Software Engineering"
  },
  {
    id: "3",
    name: "Ahmad Rizki",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    university: "Universitas Gadjah Mada",
    major: "Information Systems"
  }
];

// Mock project data
export const mockProjects: Project[] = [
  {
    id: "1",
    title: "EcoTrack - Waste Management App",
    description: "A Progressive Web App for tracking and managing waste collection in urban areas. Features real-time tracking, AI-powered waste classification, and community leaderboards.",
    thumbnailUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=600&fit=crop",
    techStack: ["Next.js", "TypeScript", "Supabase", "TailwindCSS", "PostGIS"],
    links: {
      github: "https://github.com/example/ecotrack",
      demo: "https://ecotrack-demo.vercel.app"
    },
    stats: {
      views: 1240,
      likes: 89,
      commentCount: 12
    },
    donationEnabled: true,
    author: users[0]
  },
  {
    id: "2",
    title: "StudyBuddy - Collaborative Learning Platform",
    description: "Real-time collaborative study platform with video chat, shared whiteboards, and AI study assistant. Perfect for remote learning and group projects.",
    thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    techStack: ["React", "WebRTC", "Socket.io", "Node.js", "MongoDB"],
    links: {
      github: "https://github.com/example/studybuddy",
      demo: "https://studybuddy-demo.netlify.app"
    },
    stats: {
      views: 890,
      likes: 67,
      commentCount: 8
    },
    donationEnabled: true,
    author: users[1]
  },
  {
    id: "3",
    title: "SmartKampus - Campus Navigation",
    description: "Indoor navigation system for university campuses using AR and real-time location services. Helps students find classrooms, facilities, and events.",
    thumbnailUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
    techStack: ["React Native", "AR.js", "Firebase", "Google Maps API"],
    links: {
      github: "https://github.com/example/smartkampus",
      demo: "https://smartkampus.expo.dev"
    },
    stats: {
      views: 2100,
      likes: 156,
      commentCount: 24
    },
    donationEnabled: true,
    author: users[2]
  },
  {
    id: "4",
    title: "FoodShare - Campus Food Sharing",
    description: "Connect students to share surplus food and reduce waste. Features real-time listings, chat system, and reputation scoring.",
    thumbnailUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    techStack: ["Vue.js", "Express", "PostgreSQL", "Redis"],
    links: {
      github: "https://github.com/example/foodshare",
      demo: "https://foodshare-campus.vercel.app"
    },
    stats: {
      views: 1560,
      likes: 112,
      commentCount: 18
    },
    donationEnabled: true,
    author: users[0]
  },
  {
    id: "5",
    title: "CodeReview.AI - Automated Code Analysis",
    description: "AI-powered code review assistant that provides instant feedback on code quality, security vulnerabilities, and best practices.",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
    techStack: ["Python", "FastAPI", "OpenAI", "Docker", "GitHub Actions"],
    links: {
      github: "https://github.com/example/codereview-ai",
      demo: "https://codereview-ai.herokuapp.com"
    },
    stats: {
      views: 3200,
      likes: 245,
      commentCount: 35
    },
    donationEnabled: true,
    author: users[1]
  },
  {
    id: "6",
    title: "EventHub - Campus Event Manager",
    description: "Streamline campus event organization with ticket management, QR code check-ins, and analytics dashboard for student organizations.",
    thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    techStack: ["Next.js", "Prisma", "tRPC", "Stripe", "QR Code"],
    links: {
      github: "https://github.com/example/eventhub",
      demo: "https://eventhub-campus.vercel.app"
    },
    stats: {
      views: 980,
      likes: 73,
      commentCount: 9
    },
    donationEnabled: true,
    author: users[2]
  }
];

// Mock comments
export const mockComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "c1",
      user: users[1],
      content: "This is amazing! The waste classification feature is really impressive. How accurate is the AI model?",
      createdAt: new Date("2025-12-07T10:30:00")
    },
    {
      id: "c2",
      user: users[2],
      content: "Love the UI design! Very clean and intuitive. Would love to see this implemented in my city.",
      createdAt: new Date("2025-12-07T14:15:00")
    }
  ],
  "2": [
    {
      id: "c3",
      user: users[0],
      content: "Great work on the WebRTC implementation! Did you face any challenges with NAT traversal?",
      createdAt: new Date("2025-12-06T09:20:00")
    }
  ],
  "3": [
    {
      id: "c4",
      user: users[0],
      content: "The AR navigation is super cool! How did you handle indoor positioning accuracy?",
      createdAt: new Date("2025-12-05T16:45:00")
    },
    {
      id: "c5",
      user: users[1],
      content: "This would be so useful for new students! Is it available for download yet?",
      createdAt: new Date("2025-12-06T11:30:00")
    }
  ]
};
