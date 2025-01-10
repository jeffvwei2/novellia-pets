import { db } from './database.js';
import { pets } from '../modules/pets/schema.js';
import { vaccines } from '../modules/vaccines/schema.js';
import { allergies } from '../modules/allergies/schema.js';
import { fileURLToPath } from 'url';
import process from 'process';

// Sample data
const petsData = [
  { name: 'Buddy', type: 'Dog', dob: '2020-03-15', owner: 'John Smith' },
  { name: 'Whiskers', type: 'Cat', dob: '2019-07-22', owner: 'John Smith' },
  { name: 'Max', type: 'Dog', dob: '2021-11-08', owner: 'Sarah Johnson' },
  { name: 'Luna', type: 'Cat', dob: '2022-01-14', owner: 'Sarah Johnson' },
  { name: 'Charlie', type: 'Dog', dob: '2018-05-30', owner: 'Michael Williams' },
  { name: 'Bella', type: 'Dog', dob: '2020-09-12', owner: 'Michael Williams' },
  { name: 'Oliver', type: 'Cat', dob: '2021-04-25', owner: 'Emily Brown' },
  { name: 'Daisy', type: 'Rabbit', dob: '2022-06-18', owner: 'Emily Brown' },
  { name: 'Rocky', type: 'Dog', dob: '2019-12-03', owner: 'David Jones' },
  { name: 'Milo', type: 'Cat', dob: '2020-08-20', owner: 'David Jones' }
];

const vaccinesData = [
  { pet_id: 1, name: 'Rabies', date_administered: '2023-01-15' },
  { pet_id: 1, name: 'DHPP',  date_administered: '2023-01-15' },
  { pet_id: 2, name: 'FVRCP',  date_administered: '2023-02-10' },
  { pet_id: 3, name: 'Rabies',  date_administered: '2023-03-20' },
  { pet_id: 4, name: 'FVRCP',  date_administered: '2023-04-05' },
  { pet_id: 5, name: 'DHPP',  date_administered: '2023-05-12' }
];

const allergiesData = [
  { pet_id: 1, name: 'Chicken', reaction: 'Itching and skin redness', severity: 'Moderate' },
  { pet_id: 2, name: 'Dust', reaction: 'Sneezing and watery eyes', severity: 'Mild' },
  { pet_id: 3, name: 'Pollen', reaction: 'Itching and scratching', severity: 'Mild' },
  { pet_id: 5, name: 'Wheat', reaction: 'Digestive upset', severity: 'Moderate' },
  { pet_id: 6, name: 'Flea bites', reaction: 'Severe itching and hair loss', severity: 'Severe' }
];

export async function seedDatabase(): Promise<void> {
  await db.insert(pets).values(petsData);
  await db.insert(vaccines).values(vaccinesData);
  await db.insert(allergies).values(allergiesData);

  console.log('Database seeded');
}

const isMainModule = import.meta.url === `file://${process.argv[1]}` 
  ||  fileURLToPath(import.meta.url) === process.argv[1] 
  ||process.argv[1]?.includes('seed.ts');

if (isMainModule) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error seeding database:', err);
      process.exit(1);
    });
}
