// Bayar Kasbon
// Halaman untuk konfirmasi pembayaran

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Link from '@mui/material/Link'
import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { makeStyles } from '@mui/styles'
import Chip from '@mui/material/Chip'
import styled from '@emotion/styled'
import Divider from '@mui/material/Divider'
import { useRouter } from 'next/router'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined'
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined'

const AksesKunci = process.env.NEXT_PUBLIC_SECRET_API_KEY

require('dotenv').config()

const RoundedRectangleButton = styled(Button)`
  border-radius: 32px;
  position: sticky;
  bottom: 0;
  &:disabled {
    border-radius: 32px;
  }`

const columns = [
  { id: 'tanggaljam', label: 'Tanggal Jam', minWidth: 10, sortable: true },
  { id: 'nama_user', label: 'Nama Karyawan', minWidth: 10, sortable: true },
  { id: 'jumlah', label: 'Jumlah', minWidth: 10, sortable: false },
  { id: 'metode', label: 'Metode', minWidth: 10, sortable: true },
  { id: 'keterangan', label: 'Keterangan', minWidth: 10, sortable: false },
  { id: 'status_b', label: 'Status Bayar', minWidth: 10, sortable: false },
  { id: 'status_bayar', label: 'Sudah Lunas?', minWidth: 10, sortable: true },
]

function createData(id_request, tanggaljam, nama_user, jumlah, metode, keterangan, status_b, status_bayar) {
  return { id_request, tanggaljam, nama_user, jumlah, metode, keterangan, status_b, status_bayar }
}

// Sortir
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order

    return a[1] - b[1]
  })

  return stabilizedThis.map((el) => el[0])
}

// Komparasi sortir
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// Komparasi sortir descending
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1

  return 0
}

