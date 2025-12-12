import { mockProjects } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function MyProjectsPage() {
  // Mock: Get first 3 projects as user's projects
  const userProjects = mockProjects.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Proyek Saya
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Kelola semua proyek Anda
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Unggah Proyek Baru
          </Button>
        </Link>
      </div>

      {/* Projects Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proyek</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Suka</TableHead>
              <TableHead>Komentar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-50">
                        {project.title}
                      </div>
                      <div className="text-sm text-zinc-500">
                        {project.description.slice(0, 50)}...
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {project.techStack[0]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    ❤️ {project.stats.likes}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    💬 {project.stats.commentCount}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    Terpublikasi
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/project/${project.id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {userProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500 mb-4">
            Anda belum membuat proyek apapun
          </p>
          <Link href="/dashboard/projects/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Buat Proyek Pertama Anda
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
