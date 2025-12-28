import { ProjectCard } from "@/components/project-card";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ArticlesSection } from "@/components/landing/articles-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProjectApiResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function getProjects(): Promise<ProjectApiResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects?perPage=6`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      console.error("Failed to fetch projects:", response.status);
      return [];
    }
    
    const data = await response.json();
    return data.success ? data.data?.items || [] : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();
  
  // Calculate stats
  const totalProjects = projects.length > 0 ? `${projects.length}+` : "100+";
  const totalLikes = projects.reduce((sum, p) => sum + (p.stats?.likes || 0), 0);
  
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Sticky Header */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950/30">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-bold text-zinc-50 mb-6 leading-tight">
              Tempat Kreativitas Mahasiswa{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Bersinar
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Showcase proyek inovatifmu, dapatkan feedback berkualitas, dan raih dukungan finansial dari komunitas
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-blue-500/25">
                  Mulai Sekarang
                </Button>
              </Link>
              <a href="#projects">
                <Button size="lg" variant="outline" className="font-semibold px-8 py-6 text-lg border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                  Jelajahi Proyek
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-6 rounded-2xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 shadow-lg shadow-blue-500/5">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">
                  {totalProjects}
                </div>
                <div className="text-sm text-zinc-400">
                  Proyek
                </div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 shadow-lg shadow-blue-500/5">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">
                  {totalLikes || 500}+
                </div>
                <div className="text-sm text-zinc-400">
                  Total Suka
                </div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 shadow-lg shadow-blue-500/5">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">
                  10+
                </div>
                <div className="text-sm text-zinc-400">
                  Universitas
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* How It Works Section */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* Projects Showcase */}
      <section id="projects" className="py-24 bg-zinc-950 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
              Proyek Unggulan
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Jelajahi karya-karya terbaik dari mahasiswa berbakat di seluruh Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={{
                    id: project.id,
                    title: project.title,
                    description: project.description || "",
                    thumbnailUrl: project.thumbnailUrl || "",
                    images: project.images,
                    techStack: project.techStack || [],
                    links: project.links,
                    stats: project.stats,
                    type: project.type,
                    price: project.price,
                    author: {
                      id: project.author.id,
                      name: project.author.name,
                      avatarUrl: project.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.author.name}`,
                      university: project.author.university || undefined,
                      major: project.author.major || undefined,
                    },
                  }} 
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-zinc-400 text-lg">Belum ada proyek yang tersedia</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/projects">
              <Button size="lg" variant="outline" className="font-semibold border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer">
                Lihat Semua Proyek
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <div id="articles">
        <ArticlesSection />
      </div>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
