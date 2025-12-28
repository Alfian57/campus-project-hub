"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Array<{
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder?: string;
  }>;
  className?: string;
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari...",
  filters = [],
  className,
}: SearchFilterProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-zinc-800/50 border-zinc-700"
        />
      </div>
      
      {filters.map((filter, idx) => (
        <select
          key={idx}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="h-10 px-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100"
        >
          {filter.options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-zinc-900 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}

// Common filter options
export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "Semua Status" },
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draft" },
  { value: "blocked", label: "Diblokir" },
];

export const USER_STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "blocked", label: "Diblokir" },
];

export const TRANSACTION_STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "Semua Status" },
  { value: "pending", label: "Menunggu" },
  { value: "success", label: "Berhasil" },
  { value: "failed", label: "Gagal" },
];
