const express = require('express')
const { connectToKatalogObatDB, client } = require('./mongoDB')
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

// Kirim status server
app.get('/api/server-status', (req, res) => {
  res.json({ status: 'Online' });
})

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
  const jakartaTimezone = 'Asia/Jakarta';

  try {
    const client = await pool.connect();

    // Check user credentials in the user_kasbon table
    const userQuery = 'SELECT id_user, nama_user, email_user, tanggal, roles_user, id_karyawan FROM user_kasbon WHERE id_karyawan = $1 AND password_user = $2';
    const userResult = await client.query(userQuery, [idakun, password]);

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('User login data:', user);

      // Ensure that req.session.user is an object
      if (!req.session.user) {
        req.session.user = {};
      }
      const tanggalAkun = new Date(user.tanggal);
      const tanggalFormat = tanggalAkun.toLocaleString('id-ID', { timeZone: jakartaTimezone });

      req.session.user = {
        id: user.id_user,
        username: user.nama_user, // Add the 'username' field
        email: user.email_user,
        roles: user.roles_user,
        isAdmin: false,
        tanggal_akun: tanggalFormat,
      };

      client.release();

      res.status(200).json({
        id: user.id_user,
        username: user.nama_user,
        email: user.email_user,
        roles: user.roles_user,
        isAdmin: false,
        id_akun: user.id_karyawan,
        tanggal_akun: user.tanggal,
      });

      console.log('Session User Data:', req.session.user);

      return;
    }

    // Check admin credentials in the admin_kasbon table
    const adminQuery = 'SELECT id_admin, nama_admin, email_admin, tanggal, roles_admin, id_petugas FROM admin_kasbon WHERE id_petugas = $1 AND password_admin = $2';
    const adminResult = await client.query(adminQuery, [idakun, password]);

    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];

      // Ensure that req.session.admin is an object
      if (!req.session.admin) {
        req.session.admin = {};
      }
      const tanggalAkun = new Date(admin.tanggal);
      const tanggalFormat = tanggalAkun.toLocaleString('id-ID', { timeZone: jakartaTimezone });

      req.session.admin = {
        id: admin.id_admin,
        username: admin.nama_admin,
        email: admin.email_admin,
        roles: admin.roles_admin,
        isAdmin: true,
        id_akun: admin.id_petugas,
        tanggal_akun: tanggalFormat,
      };

      client.release();

      res.status(200).json({
        id: admin.id_admin,
        username: admin.nama_admin,
        email: admin.email_admin,
        roles: admin.roles_admin,
        isAdmin: true,
        id_akun: admin.id_petugas,
        tanggal_akun: admin.tanggal,
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

// Tambah Akun User/Karyawan
app.post('/api/tambah-user', async (req, res) => {
  const { nama, email, password, id_karyawan } = req.body
  const roles = 'user'

  try {
    const client = await pool.connect()

    // Cek apakah ada user dengan nama yang sama
    const checkQuery = 'SELECT COUNT(*) FROM "user_kasbon" WHERE id_karyawan = $1 AND nama_user = $2'
    const checkResult = await client.query(checkQuery, [nama, id_karyawan])

    if (checkResult.rows[0].count > 0) {
      // user dengan nama yang sama sudah ada
      client.release();

      return res.status(400).json({ error: `Id ${id_karyawan} - ${nama} sudah ada` })
    }

    // Jika tidak ada maka lanjut masukkan data
    const insertQuery = 'INSERT INTO user_kasbon (nama_user, email_user, password_user, tanggal, roles_user, id_karyawan) VALUES ($1, $2, $3, NOW(), $4, $5)'
    const insertResult = await client.query(insertQuery, [nama, email, password, roles, id_karyawan])

    client.release();

    if (insertResult.rowCount === 1) {
      res.status(201).json({ message: `User: ${nama} Id: ${id_karyawan} berhasil ditambahkan.` })
    } else {
      res.status(500).json({ error: 'Gagal menambahkan akun user' })
    }
  } catch (error) {
    console.error('Error menambahkan user:', error);
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// API Input Kasbon Karyawan
app.post('/api/input-kasbon', async (req, res) => {

  const { jumlah, metode, keterangan, id_akun } = req.body
  const request_status = 'wait'

  try {
    const client = await pool.connect()

    const insertQuery = 'INSERT INTO request (jumlah, metode, tanggaljam, id_karyawan, status_request, keterangan)  VALUES ($1, $2, NOW(), $3, $4, $5)'
    const insertResult = await client.query(insertQuery, [jumlah, metode, id_akun, request_status, keterangan])

    client.release()

    if (insertResult.rowCount === 1) {
      res.status(201).json({ message: `Kasbon Akun Id: ${id_akun} berhasil dimasukkan ` })
      console.log('Berhasil mengirim Request Akun', id_akun)
    }
    else {
      res.status(500).json({ error: `Error memasukkan kasbon ${id_akun} ` })
    }
  }
  catch (error) {
    console.error('Error menambahkan kasbon', error)
    res.status(500).json({ error: `Internal Server Error` })
  }
})

// Ambil Data dashboard karyawan berdasarkan id_akun
app.get('/api/ambil-dashboard-karyawan/:id_akun', async (req, res) => {
  const { id_akun } = req.params;
  try {
    const client = await pool.connect();

    // Query ambil data dashboard karyawan
    const selectQuery = 'SELECT * FROM dashboard_karyawan WHERE id_karyawan = $1';
    const selectResult = await client.query(selectQuery, [id_akun]);
    client.release();


    // Jika ada hasil, maka kirim responnya hasil query
    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows);
    } else {

      // Jika tidak ada data
      res.status(404).json({ message: 'Data tidak ada' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

// API Admin Edit/Konfirmasi Request Kasbon
app.get('/api/ambil-request-kasbon', async (req, res) => {
  try {
    const client = await pool.connect()

    //Ambil data Dashboard Karyawan dengan status request 'wait'
    const selectQuery = 'SELECT * FROM dashboard_karyawan WHERE status_request = \'wait\'';
    const selectResult = await client.query(selectQuery)

    // Jika ada hasil, maka kirim responnya hasil query
    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows);
    } else {

      // Jika tidak ada data
      res.status(404).json({ message: 'Tidak ada request menunggu konfirmasi' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

// API upadate Request berdasarkan id_request
app.put('/api/update-request/:id_request', async (req, res) => {
  const requestId = req.params.id_request;
  const { status_request, id_petugas } = req.body;

  //const id_petugas = req.session.admin.id_akun;

  try {
    const client = await pool.connect();

    // Update the request in your database using SQL
    const updateQuery = 'UPDATE request SET status_request = $1, id_petugas = $2, tanggaljam = NOW() WHERE id_request = $3';
    const updateValues = [status_request, id_petugas, requestId];
    const updateResult = await client.query(updateQuery, updateValues);

    client.release();

    if (updateResult.rowCount === 1) {
      res.status(200).json({ message: 'Request berhasil diupdate' });
      console.log('Update request berhasil')
    } else {
      res.status(404).json({ error: 'Request tidak ditemukan' });
      console.log('Update Request tidak ditemukan data')
    }
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Internal Server Error' })
    console.log('Update Request tidak berhasil')
  }
});

// API Ambil data untuk halaman Bayar
app.post('/api/ambil-data-bayar', async (req, res) => {
  const id_karyawan = req.body

  try {
    const client = await pool.connect()

    const selectQuery = 'SELECT * FROM dashbaoard_karyawan WHERE status_request = \'sukses\' AND id_karyawan = $1'
    const selectResult = await client.query(selectQuery, [id_karyawan])
    client.release()

    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows)
    } else {
      res.status(404).json({ message: 'Tidak ada data bayar menunggu konfirmasi' })
    }


  }
  catch (error) {

  }

})

// Set Port buat server
const port = process.env.PORT || 3001;
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  await PostgresStatus()

})

