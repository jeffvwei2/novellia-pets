import { Allergy, AllergyInput } from '../types';

interface ModifyAllergiesProps {
  allergies: Allergy[];
  onAllergyChange: (index: number, field: keyof Allergy, value: string | null) => void;
  onAddAllergy: () => void;
  onRemoveAllergy: (index: number) => void;
}

export default function ModifyAllergies({
  allergies,
  onAllergyChange,
  onAddAllergy,
  onRemoveAllergy,
}: ModifyAllergiesProps) {

    return (
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Allergies</h3>
          <button
            type="button"
            onClick={onAddAllergy}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Allergy
          </button>
        </div>
        <div className="space-y-3">
          {allergies.map((allergy, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={allergy.name}
                    onChange={(e) => onAllergyChange(index, 'name', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reaction</label>
                  <input
                    type="text"
                    value={allergy.reaction || ''}
                    onChange={(e) => onAllergyChange(index, 'reaction', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <div className="flex gap-2">
                    <select
                      value={allergy.severity || ''}
                      onChange={(e) => onAllergyChange(index, 'severity', e.target.value || null)}
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select severity</option>
                      <option value="Mild">Mild</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe">Severe</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => onRemoveAllergy(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {allergies.length === 0 && (
            <p className="text-gray-500 text-sm">No allergies. Click "Add Allergy" to add one.</p>
          )}
        </div>
      </section>
    );
}

