import { capitalizeWords } from '../utils';

interface BarChartProps {
  data: { 
    count: number;
    [key: string]: string | number;
  }[];
  title: string;
  labelKey?: string;
}
export default function BarChart ({ 
  data, 
  title,
  labelKey = 'name'
}: BarChartProps) {

  const maxCount = Math.max(1, ...data.map(d => d.count));
  const sortedData = data.sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {sortedData.length === 0 ? (
        <p className="text-gray-500 text-sm">No data available</p>
      ) : (
        <div className="space-y-3">
          {sortedData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{capitalizeWords(String(item[labelKey]))}</span>
                <span className="text-sm text-gray-600">{item.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
