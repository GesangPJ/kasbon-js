import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/joy/Table'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'
import { makeStyles } from '@mui/styles'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import dayjs from 'dayjs'

require('dotenv').config()

const RoundedRectangleButton = styled(Button)`
  border-radius: 32px;
  position: sticky;
  &:disabled {
    border-radius: 32px
  }`

const useStyles = makeStyles((theme) => ({
  // warna warning/kuning
  warningCell: {
    backgroundColor: 'yellow',
  },

  // warna success/hijau
  successCell: {
    backgroundColor: 'green',
  },

  // warna error/merah
  errorCell: {
    backgroundColor: 'red',
  },
  ovalButton: {
    borderRadius: '50%',
  },

  downloadButton: {
    alignContent: "center",
  },
}))


function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}
const rows = [
  createData('1', 159, 6.0, 24, 4.0),
  createData('2', 237, 9.0, 37, 4.3),
  createData('3', 262, 16.0, 24, 6.0),
  createData('4', 305, 3.7, 67, 4.3),
  createData('5', 356, 16.0, 49, 3.9),
  createData('6', 159, 6.0, 24, 4.0),
  createData('7', 237, 9.0, 37, 4.3),
  createData('8', 262, 16.0, 24, 6.0),
  createData('9', 305, 3.7, 67, 4.3),
  createData('10', 356, 16.0, 49, 3.9),
];

function sum(column) {
  return rows.reduce((acc, row) => acc + row[column], 0);
}


const TableLaporanKaryawan = () => {
  const classes = useStyles()

  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const router = useRouter()
  const [id_karyawan, setidkaryawan] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [sessionData, setSessionData] = useState(null)
  const [data, setData] = useState([])
  const [sorting, setSorting] = useState({ column: 'tanggaljam', direction: 'asc' })
  const [updatedData, setUpdatedData] = useState([])
  const [selectedRows, setSelectedRows] = useState({})
  const [value, setValue] = React.useState([
    dayjs('2022-04-17'),
    dayjs('2022-04-21'),
  ])

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

  const handleSubmitID = async (e) => {
    e.preventDefault()

    if (!id_karyawan) {
      // Display Error jika ada yang tidak diisi
      setErrorMessage('ID Karyawan harus diinput terlebih dahulu')
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)

      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-bayar-download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        console.error('Data lunas tidak ditemukan')
        setErrorMessage(`Data ID : ${id_karyawan} Belum ada yang lunas`)
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
  /*
    const rows = data.map((row) => {
      const {
        id_request,
        tanggaljam,
        nama_user,
        jumlah,
        metode,
        keterangan,
        status_b,
        nama_admin,
      } = row

      return createData(
        id_request,
        formatTanggaljam(tanggaljam),
        nama_user,
        formatCurrencyIDR(jumlah),
        metode,
        keterangan,
        status_b,
        nama_admin,
      )
    })
  */
  // Untuk fungsi page berikutnya pada tabel sticky header
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Untuk fungsi row berikutnya pada tabel sticky header
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const DownloadLunas = async (id_request, nama_user, jumlah, metode, keterangan, tanggaljam, status_b) => {
    const DownloadData = {
      id_request, nama_user, jumlah, metode, keterangan, tanggaljam, status_b
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/download-kasbon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(DownloadData),
      })
      if (response.ok) {

      } else {
        console.error('Error downloading the DOCX file')
        // Handle the error
      }
    }
    catch (error) {
      console.error('Error :', error)
    }
  }



  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <form onSubmit={handleSubmitID}>
            <Grid item xs={4}>

            </Grid>
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
                Lihat Data Kasbon
              </RoundedRectangleButton>
            </Grid>
          </form><br></br>
        </Grid><br></br>
        {errorMessage && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
        {successMessage && (
          <Alert severity="success">{successMessage}</Alert>
        )}
        <Grid item xs={12}>
          <Divider sx={{ borderBottomWidth: 4 }} />
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography level="body-sm" textAlign="center" sx={{ mb: 2 }}>
          The table body is scrollable.
        </Typography>
        <Sheet sx={{ height: 300, overflow: 'auto' }}>
          <Table
            aria-label="table with sticky header"
            stickyHeader
            stickyFooter
            stripe="odd"
            hoverRow
          >
            <thead>
              <tr>
                <th>Row</th>
                <th>Calories</th>
                <th>Fat&nbsp;(g)</th>
                <th>Carbs&nbsp;(g)</th>
                <th>Protein&nbsp;(g)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.calories}</td>
                  <td>{row.fat}</td>
                  <td>{row.carbs}</td>
                  <td>{row.protein}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Totals</th>
                <td>{sum('calories').toFixed(2)}</td>
                <td>{sum('fat').toFixed(2)}</td>
                <td>{sum('carbs').toFixed(2)}</td>
                <td>{sum('protein').toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>
                  {sum('calories') + sum('fat') + sum('carbs') + sum('protein')} Kcal
                </td>
              </tr>
            </tfoot>
          </Table>
        </Sheet>
      </Paper>
    </div>
  )
}

export default TableLaporanKaryawan
