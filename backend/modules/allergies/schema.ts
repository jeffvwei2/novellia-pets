import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { pets } from '../pets/schema.js';

export const allergies = sqliteTable('allergies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pet_id: integer('pet_id')
    .notNull()
    .references(() => pets.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  reaction: text('reaction'),
  severity: text('severity'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
  petIdIdx: index('idx_allergies_pet_id').on(table.pet_id),
}));


export interface AllergyInput {
  id?: number;
  pet_id?: number;
  name: string;
  reaction: string | null;
  severity: string | null;
}

export type Allergy = typeof allergies.$inferSelect;
export type NewAllergy = typeof allergies.$inferInsert;

