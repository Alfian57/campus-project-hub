"use client";

import { useState, useMemo } from "react";
import { ArticleCard } from "@/components/article-card";
import { LandingHeader } from "@/components/landing/landing-header";
import { Footer } from "@/components/footer";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  category: string;
  readingTime: number;
  publishedAt: Date;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
    university?: string;
    major?: string;
  };
}

interface ArticlesClientPageProps {
  articles: Article[];
  categories: string[];
}

export function ArticlesClientPage({ articles, categories }: ArticlesClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Filter by search query
      const matchesSearch = searchQuery.trim() === "" || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by category
      const matchesCategory = selectedCategory === null || 
        article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Sticky Header */}
      <LandingHeader showArticlesActive />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/30">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-600/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
              Artikel & Panduan
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-8">
              Tips, tutorial, dan insight untuk membantu perjalanan pengembangan
              kariermu sebagai developer
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 bg-zinc-900/80 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-zinc-950 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <Badge
              variant="outline"
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 text-sm cursor-pointer transition-all ${
                selectedCategory === null
                  ? "bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30"
                  : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              Semua
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm cursor-pointer transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30"
                    : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-lg">
                {searchQuery || selectedCategory 
                  ? "Tidak ada artikel yang sesuai dengan filter"
                  : "Belum ada artikel tersedia"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
