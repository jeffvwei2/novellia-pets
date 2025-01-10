import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import PetTable from './PetTable';
import { Pet } from '../types';
import Loader from './Loader';
import ErrorDisplay from './ErrorDisplay';
import { usePets } from '../hooks/usePets';

type SortColumn = 'name' | 'type' | 'dob' | 'owner' | null;
type SortDirection = 'asc' | 'desc';

export default function PetList() {
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const {
    pets,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchPets,
  } = usePets(); 

  const handleSearch = (searchTerm: string) => {
    setCurrentPage(1);
    fetchPets(searchTerm, 1);
  };

  const handleClearSearch = () => {
    setCurrentPage(1);
    fetchPets(undefined, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const handlePetClick = (pet: Pet) => {
    navigate(`/pets/${pet.id}`);
  };

  const sortedPets = useMemo(() => {
    if (!sortColumn) return pets;
  
    const dir = sortDirection === 'asc' ? 1 : -1;
  
    return [...pets].sort((a, b) => {
      if (sortColumn === 'dob') {
        return (
          (new Date(a.dob).getTime() - new Date(b.dob).getTime()) * dir
        );
      }
      return a[sortColumn].localeCompare(b[sortColumn]) * dir;
    });
  }, [pets, sortColumn, sortDirection]);

  const handleSort = (column: Exclude<SortColumn, null>) => {
    const direction =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
  
    setSortColumn(column);
    setSortDirection(direction);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <>
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
        </div>
        <button
          onClick={() => navigate('/pets/new')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
        >
          + Add Pet
        </button>
      </div>
      
      <PetTable
        pets={sortedPets}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        onPetClick={handlePetClick}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {currentPage}  of {totalPages} pages
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

