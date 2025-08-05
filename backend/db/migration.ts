import { knex } from 'knex';
import knexConfig from './knexConfig';
import * as dotenv from "dotenv";
dotenv.config();


async function runMigrations() {
  const environment = process.env.NODE_ENV || 'development';
  const db = knex(knexConfig[environment]);

  try {
    console.log('Running migrations...');
    await db.migrate.latest();
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runMigrations();