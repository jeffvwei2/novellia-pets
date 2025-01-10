import { Vaccine, Allergy, Pet } from '../types';
import { formatDate, capitalizeWords } from '../utils';

type SortColumn = 'name' | 'type' | 'dob' | 'owner' | null;
type SortDirection = 'asc' | 'desc';

interface PetTableProps {
  pets: Pet[];
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: 'name' | 'type' | 'dob' | 'owner') => void;
  onPetClick: (pet: Pet) => void;
}

export default function PetTable({
  pets,
  sortColumn,
  sortDirection,
  onSort,
  onPetClick,
}: PetTableProps) {
  const getSortIcon = (column: 'name' | 'type' | 'dob' | 'owner') => {
    if (sortColumn !== column) {
      return (
        <span className="text-gray-400 ml-1">
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </span>
      );
    }
    return (
      <span className="text-blue-600 ml-1">
        {sortDirection === 'asc' ? (
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                Name
                {getSortIcon('name')}
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => onSort('type')}
            >
              <div className="flex items-center">
                Type
                {getSortIcon('type')}
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => onSort('dob')}
            >
              <div className="flex items-center">
                Date of Birth
                {getSortIcon('dob')}
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => onSort('owner')}
            >
              <div className="flex items-center">
                Owner
                {getSortIcon('owner')}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Vaccines
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Allergies
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {!pets.length ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No pets found
              </td>
            </tr>
          ) : (
            pets.map((pet) => (
              <tr
                key={pet.id}
                onClick={() => onPetClick(pet)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {capitalizeWords(pet.name)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {capitalizeWords(pet.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(pet.dob)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {capitalizeWords(pet.owner)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {pet.vaccines.length === 0 ? (
                    <span className="text-gray-400">None</span>
                  ) : (
                    <div className="space-y-1">
                      {pet.vaccines.map((vaccine: Vaccine) => (
                        <div key={vaccine.id} className="flex flex-col">
                          <span className="font-medium">{vaccine.name}</span>
                          {vaccine.date_administered && (
                            <span className="text-xs text-gray-400">
                              {formatDate(vaccine.date_administered)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {pet.allergies.length === 0 ? (
                    <span className="text-gray-400">None</span>
                  ) : (
                    <div className="space-y-1">
                      {pet.allergies.map((allergy: Allergy) => (
                        <div key={allergy.id} className="flex flex-col">
                          <span className="font-medium">{capitalizeWords(allergy.name)}</span>
                          {allergy.severity && (
                            <span className="text-xs text-gray-400">
                              {allergy.severity}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

