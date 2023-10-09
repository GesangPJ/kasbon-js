import React, { useState, useEffect } from 'react'
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
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

//import API_URL from 'src/configs/api'
const API_URL = require('src/configs/api')

// Menggunakan style untuk edit style cell table nanti
const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  simpanButton: {
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'primary', // Set the background color to match the table
  },


}))

const columns = [
  { id: 'id_request', label: 'ID', minWidth: 10, sortable: true },
  { id: 'tanggaljam', label: 'Tanggal Waktu', minWidth: 10, sortable: true },
  { id: 'nama_user', label: 'Nama Karyawan', minWidth: 10, sortable: true },
  { id: 'jumlah', label: 'Nilai', minWidth: 10, sortable: false },
  { id: 'metode', label: 'Metode', minWidth: 10, sortable: true },
  { id: 'keterangan', label: 'Keterangan', minWidth: 10, align: 'left', sortable: false },
  { id: 'status_request', label: 'Req', minWidth: 10, align: 'left', sortable: false },
  { id: 'b_tombol', label: '', minWidth: 10, align: 'left', sortable: false },
  { id: 'simpan', label: 'simpan', minWidth: 10, align: 'left', sortable: false },
]

// Konstruktor row
function createData(id_request, tanggaljam, nama_user, jumlah, metode, keterangan, status_request, status_bayar) {


  return { id_request, tanggaljam, jumlah, nama_user, metode, keterangan, status_request, status_bayar }
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

// Table dashboard karyawan
const TableEditRequest = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [data, setData] = useState([])
  const [sorting, setSorting] = useState({ column: 'tanggaljam', direction: 'asc' })
  const [sessionData, setSessionData] = useState(null)
  const [value, setValue] = React.useState('female')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedRows, setSelectedRows] = useState({})

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleSort = (columnId) => {
    const isAsc = sorting.column === columnId && sorting.direction === 'asc'
    setSorting({ column: columnId, direction: isAsc ? 'desc' : 'asc' })
  }

  // Ambil data dari API/ambil-dashboard-karyawan
  useEffect(() => {
    const fetchSessionData = async () => {
      // Ambil SessionData dari Session Storage
      const sessionDataStr = sessionStorage.getItem('sessionData')
      if (sessionDataStr) {
        const sessionData = JSON.parse(sessionDataStr)
        setSessionData(sessionData)
      }
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ambil-request-kasbon`)
        if (response.ok) {
          const result = await response.json()
          setData(result)
        } else if (response.status === 404) {
          console.error('Data tidak ditemukan')
          setErrorMessage(`Tidak ada request saat ini`)
          setTimeout(() => {
            setErrorMessage('')
          }, 3000)

        } else {
          console.error('Error:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
    fetchSessionData()
  }, [])

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

  // Masukkan data ke baris tabel
  const rows = data.map((row) => {
    return createData(
      row.id_request,
      formatTanggaljam(row.tanggaljam),
      row.nama_user,
      formatCurrencyIDR(row.jumlah),
      row.metode,
      row.keterangan,
      row.status_request,
    )
  })

  const classes = useStyles()

  const sortedData = stableSort(rows, getComparator(sorting.direction, sorting.column))

  const [radioButtonValues, setRadioButtonValues] = useState({})

  const handleRadioChange = (event, requestId) => {
    setSelectedRows({
      ...selectedRows,
      [requestId]: event.target.value,
    });
  };

  // Mengirim update ke API
  const handleSimpan = async (id_request) => {
    // Menggunakan tombol SIMPAN untuk mengambil id_request
    const status_request = radioButtonValues[id_request]
    const id_akun = sessionData.id_akun

    try {
      const response = await fetch(`${API_URL}/api/update-request/${id_request}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status_request, id_petugas: id_akun }),
      })

      if (response.ok) {
        setSuccessMessage(`Data request berhasil diupdate.`)
        setTimeout(() => {
          setSuccessMessage('')
        }, 1000)
        console.log('Data request berhasil diupdate')
        window.location.reload()
      } else {
        setErrorMessage(`Gagal mengirim update data request`)
        setTimeout(() => {
          setErrorMessage('')
        }, 3000)

        console.error('Error update data request')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleBatchUpdate = async () => {
    const id_akun = sessionData.id_akun;
    const updatePromises = [];

    // Iterate through selected rows and create update promises
    for (const requestId in selectedRows) {
      const status_request = selectedRows[requestId];
      updatePromises.push(
        fetch(`${API_URL}/api/update-request/${requestId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status_request, id_petugas: id_akun }),
        })
      );
    }

    try {
      const responses = await Promise.all(updatePromises);
      const isSuccess = responses.every((response) => response.ok);

      if (isSuccess) {
        setSuccessMessage(`Data request berhasil diupdate.`);
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
        console.log('Data request berhasil diupdate');
        window.location.reload();
      } else {
        setErrorMessage(`Gagal mengirim update data request`);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        console.error('Error update data request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {errorMessage && (
        <Alert severity="error">{errorMessage}</Alert>
      )}
      {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>

              <TableRow>
                <TableCell
                  align="left"
                  onClick={() => handleSort('tanggaljam')}
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
                  onClick={() => handleSort('nama_user')}
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
                <TableCell align="left">Nilai</TableCell>
                <TableCell
                  align="left"
                  onClick={() => handleSort('metode')}
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
                <TableCell align="left" id="b_tombol">Konfirmasi Request</TableCell>
                <TableCell align="left" id="simpan_tombol">Simpan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow
                  key={row.id_request}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">{row.tanggaljam}</TableCell>
                  <TableCell align="left">{row.nama_user}</TableCell>
                  <TableCell align="left">{row.jumlah}</TableCell>
                  <TableCell align="left">{row.metode}</TableCell>
                  <TableCell align="left">{row.keterangan}</TableCell>
                  <TableCell align="left">
                    <FormControl>
                      <RadioGroup
                        row
                        name={`row-radio-buttons-group-${row.id_request}`}
                        value={radioButtonValues[row.id_request] || ''}
                        onChange={(event) => handleRadioChange(event, row.id_request)}
                      >
                        <FormControlLabel value="sukses" control={<Radio />} label="Setuju" />
                        <FormControlLabel value="tolak" control={<Radio />} label="Tolak" />
                      </RadioGroup>
                    </FormControl>
                  </TableCell>
                  <TableCell align="left">
                    <Button type='submit' variant='contained' size='large' onClick={() => handleSimpan(row.id_request)}>
                      Simpan
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          size="large"
          onClick={handleBatchUpdate}
          className={classes.simpanButton}
          disabled={Object.keys(selectedRows).length === 0}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

export default TableEditRequest
