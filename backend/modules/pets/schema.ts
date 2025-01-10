import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { Vaccine, VaccineInput } from '../vaccines/schema.js';
import { Allergy, AllergyInput } from '../allergies/schema.js';

export interface PetWithRelations extends Pet {
  vaccines: Vaccine[];
  allergies: Allergy[];
}

export interface PetInput {
  name: string;
  type: string;
  dob: string;
  owner: string;
  vaccines?: VaccineInput[];
  allergies?: AllergyInput[];
}

export interface PaginatedPets {
  pets: PetWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export const pets = sqliteTable('pets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').notNull(),
  dob: text('dob').notNull(),
  owner: text('owner').notNull(),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Pet = typeof pets.$inferSelect;
export type NewPet = typeof pets.$inferInsert;

