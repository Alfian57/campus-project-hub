"use client";

import { useState, useEffect, useCallback } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { usersService } from "@/lib/services/users";
import { UserApiResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlockReasonModal } from "@/components/moderator/block-reason-modal";
import { 
  DataTable, 
  SearchFilter, 
  UserStatusBadge,
  USER_STATUS_FILTER_OPTIONS 
} from "@/components/shared";
import { usePagination, useDebounce } from "@/hooks";
import { 
  ArrowLeft, 
  UserCheck, 
  UserX,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ModeratorUsersPage() {
  const [users, setUsers] = useState<UserApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalItems, setTotalItems] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Block modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserApiResponse | null>(null);

  // Hooks
  const { page, perPage, setPage } = usePagination({ initialPerPage: 20 });
  const debouncedSearch = useDebounce(searchQuery);
  const totalPages = Math.ceil(totalItems / perPage);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await usersService.getUsers({
        page,
        perPage,
        search: debouncedSearch,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setUsers(data.items);
      setTotalItems(data.meta.total_items);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data pengguna");
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openBlockModal = (user: UserApiResponse) => {
    setSelectedUser(user);
    setShowBlockModal(true);
  };

  const handleBlock = async (reason: string) => {
    if (!selectedUser) return;
    setActionLoading(selectedUser.id);
    try {
      await usersService.blockUser(selectedUser.id, reason);
      toast.success("Pengguna berhasil diblokir");
      fetchUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Gagal memblokir pengguna");
    } finally {
      setActionLoading(null);
      setShowBlockModal(false);
      setSelectedUser(null);
    }
  };

  const handleUnblock = async (userId: string) => {
    setActionLoading(userId);
    try {
      await usersService.unblockUser(userId);
      toast.success("Pengguna berhasil dibuka blokirnya");
      fetchUsers();
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Gagal membuka blokir pengguna");
    } finally {
      setActionLoading(null);
    }
  };

  // Table columns definition
  const columns = [
    {
      key: "user",
      header: "Pengguna",
      render: (user: UserApiResponse) => (
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-zinc-100">{user.name}</p>
            <p className="text-sm text-zinc-500">{user.university || "-"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (user: UserApiResponse) => (
        <span className="text-zinc-400">{user.email}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user: UserApiResponse) => (
        <Badge variant="secondary" className="capitalize">
          {user.role === "admin" && <Shield className="w-3 h-3 mr-1" />}
          {user.role}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user: UserApiResponse) => (
        <UserStatusBadge status={user.status} />
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName: "text-zinc-400 text-right",
      render: (user: UserApiResponse) => (
        <div className="text-right">
          {user.role !== "admin" && user.role !== "moderator" ? (
            user.status === "active" ? (
              <Button
                size="sm"
                variant="outline"
                className="text-red-500 hover:text-red-400 border-red-500/30"
                onClick={() => openBlockModal(user)}
                disabled={actionLoading === user.id}
              >
                {actionLoading === user.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserX className="w-4 h-4 mr-1" />
                )}
                Blokir
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="text-green-500 hover:text-green-400 border-green-500/30"
                onClick={() => handleUnblock(user.id)}
                disabled={actionLoading === user.id}
              >
                {actionLoading === user.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserCheck className="w-4 h-4 mr-1" />
                )}
                Buka Blokir
              </Button>
            )
          ) : (
            <span className="text-xs text-zinc-500">Tidak dapat diblokir</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <RoleGuard allowedRoles={["moderator", "admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/moderator">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-50">Moderasi Pengguna</h1>
            <p className="text-zinc-400">Kelola dan moderasi akun pengguna</p>
          </div>
        </div>

        {/* Search & Filters */}
        <SearchFilter
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari pengguna..."
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: USER_STATUS_FILTER_OPTIONS,
            },
          ]}
        />

        {/* Data Table */}
        <DataTable
          data={users}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="Tidak ada pengguna ditemukan"
          keyExtractor={(user) => user.id}
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={perPage}
          onPageChange={setPage}
        />
      </div>

      {/* Block Reason Modal */}
      {selectedUser && (
        <BlockReasonModal
          isOpen={showBlockModal}
          onClose={() => {
            setShowBlockModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleBlock}
          title="Blokir Pengguna"
          itemName={selectedUser.name}
          itemType="pengguna"
          isLoading={actionLoading === selectedUser.id}
        />
      )}
    </RoleGuard>
  );
}
