const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const normalizeValue = (value) => {
  if (!value) return value;
  return value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value;
};

const pool = new Pool({
    user: normalizeValue(process.env.DB_USER),
    host: normalizeValue(process.env.DB_HOST),
    database: normalizeValue(process.env.DB_DATABASE),
    password: normalizeValue(process.env.DB_PASSWORD),
    port: parseInt(normalizeValue(process.env.DB_PORT), 10) || 5432,
});

module.exports = pool;