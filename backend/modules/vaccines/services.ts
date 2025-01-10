import { db } from '../../db/database.js';
import { vaccines, type Vaccine, type VaccineInput } from './schema.js';
import { sql, eq, inArray } from 'drizzle-orm';
import { Transaction } from '../shared.js';

export async function getExistingVaccines(petId: number): Promise<Vaccine[]> {
  return await db.select().from(vaccines).where(eq(vaccines.pet_id, petId))
}

export function deleteVaccines(tx: Transaction, vaccineIds: number[]): void {
   tx.delete(vaccines)
    .where(inArray(vaccines.id, vaccineIds))
    .run()
}

export function upsertVaccines(tx: Transaction, petId: number, vaccineInputs: VaccineInput[]): void {
  if (!vaccineInputs.length) return;

  const values = vaccineInputs.map(v => ({
    ...(v.id ? { id: v.id } : {}),
    pet_id: v.pet_id ?? petId,
    name: v.name,
    date_administered: v.date_administered,
  }));

  tx.insert(vaccines)
    .values(values)
    .onConflictDoUpdate({
      target: vaccines.id,
      set: {
        pet_id: sql`excluded.pet_id`,
        name: sql`excluded.name`,
        date_administered: sql`excluded.date_administered`,
        updated_at: sql`CURRENT_TIMESTAMP`,
      },
    })
    .run();
}

export function insertVaccines(tx: Transaction, petId: number, vaccineInputs: VaccineInput[]): void {
  if (!vaccineInputs?.length) return
  tx.insert(vaccines)
    .values(vaccineInputs.map(v => ({ ...v, pet_id: petId })))
    .run();
}