import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pet, Vaccine, Allergy, PetInput, VaccineInput, AllergyInput } from '../types';
import { getPetById, updatePet, createPet, deletePet } from '../services/pets';
import Loader from './Loader';
import ErrorDisplay from './ErrorDisplay';
import ModifyVaccine from './ModifyVaccine';
import ModifyAllergies from './ModifyAllergies';

export default function ModifyPet() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isCreateMode = id === 'new' || !id;
  const [pet, setPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    dob: '',
    owner: '',
  });

  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isCreateMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      if (isCreateMode) {
        setFetching(false);
        return;
      }

      if (!id) {
        setError('Pet ID is required');
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        const data = await getPetById(Number(id));
        if (!data) {
          setError('Pet not found');
        } else {
          setPet(data);
          setFormData({
            name: data.name,
            type: data.type,
            dob: data.dob.split('T')[0],
            owner: data.owner,
          });
          setVaccines(data.vaccines);
          setAllergies(data.allergies);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setFetching(false);
      }
    };

    fetchPet();
  }, [id, isCreateMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVaccineChange = (index: number, field: keyof Vaccine, value: string | null) => {
    const updated = [...vaccines];
    updated[index] = { ...updated[index], [field]: value };
    setVaccines(updated);
  };

  const addVaccine = () => {
    setVaccines([...vaccines, {
      id: Date.now(),
      pet_id: pet?.id || 0,
      name: '',
      date_administered: null,
    }]);
  };

  const removeVaccine = (index: number) => {
    setVaccines(vaccines.filter((_, i) => i !== index));
  };

  const handleAllergyChange = (index: number, field: keyof Allergy, value: string | null) => {
    const updated = [...allergies];
    updated[index] = { ...updated[index], [field]: value };
    setAllergies(updated);
  };

  const addAllergy = () => {
    setAllergies([...allergies, {
      id: Date.now(),
      pet_id: pet?.id || 0,
      name: '',
      reaction: null,
      severity: null,
    }]);
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


    try {
      const vaccinesPayload = vaccines.map(v => ({
        id: v.id > 0 && !isCreateMode ? v.id : undefined,
        name: v.name.trim(),
        date_administered: v.date_administered,
      })) as VaccineInput[]
      
      const allergiesPayload = allergies.map(a => ({
        id: a.id > 0 && !isCreateMode ? a.id : undefined,
        name: a.name.trim(),
        reaction: a.reaction ? a.reaction.trim() : null,
        severity: a.severity,
      })) as AllergyInput[]

      const payload: PetInput = {
        name: formData.name.trim(),
        type: formData.type.trim(),
        dob: formData.dob,
        owner: formData.owner.trim(),
        vaccines: vaccinesPayload,
        allergies: allergiesPayload,
      }

      if (isCreateMode) {
        const newPet = await createPet(payload);
        navigate(`/pets/${newPet.id}`);
      } else {
        if (!pet) return;
        
        await updatePet(pet.id, payload);
        navigate(`/pets/${pet.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isCreateMode) {
      navigate('/');
    } else if (pet) {
      navigate(`/pets/${pet.id}`);
    } else {
      navigate('/');
    }
  };

  const handleDelete = async () => {
    if (!pet || isCreateMode) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${pet.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      await deletePet(pet.id);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pet');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loader />;
  }

  if (!isCreateMode && (error || !pet)) {
    return <ErrorDisplay message={error || 'Pet not found'} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={handleCancel}
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
            Back to Pet Detail
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {isCreateMode ? 'Add New Pet' : 'Edit Pet'}
            </h2>
            {!isCreateMode && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Delete Pet
              </button>
            )}
          </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Vaccines */}
        <ModifyVaccine
          vaccines={vaccines}
          onVaccineChange={handleVaccineChange}
          onAddVaccine={addVaccine}
          onRemoveVaccine={removeVaccine}
        />

        {/* Allergies */}
        <ModifyAllergies
          allergies={allergies}
          onAllergyChange={handleAllergyChange}
          onAddAllergy={addAllergy}
          onRemoveAllergy={removeAllergy}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
}

