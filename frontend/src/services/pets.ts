import { Pet, PetInput } from "../types";
import { API_URL, DEFAULT_PAGE_LIMIT } from "../utils";

export interface PaginatedPetsResponse {
  pets: Pet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getAllPets = async (page: number = 1, limit: number = DEFAULT_PAGE_LIMIT): Promise<PaginatedPetsResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const response = await fetch(`${API_URL}/pets?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch pets');
  }
  return response.json();
}

export const getPetById = async (id: number) => {
  const response = await fetch(`${API_URL}/pets/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch pet');
  }
  return response.json();
}

export const createPet = async (pet: PetInput): Promise<Pet> => {
  const response = await fetch(`${API_URL}/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pet),
  });
  if (!response.ok) {
    throw new Error('Failed to create pet');
  }
  return response.json();
}

export const updatePet = async (id: number, pet: Partial<PetInput>): Promise<Pet> => {
  const response = await fetch(`${API_URL}/pets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pet),
  });
  if (!response.ok) {
    throw new Error('Failed to update pet');
  }
  return response.json();
}

export const searchPets = async (searchTerm: string): Promise<Pet[]> => {
  const params = new URLSearchParams();
  if (searchTerm) {
    params.append('q', searchTerm);
  }
  
  const response = await fetch(`${API_URL}/pets/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to search pets');
  }
  return response.json();
}

export const deletePet = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/pets/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete pet');
  }
}