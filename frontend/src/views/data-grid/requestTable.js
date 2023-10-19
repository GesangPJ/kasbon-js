import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { useState, useEffect } from 'react'
import Alert from '@mui/material/Alert'
import { makeStyles } from '@mui/styles'
import Chip from '@mui/material/Chip'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'
import id from 'dayjs/locale/id'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined'
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'

dayjs.locale(id)

require('dotenv').config()

const RoundedRectangleButton = styled(Button)`
  border-radius: 32px;
  position: sticky;
  &:disabled {
    border-radius: 32px
  }`

// Format mata uang ke rupiah
const formatCurrencyIDR = (jumlah) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(jumlah)
}

// SSR Biar bisa ambil data waktu production build
export async function getServerSideProps() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-dashboard-komplit`)
  const data = await response.json()

  return {
    props: {
      data,
    },
    revalidate: 5, // ambil setiap X detik
  }
}

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

// Format tanggaljam standar Indonesia dan Zona Waktu UTC+7 (JAKARTA)
const formatTanggaljam = (tanggaljam) => {
  const jakartaTimezone = 'Asia/Jakarta'
  const utcDate = new Date(tanggaljam)
  const options = { timeZone: jakartaTimezone, hour12: false }


  return utcDate.toLocaleString('id-ID', options)
}

const RequestDataGrid = () => {
  const [data, setData] = useState([])
  const [sessionData, setSessionData] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedRows, setSelectedRows] = useState({})
  const classes = useStyles()

  const handleRadioChange = (event, requestId) => {
    setSelectedRows({
      ...selectedRows,
      [requestId]: event.target.value,
    })
  }

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-request-kasbon`)
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

  const handleBatchUpdate = async () => {
    const id_akun = sessionData.id_akun
    const updatePromises = []

    // Iterate through selected rows and create update promises
    for (const requestId in selectedRows) {
      const status_request = selectedRows[requestId]
      updatePromises.push(
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/update-request/${requestId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status_request, id_petugas: id_akun }),
        })
      )
    }

    try {
      const responses = await Promise.all(updatePromises)
      const isSuccess = responses.every((response) => response.ok)

      if (isSuccess) {
        setSuccessMessage(`Data request berhasil diupdate.`)
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
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

  const rows = data.map((row, index) => ({
    id: row.id_request,
    tanggaljam: row.tanggaljam,
    nama_user: row.nama_user,
    jumlah: formatCurrencyIDR(row.jumlah),
    metode: row.metode,
    keterangan: row.keterangan,
    status_request: row.status_request,
  }))

  const StatusBCellRenderer = ({ value, row }) => {
    const [radioValue, setRadioValue] = useState(value)

    const handleRadioChange = (event) => {
      setRadioValue(event.target.value)
      setSelectedRows({
        ...selectedRows,
        [row.id]: event.target.value,
      })
    }

    return (
      <TableRow key={row.id}>
        <TableCell align="left">
          <FormControl>
            <RadioGroup row value={radioValue} onChange={handleRadioChange}>
              <FormControlLabel
                value="sukses"
                control={<Radio />}
                label="Setuju"
              />
              <FormControlLabel
                value="tolak"
                control={<Radio />}
                label="Tolak"
              />
            </RadioGroup>
          </FormControl>
        </TableCell>
      </TableRow>
    )
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'tanggaljam',
      headerName: 'Tanggal Jam',
      width: 180,
      editable: true,
      type: 'date',
      valueFormatter: (params) => {
        const formattedDate = formatTanggaljam(params.value)
        return formattedDate
      },
      sortComparator: (v1, v2) => {
        // Parse the dates and compare them for sorting
        const date1 = new Date(v1)
        const date2 = new Date(v2)

        return date1 - date2
      },
    },
    {
      field: 'nama_user',
      headerName: 'NK',
      width: 120,
      editable: true,
    },
    {
      field: 'jumlah',
      headerName: 'Jumlah',
      width: 120,
      editable: false,
    },
    {
      field: 'metode',
      headerName: 'Metode',
      width: 90,
      editable: true,
    },
    {
      field: 'keterangan',
      headerName: 'Keterangan',
      width: 150,
      editable: true,
    },
    {
      field: 'status_request',
      headerName: 'Req',
      width: 115,
      valueGetter: (params) => {
        const row = params.row
        if (row.status_request === 'wait') {
          return 'wait'
        } else if (row.status_request === 'sukses') {
          return 'sukses'
        } else if (row.status_request === 'tolak') {
          return 'tolak'
        }
        return row.status_request
      },
      renderCell: (params) => {
        const statusRequest = params.value
        let chipColor = 'default'
        let chipLabel = statusRequest
        let icon = null

        if (statusRequest === 'wait') {
          chipColor = 'default'
          chipLabel = 'Wait'
          icon = <SyncOutlinedIcon style={{ color: 'grey' }} />
        } else if (statusRequest === 'sukses') {
          chipColor = 'success'
          chipLabel = 'Sukses'
          icon = <DoneOutlinedIcon style={{ color: 'green' }} />

        } else if (statusRequest === 'tolak') {
          chipColor = 'error'
          chipLabel = 'Tolak'
          icon = <CloseOutlinedIcon style={{ color: 'red' }} />
        } else {
          chipColor = 'error'
          chipLabel = 'No Data'
          icon = <ErrorOutlineOutlinedIcon style={{ color: 'red' }} />
        }

        return <Chip
          label={chipLabel}
          color={chipColor}
          variant="outlined"
          avatar={icon} // This adds the icon to the left of the label
        />
      },
    },
    {
      field: 'tombol_b',
      headerName: 'Setuju?',
      width: 150,
      renderCell: (params) => (
        <StatusBCellRenderer value={selectedRows[params.row.id]} row={params.row} />
      ),
    },
  ]

  return (
    <div>
      <Box sx={{ height: 600, width: '100%' }}>
        {errorMessage && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
        {successMessage && (
          <Alert severity="success">{successMessage}</Alert>
        )}
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{
            toolbar: GridToolbar,
          }}
          getRowHeight={() => 80}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 20, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
        /><br></br>

      </Box>
      <div className={classes.buttonContainer}>
        <RoundedRectangleButton
          variant="contained"
          size="large"
          onClick={handleBatchUpdate}
          disabled={Object.keys(selectedRows).length === 0}
        >
          Simpan
        </RoundedRectangleButton>
      </div><br></br>
    </div>

  )
}

export default RequestDataGrid
