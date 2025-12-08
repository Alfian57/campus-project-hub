import { mockTransactions, formatCurrency, formatDate } from "@/lib/mock-dashboard-data";
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
import { Download } from "lucide-react";

export default function TransactionsPage() {
  const transactions = mockTransactions;
  const totalRevenue = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Transaction Monitor
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            View all platform transactions
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Total Revenue
          </p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Total Transactions
          </p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {transactions.length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Successful
          </p>
          <p className="text-2xl font-bold text-green-600">
            {transactions.filter((t) => t.status === "success").length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {transactions.filter((t) => t.status === "pending").length}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Donor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <code className="text-xs text-zinc-600 dark:text-zinc-400">
                    #{transaction.id}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-zinc-900 dark:text-zinc-50">
                    {transaction.projectTitle}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{transaction.donorName}</div>
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
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                  {formatDate(transaction.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
