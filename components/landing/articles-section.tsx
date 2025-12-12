"use client";

import { motion } from "framer-motion";
import { mockArticles } from "@/lib/mock-data";
import { ArticleCard } from "@/components/article-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ArticlesSection() {
  // Show only the 3 most recent articles
  const featuredArticles = mockArticles.slice(0, 3);

  return (
    <section id="articles" className="py-24 bg-zinc-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            Artikel Terbaru
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Tips, panduan, dan insight untuk membantu perjalanan pengembangan kariermu
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/articles">
            <Button
              size="lg"
              variant="outline"
              className="font-semibold border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white group"
            >
              Lihat Semua Artikel
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
