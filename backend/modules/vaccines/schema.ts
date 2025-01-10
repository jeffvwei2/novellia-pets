import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { pets } from '../pets/schema.js';

export const vaccines = sqliteTable('vaccines', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pet_id: integer('pet_id')
    .notNull()
    .references(() => pets.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  date_administered: text('date_administered'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
  petIdIdx: index('idx_vaccines_pet_id').on(table.pet_id),
}));


export interface VaccineInput {
  id?: number;
  pet_id?: number; 
  name: string;
  date_administered: string | null;
}

export type Vaccine = typeof vaccines.$inferSelect;
export type NewVaccine = typeof vaccines.$inferInsert;

