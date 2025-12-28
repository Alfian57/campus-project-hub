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
import { CreateUserModal } from "@/components/admin/create-user-modal";
import { BlockUserModal } from "@/components/admin/block-user-modal";
import { EditUserModal } from "@/components/admin/edit-user-modal";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/format";
import { useAuth } from "@/components/providers/AuthContext";
import { Shield, Ban, CheckCircle, Edit, Trash2, Search, Loader2, Plus, ArrowUpDown, Filter } from "lucide-react";

type UserRole = "admin" | "moderator" | "user";

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  moderator: "Moderator",
  user: "Pengguna",
};

export default function UsersManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserApiResponse | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"active" | "blocked" | "all">("all");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on search
        fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch when filters/sort/page changes
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.perPage, filterRole, filterStatus, sortConfig]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await usersService.getUsers({ 
        page: pagination.page,
        perPage: pagination.perPage,
        search: searchQuery,
        role: filterRole,
        status: filterStatus,
        sortBy: sortConfig?.key,
        sortDirection: sortConfig?.direction,
      });
      setUsers(data.items);
      setPagination(prev => ({
        ...prev,
        totalItems: data.meta.total_items,
        totalPages: data.meta.total_pages,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat pengguna");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on sort
  };

  const handleCreateUser = async (data: any) => {
    try {
      const newUser = await usersService.createUser(data);
      setUsers((prev) => [newUser, ...prev]);
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Gagal membuat pengguna");
      throw error; // Let modal handle loading state if needed
    }
  };

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

  const handleUpdateUser = async (userId: string, data: any) => {
    try {
      await usersService.updateUser(userId, data);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, ...data } : user))
      );
      toast.success("Data pengguna berhasil diperbarui");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Gagal memperbarui data pengguna");
      throw error;
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

  const openEditUserModal = (user: UserApiResponse) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
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

  const getSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
        return <ArrowUpDown className={`w-4 h-4 ml-1 inline ${sortConfig.direction === 'asc' ? 'text-blue-500' : 'text-blue-500'}`} />
    }
    return <ArrowUpDown className="w-4 h-4 ml-1 inline text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Manajemen Pengguna
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Kelola semua pengguna platform
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Cari berdasarkan nama, email, atau universitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
             <div className="relative">
                <select 
                    className="h-10 w-full md:w-[150px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as UserRole | "all")}
                >
                    <option value="all">Semua Role</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="user">User</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
             </div>

             <div className="relative">
                <select 
                    className="h-10 w-full md:w-[150px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as "active" | "blocked" | "all")}
                >
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="blocked">Diblokir</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
             </div>
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
              <TableHead 
                className="cursor-pointer group select-none" 
                onClick={() => handleSort("name")}
              >
                Pengguna {getSortIcon("name")}
              </TableHead>
              <TableHead 
                className="cursor-pointer group select-none" 
                onClick={() => handleSort("role")}
              >
                Role {getSortIcon("role")}
              </TableHead>
              <TableHead 
                className="cursor-pointer group select-none" 
                onClick={() => handleSort("university")}
              >
                Universitas {getSortIcon("university")}
              </TableHead>
              <TableHead 
                className="cursor-pointer group select-none" 
                onClick={() => handleSort("level")}
              >
                Level {getSortIcon("level")}
              </TableHead>
              <TableHead>
                Status
              </TableHead>
              <TableHead 
                className="cursor-pointer group select-none" 
                onClick={() => handleSort("createdAt")}
              >
                Bergabung {getSortIcon("createdAt")}
              </TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {/* ... Cells same as before ... */}
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
                  {user.role === "user" ? (
                    <div className="text-sm">
                      {user.university || "-"}
                      <div className="text-xs text-zinc-500">{user.major || ""}</div>
                    </div>
                  ) : (
                    <span className="text-zinc-400 text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.role === "user" ? `Lv. ${user.level || 1}` : "-"}
                </TableCell>
                <TableCell>
                  {(user.role === "admin" || user.role === "moderator") ? (
                    <span className="text-zinc-400 text-sm">-</span>
                  ) : (
                    <Badge
                      className={
                        user.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      }
                    >
                      {user.status === "active" ? "Aktif" : "Diblokir"}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditUserModal(user)}
                      className="hover:text-blue-600 cursor-pointer"
                      title="Edit Pengguna"
                      disabled={user.role === "admin"}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    {user.role !== "admin" && (user.role !== "moderator" || currentUser?.role === "admin") && (
                      user.status === "active" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openBlockModal(user)}
                          className="hover:text-red-600 cursor-pointer"
                          title="Blokir Pengguna"
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUnblockUser(user.id)}
                          className="hover:text-green-600 cursor-pointer"
                          title="Buka Blokir"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDeleteModal(user)}
                      className="hover:text-red-600 cursor-pointer"
                      title="Hapus Pengguna"
                      disabled={user.id === currentUser?.id}
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

      {users.length === 0 && !isLoading && (
        <div className="text-center py-12 text-zinc-500">
          Tidak ada pengguna yang ditemukan sesuai pencarian Anda.
        </div>
      )}

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
                {/* No icon needed for this small one, or maybe add one if user insists, but request was mainly about "warna" (color/style) */}
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

      {/* Modals */}
      <CreateUserModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser}
      />

      {selectedUser && (
        <>
          <BlockUserModal
            isOpen={isBlockModalOpen}
            onClose={() => setIsBlockModalOpen(false)}
            userId={selectedUser.id}
            userName={selectedUser.name}
            onBlock={handleBlockUser}
          />
          <EditUserModal
            isOpen={isEditUserModalOpen}
            onClose={() => setIsEditUserModalOpen(false)}
            user={selectedUser}
            onUpdate={handleUpdateUser}
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