const FormBayarKasbon = () => {
  const [id_karyawan, setidkaryawan] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [sessionData, setSessionData] = useState(null)
  const [data, setData] = useState([])
  const [sorting, setSorting] = useState({ column: 'tanggaljam', direction: 'asc' })
  const [radioButtonValues, setRadioButtonValues] = useState({})
  const [updatedData, setUpdatedData] = useState([])
  const [selectedRows, setSelectedRows] = useState({})
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(true)

  const handleSort = (columnId) => {
    const isAsc = sorting.column === columnId && sorting.direction === 'asc'
    setSorting({ column: columnId, direction: isAsc ? 'desc' : 'asc' })
  }

  const getStatusChips = (status) => {
    if (status === 'belum') {
      return (
        <Chip
          label="Belum"
          color="default"
          variant="outlined"
          icon={<PauseCircleOutlineOutlinedIcon style={{ color: 'grey' }} />}
          style={{ color: 'black' }}
        />
      )
    } else if (status === 'lunas') {
      return (
        <Chip
          label="Lunas"
          color="success"
          icon={<DoneOutlinedIcon style={{ color: 'green' }} />}
          variant="outlined"
          style={{ color: 'green' }}
        />
      )

    } else {
      return status
    }
  }

  // Validasi ID Karyawan hanya huruf dan angka
  const handleidkaryawanChange = (e) => {
    const inputValue = e.target.value

    if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
      setidkaryawan(inputValue)
    } else {
      // Menampilkan error jika ada input diluar huruf dan angka
      setErrorMessage('ID Hanya boleh huruf dan angka!')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('sessionData'))

    if (!userData || !userData.isAdmin) {
      // User is not authorized
      setIsAuthorized(false) // Set the state variable to false
      router.push('/401') // Redirect to the 401 page
    }

    const fetchSessionData = async () => {
      // Ambil SessionData dari Session Storage
      const sessionDataStr = sessionStorage.getItem('sessionData')
      if (sessionDataStr) {
        const sessionData = JSON.parse(sessionDataStr)
        setSessionData(sessionData)
      }
    }
    fetchSessionData()
  }, [router])

  if (!isAuthorized) {
    return null
  }

  const handleSubmitID = async (e) => {
    e.preventDefault()

    if (!id_karyawan) {
      // Display Error jika ada yang tidak diisi
      setErrorMessage('ID Karyawan harus diinput terlebih dahulu')

      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-data-bayar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Key-Api': AksesKunci,
        },
        body: JSON.stringify({ id_karyawan }),
      })

      if (response.ok) {
        setSuccessMessage('Permintaan data berhasil dikirim.')
        setidkaryawan('')
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)

        const result = await response.json()
        setData(result)

        // Jika data tidak ditemukan (Error 404)
      } else if (response.status === 404) {
        console.error('Data tidak ditemukan')
        setErrorMessage(`Data ID : ${id_karyawan} tidak ditemukan`)
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)

      } else {
        console.error('Error mengirim permintaan data.')
        setErrorMessage('Gagal mengirim permintaan data')
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      }
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage('Internal Server Error')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  // Format mata uang ke rupiah
  const formatCurrencyIDR = (jumlah) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(jumlah)
  }

  // Format tanggaljam standar Indonesia dan Zona Waktu UTC+7 (JAKARTA)
  const formatTanggaljam = (tanggaljam) => {
    const jakartaTimezone = 'Asia/Jakarta'
    const utcDate = new Date(tanggaljam)
    const options = { timeZone: jakartaTimezone, hour12: false }

    return utcDate.toLocaleString('id-ID', options)
  }

  // Memetakan data ke row/baris
  const rows = data.map((row) => {
    return createData(
      row.id_request,
      formatTanggaljam(row.tanggaljam),
      row.nama_user,
      formatCurrencyIDR(row.jumlah),
      row.metode,
      row.keterangan,
      row.status_b,
    )
  })

  // Handle perubahan pada tombol radio
  const handleRadioChange = (event, requestId) => {
    setRadioButtonValues({
      ...radioButtonValues,
      [requestId]: event.target.value,
    })
  }

  const handleRowSelect = (id_request, value) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [id_request]: value,
    }))
  }

  // Validasi apakah semua tombol radio dipilih
  const isAllRadioButtonsSelected = () => {
    return rows.every((row) => radioButtonValues[row.id_request] === 'lunas' || radioButtonValues[row.id_request] === 'belum')
  }

  // Tombol Simpan Semua Data
  const handleSimpanSemua = async () => {
    if (sessionData && sessionData.id_akun && isAllRadioButtonsSelected()) {
      const updates = rows.map((row) => ({
        id_request: row.id_request,
        status_b: radioButtonValues[row.id_request],
        id_petugas: sessionData.id_akun,
      }))

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/edit-bayar-batch`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Key-Api': AksesKunci,
          },
          body: JSON.stringify({ requests: updates }),
        })

        if (response.ok) {
          // Jika sukses mengirim data
          setSuccessMessage(`Data berhasil diupdate semua.`)
          window.location.reload() // Reload halaman
          setTimeout(() => {
            setSuccessMessage('')
          }, 1000)

          // Kosongkan radiobutton
          setRadioButtonValues({})
        } else {
          // Jika error mengirim data
          setErrorMessage(`Gagal update data.`)
          setTimeout(() => {
            setErrorMessage('')
          }, 3000)

          console.error('Error in batch update')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    else {
      setErrorMessage('Semua tombol radio di setiap baris harus dipilih')
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
  }


  const sortedData = stableSort(rows, getComparator(sorting.direction, sorting.column))

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href=''>
            Bayar Kasbon
          </Link>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <form onSubmit={handleSubmitID}>
          <Grid item xs={4}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TextField
                fullWidth
                type="text"
                label="ID Karyawan"
                name="id_karyawan"
                placeholder="ID Karyawan"
                helperText="Masukkan ID Karyawan"
                value={id_karyawan}
                onChange={handleidkaryawanChange}
              />
            </Box>
          </Grid><br></br>
          <Grid item xs={7}>
            <RoundedRectangleButton type="button" variant="contained" size="large" onClick={handleSubmitID} color="primary">
              Lihat Data
            </RoundedRectangleButton>
          </Grid>
        </form>
      </Grid>
      {errorMessage && (
        <Alert severity="error">{errorMessage}</Alert>
      )}
      {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
      )}
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 4 }} />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='' titleTypographyProps={{ variant: 'h6' }} />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    onClick={() => handleSort('tanggaljam')} // Sortir
                  >Tanggal Jam {sorting.column === 'tanggaljam' ? (
                    sorting.direction === 'asc' ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowUpIcon />
                    )
                  ) : null}
                  </TableCell>
                  <TableCell
                    align="left"
                    onClick={() => handleSort('nama_user')} // Sortir
                  >
                    Nama Karyawan
                    {sorting.column === 'nama_user' ? (
                      sorting.direction === 'asc' ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowUpIcon />
                      )
                    ) : null}
                  </TableCell>
                  <TableCell align="left">Jumlah</TableCell>
                  <TableCell
                    align="left"
                    onClick={() => handleSort('metode')} // Sortir
                  >
                    Metode
                    {sorting.column === 'metode' ? (
                      sorting.direction === 'asc' ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowUpIcon />
                      )
                    ) : null}
                  </TableCell>
                  <TableCell align="left">Keterangan</TableCell>
                  <TableCell align="left">Status Bayar</TableCell>
                  <TableCell align="left" id="b_tombol">Sudah Lunas?</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((row) => {

                  // Cek apakah baris yg dipilih ada di updatedData
                  const updatedRow = updatedData.find((updatedRow) => updatedRow.id_request === row.id_request)

                  // Menggunakan UpdateRow jika ada
                  const dataRow = updatedRow || row

                  return (
                    <TableRow
                      key={dataRow.id_request}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="left">{row.tanggaljam}</TableCell>
                      <TableCell align="left">{row.nama_user}</TableCell>
                      <TableCell align="left">{row.jumlah}</TableCell>
                      <TableCell align="left">{row.metode}</TableCell>
                      <TableCell align="left">{row.keterangan}</TableCell>
                      <TableCell align="left">{getStatusChips(row.status_b)}</TableCell>
                      <TableCell aligh="left">
                        <FormControl>
                          <RadioGroup
                            row
                            name={`row-radio-buttons-group-${row.id_request}`}
                            value={radioButtonValues[row.id_request] || ''}
                            onChange={(event) => handleRadioChange(event, row.id_request)}
                          >
                            <FormControlLabel value="lunas" control={<Radio />} label="Lunas" />
                            <FormControlLabel value="belum" control={<Radio />} label="Belum" />
                          </RadioGroup>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            gap: 5,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="caption">
          Harap mengisi semua pilihan pada setiap baris sebelum tekan tombol simpan semua
        </Typography>
      </Grid><br></br>
      {errorMessage && (
        <Alert severity="error">{errorMessage}</Alert>
      )}
      {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
      )}
      <Grid item xs={12}>
        <RoundedRectangleButton type='submit' variant='contained' size='large' onClick={handleSimpanSemua} color="primary">
          Simpan Semua
        </RoundedRectangleButton>
      </Grid>

    </Grid>
  )
}

export default FormBayarKasbon
