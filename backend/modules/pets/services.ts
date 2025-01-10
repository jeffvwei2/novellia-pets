import { db } from '../../db/database.js';
import { pets, type PetWithRelations, type PetInput, type PaginatedPets } from './schema.js';
import { eq, or, like, sql } from 'drizzle-orm';
import { upsertVaccines, insertVaccines, deleteVaccines, getExistingVaccines } from '../vaccines/services.js';
import { upsertAllergies, insertAllergies, deleteAllergies, getExistingAllergies } from '../allergies/services.js';

export async function getAllPets(page: number = 1, limit: number = 20): Promise<PaginatedPets> {
  const offset = (page - 1) * limit;

  // Get total count
  const totalResult = await db.select({ count: sql<number>`count(*)` }).from(pets);
  const total = Number(totalResult[0]?.count ?? 0);

  // Get paginated pets
  const petsList = await db.query.pets.findMany({
    with: {
      vaccines: true,
      allergies: true,
    },
    limit,
    offset,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    pets: petsList,
    total,
    page,
    limit,
    totalPages,
  };
}

export async function getPetById(id: number): Promise<PetWithRelations | undefined> {
  return await db.query.pets.findFirst({
    where: eq(pets.id, id),
    with: {
      vaccines: true,
      allergies: true,
    },
  });
}

export async function createPet(petInput: PetInput): Promise<PetWithRelations | undefined> {
  const { vaccines: vaccineInputs, allergies: allergyInputs, ...petData } = petInput;
  let newPetId: number = 0;
   db.transaction((tx) => {
    const result = tx.insert(pets).values(petData).run()
    newPetId = Number(result.lastInsertRowid);

    if (vaccineInputs?.length) {
      insertVaccines(tx, newPetId, vaccineInputs);
    }

    if (allergyInputs?.length) {
      insertAllergies(tx, newPetId, allergyInputs);
    }
  });
  
  return await getPetById(newPetId)
}

export async function updatePet(id: number, petInput: Partial<PetInput>): Promise<PetWithRelations | undefined> {
  // Extract vaccines and allergies from input
  const { vaccines: vaccineInputs, allergies: allergyInputs, ...petData } = petInput;
  if(!petData) {
    return undefined;
  }
  const existingAllergies = await getExistingAllergies(id);
  const existingVaccines = await getExistingVaccines(id);
  // parse update input ids
  const vaccineUpdateIds = new Set(vaccineInputs?.filter(v => v.id !== undefined).map(v => v.id));
  const allergyUpdateIds = new Set(allergyInputs?.filter(a => a.id !== undefined).map(a => a.id));
  
  // parse set of existing Ids
  const vaccineExistingIds = new Set(existingVaccines?.map(a => a.id));
  const allergyExistingIds= new Set(existingAllergies?.map(v => v.id));


  // Update the pet if there's pet data
  db.transaction((tx) => {
    // Update the pet
    tx.update(pets)
      .set(petData)
      .where(eq(pets.id, id))
      .run();

    // Update/create vaccines if provided (set pet_id before passing)
    if (vaccineInputs?.length) {
      let removedVaccineIds: number[] = [...vaccineExistingIds].filter(id => !vaccineUpdateIds.has(id)).map(id => Number(id));
      deleteVaccines(tx, removedVaccineIds);
      upsertVaccines(tx, id, vaccineInputs);
    }

    // Update/create allergies if provided (set pet_id before passing)
    if (allergyInputs?.length) {
      let removedAllergyIds: number[] = [...allergyExistingIds].filter(id => !allergyUpdateIds.has(id)).map(id => Number(id));
      deleteAllergies(tx, removedAllergyIds);
      upsertAllergies(tx, id, allergyInputs);
    }
  });
  return await getPetById(id);
}

export async function deletePet(id: number): Promise<boolean> {
  const result = await db.delete(pets).where(eq(pets.id, id)).returning();
  return result.length > 0;
}

export async function searchPets(
  searchTerm?: string
): Promise<PetWithRelations[]> {
  const searchPattern = searchTerm ? `%${searchTerm}%` : undefined;
  
  // Search only name, type, dob, and owner fields
  return await db.query.pets.findMany({
    where: searchPattern ? (
      or(
        like(pets.name, searchPattern),
        like(pets.type, searchPattern),
        like(pets.dob, searchPattern),
        like(pets.owner, searchPattern)
      )
    ) : undefined,
    with: {
      vaccines: true,
      allergies: true,
    },
  });
}