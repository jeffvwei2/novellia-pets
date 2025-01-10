import { pets } from '../modules/pets/schema.js';
import { vaccines } from '../modules/vaccines/schema.js';
import { allergies } from '../modules/allergies/schema.js';
import { relations } from 'drizzle-orm';

export * from '../modules/pets/schema.js';
export * from '../modules/vaccines/schema.js';
export * from '../modules/allergies/schema.js';

export const petsRelations = relations(pets, (r) => ({
  vaccines: r.many(vaccines),
  allergies: r.many(allergies),
}));

export const vaccinesRelations = relations(vaccines, (r) => ({
  pet: r.one(pets, {
    fields: [vaccines.pet_id],
    references: [pets.id],
  }),
}));

export const allergiesRelations = relations(allergies, (r) => ({
  pet: r.one(pets, {
    fields: [allergies.pet_id],
    references: [pets.id],
  }),
}));
