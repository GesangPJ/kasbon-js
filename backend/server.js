const express = require('express')
const cors = require('cors')
const session = require('express-session')
const { pool, PostgresStatus } = require('./postgres')
const cookieParser = require('cookie-parser')
const pgSession = require('connect-pg-simple')(session)
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const PizZip = require("pizzip")
const Docxtemplater = require("docxtemplater")
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const http = require('http')
const logDirectory = 'logs'
const winston = require('winston')
const expressWinston = require('express-winston')
const dayjs = require('dayjs')

const allowedOrigins = process.env.CORS_ORIGINS.split(',')
const PREFLIGHT = process.env.PREFLIGHT

const logFilePath = path.join(logDirectory, `kasbon-backend-${new Date().toISOString().replace(/[:.]/g, '-')}.log`)




const app = express()
dotenv.config()
const server = http.createServer(app)

// Express JS
app.use(express.json())
app.use(cookieParser())


// Konfigurasi express-session untuk kelola session (Express-session management)
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: 'sessions',
    }),

    // Pengaturan session dan cookie
    secret: '4MOS7PnCkw51C4c03Y0QB4UJOoiemF1t',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
)

const logsDirectory = path.join(__dirname, 'logs')
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory)
}

// Create a custom timestamp format for log filenames
const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss')

// Create a log file with a dynamic filename
const logFileName = path.join(logsDirectory, `Kasbon-backend-${timestamp}.log`)

