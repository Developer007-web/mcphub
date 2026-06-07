import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(client => {
    console.log('✓ Connected to PostgreSQL');
    client.release();
  })
  .catch(err => {
    console.error('✗ DB connection failed:', err.message);
  });

export default pool;
