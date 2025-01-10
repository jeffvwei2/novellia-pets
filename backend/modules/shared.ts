import { db } from '../db/database.js';

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];