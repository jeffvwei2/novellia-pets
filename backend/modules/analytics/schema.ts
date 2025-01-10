export interface AnalyticsData {
  totalPets: number;
  petTypes: { type: string; count: number }[];
  allergies: { name: string; count: number }[];
  vaccines: { name: string; count: number }[];
}