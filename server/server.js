const express = require('express')
const { connectToKatalogObatDB } = require('./mongoDB')
const { connectToKasbonDB } = require('./mongoDB')
const cors = require('cors')
const session = require('express-session')
const { pool, PostgresStatus } = require('./postgres')
const generateSecretKey = require('./secret_generator')

const app = express()

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the actual URL of your frontend.
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204.
};
app.use(cors(corsOptions))

// Express JS
app.use(express.json())
app.use(cors())


// Configure express-session for session management
app.use(
  session({
    secret: generateSecretKey(), // Change this to a more secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Define an API endpoint for authentication
app.post('/api/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const client = await pool.connect();

    // Check if the provided credentials match any user in the 'admin' table
    const adminQuery = 'SELECT * FROM admin WHERE nama = $1 AND password = $2';
    const adminResult = await client.query(adminQuery, [name, password]);

    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      req.session.user = admin; // Store admin information in the session
      client.release();
      res.status(200).json({ role: 'admin' });

      return;
    }

    // Check if the provided credentials match any user in the 'user' table
    const userQuery = 'SELECT * FROM user WHERE nama = $1 AND password = $2';
    const userResult = await client.query(userQuery, [name, password]);

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      req.session.user = user; // Store user information in the session
      client.release();
      res.status(200).json({ role: 'user' });

      return;
    }

    // Invalid credentials
    client.release();
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


// Cek Status koneksi MongoDB
app.get('/api/mongodb-status', async (req, res) => {
  try {
    // Cek koneksi ke MongoDB pake MongoDB Driver
    await connectToKatalogObatDB(); // Call the correct function to check MongoDB status

    // Respon status pake JSON
    res.json({ isConnected: true });
  } catch (error) {
    console.error('Error checking MongoDB status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/api/postgres-status', async (req, res) => {
  try {
    // Check PostgreSQL status using the PostgresStatus function
    await PostgresStatus();

    // Respond with a JSON status
    res.json({ isConnected: true });
  } catch (error) {
    console.error('Error checking PostgreSQL status:', error);
    res.json({ isConnected: false });
  }
})


// Kirim status server
app.get('/api/server-status', (req, res) => {
  res.json({ status: 'Online' });
})

// Kirim (POST) data admin ke Postgres
app.post('/api/tambah-admin', async (req, res) => {
  const { nama, email, password } = req.body;
  const roles = 'admin'; // Manually set roles to 'admin'

  try {
    const client = await pool.connect()
    const result = await client.query('INSERT INTO "admin" (nama, email, password, tanggal, roles) VALUES ($1, $2, $3, NOW(), $4)', [nama, email, password, roles])
    client.release()

    if (result.rowCount === 1) {
      res.status(201).json({ message: `Admin ${nama} berhasil ditambahkan.` })
    } else {
      res.status(500).json({ error: 'Failed to add the account.' })
    }
  } catch (error) {
    console.error('Error menambahkan admin:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Kirim (POST) data user ke Postgres
app.post('/api/tambah-user', async (req, res) => {
  const { nama, email, password } = req.body;
  const roles = 'user';

  try {
    const client = await pool.connect();

    // Cek apakah ada user dengan nama yang sama
    const checkQuery = 'SELECT COUNT(*) FROM "user" WHERE nama = $1';
    const checkResult = await client.query(checkQuery, [nama]);

    if (checkResult.rows[0].count > 0) {
      // user dengan nama yang sama sudah ada
      client.release()

      return res.status(400).json({ error: `User ini ${nama} sudah ada` });
    }

    // Jika tidak ada maka lanjut masukkan data
    const insertQuery = 'INSERT INTO "user" (nama, email, password, tanggal, roles) VALUES ($1, $2, $3, NOW(), $4)';
    const insertResult = await client.query(insertQuery, [nama, email, password, roles]);

    client.release();

    if (insertResult.rowCount === 1) {
      res.status(201).json({ message: `User ${nama} berhasil ditambahkan.` });
    } else {
      res.status(500).json({ error: 'Gagal menambahkan akun user' });
    }
  } catch (error) {
    console.error('Error menambahkan user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ambil Detail Data Obat Generik berdasarkan row yang dipilih user
app.get('/api/obat-generik/:namaObat', async (req, res) => {
  const { namaObat } = req.params;

  try {
    const db = await connectToKatalogObatDB();
    const obatGenerikCollection = db.collection('obat_generik');

    // Nemuin obat pake nama obat
    const obat = await obatGenerikCollection.findOne({ namaObat });

    if (!obat) {
      return res.status(404).json({ error: 'Obat not found' });
    }

    res.json(obat);
  } catch (error) {
    console.error('Error fetching obat generik data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Set Port buat server
const port = process.env.PORT || 3001;
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  // Mulai Koneksi ke MongoDB saat server start
  // await connectToKasbonDB()

})

