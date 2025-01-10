import { API_URL } from "../utils";
import { AnalyticsData } from "../types";

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await fetch(`${API_URL}/analytics`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  return response.json();
};

