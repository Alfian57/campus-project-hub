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
import { Edit, Trash2, Plus, Loader2, ArrowUpDown, Search } from "lucide-react";
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryApiResponse | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryApiResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Pagination & Sort state
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "blue",
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchCategories();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, [pagination.page, pagination.perPage, sortConfig]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoriesService.getCategories({
        page: pagination.page,
        perPage: pagination.perPage,
        search: searchQuery,
        sortBy: sortConfig?.key,
        sortDirection: sortConfig?.direction,
      });
      setCategories(data.items);
      setPagination(prev => ({
        ...prev,
        totalItems: data.meta.total_items,
        totalPages: data.meta.total_pages,
      }));
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
      await categoriesService.createCategory({
        name: formData.name,
        description: formData.description,
        color: formData.color,
      });
      toast.success(`Kategori "${formData.name}" berhasil dibuat`);
      setFormData({ name: "", description: "", color: "blue" });
      setIsCreateModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Gagal membuat kategori");
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !formData.name.trim()) return;

    try {
      await categoriesService.updateCategory(editingCategory.id, {
        name: formData.name,
        description: formData.description,
        color: formData.color,
      });
      toast.success(`Kategori "${formData.name}" berhasil diperbarui`);
      setEditingCategory(null);
      setFormData({ name: "", description: "", color: "blue" });
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Gagal memperbarui kategori");
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await categoriesService.deleteCategory(categoryToDelete.id);
      toast.success(`Kategori "${categoryToDelete.name}" berhasil dihapus`);
      setIsDeleteModalOpen(false);
      fetchCategories();
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

  const openDeleteModal = (category: CategoryApiResponse) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleSort = (key: string) => {
    if (key !== "nama" && key !== "dibuat") return;
    
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
    }
    setSortConfig({ key, direction });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
        return <ArrowUpDown className={`w-4 h-4 ml-1 inline ${sortConfig.direction === 'asc' ? 'text-blue-500' : 'text-blue-500'}`} />
    }
    if (key === "nama" || key === "dibuat") {
        return <ArrowUpDown className="w-4 h-4 ml-1 inline text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    }
    return null;
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Manajemen Kategori
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Kelola kategori proyek
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Kategori
        </Button>
      </div>

       <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full md:max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
           <Input
             placeholder="Cari kategori..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="pl-10"
           />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Warna</TableHead>
              <TableHead 
                className="cursor-pointer group select-none"
                onClick={() => handleSort("nama")}
              >
                Nama {getSortIcon("nama")}
              </TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Proyek</TableHead>
              <TableHead 
                className="cursor-pointer group select-none"
                onClick={() => handleSort("dibuat")}
              >
                Dibuat {getSortIcon("dibuat")}
              </TableHead>
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600">Baris per halaman:</span>
            <div className="relative">
                <select
                    className="h-9 w-[70px] rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none"
                    value={pagination.perPage}
                    onChange={(e) => setPagination(prev => ({ ...prev, perPage: Number(e.target.value), page: 1 }))}
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600">
                Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            <div className="flex gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page <= 1}
                    className="cursor-pointer"
                >
                    Prev
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="cursor-pointer"
                >
                    Next
                </Button>
            </div>
        </div>
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
