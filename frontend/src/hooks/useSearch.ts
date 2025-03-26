import { useState, useCallback, useMemo } from 'react';

interface UseSearchOptions<T> {
  items: T[];
  searchFields: (keyof T)[];
  initialFilters?: Record<string, string>;
}

export const useSearch = <T extends Record<string, any>>({
  items,
  searchFields,
  initialFilters = {},
}: UseSearchOptions<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Apply search term
      if (searchTerm) {
        const matchesSearch = searchFields.some((field) => {
          const value = item[field];
          return value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
        if (!matchesSearch) return false;
      }

      // Apply filters
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        return item[field]?.toString().toLowerCase() === value.toLowerCase();
      });
    });
  }, [items, searchTerm, searchFields, filters]);

  return {
    searchTerm,
    filters,
    filteredItems,
    handleSearch,
    handleFilterChange,
    clearFilters,
  };
}; 