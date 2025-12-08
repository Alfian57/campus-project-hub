"use client";

import { useState } from "react";
import { mockCategories } from "@/lib/mock-dashboard-data";
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
import { Edit, Trash2, Plus } from "lucide-react";
import { Category } from "@/types/dashboard";
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

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "blue",
  });

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const newCategory: Category = {
      id: String(categories.length + 1),
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      color: formData.color,
      projectCount: 0,
      createdAt: new Date(),
    };

    setCategories((prev) => [...prev, newCategory]);
    toast.success(`Category "${formData.name}" created`);
    setFormData({ name: "", description: "", color: "blue" });
    setIsCreateModalOpen(false);
  };

  const handleUpdate = () => {
    if (!editingCategory || !formData.name.trim()) return;

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === editingCategory.id
          ? {
              ...cat,
              name: formData.name,
              description: formData.description,
              color: formData.color,
              slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
            }
          : cat
      )
    );

    toast.success(`Category "${formData.name}" updated`);
    setEditingCategory(null);
    setFormData({ name: "", description: "", color: "blue" });
  };

  const handleDelete = (categoryId: string, categoryName: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${categoryName}"? This will unassign projects from this category.`
      )
    ) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      toast.success(`Category "${categoryName}" deleted`);
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
    });
  };

  const colorOptions = [
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "red", label: "Red", class: "bg-red-500" },
    { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
    { value: "purple", label: "Purple", class: "bg-purple-500" },
    { value: "pink", label: "Pink", class: "bg-pink-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Category Management
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Manage project categories
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Total Categories
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {categories.length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Total Projects
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {categories.reduce((sum, cat) => sum + cat.projectCount, 0)}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Avg Projects/Category
          </p>
          <p className="text-2xl font-bold text-purple-600">
            {(
              categories.reduce((sum, cat) => sum + cat.projectCount, 0) /
              categories.length
            ).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Color</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div
                    className={`w-8 h-8 rounded-full bg-${category.color}-500`}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium text-zinc-900 dark:text-zinc-50">
                    {category.name}
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-sm text-zinc-600 dark:text-zinc-400">
                    {category.slug}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                    {category.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{category.projectCount}</Badge>
                </TableCell>
                <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                  {category.createdAt.toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(category)}
                      className="hover:text-blue-600"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(category.id, category.name)}
                      className="hover:text-red-600"
                      title="Delete Category"
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
              {editingCategory ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update category information"
                : "Add a new project category"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Web Development"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief description of this category"
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
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
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={editingCategory ? handleUpdate : handleCreate}
            >
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
