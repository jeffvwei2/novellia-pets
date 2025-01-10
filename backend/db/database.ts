import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as schema from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'database.sqlite');

const sqlite = new Database(DB_PATH);
export const db = drizzle(sqlite, { schema });

console.log('Connected to SQLite database');

export function closeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      sqlite.close();
      console.log('Database connection closed');
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
