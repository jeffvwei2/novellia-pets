import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pet } from '../types';
import { formatDate } from '../utils';
import { getPetById } from '../services/pets';
import Loader from './Loader';
import ErrorDisplay from './ErrorDisplay';

export default function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) {
        setError('Pet ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('fetchPet', id);
        const data = await getPetById(Number(id));
        console.log('data', data);
        if (!data) {
          setError('Pet not found');
        } else {
          setPet(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleEdit = () => {
    navigate(`/pets/${id}/edit`);
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !pet) {
    return <ErrorDisplay message={error || 'Pet not found'} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Pet List
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{pet.name}</h2>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-base text-gray-900 mt-1">{pet.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Type</label>
              <p className="text-base text-gray-900 mt-1">{pet.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth</label>
              <p className="text-base text-gray-900 mt-1">{formatDate(pet.dob)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Owner</label>
              <p className="text-base text-gray-900 mt-1">{pet.owner}</p>
            </div>
          </div>
        </section>

        {/* Vaccines */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vaccines</h3>
          {!pet.vaccines.length ? (
            <p className="text-gray-500">No vaccines recorded</p>
          ) : (
            <div className="space-y-3">
              {pet.vaccines.map((vaccine) => (
                <div key={vaccine.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{vaccine.name}</h4>
                    </div>
                    {vaccine.date_administered && (
                      <span className="text-sm text-gray-500">
                        {formatDate(vaccine.date_administered)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Allergies */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
          {!pet.allergies.length ? (
            <p className="text-gray-500">No allergies recorded</p>
          ) : (
            <div className="space-y-3">
              {pet.allergies.map((allergy) => (
                <div key={allergy.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{allergy.name}</h4>
                      {allergy.reaction && (
                        <p className="text-sm text-gray-600 mt-1">{allergy.reaction}</p>
                      )}
                    </div>
                    {allergy.severity && (
                      <span className={`text-sm px-2 py-1 rounded ${
                        allergy.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                        allergy.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {allergy.severity}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
        </div>
      </div>
    </div>
  );
}

