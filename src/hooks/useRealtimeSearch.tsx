
import { useState, useEffect, useMemo } from 'react';

interface UseRealtimeSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  debounceMs?: number;
}

export const useRealtimeSearch = <T extends Record<string, any>>({
  data,
  searchFields,
  debounceMs = 300
}: UseRealtimeSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce do termo de busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Filtrar dados baseado na busca
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return data;
    }

    const term = debouncedSearchTerm.toLowerCase();
    
    return data.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      });
    });
  }, [data, debouncedSearchTerm, searchFields]);

  // Estatísticas da busca
  const searchStats = useMemo(() => ({
    total: data.length,
    filtered: filteredData.length,
    hasResults: filteredData.length > 0,
    isSearching: debouncedSearchTerm.trim().length > 0
  }), [data.length, filteredData.length, debouncedSearchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    searchStats,
    clearSearch,
    isSearching: debouncedSearchTerm.trim().length > 0
  };
};
