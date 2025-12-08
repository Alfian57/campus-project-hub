"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Globe, Heart, MessageCircle } from "lucide-react";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleLike } from "@/actions/social";
import { toast } from "sonner";
import { DonationModal } from "./donation-modal";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [likes, setLikes] = useState(project.stats.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    const newLikes = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikes);
    setIsLiked(!isLiked);

    // Server update
    startTransition(async () => {
      const result = await toggleLike(project.id, newLikes);
      if (result.success) {
        setLikes(result.likes);
      } else {
        // Revert on error
        setLikes(likes);
        setIsLiked(isLiked);
        toast.error("Failed to update like");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/project/${project.id}`}>
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {/* Thumbnail */}
          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            {/* Quick Donate Button - Slides up on hover */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 100, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 p-4"
              onClick={(e) => e.preventDefault()}
            >
              {project.donationEnabled && (
                <DonationModal projectId={project.id} projectTitle={project.title}>
                  <Button
                    className="w-full bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow-lg"
                    size="lg"
                  >
                    ☕ Quick Donate
                  </Button>
                </DonationModal>
              )}
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title & Description */}
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-1">
              {project.title}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.slice(0, 4).map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="text-xs rounded-full px-3 py-1"
                >
                  {tech}
                </Badge>
              ))}
              {project.techStack.length > 4 && (
                <Badge
                  variant="secondary"
                  className="text-xs rounded-full px-3 py-1"
                >
                  +{project.techStack.length - 4}
                </Badge>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
              {/* Left - External Links */}
              <div className="flex items-center gap-3">
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                  title="View Code"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                  title="View Live Demo"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>

              {/* Right - Social Stats */}
              <div className="flex items-center gap-4">
                {/* Like Button */}
                <motion.button
                  onClick={handleLike}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1.5 group/like"
                >
                  <motion.div
                    animate={{
                      scale: isLiked ? [1, 1.3, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isLiked
                          ? "fill-red-500 text-red-500"
                          : "text-zinc-600 dark:text-zinc-400 group-hover/like:text-red-500"
                      }`}
                    />
                  </motion.div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {likes}
                  </span>
                </motion.button>

                {/* Comments */}
                <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {project.stats.commentCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
