import { Pool } from 'pg';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env') });

const normalizeValue = (value: string | undefined): string | undefined => {
  if (!value) return value;
  return value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value;
};

const pool = new Pool({
    user: normalizeValue(process.env.DB_USER),
    host: normalizeValue(process.env.DB_HOST),
    database: normalizeValue(process.env.DB_DATABASE),
    password: normalizeValue(process.env.DB_PASSWORD),
    port: parseInt(normalizeValue(process.env.DB_PORT) || '5432', 10),
});

export default pool;