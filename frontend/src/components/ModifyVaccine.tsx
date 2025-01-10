import { Vaccine, VaccineInput } from '../types';

interface ModifyVaccineProps {
  vaccines: Vaccine[];
  onVaccineChange: (index: number, field: keyof Vaccine, value: string | null) => void;
  onAddVaccine: () => void;
  onRemoveVaccine: (index: number) => void;
}

export default function ModifyVaccine({
  vaccines,
  onVaccineChange,
  onAddVaccine,
  onRemoveVaccine,
}: ModifyVaccineProps) {

    return (
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Vaccines</h3>
          <button
            type="button"
            onClick={onAddVaccine}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Vaccine
          </button>
        </div>
        <div className="space-y-3">
          {vaccines.map((vaccine, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={vaccine.name}
                    onChange={(e) => onVaccineChange(index, 'name', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Administered</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={vaccine.date_administered ? vaccine.date_administered.split('T')[0] : ''}
                      onChange={(e) => onVaccineChange(index, 'date_administered', e.target.value || null)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveVaccine(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {vaccines.length === 0 && (
            <p className="text-gray-500 text-sm">No vaccines. Click "Add Vaccine" to add one.</p>
          )}
        </div>
      </section>
    );
}

