"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthContext";

interface LandingHeaderProps {
  showArticlesActive?: boolean;
}

export function LandingHeader({ showArticlesActive = false }: LandingHeaderProps) {
  const { isAuthenticated, isLoading } = useAuth();

  return (
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
              className={`text-sm font-medium transition-colors ${
                showArticlesActive ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              Artikel
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-24 h-10 bg-zinc-800 animate-pulse rounded-lg" />
            ) : isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
