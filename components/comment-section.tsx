"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import { Comment } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addComment } from "@/actions/social";
import { toast } from "sonner";

interface CommentSectionProps {
  projectId: string;
  initialComments: Comment[];
}

export function CommentSection({
  projectId,
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error("Silakan masukkan komentar");
      return;
    }

    setIsSubmitting(true);

    // Optimistic update
    const tempComment: Comment = {
      id: `temp-${Date.now()}`,
      content: newComment,
      createdAt: new Date(),
      user: {
        id: "guest",
        name: "Pengguna Tamu",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
      },
    };

    setComments([tempComment, ...comments]);
    setNewComment("");

    // Server update
    try {
      const result = await addComment(projectId, newComment);
      if (result.success) {
        toast.success("Komentar ditambahkan!");
      } else {
        // Revert on error
        setComments(comments);
        setNewComment(newComment);
        toast.error("Gagal menambahkan komentar");
      }
    } catch (error) {
      setComments(comments);
      setNewComment(newComment);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes === 0 ? "Baru saja" : `${minutes} menit lalu`;
      }
      return `${hours} jam lalu`;
    }
    if (days === 1) return "Kemarin";
    if (days < 7) return `${days} hari lalu`;
    return new Date(date).toLocaleDateString("id-ID");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Diskusi ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Bagikan pemikiranmu atau ajukan pertanyaan..."
            className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-300 resize-none"
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
            </Button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
              Belum ada komentar. Jadilah yang pertama berbagi pemikiran!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    <Image
                      src={comment.user.avatarUrl}
                      alt={comment.user.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
