import { useState, useEffect } from "react";
import { Pet } from "../types";
import { getAllPets, searchPets } from "../services/pets";
import { DEFAULT_PAGE_LIMIT } from "../utils";

export function usePets(limit = 10) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPets = async (search?: string, page = 1) => {
    try {
      setLoading(true);

      if (search) {
        const data = await searchPets(search);
        setPets(data);
        setTotalPages(1);
      } else {
        const result = await getAllPets(page, limit);
        setPets(result.pets);
        setTotalPages(result.totalPages);
        setCurrentPage(result.page);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchPets(undefined, currentPage);
  }, [currentPage]);

  return {
    pets,
    loading,
    error,
    currentPage,
    totalPages,
    fetchPets,
    setCurrentPage,
  };
}
