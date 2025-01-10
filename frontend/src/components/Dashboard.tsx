import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics } from '../services/analytics';
import { AnalyticsData } from '../types';
import Loader from './Loader';
import ErrorDisplay from './ErrorDisplay';
import BarChart from './BarChart';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Pet List
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Total Pets</h2>
          <p className="text-4xl font-bold text-blue-600">{analytics.totalPets}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BarChart data={analytics.petTypes} title="Pet Types" labelKey="type" />
          <BarChart data={analytics.allergies} title="Allergies" labelKey="name" />
          <BarChart data={analytics.vaccines} title="Vaccines" labelKey="name" />
        </div>
      </div>
    </div>
  );
}

