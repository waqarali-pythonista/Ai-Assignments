import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
  totalItems?: number;
}

export const usePagination = ({
  initialPage = 1,
  pageSize = 10,
  totalItems = 0,
}: UsePaginationOptions = {}) => {
  const [page, setPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [total, setTotal] = useState(totalItems);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setItemsPerPage(newPageSize);
    setPage(1);
  }, []);

  const setTotalItems = useCallback((newTotal: number) => {
    setTotal(newTotal);
  }, []);

  const resetPagination = useCallback(() => {
    setPage(initialPage);
    setItemsPerPage(pageSize);
    setTotal(totalItems);
  }, [initialPage, pageSize, totalItems]);

  return {
    page,
    itemsPerPage,
    total,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    setTotalItems,
    resetPagination,
  };
}; 