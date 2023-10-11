const { Pool } = require('pg')
require('dotenv').config()

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}

// Create a new PostgreSQL pool
const pool = new Pool(dbConfig)

// Function to check the database connection status
async function PostgresStatus() {
  try {
    const client = await pool.connect()
    console.log('PostgreSQL Connected')
    client.release() // Release the client back to the pool
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

// Export the pool to use it in other parts of your application
module.exports = { pool, PostgresStatus }
