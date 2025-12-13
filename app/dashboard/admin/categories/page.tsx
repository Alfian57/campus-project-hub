"use client";

import { useState, useEffect } from "react";
import { categoriesService } from "@/lib/services/categories";
import { CategoryApiResponse } from "@/types/api";
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
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";
import { formatDate } from "@/lib/utils/format";

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<CategoryApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryApiResponse | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryApiResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "blue",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoriesService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Gagal memuat kategori");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }

    try {
      const newCategory = await categoriesService.createCategory({
        name: formData.name,
        description: formData.description,
        color: formData.color,
      });
      setCategories((prev) => [...prev, newCategory]);
      toast.success(`Kategori "${formData.name}" berhasil dibuat`);
      setFormData({ name: "", description: "", color: "blue" });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Gagal membuat kategori");
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !formData.name.trim()) return;

    try {
      const updated = await categoriesService.updateCategory(editingCategory.id, {
        name: formData.name,
        description: formData.description,
        color: formData.color,
      });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editingCategory.id ? updated : cat))
      );
      toast.success(`Kategori "${formData.name}" berhasil diperbarui`);
      setEditingCategory(null);
      setFormData({ name: "", description: "", color: "blue" });
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Gagal memperbarui kategori");
    }
  };

  const openDeleteModal = (category: CategoryApiResponse) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await categoriesService.deleteCategory(categoryToDelete.id);
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id));
      toast.success(`Kategori "${categoryToDelete.name}" berhasil dihapus`);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Gagal menghapus kategori");
    }
  };

  const openEditModal = (category: CategoryApiResponse) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color || "blue",
    });
  };

  const colorOptions = [
    { value: "blue", label: "Biru", class: "bg-blue-500" },
    { value: "green", label: "Hijau", class: "bg-green-500" },
    { value: "red", label: "Merah", class: "bg-red-500" },
    { value: "yellow", label: "Kuning", class: "bg-yellow-500" },
    { value: "purple", label: "Ungu", class: "bg-purple-500" },
    { value: "pink", label: "Pink", class: "bg-pink-500" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Manajemen Kategori
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Kelola kategori proyek
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Kategori
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Kategori</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {categories.length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Proyek</p>
          <p className="text-2xl font-bold text-blue-600">
            {categories.reduce((sum, cat) => sum + (cat.projectCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Warna</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Proyek</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className={`w-8 h-8 rounded-full bg-${category.color || "blue"}-500`} />
                </TableCell>
                <TableCell>
                  <div className="font-medium text-zinc-900 dark:text-zinc-50">
                    {category.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                    {category.description || "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{category.projectCount || 0}</Badge>
                </TableCell>
                <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                  {formatDate(category.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(category)}
                      className="hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDeleteModal(category)}
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

      {/* Create/Edit Modal */}
      <Dialog
        open={isCreateModalOpen || !!editingCategory}
        onOpenChange={() => {
          setIsCreateModalOpen(false);
          setEditingCategory(null);
          setFormData({ name: "", description: "", color: "blue" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Kategori" : "Buat Kategori"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Perbarui informasi kategori"
                : "Tambahkan kategori proyek baru"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Contoh: Pengembangan Web"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Deskripsi singkat kategori ini"
              />
            </div>

            <div className="space-y-2">
              <Label>Warna</Label>
              <div className="grid grid-cols-6 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, color: color.value }))
                    }
                    className={`w-10 h-10 rounded-full ${color.class} ${
                      formData.color === color.value
                        ? "ring-4 ring-blue-500 ring-offset-2"
                        : ""
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingCategory(null);
                setFormData({ name: "", description: "", color: "blue" });
              }}
            >
              Batal
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={editingCategory ? handleUpdate : handleCreate}
            >
              {editingCategory ? "Perbarui" : "Buat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Hapus Kategori"
          itemName={categoryToDelete.name}
          description="Ini akan menghapus kategori dari semua proyek terkait."
        />
      )}
    </div>
  );
}
