import { notFound } from "next/navigation";
import Image from "next/image";
import { mockProjects, mockComments } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommentSection } from "@/components/comment-section";
import { ImageCarousel } from "@/components/image-carousel";
import { Github, Globe, Eye, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const comments = mockComments[id] || [];

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Proyek
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div>
              <h1 className="text-4xl font-bold text-zinc-50 mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-zinc-400 mb-6">
                {project.description}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-800">
                  <Image
                    src={project.author.avatarUrl}
                    alt={project.author.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <div className="font-semibold text-zinc-50">
                    {project.author.name}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {project.author.university} • {project.author.major}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{project.stats.views} dilihat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  <span>{project.stats.likes} suka</span>
                </div>
              </div>
            </div>

            {/* Project Images Carousel */}
            <ImageCarousel
              images={project.images || [project.thumbnailUrl]}
              alt={project.title}
            />

            {/* Tech Stack */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-50 mb-3">
                Teknologi yang Digunakan
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-sm px-4 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Comments */}
            <CommentSection projectId={project.id} initialComments={comments} />
          </div>

          {/* Sticky Action Box - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* External Links Card */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold text-zinc-50 mb-4">
                    Tautan Proyek
                  </h3>
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" variant="default">
                      <Globe className="w-4 h-4 mr-2" />
                      Lihat Demo
                    </Button>
                  </a>
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800" size="lg" variant="outline">
                      <Github className="w-4 h-4 mr-2" />
                      Lihat Kode Sumber
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
