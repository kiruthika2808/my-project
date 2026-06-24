import { useMemo } from "react";

export function useFilteredList(items, query, keys, filterValue, filterKey) {
  return useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = keys.some((key) => String(item[key] || "").toLowerCase().includes(query.toLowerCase()));
      const matchesFilter = !filterValue || filterValue === "All" || item[filterKey] === filterValue;
      return matchesQuery && matchesFilter;
    });
  }, [items, query, keys, filterValue, filterKey]);
}
