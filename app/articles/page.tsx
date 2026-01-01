import { ArticlesClientPage } from "@/components/articles-client-page";
import { ArticleApiResponse } from "@/types/api";
import { Metadata } from "next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const metadata: Metadata = {
  title: "Artikel & Wawasan",
  description:
    "Baca artikel terbaru tentang teknologi, pengembangan karir, dan tips sukses untuk mahasiswa dari komunitas Campus Project Hub.",
  openGraph: {
    title: "Artikel & Wawasan - Campus Project Hub",
    description:
      "Baca artikel terbaru tentang teknologi, pengembangan karir, dan tips sukses untuk mahasiswa.",
  },
};

async function getArticles(): Promise<ArticleApiResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/articles?perPage=20&status=published`, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.success ? data.data?.items || [] : [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function ArticlesPage() {
  const apiArticles = await getArticles();
  
  // Convert and get unique categories
  const articles = apiArticles.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    thumbnailUrl: a.thumbnailUrl || "",
    category: a.category || "Umum",
    readingTime: a.readingTime || 5,
    publishedAt: new Date(a.createdAt),
    author: {
      id: a.author.id,
      name: a.author.name,
      avatarUrl: a.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.author.name}`,
      university: a.author.university || undefined,
      major: a.author.major || undefined,
    },
  }));
  
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return <ArticlesClientPage articles={articles} categories={categories} />;
}
