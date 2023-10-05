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
  const { username, password } = req.body;

  try {
    const client = await pool.connect();

    // Check user credentials in the user_kasbon table
    const userQuery = 'SELECT id_user, nama_user, email_user, roles_user FROM user_kasbon WHERE nama_user = $1 AND password_user = $2';
    const userResult = await client.query(userQuery, [username, password]);

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
        roles: user.roles_user,
        isAdmin: false,
      });

      console.log('Session User Data:', req.session.user);

      return;
    }

    // Check admin credentials in the admin_kasbon table
    const adminQuery = 'SELECT id_admin, nama_admin, email_admin, roles_admin FROM admin_kasbon WHERE nama_admin = $1 AND password_admin = $2';
    const adminResult = await client.query(adminQuery, [username, password]);

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
      };

      client.release();

      res.status(200).json({
        roles: admin.roles_admin,
        isAdmin: true,
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
    const result = await client.query('INSERT INTO admin_kasbon (nama_admin, email_admin, password_admin, tanggal, roles_admin) VALUES ($1, $2, $3, NOW(), $4)', [nama, email, password, roles])
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
    const checkQuery = 'SELECT COUNT(*) FROM "user_kasbon" WHERE nama_user = $1';
    const checkResult = await client.query(checkQuery, [nama]);

    if (checkResult.rows[0].count > 0) {
      // user dengan nama yang sama sudah ada
      client.release()

      return res.status(400).json({ error: `User ini ${nama} sudah ada` });
    }

    // Jika tidak ada maka lanjut masukkan data
    const insertQuery = 'INSERT INTO user_kasbon (nama_user, email_user, password_user, tanggal, roles_user) VALUES ($1, $2, $3, NOW(), $4)';
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
  await PostgresStatus()

})

