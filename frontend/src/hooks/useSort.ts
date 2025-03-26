import { useState, useCallback, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

interface UseSortOptions<T> {
  items: T[];
  initialSortField?: keyof T;
  initialSortDirection?: SortDirection;
}

export const useSort = <T extends Record<string, any>>({
  items,
  initialSortField,
  initialSortDirection = 'asc',
}: UseSortOptions<T>) => {
  const [sortField, setSortField] = useState<keyof T | undefined>(initialSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    initialSortDirection
  );

  const handleSort = useCallback(
    (field: keyof T) => {
      if (field === sortField) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    },
    [sortField]
  );

  const sortedItems = useMemo(() => {
    if (!sortField) return items;

    return [...items].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [items, sortField, sortDirection]);

  const resetSort = useCallback(() => {
    setSortField(initialSortField);
    setSortDirection(initialSortDirection);
  }, [initialSortField, initialSortDirection]);

  return {
    sortField,
    sortDirection,
    sortedItems,
    handleSort,
    resetSort,
  };
}; 