"use client";

import { useState } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  initialPerPage?: number;
}

interface UsePaginationReturn {
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  resetPage: () => void;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, initialPerPage = 10 } = options;
  
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const resetPage = () => setPage(1);

  return {
    page,
    perPage,
    setPage,
    setPerPage,
    resetPage,
  };
}
