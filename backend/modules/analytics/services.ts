import { db } from '../../db/database.js';
import { pets } from '../pets/schema.js';
import { vaccines } from '../vaccines/schema.js';
import { allergies } from '../allergies/schema.js';
import { sql } from 'drizzle-orm';
import { AnalyticsData } from './schema.js';

export async function getAnalytics(): Promise<AnalyticsData> {
  const totalPetsResult = await db.select({ count: sql<number>`count(*)` }).from(pets);
  const totalPets = Number(totalPetsResult[0]?.count ?? 0);

  const petTypesResult = await db
    .select({
      type: sql<string>`lower(${pets.type})`.as('type'),
      count: sql<number>`count(*)`,
    })
    .from(pets)
    .groupBy(sql`lower(${pets.type})`);
  
  const petTypes = petTypesResult.map(row => ({
    type: row.type,
    count: Number(row.count),
  }));

  const allergiesResult = await db
    .select({
      name: sql<string>`lower(${allergies.name})`.as('name'),
      count: sql<number>`count(*)`,
    })
    .from(allergies)
    .groupBy(sql`lower(${allergies.name})`);
  
  const allergiesData = allergiesResult.map(row => ({
    name: row.name,
    count: Number(row.count),
  }));

  const vaccinesResult = await db
    .select({
      name: sql<string>`lower(${vaccines.name})`.as('name'),
      count: sql<number>`count(*)`,
    })
    .from(vaccines)
    .groupBy(sql`lower(${vaccines.name})`);
  
  const vaccinesData = vaccinesResult.map(row => ({
    name: row.name,
    count: Number(row.count),
  }));

  return {
    totalPets,
    petTypes,
    allergies: allergiesData,
    vaccines: vaccinesData,
  };
}

