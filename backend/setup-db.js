import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const setup = async () => {
  const client = await pool.connect();
  try {
    console.log('✓ Connected to PostgreSQL');
    console.log('Creating tables...\n');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✓ users table ready');

    await client.query(`
      CREATE TABLE IF NOT EXISTS servers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        github_url TEXT,
        install_command TEXT,
        tags TEXT[] DEFAULT '{}',
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✓ servers table ready');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_servers_user_id ON servers(user_id);
      CREATE INDEX IF NOT EXISTS idx_servers_views ON servers(views DESC);
      CREATE INDEX IF NOT EXISTS idx_servers_likes ON servers(likes DESC);
      CREATE INDEX IF NOT EXISTS idx_servers_created ON servers(created_at DESC);
    `);
    console.log('✓ Indexes created');

    console.log('\n✅ Database setup complete!');
  } catch (err) {
    console.error('\n❌ Setup error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

setup();
