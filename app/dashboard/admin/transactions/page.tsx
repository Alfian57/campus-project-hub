"use client";

import { useState, useEffect } from "react";
import { transactionsService } from "@/lib/services/transactions";
import { TransactionApiResponse } from "@/types/api";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Loader2, ArrowUpDown, Filter, Calendar } from "lucide-react";
import { toast } from "sonner";

const statusLabels: Record<string, string> = {
  success: "Berhasil",
  pending: "Menunggu",
  failed: "Gagal",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  // Pagination & Sort
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, pagination.perPage, filterStatus, sortConfig, dateRange]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await transactionsService.getAdminTransactions({
        page: pagination.page,
        perPage: pagination.perPage,
        status: filterStatus,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
        sortBy: sortConfig?.key,
        sortDirection: sortConfig?.direction,
      });
      setTransactions(data.items);
      setPagination(prev => ({
        ...prev,
        totalItems: data.meta.total_items,
        totalPages: data.meta.total_pages,
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Gagal memuat transaksi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string) => {
    const validKeys = ["created_at", "amount", "status"];
    if (!validKeys.includes(key)) return;

    let direction: "asc" | "desc" = "desc"; // Default desc
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "desc") {
        direction = "asc";
    }
    setSortConfig({ key, direction });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
        return <ArrowUpDown className={`w-4 h-4 ml-1 inline ${sortConfig.direction === 'asc' ? 'text-blue-500' : 'text-blue-500'}`} />
    }
    return <ArrowUpDown className="w-4 h-4 ml-1 inline text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
  };

  const handleExport = async () => {
    if (pagination.totalItems === 0) {
      toast.error("Tidak ada transaksi untuk diekspor");
      return;
    }
    
    setIsExporting(true);
    try {
      await transactionsService.exportTransactions({
        status: filterStatus,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
      });
      toast.success("Berhasil mengekspor transaksi");
    } catch (error) {
      console.error("Error exporting transactions:", error);
      toast.error("Gagal mengekspor transaksi");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading && transactions.length === 0) {
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
            Monitor Transaksi
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Lihat semua transaksi platform
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Ekspor CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Date Range */}
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-white pointer-events-none" />
                    <Input 
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="pl-10 w-full sm:w-[160px] dark:[&::-webkit-calendar-picker-indicator]:invert"
                        placeholder="Start Date"
                    />
                </div>
                <span className="text-zinc-500">-</span>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-white pointer-events-none" />
                    <Input 
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="pl-10 w-full sm:w-[160px] dark:[&::-webkit-calendar-picker-indicator]:invert"
                        placeholder="End Date"
                    />
                </div>
            </div>

             {/* Status Filter */}
             <div className="relative w-full sm:w-auto">
                <select 
                    className="h-10 w-full sm:w-[180px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none pl-10"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">Semua Status</option>
                    <option value="success">Berhasil</option>
                    <option value="pending">Menunggu</option>
                    <option value="failed">Gagal</option>
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
             </div>
        </div>
      </div>

      {/* Stats - Dynamic based on metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Transaksi (Filter)</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {pagination.totalItems}
          </p>
        </div>
         <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
           <p className="text-sm text-zinc-600 dark:text-zinc-400">Halaman Ini</p>
           <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {transactions.length}
           </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Proyek</TableHead>
              <TableHead>Pembeli</TableHead>
              <TableHead 
                className="cursor-pointer group select-none"
                onClick={() => handleSort("amount")}
              >
                Jumlah {getSortIcon("amount")}
              </TableHead>
              <TableHead 
                 className="cursor-pointer group select-none"
                 onClick={() => handleSort("status")}
              >
                Status {getSortIcon("status")}
              </TableHead>
              <TableHead 
                 className="cursor-pointer group select-none"
                 onClick={() => handleSort("created_at")}
              >
                Tanggal {getSortIcon("created_at")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <code className="text-xs text-zinc-600 dark:text-zinc-400">
                      #{transaction.id.slice(0, 8)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">
                      {transaction.projectTitle}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{transaction.buyerName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-green-600">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        transaction.status === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      }
                    >
                      {statusLabels[transaction.status] || transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                    {formatDate(transaction.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                  Belum ada transaksi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Pagination Controls */}
       <div className="flex items-center justify-between pt-4">
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
    </div>
  );
}
