import { mockArticles } from "@/lib/mock-data";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowLeft, Clock, Calendar, Share2, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { id } = await params;
  const article = mockArticles.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(article.publishedAt);

  // Get related articles (same category, excluding current)
  const relatedArticles = mockArticles
    .filter((a) => a.id !== id && a.category === article.category)
    .slice(0, 2);

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

      {/* Hero Section with Image */}
      <section className="relative">
        {/* Background Image */}
        <div className="relative h-[300px] md:h-[400px] w-full">
          <Image
            src={article.thumbnailUrl}
            alt={article.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-3xl">
              {/* Back Button */}
              <Link href="/articles">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-300 hover:text-white hover:bg-zinc-800/50 mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Artikel
                </Button>
              </Link>

              {/* Category */}
              <Badge className="bg-blue-600/90 hover:bg-blue-600 text-white border-0 mb-4">
                {article.category}
              </Badge>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-50 mb-4">
                {article.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-zinc-400">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8 border border-zinc-700">
                    <AvatarImage
                      src={article.author.avatarUrl}
                      alt={article.author.name}
                    />
                    <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">
                      {article.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{article.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{article.readingTime} menit baca</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-zinc-950 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="border-zinc-800 bg-zinc-900/50 p-8 md:p-10">
                <article className="prose prose-invert prose-lg max-w-none">
                  <div
                    className="text-zinc-300"
                    dangerouslySetInnerHTML={{
                      __html: article.content
                        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8 first:mt-0 text-zinc-100">$1</h1>')
                        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-8 text-zinc-100">$1</h2>')
                        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 mt-6 text-zinc-100">$1</h3>')
                        .replace(/^\- (.*$)/gim, '<li class="ml-4 text-zinc-300">$1</li>')
                        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-zinc-300">$1</li>')
                        .replace(/\n\n/g, '</p><p class="mb-4 text-zinc-300">')
                        .replace(/^(?!<[hlu])/gm, '<p class="mb-4 text-zinc-300">')
                    }}
                  />
                </article>

                {/* Share */}
                <div className="mt-12 pt-8 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Bagikan artikel ini</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Bagikan
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Card */}
              <Card className="border-zinc-800 bg-zinc-900/50 p-6 mb-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">
                  Tentang Penulis
                </h3>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-16 h-16 border-2 border-zinc-700 mb-3">
                    <AvatarImage
                      src={article.author.avatarUrl}
                      alt={article.author.name}
                    />
                    <AvatarFallback className="bg-zinc-800 text-zinc-400">
                      {article.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-semibold text-zinc-100">{article.author.name}</h4>
                  {article.author.university && (
                    <p className="text-sm text-zinc-400 mt-1">
                      {article.author.university}
                    </p>
                  )}
                  {article.author.major && (
                    <p className="text-sm text-zinc-500">{article.author.major}</p>
                  )}
                </div>
              </Card>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <Card className="border-zinc-800 bg-zinc-900/50 p-6">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    Artikel Terkait
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        href={`/articles/${related.id}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={related.thumbnailUrl}
                              alt={related.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-zinc-200 group-hover:text-blue-400 transition-colors line-clamp-2">
                              {related.title}
                            </h4>
                            <p className="text-xs text-zinc-500 mt-1">
                              {related.readingTime} menit
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
