import { Pool } from 'pg';

export const pgPool = new Pool{{
  connectionString: process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost:5432/jigyasa_db',
}};
