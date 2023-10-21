import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { makeStyles } from '@mui/styles'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import TableFooter from '@mui/material/TableFooter'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined'
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import * as React from 'react'
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

const columns = [
  { id: 'id_request', label: 'ID', minWidth: 10, sortable: true },
  { id: 'tanggaljam', label: 'Tanggal Waktu', minWidth: 10, sortable: true },
  { id: 'nama_user', label: 'Nama Karyawan', minWidth: 10, sortable: true },
  { id: 'jumlah', label: 'Jumlah', minWidth: 10, sortable: false },
  { id: 'metode', label: 'Metode', minWidth: 10, sortable: true },
  { id: 'keterangan', label: 'Keterangan', minWidth: 10, align: 'left', sortable: false },
  { id: 'status_b', label: 'Status Bayar', minWidth: 10, align: 'left', sortable: false },
  { id: 'nama_admin', label: 'Petugas', minWidth: 10, align: 'left', sortable: true },
]

function createData(id_request, tanggaljam, nama_user, jumlah, metode, keterangan, status_b, nama_admin) {
  return { id_request, tanggaljam, nama_user, jumlah, metode, keterangan, status_b, nama_admin }
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

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order

    return a[1] - b[1]
  })

  return stabilizedThis.map((el) => el[0])
}


const TableSeluruhLaporanKasbon = () => {
  const classes = useStyles()
  const [selectedDate, setSelectedDate] = React.useState(null)

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

    if (!selectedDate) {
      // Display Error if selectedDate (month and year) is empty
      setErrorMessage('Pilih Bulan Dan Tahun terlebih dahulu')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
      return
    }

    // Format the selected date as 'MM/yyyy'
    const formattedDate = selectedDate ? dayjs(selectedDate).format('MM/YYYY') : null

    try {
      const requestData = {
        selectedDate: formattedDate, // Include the formatted date in the request
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/semua-laporan-karyawan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Send the ID and selectedDate
      })

      if (response.ok) {
        setSuccessMessage('Permintaan data berhasil dikirim.')
        setidkaryawan('')
        setSelectedDate(null) // Reset the selected date
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)

        const result = await response.json()
        setData(result)
      } else if (response.status === 404) {
        console.error('Data kasbon tidak ditemukan')
        setErrorMessage(`Data ID: ${id_karyawan} tidak ada Kasbon ditemukan`)
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
      parseFloat(jumlah),
      metode,
      keterangan,
      status_b,
      nama_admin,
    )
  })

  // Untuk fungsi page berikutnya pada tabel sticky header
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Untuk fungsi row berikutnya pada tabel sticky header
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  // Sorting function
  const sortedData = stableSort(rows, getComparator(sorting.direction, sorting.column))

  const handleSort = (columnId) => {
    const isAsc = sorting.column === columnId && sorting.direction === 'asc'
    setSorting({ column: columnId, direction: isAsc ? 'desc' : 'asc' })
  }



  const totalLunas = data.reduce((total, row) => {
    if (row.status_b === 'lunas') {
      return total + parseFloat(row.jumlah)
    }
    return total
  }, 0)

  const totalSisaKasbon = data.reduce((total, row) => {
    if (row.status_b !== 'lunas') {
      return total + parseFloat(row.jumlah)
    }
    return total
  }, 0)

  const totalJumlah = totalLunas + totalSisaKasbon

  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <form onSubmit={handleSubmitID}>

            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  views={['year', 'month']}
                  label="Pilih Bulan Dan Tahun"
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  inputFormat={'MM/yyyy'} // You can customize the format
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <br></br>
            <Grid item xs={7}>
              <RoundedRectangleButton type="button" variant="contained" size="large" onClick={handleSubmitID} color="primary">
                Lihat Data Bayar
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
        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{ minWidth: column.minWidth }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center' }}
                      onClick={() => column.sortable && handleSort(column.id)}
                    >
                      {column.label}
                      {column.sortable && (
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '4px' }}>
                          {column.sortable && (
                            <div style={{ height: '24px' }}>
                              {sorting.column === column.id && sorting.direction === 'asc' && (
                                <ArrowUpwardIcon fontSize="small" />
                              )}
                              {sorting.column === column.id && sorting.direction === 'desc' && (
                                <ArrowDownwardIcon fontSize="small" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id_request}>
                  {columns.map((column) => {
                    const value = row[column.id]
                    if (column.id === 'aksi') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      )
                    }

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'status_b' ? (
                          row.status_b === 'lunas' ? (
                            <Chip label="Lunas" color="success" variant="outlined" style={{ color: 'green' }} icon={<DoneOutlinedIcon style={{ color: 'green' }} />} />
                          ) : row.status_b === 'belum' ? (
                            <Chip label="Belum" color="default" variant="outlined" style={{ color: 'default' }} icon={<PauseCircleOutlineOutlinedIcon style={{ color: 'grey' }} />} />
                          ) : (
                            row.status_b
                          )
                        ) : column.format && typeof row[column.id] === 'number' ? (
                          column.format(row[column.id])
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>
                  Jumlah Total :  {/* Display your total jumlah here */}
                </TableCell>
                <TableCell colSpan={3}>
                  {formatCurrencyIDR(totalJumlah)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} align="left">
                  Total Lunas :  {/* Display your total lunas here */}
                </TableCell>
                <TableCell colSpan={3}>
                  {formatCurrencyIDR(totalLunas)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} align="left">
                  Sisa Kasbon :  {/* Display your sisa kasbon here */}
                </TableCell>
                <TableCell colSpan={3}>
                  {formatCurrencyIDR(totalSisaKasbon)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[100, 150, 200]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  )
}

export default TableSeluruhLaporanKasbon