// Create a custom Winston format that includes the timestamp
const customFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`
})

// Configure Winston to write logs to the file
winston.configure({
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat
  ),
  transports: [
    new winston.transports.File({ filename: logFileName }),
  ],
})

// Set up a console transport for Winston to log to the terminal
winston.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      customFormat
    ),
  })
)

// Set up logging for Express.js requests and errors
app.use(expressWinston.logger({
  winstonInstance: winston,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
}))

// Your routes and other middleware

// Set up error logging
app.use(expressWinston.errorLogger({
  winstonInstance: winston,
}))

// Error handling middleware
app.use((err, req, res, next) => {
  // Handle errors and log them as needed
  winston.error(err.message, err)

  // Send an error response to the client
  res.status(500).json({ error: 'Internal Server Error' })
})

// Override console.log to log to both the file and the terminal
const logFileStream = fs.createWriteStream(logFileName, { flags: 'a' })
console.log = function (message) {
  const logMessage = `${dayjs().format()} [info]: ${message}`
  logFileStream.write(logMessage + '\n')
  winston.info(message) // Log it using Winston
}

// Menentukan izin akses ke server API
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: PREFLIGHT,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))

// CSRF Token Generator
function generateCSRFToken() {
  return uuidv4()
}

// Kirim status server
app.get('/api/server-status', (req, res) => {
  res.json({ status: 'Online' })
})

// Hapus semua session data di table session postgres
app.get('/api/clear-sessions', CekAPIKey, async (req, res) => {
  try {
    const client = await pool.connect()
    const clearSessionsQuery = 'DELETE FROM sessions'
    await client.query(clearSessionsQuery)
    client.release()
    res.send('Session data cleared')
  } catch (error) {
    console.error('Error clearing session data:', error)
    res.status(500).send('Internal Server Error')
  }
})

// API Auth pakai API KEY
function CekAPIKey(req, res, next) {
  const apiKey = req.header('Key-Api')

  if (!apiKey) {
    return res.status(401).json({ error: 'Access Denied' })
  }

  // Cek apakah API Dari frontend sama 
  const validApiKey = process.env.API_ACCESS_KEY // Ambil API KEY Dari ENV

  // Jika Key tidak sama, larang akses
  if (apiKey !== validApiKey) {
    return res.status(403).json({ error: 'Access Denied' })
  }

  // Jika valid, lanjut
  next()
}

//Bcrypt cek password
const checkPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

// API Masuk
app.post('/api/masuk', CekAPIKey, async (req, res) => {
  const { idakun, password } = req.body
  const jakartaTimezone = 'Asia/Jakarta'

  try {

    // Koneksi ke PostgreSQL
    const client = await pool.connect()

    // Cek kredensial pada tabel user_kasbon
    const userQuery = 'SELECT id_user, nama_user, email_user, tanggal, roles_user, password_user, id_karyawan FROM user_kasbon WHERE id_karyawan = $1'
    const userResult = await client.query(userQuery, [idakun])

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0]
      const passwordMatch = await checkPassword(password, user.password_user)


      if (passwordMatch) {
        console.log('Password Match!')

        // Pastikan bahwa session adalah objek
        if (!req.session.user) {
          req.session.user = {}
        }
        const tanggalAkun = new Date(user.tanggal)
        const tanggalFormat = tanggalAkun.toLocaleString('id-ID', { timeZone: jakartaTimezone })
        const csrfToken = generateCSRFToken()
        req.session.csrfToken = csrfToken

        // Simpan session ke backend
        req.session.user = {
          id: user.id_user,
          username: user.nama_user,
          email: user.email_user,
          roles: user.roles_user,
          isAdmin: false,
          id_akun: user.id_karyawan,
          tanggal_akun: tanggalFormat,
          csrfToken,
        }

        client.release()

        // Jika sukses, kirim respon status dan kirim data session ke frontend
        res.status(200).json({
          id: user.id_user,
          username: user.nama_user,
          email: user.email_user,
          roles: user.roles_user,
          isAdmin: false,
          id_akun: user.id_karyawan,
          tanggal_akun: user.tanggal,
          csrfToken,
        })
        console.log('Session User Data:', req.session.user)
        console.log('Password Match!')

      } else {
        // Password does not match
        client.release()
        console.log(`Password atau ID Salah`)
        res.status(401).json({ error: 'Invalid credentials' })
      }
      return
    }

    // Cek kredensial untuk tabel admin_kasbon
    const adminQuery = 'SELECT id_admin, nama_admin, email_admin, tanggal, roles_admin, password_admin, id_petugas FROM admin_kasbon WHERE id_petugas = $1'
    const adminResult = await client.query(adminQuery, [idakun])

    // Jika Data ditemukan
    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0]
      const passwordMatch = await checkPassword(password, admin.password_admin)

      if (passwordMatch) {
        // Pastikan bahwa session adalah objek
        if (!req.session.admin) {
          req.session.admin = {}
        }
        const tanggalAkun = new Date(admin.tanggal)
        const tanggalFormat = tanggalAkun.toLocaleString('id-ID', { timeZone: jakartaTimezone })
        const csrfToken = generateCSRFToken()
        req.session.csrfToken = csrfToken

        req.session.admin = {
          id: admin.id_admin,
          username: admin.nama_admin,
          email: admin.email_admin,
          roles: admin.roles_admin,
          isAdmin: true,
          id_akun: admin.id_petugas,
          tanggal_akun: tanggalFormat,
          csrfToken,
        }

        client.release()

        // Jika sukses, kirim respon status dan kirim data session ke frontend
        res.status(200).json({
          id: admin.id_admin,
          username: admin.nama_admin,
          email: admin.email_admin,
          roles: admin.roles_admin,
          isAdmin: true,
          id_akun: admin.id_petugas,
          tanggal_akun: admin.tanggal,
          csrfToken,
        })

        console.log('Session Admin Data:', req.session.admin)
        console.log('Password Match!')

      } else {
        // Password does not match
        client.release()
        console.log(`Password atau ID Salah`)
        res.status(401).json({ error: 'Invalid credentials' })
        console.log(`Invalid credentials`)
      }
      return
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

//API Keluar (Logout)
app.post('/api/keluar', async (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    } else {
      const id_akun = req.body.id_akun
      // Redirect to the login page after successful logout
      res.status(200).json({ message: `Akun ${id_akun} Berhasil Log Out` })
      console.log(`Akun ${id_akun} Berhasil Log Out`)

    }
  })

})

// API Ambil session
app.get('/api/get-session', async (req, res) => {
  // Debug Session ID
  console.log('Session ID:', req.sessionID)

  // cek role akun dan ambil data session sesuai role
  if (req.session.user) {
    sessionUser = req.session.user

    res.json(sessionUser)
  } else if (req.session.admin) {
    sessionAdmin = req.session.admin

    res.json(sessionAdmin)
  } else {

    // Jika tidak ketemu, kirim pesan
    res.json({ error: 'Session data tidak ditemukan!' })
  }
})

// Kirim Status PostgreSQL
app.get('/api/postgres-status', async (req, res) => {
  try {
    // cek postgresql status
    await PostgresStatus()

    // Respond with a JSON status
    res.json({ isConnected: true })
  } catch (error) {
    console.error('Error checking PostgreSQL status:', error)
    res.json({ isConnected: false })
  }
})

// Tambah Akun Admin
app.post('/api/tambah-admin', async (req, res) => {
  const { nama, email, password, id_petugas } = req.body
  const roles = 'admin'

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const client = await pool.connect()

    // Cek apakah ada admin dengan nama dan id yang sama
    const checkQuery = 'SELECT COUNT(*) FROM "admin_kasbon" WHERE id_petugas = $1'
    const checkResult = await client.query(checkQuery, [id_petugas])

    if (checkResult.rows[0].count > 0) {
      // ada admin dengan nama dan id yang sama
      client.release()

      return res.status(400).json({ error: `Id ${id_petugas} - ${nama} sudah ada` })
    }

    // Lanjut jika tidak ada
    const insertQuery = 'INSERT INTO admin_kasbon (nama_admin, email_admin, password_admin, tanggal, roles_admin, id_petugas) VALUES ($1, $2, $3, NOW(), $4, $5)'
    const insertResult = await client.query(insertQuery, [nama, email, hashedPassword, roles, id_petugas])

    client.release()

    if (insertResult.rowCount === 1) {
      res.status(201).json({ message: `Admin ${nama} ID : ${id_petugas} berhasil ditambahkan.` })

    } else {
      res.status(500).json({ error: 'Gagal menambahkan akun admin.' })
      console.log('Gagal menambahkan Akun Admin')

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
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const client = await pool.connect()

    // Cek apakah ada user dengan nama yang sama
    const checkQuery = 'SELECT COUNT(*) FROM "user_kasbon" WHERE id_karyawan = $1'
    const checkResult = await client.query(checkQuery, [id_karyawan])

    if (checkResult.rows[0].count > 0) {
      // user dengan nama yang sama sudah ada
      client.release()
      console.log(`Sudah ada akun karyawan dengan ID yang sama`)
      return res.status(400).json({ error: `Id ${id_karyawan} - ${nama} sudah ada` })

    }

    // Jika tidak ada maka lanjut masukkan data
    const insertQuery = 'INSERT INTO user_kasbon (nama_user, email_user, password_user, tanggal, roles_user, id_karyawan) VALUES ($1, $2, $3, NOW(), $4, $5)'
    const insertResult = await client.query(insertQuery, [nama, email, hashedPassword, roles, id_karyawan])

    client.release()

    if (insertResult.rowCount === 1) {
      res.status(201).json({ message: `User: ${nama} Id: ${id_karyawan} berhasil ditambahkan.` })
      console.log(`Akun ${id_karyawan} berhasil dibuat`)

    } else {
      res.status(500).json({ error: 'Gagal menambahkan akun user' })
      console.log(`Gagal membuat akun ${id_karyawan}`)

    }
  } catch (error) {
    console.error('Error menambahkan user:', error)
    res.status(500).json({ error: 'Internal Server Error' })

  }
})

// API Input Kasbon Karyawan
app.post('/api/input-kasbon', async (req, res) => {

  const { jumlah, metode, keterangan, id_akun } = req.body
  const request_status = 'wait'
  const status_b = 'belum'

  try {
    const client = await pool.connect()

    const insertQuery = 'INSERT INTO request (jumlah, metode, tanggaljam, id_karyawan, status_request, keterangan, status_b)  VALUES ($1, $2, NOW(), $3, $4, $5, $6)'
    const insertResult = await client.query(insertQuery, [jumlah, metode, id_akun, request_status, keterangan, status_b])

    client.release()

    if (insertResult.rowCount === 1) {
      res.status(201).json({ message: `Kasbon Akun Id: ${id_akun} berhasil dimasukkan ` })
      console.log('Berhasil mmembuat request kasbon :', id_akun)

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
  const { id_akun } = req.params
  try {
    const client = await pool.connect()

    // Query ambil data dashboard karyawan
    const selectQuery = 'SELECT * FROM dashboard_komplit WHERE id_karyawan = $1'
    const selectResult = await client.query(selectQuery, [id_akun])
    client.release()


    // Jika ada hasil, maka kirim responnya hasil query
    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows)
    } else {

      // Jika tidak ada data
      res.status(404).json({ message: 'Data tidak ada' })
      console.log(`Tidak ditemukan data akun ${id_akun} di dashboard karyawan`)

    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })

  }
})

// API Admin Edit/Konfirmasi Request Kasbon
app.get('/api/ambil-request-kasbon', async (req, res) => {
  try {
    const client = await pool.connect()

    //Ambil data Dashboard Karyawan dengan status request 'wait'
    const selectQuery = 'SELECT * FROM dashboard_komplit WHERE status_request = \'wait\''
    const selectResult = await client.query(selectQuery)

    client.release()

    // Jika ada hasil, maka kirim responnya hasil query
    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows)

    } else {
      res.status(404).json({ message: 'Tidak ada request menunggu konfirmasi' })
      console.log(`Tidak ada request kasbon menunggu`)

    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
    console.log(`Error mengambil request kasbon`)

  }
})

// API upadate Request berdasarkan id_request
app.put('/api/update-request/:id_request', async (req, res) => {
  const requestId = req.params.id_request
  const { status_request, id_petugas } = req.body

  try {
    // Buka koneksi ke Postgres
    const client = await pool.connect()

    // Query Update request
    const updateQuery = 'UPDATE request SET status_request = $1, id_petugas = $2, status_b=\'belum\', tanggaljam = NOW() WHERE id_request = $3'
    const updateValues = [status_request, id_petugas, requestId]
    const updateResult = await client.query(updateQuery, updateValues)

    client.release()

    if (updateResult.rowCount === 1) {
      // Jika sukses
      res.status(200).json({ message: 'Request berhasil diupdate' })
      console.log(`Update request ${requestId}  berhasil`)

    } else {
      // Jika tidak menemukan data yang tepat
      res.status(404).json({ error: 'Request tidak ditemukan' })
      console.log('Update Request tidak ditemukan data')
    }
  } catch (error) {
    console.error('Error updating request:', error)
    res.status(500).json({ error: 'Internal Server Error' })
    console.log('Update Request tidak berhasil')
  }
})

//API Update request secara bersamaan
app.post('/api/update-requests/:id_request', async (req, res) => {
  const requestId = req.params.id_request
  const requestsToUpdate = req.body.requests // Yang masuk adalah array beberapa request

  try {
    // Buka koneksi ke Postgres
    const client = await pool.connect()

    for (const request of requestsToUpdate) {
      const { status_request, id_petugas } = request

      // Query Update request
      const updateQuery = 'UPDATE request SET status_request = $1, id_petugas = $2, status_b=\'belum\', tanggaljam = NOW() WHERE id_request = $3'
      const updateValues = [status_request, id_petugas, requestId]

      const updateResult = await client.query(updateQuery, updateValues)

      if (updateResult.rowCount === 1) {
        // Jika sukses
        console.log(`Request with ID ${requestId} updated successfully`)

      } else {
        // Jika tidak menemukan data yang tepat
        console.log(`Request with ID ${requestId} not found`)

      }
    }

    client.release()

    res.status(200).json({ message: 'Requests updated successfully' })
    console.log(`Berhasil update status request bersamaan`)


  } catch (error) {
    console.error('Error updating requests:', error)
    res.status(500).json({ error: 'Internal Server Error' })
    console.log(`Gagal update status request bersamaan`)

  }
})


// API Ambil data untuk halaman Bayar
app.post('/api/ambil-data-bayar', CekAPIKey, async (req, res) => {
  const id_karyawan = req.body.id_karyawan

  try {
    const client = await pool.connect()

    const selectQuery = 'SELECT * FROM dashboard_komplit WHERE status_request = \'sukses\' AND id_karyawan = $1'
    const selectResult = await client.query(selectQuery, [id_karyawan])

    client.release()

    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows)

    } else {
      res.status(404).json({ message: 'Tidak ada data bayar menunggu konfirmasi' })
      console.log(`Tidak ditemukan data kasbon untuk bayar`)
    }
  }
  catch (error) {
    console.error('Error :', error)

  }

})

// API Ambil data request untuk di download
app.post('/api/ambil-request-download', CekAPIKey, async (req, res) => {
  const id_karyawan = req.body.id_karyawan

  try {
    const client = await pool.connect()

    const selectQuery = 'SELECT * FROM dashboard_komplit WHERE status_request = \'sukses\' AND status_b = \'belum\' AND id_karyawan = $1'
    const selectResult = await client.query(selectQuery, [id_karyawan])

    client.release()

    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows)

    } else {
      res.status(404).json({ message: 'Tidak ada data request' })
      console.log(`Tidak ditemukan data request kasbon`)

    }
  }
  catch (error) {
    console.error('Error :', error)

  }

})

// API Ambil data request untuk di download
app.post('/api/ambil-bayar-download', CekAPIKey, async (req, res) => {
  const id_karyawan = req.body.id_karyawan

  try {
    const client = await pool.connect()

    const selectQuery = 'SELECT * FROM dashboard_komplit WHERE status_request = \'sukses\' AND status_b = \'lunas\' AND id_karyawan = $1'
    const selectResult = await client.query(selectQuery, [id_karyawan])

    client.release()

    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows)

    } else {
      res.status(404).json({ message: `ID : ${id_karyawan} tidak ada kasbon yang lunas ` })
      console.log(`ID : ${id_karyawan} tidak ditemukan kasbon sudah lunas`)

    }
  }
  catch (error) {
    console.error('Error :', error)

  }

})

// API Dashboard Admin (Menggunakan VIEW dashboard_komplit)
app.get('/api/ambil-dashboard-komplit', CekAPIKey, async (req, res) => {

  try {
    const client = await pool.connect()

    const selectQuery = 'SELECT * FROM dashboard_komplit'
    const selectResult = await client.query(selectQuery)

    client.release()

    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows)

    } else {
      res.status(404).json({ message: 'Tidak ada data, harap hubungi admin' })

    }
  }
  catch (error) {
    console.error('Error Ambil dashboard_komplit :', error)

  }
})

//API Tambah Bayar
app.put('/api/edit-bayar/:id_request', async (req, res) => {

  const { status_b, id_petugas } = req.body
  const requestId = req.params.id_request

  try {
    const client = await pool.connect()

    const updateQuery = 'UPDATE request SET status_b = $1, id_petugas = $2, tanggaljam=NOW() WHERE id_request = $3'
    const updateValues = [status_b, id_petugas, requestId]
    const updateResult = await client.query(updateQuery, updateValues)

    client.release()

    if (updateResult.rowCount === 1) {
      res.status(200).json({ message: 'Pembayaran berhasil diubah' })
      console.log('Update bayar berhasil')

    } else {
      res.status(404).json({ error: 'Request tidak ditemukan' })
      console.log('Update bayar tidak ditemukan data')

    }
  }
  catch (error) {
    console.error('Error update bayar :', error)
    res.status(500).json({ error: 'Internal Server Error' })
    console.log('Update bayar tidak berhasil')

  }
})

// API update data bayar sekaligus
app.put('/api/edit-bayar-batch', CekAPIKey, async (req, res) => {
  const updates = req.body.requests // Array update dari frontend

  try {

    //Buka koneksi ke Postgres
    const client = await pool.connect()

    // Membuat array untuk menyimpan promise setiap update
    const updatePromises = updates.map(async (update) => {
      const { status_b, id_petugas, id_request } = update

      // Query Update tabel request
      const updateQuery = 'UPDATE request SET status_b = $1, id_petugas = $2, tanggaljam = NOW() WHERE id_request = $3'
      const updateValues = [status_b, id_petugas, id_request]
      const updateResult = await client.query(updateQuery, updateValues)

      if (updateResult.rowCount !== 1) {
        //Jika Error
        return { error: 'Failed to update request with id ' + id_request }
      }

      return null // Update sukses
    })

    // Menunggu semua update selesai
    const updateResults = await Promise.all(updatePromises)

    // Cek apakah ada error
    const errors = updateResults.filter((result) => result && result.error)

    if (errors.length > 0) {
      // Jika gagal update
      res.status(500).json({ errors })
    } else {
      // Saat update sukses
      res.status(200).json({ message: 'Batch update data bayar berhasil' })
      console.log(`Berhasil update status bayar bersamaan`)


    }
  } catch (error) {
    console.error('Error batch update bayar :', error)
    res.status(500).json({ error: 'Internal Server Error' })

  }
})

// Download Request Kasbon
app.post('/api/download-request', CekAPIKey, async (req, res) => {
  const { id_request, nama_user, jumlah, metode, tanggaljam, keterangan } = req.body

  const DateTime = new Date()

  const formatTanggaljam = (tanggaljam) => {
    const jakartaTimezone = 'Asia/Jakarta'
    const utcDate = new Date(tanggaljam)
    const options = { timeZone: jakartaTimezone, hour12: false }

    return utcDate.toLocaleString('id-ID', options)
  }
  try {
    const content = fs.readFileSync(
      path.resolve(__dirname, "template_request.docx"),
      "binary"
    )

    const zip = new PizZip(content)

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })
    doc.render({
      id_request: id_request,
      nama_user: nama_user,
      jumlah: jumlah,
      metode: metode,
      keterangan: keterangan,
      tanggaljam: tanggaljam,
      status_q: 'Sukses',
      current_datetime: formatTanggaljam(DateTime)
    })

    const buffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    })

    if (buffer) {
      res.setHeader('Content-Disposition', `attachment filename=kasbon-${nama_user}-${id_request}.docx`)
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      res.setHeader('Content-Length', buffer.length)
      res.send(buffer)
      console.log(`Sukses membuat Docx Request Kasbon ${id_request}`)

    } else {
      res.status(500).send('Internal Server Error')
      console.log(`Gagal membuat Docx Bukti Kasbon`)
    }
  }
  catch (error) {
    res.status(500).send('Cannot make Docx')
    console.error(`Gagal membuat Docx Bukti Kasbon`, error)
  }
})

// Download Bukti Lunas
app.post('/api/download-lunas', CekAPIKey, async (req, res) => {
  const { id_request, nama_user, jumlah, metode, keterangan, tanggaljam, status_b } = req.body

  const DateTime = new Date()

  const formatTanggaljam = (tanggaljam) => {
    const jakartaTimezone = 'Asia/Jakarta'
    const utcDate = new Date(tanggaljam)
    const options = { timeZone: jakartaTimezone, hour12: false }

    return utcDate.toLocaleString('id-ID', options)
  }
  try {
    const content = fs.readFileSync(
      path.resolve(__dirname, "template_lunas.docx"),
      "binary"
    )

    const zip = new PizZip(content)

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })
    doc.render({
      id_request: id_request,
      nama_user: nama_user,
      jumlah: jumlah,
      metode: metode,
      keterangan: keterangan,
      tanggaljam: tanggaljam,
      status_b: 'Lunas',
      current_datetime: formatTanggaljam(DateTime)
    })

    const buffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    })

    if (buffer) {
      res.setHeader('Content-Disposition', `attachment filename=kasbon-${nama_user}-${id_request}.docx`)
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      res.setHeader('Content-Length', buffer.length)
      res.send(buffer)
      console.log(`Sukses membuat Docx Bukti Lunas ${id_request}`)

    } else {
      res.status(500).send('Internal Server Error')
      console.log(`Gagal membuat Docx Bukti Lunas`)
      console.error(`Gagal membuat Docx Bukti Lunas`)
    }
  }
  catch (error) {
    res.status(500).send('Cannot make Docx')
    console.error(`Gagal membuat Docx Bukti Lunas`, error)
  }
})

// API Ambil data akun karyawan
app.get('/api/ambil-akun-karyawan', async (req, res) => {
  try {
    const client = await pool.connect()

    const selectQuery = 'SELECT * FROM user_kasbon'
    const selectResult = await client.query(selectQuery)

    client.release()

    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows)
      console.log(`Berhasil mengirim data akun karyawan`)


    } else {
      res.status(404).json({ message: 'Tidak ada data, cek pgAdmin' })
      console.log(`Tidak ada data akun karyawan, cek pgAdmin`)

    }
  }
  catch (error) {
    console.error('Error ambil data karyawan :', error)
    console.log('Error ambil data karyawan')
  }

})

// API Ambil data akun Admin
app.get('/api/ambil-akun-admin', async (req, res) => {
  try {
    const client = await pool.connect()

    const selectQuery = 'SELECT * FROM admin_kasbon'
    const selectResult = await client.query(selectQuery)

    client.release()

    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows)
      console.log(`Berhasil mengirim data akun admin`)
    } else {
      res.status(404).json({ message: 'Tidak ada data, cek pgAdmin' })
      console.log(` Tidak ada data akun admin, cek pgAdmin`)

    }
  }
  catch (error) {
    console.error('Error ambil data Admin :', error)
    console.log('Error ambil data Admin')
  }

})

// Ganti Password Admin
app.post('/api/ganti-password-admin', async (req, res) => {
  const { password_check, password, id_petugas } = req.body

  try {
    const client = await pool.connect()

    // Ambil password dari DB
    const selectQuery = 'SELECT password_admin FROM "admin_kasbon" WHERE id_petugas = $1'
    const selectResult = await client.query(selectQuery, [id_petugas])

    if (selectResult.rows.length === 0) {
      client.release()
      console.log(`Tidak ditemukan ID Admin untuk dirubah password`)
      return res.status(400).json({ error: `Admin with ID ${id_petugas} not found.` })

    }

    const hashedPassword = selectResult.rows[0].password_admin

    // Komparasi password lama
    const passwordMatch = await bcrypt.compare(password_check, hashedPassword)

    // Jika password tidak sama maka respon 400
    if (!passwordMatch) {
      client.release()
      console.log(`Password lama salah`)
      return res.status(400).json({ error: 'Incorrect old password.' })

    }

    // Jika password lama sama, maka lanjut update
    const newHashedPassword = await bcrypt.hash(password, 10)
    const updateQuery = 'UPDATE "admin_kasbon" SET password_admin = $1 WHERE id_petugas = $2'
    await client.query(updateQuery, [newHashedPassword, id_petugas])

    client.release()
    res.status(200).json({ message: `Admin ID ${id_petugas} password berhasil dirubah.` })
    console.log(`Admin ID ${id_petugas} password berhasil dirubah`)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while changing the password.' })
  }
})

//API Ambil Laporan Karyawan Berdasarkan ID Dan Bulan-Tahun
app.post('/api/ambil-laporan-karyawan', CekAPIKey, async (req, res) => {
  const id_karyawan = req.body.id_karyawan
  const selectedDate = req.body.selectedDate // Formatted date 'MM/yyyy'

  try {
    // Parse the formatted date to extract the month and year
    const [selectedMonth, selectedYear] = selectedDate.split('/').map(Number)

    const client = await pool.connect()

    // Modify the SQL query to filter by both ID and the extracted month and year
    const selectQuery = 'SELECT * FROM dashboard_komplit WHERE status_request = \'sukses\' AND id_karyawan = $1 AND EXTRACT(MONTH FROM tanggaljam) = $2 AND EXTRACT(YEAR FROM tanggaljam) = $3'
    const selectResult = await client.query(selectQuery, [id_karyawan, selectedMonth, selectedYear])

    client.release()

    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows)
      console.log(`Berhasil kirim laporan kasbon ${id_karyawan}`)


    } else {
      res.status(404).json({ message: `ID: ${id_karyawan} tidak ada data kasbon disetujui ` })
      console.log(`ID: ${id_karyawan} tidak ditemukan kasbon disetujui`)

    }
  } catch (error) {
    console.error('Error:', error)

  }
})

//API Ambil Seluruh Laporan Karyawan Berdasarkan Bulan-Tahun
app.post('/api/semua-laporan-karyawan', CekAPIKey, async (req, res) => {
  const selectedDate = req.body.selectedDate 

  try {
    // Parsing format tanggal ke standar ISO UTC
    const [selectedMonth, selectedYear] = selectedDate.split('/').map(Number)

    const client = await pool.connect()

    // Modify the SQL query to filter by both ID and the extracted month and year
    const selectQuery = 'SELECT * FROM dashboard_komplit WHERE status_request = \'sukses\' AND EXTRACT(MONTH FROM tanggaljam) = $1 AND EXTRACT(YEAR FROM tanggaljam) = $2'
    const selectResult = await client.query(selectQuery, [selectedMonth, selectedYear])

    client.release()

    if (selectResult.rows.length > 0) {
      res.status(200).json(selectResult.rows)
      console.log(`Berhasil kirim Laporan semua karyawan`)

    } else {
      res.status(404).json({ message: `Tidak ada data kasbon pada Bulan ${selectedMonth} Tahun ${selectedYear} ` })
      console.log(`ID: ${id_karyawan} tidak ditemukan kasbon disetujui`)

    }
  } catch (error) {
    console.error('Error:', error)

  }
})

// Set Port buat server
const port = process.env.PORT || 3001
server.listen(port, '0.0.0.0', async () => {
  console.log(`Server is running on port ${port}`)

  await PostgresStatus()

  server.on('connection', (socket) => {
    // Handle incoming connections
  })
})
