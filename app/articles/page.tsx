import { mockArticles } from "@/lib/mock-data";
import { ArticleCard } from "@/components/article-card";
import { Footer } from "@/components/footer";
import { Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ArticlesPage() {
  // Get unique categories
  const categories = Array.from(new Set(mockArticles.map((a) => a.category)));

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Sticky Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-50">Campus Hub</h1>
              </div>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/#features"
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Fitur
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Cara Kerja
              </Link>
              <Link
                href="/projects"
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Proyek
              </Link>
              <Link
                href="/articles"
                className="text-sm font-medium text-zinc-100 transition-colors"
              >
                Artikel
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block">
                <Button
                  variant="ghost"
                  className="text-zinc-300 hover:text-white hover:bg-zinc-800"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Daftar Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

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
              className="px-4 py-2 text-sm cursor-pointer bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30"
            >
              Semua
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="px-4 py-2 text-sm cursor-pointer border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
