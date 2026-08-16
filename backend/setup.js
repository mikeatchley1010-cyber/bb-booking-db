const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_CHv6es4EhdYc@ep-tiny-recipe-ax8wmzjq.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require', // <--- PASTE YOUR LONG LINK HERE!
});

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        room_name VARCHAR(255) NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL
      );
    `);
    console.log("Success: The reservations table has been created IN THE CLOUD!");
  } catch (err) {
    console.error("Error creating table:", err.message);
  } finally {
    pool.end();
  }
};

createTable();