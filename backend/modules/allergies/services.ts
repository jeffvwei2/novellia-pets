import { allergies, type Allergy, type AllergyInput } from './schema.js';
import { sql,eq, inArray } from 'drizzle-orm';
import { Transaction } from '../shared.js';
import { db } from '../../db/database.js';

export async function getExistingAllergies(petId: number): Promise<Allergy[]> {
  return await db.select().from(allergies).where(eq(allergies.pet_id, petId))
}

export function deleteAllergies(tx: Transaction, allergyIds: number[]): void {
  tx.delete(allergies)
  .where(inArray(allergies.id, allergyIds))
  .run()
}

export  function upsertAllergies(tx: Transaction, petId: number, allergyInputs: AllergyInput[]): void {
  if (!allergyInputs.length) return 

  const values = allergyInputs.map(a => ({
    ...(a.id ? { id: a.id } : {}),
    pet_id: a.pet_id ?? petId,
    name: a.name,
    reaction: a.reaction,
    severity: a.severity,
  }));

  tx.insert(allergies)
    .values(values)
    .onConflictDoUpdate({
      target: allergies.id,
      set: {
        pet_id: sql`excluded.pet_id`,
        name: sql`excluded.name`,
        reaction: sql`excluded.reaction`,
        severity: sql`excluded.severity`,
        updated_at: sql`CURRENT_TIMESTAMP`,
      },
    })
    .run();
}

export function insertAllergies(tx: Transaction, petId: number, allergyInputs: AllergyInput[]): void {
  if (!allergyInputs?.length) return

  tx.insert(allergies)
    .values(allergyInputs.map(a => ({ ...a, pet_id: petId })))
    .run();
}
