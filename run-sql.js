const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value;
  }
});

const connectionString = env.DIRECT_URL || env.DATABASE_URL;

if (!connectionString) {
  console.error('No connection string found in .env.local');
  process.exit(1);
}

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  await client.connect();
  console.log('Connected to PostgreSQL database.');

  const sql = `
    -- Update the student projects policy to support 'ALL' class_grades
    DROP POLICY IF EXISTS "Students can view projects for their school and grade" ON projects;
    
    CREATE POLICY "Students can view projects for their school and grade"
      ON projects FOR SELECT
      USING (
        school_id IN (SELECT school_id FROM students WHERE user_id = auth.uid())
        AND (
          class_grade = 'ALL'
          OR class_grade IN (SELECT class_grade FROM students WHERE user_id = auth.uid())
        )
      );
      
    -- Verify the policy change
    SELECT policyname, qual FROM pg_policies WHERE tablename = 'projects';
  `;

  try {
    const res = await client.query(sql);
    console.log('SQL commands executed successfully.');
    console.log(res[res.length - 1].rows);
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await client.end();
  }
}

main();
