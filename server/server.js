const express = require('express')
const { connectToKatalogObatDB } = require('./mongoDB')
const { connectToKasbonDB } = require('./mongoDB')
const cors = require('cors')
const session = require('express-session')
const pool = require('./postgres')

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
    secret: 'secret', // Change this to a more secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Define an API endpoint for authentication
app.post('/api/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const db = await connectToKasbonDB();
    const adminCollection = db.collection('admin');
    const userCollection = db.collection('user');

    // Check if the provided credentials match any user in the 'admin' collection
    const admin = await adminCollection.findOne({ name, password });
    if (admin) {
      req.session.user = admin; // Simpan informasi admin di session
      res.status(200).json({ role: 'admin' });

      return;
    }

    // Check if the provided credentials match any user in the 'user' collection
    const user = await userCollection.findOne({ name, password });
    if (user) {
      req.session.user = user; // Simpan informasi user di session
      res.status(200).json({ role: 'user' });

      return;
    }

    // Invalid credentials
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
});

// Kirim status server
app.get('/api/server-status', (req, res) => {
  res.json({ status: 'Online' });
});

// Kirim (POST) data obat_generik ke MongoDB
app.post('/api/add-obat-generik', async (req, res) => {

  const { namaObat, komposisi, kegunaanUtama, deskripsi, formula } = req.body;

  try {
    const db = await connectToKatalogObatDB();
    const obatGenerikCollection = db.collection('obat_generik');

    // Masukkan data obat generik ke collection MongoDB
    await obatGenerikCollection.insertOne({ namaObat, komposisi, kegunaanUtama, deskripsi, formula });

    res.status(201).json({ message: 'Obat added successfully' });
  } catch (error) {
    console.error('Error adding obat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Kirim (POST) data admin ke MongoDB
app.post('/api/add-akun', async (req, res) => {

  const { nama, email, password, roles } = req.body;

  try {
    const db = await connectToKasbonDB();
    const AkunCollection = db.collection('akun');

    // Masukkan data admin ke koleksi
    await AkunCollection.insertOne({ nama, email, password, roles });

    res.status(201).json({ message: `Akun ${nama} sebagai ${roles} berhasil ditambahkan.` });
  } catch (error) {
    console.error('Error menambahkan akun:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Kirim (POST) data admin ke Postgres
app.post('/api/tambah-akun', async (req, res) => {
  const { nama, email, password, roles } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO akun (nama, email, password, roles, tanggal) VALUES ($1, $2, $3, $4, NOW())', [nama, email, password, roles]);
    client.release();

    if (result.rowCount === 1) {
      res.status(201).json({ message: `Akun ${nama} sebagai ${roles} berhasil ditambahkan.` });
    } else {
      res.status(500).json({ error: 'Failed to add the account.' });
    }
  } catch (error) {
    console.error('Error adding akun:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})




// Kirim (POST) data user ke MongoDB
app.post('/api/add-user', async (req, res) => {

  const { nama, email, password } = req.body;

  try {
    const db = await connectToKasbonDB();
    const obatGenerikCollection = db.collection('user');

    // Masukkan data admin ke koleksi
    await obatGenerikCollection.insertOne({ nama, email, password });

    res.status(201).json({ message: `User ${nama} berhasil ditambahkan.` });
  } catch (error) {
    console.error('Error menambahkan user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Ambil data obat generik dari MongoDB
app.get('/api/obat-generik', async (req, res) => {
  try {
    const db = await connectToKatalogObatDB();
    const obatGenerikCollection = db.collection('obat_generik');
    const data = await obatGenerikCollection.find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error('Error fetching obat generik data:', error);
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
});

// Kirim (POST) data obat_herbal ke MongoDB
app.post('/api/add-obat-herbal', async (req, res) => {

  const { namaObat, komposisi, kegunaanUtama, deskripsi, latin } = req.body;

  try {
    const db = await connectToKatalogObatDB();
    const obatHerbalCollection = db.collection('obat_herbal');

    // memasukkan data Obat Herbal ke Collection MongoDB
    await obatHerbalCollection.insertOne({ namaObat, komposisi, kegunaanUtama, deskripsi, latin });

    res.status(201).json({ message: 'Obat herbal berhasil ditambahkan' });
  } catch (error) {
    console.error('Error adding obat herbal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ambil data obat herbal dari MongoDB
app.get('/api/obat-herbal', async (req, res) => {
  try {
    const db = await connectToKatalogObatDB();
    const obatHerbalCollection = db.collection('obat_herbal');
    const data = await obatHerbalCollection.find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error('Error fetching obat herbal data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ambil Detail Data Obat Herbal berdasarkan row yang dipilih user
app.get('/api/obat-herbal/:namaObat', async (req, res) => {
  const { namaObat } = req.params;

  try {
    const db = await connectToKatalogObatDB();
    const obatGenerikCollection = db.collection('obat_herbal');

    // Nemuin obat pake nama obat
    const obat = await obatGenerikCollection.findOne({ namaObat });

    if (!obat) {
      return res.status(404).json({ error: 'Nama Obat Tidak Ditemukan' });
    }

    res.json(obat);
  } catch (error) {
    console.error('Error fetching obat generik data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set Port buat server
const port = process.env.PORT || 3001;
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  // Mulai Koneksi ke MongoDB saat server start
  await connectToKasbonDB()

})

