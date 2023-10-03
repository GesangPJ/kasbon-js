const mysql = require('mysql2');

const koneksi = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kasbon',
});

koneksi.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);

    return;
  }
  console.log('Connected to MySQL database');
});

async function mySQLStatus() {
  try {
    // Check if the connection is still alive
    if (!koneksi || koneksi.state === 'disconnected') {
      throw new Error('MySQL connection is not active');
    }

    console.log('MySQL Database is Connected');

    return koneksi;
  } catch (error) {
    console.log('Error MySQL is not Connected', error);
    throw error;
  }
}

module.exports = { koneksi, mySQLStatus };
