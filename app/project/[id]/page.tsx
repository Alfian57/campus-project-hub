import { notFound } from "next/navigation";
import Image from "next/image";
import { mockProjects, mockComments } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DonationModal } from "@/components/donation-modal";
import { CommentSection } from "@/components/comment-section";
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
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
                {project.description}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                  <Image
                    src={project.author.avatarUrl}
                    alt={project.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {project.author.name}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {project.author.university} • {project.author.major}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{project.stats.views} views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  <span>{project.stats.likes} likes</span>
                </div>
              </div>
            </div>

            {/* Project Image */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-sm px-4 py-2">
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
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                    Project Links
                  </h3>
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full" size="lg" variant="default">
                      <Globe className="w-4 h-4 mr-2" />
                      View Live Demo
                    </Button>
                  </a>
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full" size="lg" variant="outline">
                      <Github className="w-4 h-4 mr-2" />
                      View Source Code
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Donation Card */}
              {project.donationEnabled && (
                <Card className="border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                      Support This Student
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      Show your appreciation with a donation. Every contribution
                      helps fuel more innovation!
                    </p>
                    <DonationModal
                      projectId={project.id}
                      projectTitle={project.title}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
