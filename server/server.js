const express = require('express')
const { connectToKatalogObatDB } = require('./mongoDB')
const cors = require('cors')
const session = require('express-session')
const { pool, PostgresStatus } = require('./postgres')
const cookieParser = require('cookie-parser')
const pgSession = require('connect-pg-simple')(session)

const app = express()

// Express JS
app.use(express.json())
app.use(cookieParser())


// Configure express-session for session management
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: 'sessions',
    }),
    secret: 'zXBVUQI0XCO24vcOc7leDCRJDI26QvSN',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);


const corsOptions = {
  origin: 'http://localhost:3000', // Be cautious when using '*' in a production environment.
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions))

// Clear semua session data
app.get('/api/clear-sessions', async (req, res) => {
  try {
    const client = await pool.connect();
    const clearSessionsQuery = 'DELETE FROM sessions';
    await client.query(clearSessionsQuery);
    client.release();
    res.send('Session data cleared');
  } catch (error) {
    console.error('Error clearing session data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Logout
app.get('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Redirect to the login page after successful logout
      res.status(200).json({ message: 'Logged out successfully' });
    }
  });
})

// API Masuk
app.post('/api/masuk', async (req, res) => {
  const { idakun, password } = req.body;

  try {
    const client = await pool.connect();

    // Check user credentials in the user_kasbon table
    const userQuery = 'SELECT id_user, nama_user, email_user, roles_user, id_karyawan FROM user_kasbon WHERE id_karyawan = $1 AND password_user = $2';
    const userResult = await client.query(userQuery, [idakun, password]);

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('User login data:', user);

      // Ensure that req.session.user is an object
      if (!req.session.user) {
        req.session.user = {};
      }

      req.session.user = {
        id: user.id_user,
        username: user.nama_user, // Add the 'username' field
        email: user.email_user,
        roles: user.roles_user,
        isAdmin: false,
      };

      client.release();

      res.status(200).json({
        id: user.id_user,
        username: user.nama_user,
        email: user.email_user,
        roles: user.roles_user,
        isAdmin: false,
        id_akun: user.id_karyawan,
      });

      console.log('Session User Data:', req.session.user);

      return;
    }

    // Check admin credentials in the admin_kasbon table
    const adminQuery = 'SELECT id_admin, nama_admin, email_admin, roles_admin, id_petugas FROM admin_kasbon WHERE id_petugas = $1 AND password_admin = $2';
    const adminResult = await client.query(adminQuery, [idakun, password]);

    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];

      // Ensure that req.session.admin is an object
      if (!req.session.admin) {
        req.session.admin = {};
      }

      req.session.admin = {
        id: admin.id_admin,
        username: admin.nama_admin,
        email: admin.email_admin,
        roles: admin.roles_admin,
        isAdmin: true,
        id_akun: admin.id_petugas,
      };

      client.release();

      res.status(200).json({
        id: admin.id_admin,
        username: admin.nama_admin,
        email: admin.email_admin,
        roles: admin.roles_admin,
        isAdmin: true,
        id_akun: admin.id_petugas,
      });

      console.log('Session Admin Data:', req.session.admin);

      return;
    }

    // Invalid credentials
    client.release();
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/get-session', async (req, res) => {
  // Log the session ID for debugging
  console.log('Session ID:', req.sessionID);

  // Check the user's role and retrieve the session data from the corresponding session object
  if (req.session.user) {
    sessionUser = req.session.user;

    res.json(sessionUser);
  } else if (req.session.admin) {
    sessionAdmin = req.session.admin;

    res.json(sessionAdmin);
  } else {

    res.json({ error: 'Session data not found' });
  }
});

// Kirim Status PostgreSQL
app.get('/api/postgres-status', async (req, res) => {
  try {
    // cek postgresql status
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

// Tambah Akun Admin
app.post('/api/tambah-admin', async (req, res) => {
  const { nama, email, password, id_petugas } = req.body
  const roles = 'admin'

  try {
    const client = await pool.connect()

    // Cek apakah ada admin dengan nama dan id yang sama
    const checkQuery = 'SELECT COUNT(*) FROM "admin_kasbon" WHERE id_petugas = $1 AND nama_admin = $2'
    const checkResult = await client.query(checkQuery, [id_petugas, nama])

    if (checkResult.rows[0].count > 0) {
      // ada admin dengan nama dan id yang sama
      client.release()

      return res.status(400).json({ error: `Id ${id_petugas} - ${nama} sudah ada` })
    }

    // Lanjut jika tidak ada

    const insertQuery = 'INSERT INTO admin_kasbon (nama_admin, email_admin, password_admin, tanggal, roles_admin, id_petugas) VALUES ($1, $2, $3, NOW(), $4, $5)';
    const insertResult = await client.query(insertQuery, [nama, email, password, roles, id_petugas])

    client.release()

    if (insertResult.rowCount === 1) {
      res.status(201).json({ message: `Admin ${nama} ID : ${id_petugas} berhasil ditambahkan.` })
    } else {
      res.status(500).json({ error: 'Gagal menambahkan akun admin.' })
    }
  } catch (error) {
    console.error('Error menambahkan admin:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Tambah Akun User
app.post('/api/tambah-user', async (req, res) => {
  const { nama, email, password, id_karyawan } = req.body;
  const roles = 'user';

  try {
    const client = await pool.connect();

    // Cek apakah ada user dengan nama yang sama
    const checkQuery = 'SELECT COUNT(*) FROM "user_kasbon" WHERE id_karyawan = $4 AND nama_user = $1';
    const checkResult = await client.query(checkQuery, [nama, id_karyawan]); // Include `nama` and `id_karyawan` in the correct order

    if (checkResult.rows[0].count > 0) {
      // ada user dengan nama dan id yang sama
      client.release();

      return res.status(400).json({ error: `Id ${id_karyawan} - ${nama} sudah ada` });
    }

    // Jika tidak ada maka lanjut masukkan data
    const insertQuery = 'INSERT INTO user_kasbon (nama_user, email_user, password_user, tanggal, roles_user, id_karyawan) VALUES ($1, $2, $3, NOW(), $4, $5)';
    const insertResult = await client.query(insertQuery, [nama, email, password, roles, id_karyawan]);

    client.release();

    if (insertResult.rowCount === 1) {
      res.status(201).json({ message: `User: ${nama} Id: ${id_karyawan} berhasil ditambahkan.` });
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
  await PostgresStatus()

})

