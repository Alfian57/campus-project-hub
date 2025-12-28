import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type StatusType = 
  | "published" 
  | "draft" 
  | "blocked" 
  | "active" 
  | "pending" 
  | "success" 
  | "failed";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  published: {
    label: "Terbit",
    className: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  draft: {
    label: "Draft",
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  blocked: {
    label: "Diblokir",
    className: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  },
  active: {
    label: "Aktif",
    className: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  pending: {
    label: "Menunggu",
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  success: {
    label: "Berhasil",
    className: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  failed: {
    label: "Gagal",
    className: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "" };
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

// User status helper
export function UserStatusBadge({ status }: { status: "active" | "blocked" }) {
  return <StatusBadge status={status} />;
}

// Project/Article status helper
export function ContentStatusBadge({ status }: { status: "published" | "draft" | "blocked" }) {
  return <StatusBadge status={status} />;
}

// Transaction status helper
export function TransactionStatusBadge({ status }: { status: "pending" | "success" | "failed" }) {
  return <StatusBadge status={status} />;
}
