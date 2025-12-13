"use client";

import { useState, useEffect } from "react";
import { usersService } from "@/lib/services/users";
import { UserApiResponse } from "@/types/api";
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
import { Shield, Ban, CheckCircle, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { BlockUserModal } from "@/components/admin/block-user-modal";
import { EditRoleModal } from "@/components/admin/edit-role-modal";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/format";

type UserRole = "admin" | "moderator" | "user";

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  moderator: "Moderator",
  user: "Pengguna",
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserApiResponse | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await usersService.getUsers({ perPage: 100 });
      setUsers(data.items);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat pengguna");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.university || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlockUser = async (userId: string, reason: string) => {
    try {
      await usersService.blockUser(userId, reason);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: "blocked" } : user
        )
      );
      toast.success("Pengguna berhasil diblokir");
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Gagal memblokir pengguna");
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await usersService.unblockUser(userId);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: "active" } : user
        )
      );
      toast.success("Pengguna telah dibuka blokirnya");
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Gagal membuka blokir pengguna");
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      await usersService.updateUser(userId, { role: newRole } as any);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
      );
      toast.success("Role pengguna berhasil diubah");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Gagal mengubah role pengguna");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await usersService.deleteUser(selectedUser.id);
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
      toast.success(`Pengguna ${selectedUser.name} telah dihapus`);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Gagal menghapus pengguna");
    }
  };

  const openBlockModal = (user: UserApiResponse) => {
    setSelectedUser(user);
    setIsBlockModalOpen(true);
  };

  const openEditRoleModal = (user: UserApiResponse) => {
    setSelectedUser(user);
    setIsEditRoleModalOpen(true);
  };

  const openDeleteModal = (user: UserApiResponse) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      moderator: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      user: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    };
    return colors[role] || colors.user;
  };

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
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Manajemen Pengguna
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Kelola semua pengguna platform
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Cari berdasarkan nama, email, atau universitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Pengguna</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {users.length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Aktif</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.status === "active").length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Diblokir</p>
          <p className="text-2xl font-bold text-red-600">
            {users.filter((u) => u.status === "blocked").length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Universitas</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bergabung</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-50">
                        {user.name}
                      </div>
                      <div className="text-sm text-zinc-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadge(user.role)}>
                    {user.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                    {roleLabels[user.role as UserRole] || user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {user.university || "-"}
                    <div className="text-xs text-zinc-500">{user.major || ""}</div>
                  </div>
                </TableCell>
                <TableCell>Lv. {user.level || 1}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }
                  >
                    {user.status === "active" ? "Aktif" : "Diblokir"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditRoleModal(user)}
                      className="hover:text-blue-600"
                      title="Edit Role"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {user.status === "active" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openBlockModal(user)}
                        className="hover:text-red-600"
                        title="Blokir Pengguna"
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUnblockUser(user.id)}
                        className="hover:text-green-600"
                        title="Buka Blokir"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDeleteModal(user)}
                      className="hover:text-red-600"
                      title="Hapus Pengguna"
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          Tidak ada pengguna yang ditemukan sesuai pencarian Anda.
        </div>
      )}

      {/* Modals */}
      {selectedUser && (
        <>
          <BlockUserModal
            isOpen={isBlockModalOpen}
            onClose={() => setIsBlockModalOpen(false)}
            userId={selectedUser.id}
            userName={selectedUser.name}
            onBlock={handleBlockUser}
          />
          <EditRoleModal
            isOpen={isEditRoleModalOpen}
            onClose={() => setIsEditRoleModalOpen(false)}
            userId={selectedUser.id}
            userName={selectedUser.name}
            currentRole={selectedUser.role as UserRole}
            onUpdate={handleUpdateRole}
          />
          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteUser}
            title="Hapus Pengguna"
            itemName={selectedUser.name}
          />
        </>
      )}
    </div>
  );
}
