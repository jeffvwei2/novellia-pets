export interface Pet {
  id: number;
  name: string;
  type: string;
  dob: string;
  owner: string;
  created_at: string;
  updated_at: string;
  vaccines: Vaccine[];
  allergies: Allergy[];
}

export interface Vaccine {
  id: number;
  pet_id: number;
  name: string;
  date_administered: string | null;
}

export interface Allergy {
  id: number;
  pet_id: number;
  name: string;
  reaction: string | null;
  severity: string | null;
}

export interface PetInput extends Omit<Pet, 'vaccines' | 'allergies' | 'created_at' | 'updated_at' | 'id'> { id?: number; vaccines: VaccineInput[], allergies: AllergyInput[] };
export interface VaccineInput extends Omit<Vaccine, 'id'> { id?: number };
export interface AllergyInput extends Omit<Allergy, 'id'> { id?: number };

export interface AnalyticsData {
  totalPets: number;
  petTypes: { type: string; count: number }[];
  allergies: { name: string; count: number }[];
  vaccines: { name: string; count: number }[];
}
