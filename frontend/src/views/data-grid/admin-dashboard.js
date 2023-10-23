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
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined'
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'

dayjs.locale(id)

require('dotenv').config()

const AksesKunci = process.env.NEXT_PUBLIC_SECRET_API_KEY
const headers = { 'Key-Api': process.env.NEXT_PUBLIC_SECRET_API_KEY, }

const RoundedRectangleButton = styled(Button)`
  border-radius: 32px;
  position: sticky;
  &:disabled {
    border-radius: 32px
  }`

// SSR Biar bisa ambil data waktu production build
export async function getServerSideProps() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-dashboard-komplit`, {
    headers: headers,
  })
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
}))

// Format tanggaljam standar Indonesia dan Zona Waktu UTC+7 (JAKARTA)
const formatTanggaljam = (tanggaljam) => {
  const jakartaTimezone = 'Asia/Jakarta'
  const utcDate = new Date(tanggaljam)
  const options = { timeZone: jakartaTimezone, hour12: false }

  return utcDate.toLocaleString('id-ID', options)
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
    field: 'id_karyawan',
    headerName: '',
    width: 80,
    editable: false,
    disableSorting: true,
    filterable: false,
  },
  {
    field: 'jumlah',
    headerName: 'Jumlah',
    type: 'number',
    width: 120,
    align: 'left',
    editable: false,
    headerAlign: 'left',
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
    width: 125,
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
    field: 'status_b',
    headerName: 'Bayar',
    width: 125,
    valueGetter: (params) => {
      const row = params.row
      if (row.status_b === 'lunas') {
        return 'lunas'
      } else if (row.status_b === 'belum') {
        return 'belum'
      }
      return row.status_b
    },
    renderCell: (params) => {
      const statusB = params.value
      let chipColor = 'default'
      let chipLabel = statusB
      let icon = null

      if (statusB === 'lunas') {
        chipColor = 'success'
        chipLabel = 'Lunas'
        icon = <DoneOutlinedIcon style={{ color: 'green' }} />
      } else if (statusB === 'belum') {
        chipColor = 'default'
        chipLabel = 'Belum'
        icon = <PauseCircleOutlineOutlinedIcon style={{ color: 'grey' }} />
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
    field: 'nama_admin',
    headerName: 'Petugas',
    width: 180,
    editable: true,
  },
]

const AdminDataGrid = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalJumlah, setTotalJumlah] = useState(0)
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-dashboard-komplit`, {
          headers: headers,
        })
        if (response.ok) {
          const result = await response.json()
          setData(result)
        } else if (response.status === 403) {
          const router = useRouter()
          router.push('/401')
        } else {
          console.error('Error mengambil dashboard admin.')
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Recalculate the total value whenever the filtered data changes
    const calculateTotalJumlah = () => {
      const total = filteredData.reduce((total, row) => total + (parseFloat(row.jumlah) || 0), 0)
      setTotalJumlah(total)
    }

    calculateTotalJumlah()
  }, [filteredData])

  // Format mata uang ke rupiah
  const formatCurrencyIDR = (jumlah) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(jumlah)
  }

  const customMonthYearFilterOperator = {
    // Custom filter operator for month and year
    'month-year': (filterValue, rowValue) => {
      // Parse the filter value as a date
      const filterDate = new Date(filterValue)

      // Parse the row value as a date
      const rowDate = new Date(rowValue)

      // Compare the month and year of the filter value and row value
      return (
        filterDate.getMonth() === rowDate.getMonth() &&
        filterDate.getFullYear() === rowDate.getFullYear()
      )
    },
  }

  if (isLoading) {

    return <div>Loading...</div>
  }

  if (data.length === 0) {
    // Handle the case when there are no data
    return <Alert severity="info">No data available.</Alert>
  }

  const rows = data.map((row, index) => ({
    id: row.id_request || `row-${index}`,
    tanggaljam: row.tanggaljam,
    nama_user: row.nama_user,
    id_karyawan: row.id_karyawan,
    jumlah: parseFloat(row.jumlah),
    metode: row.metode,
    keterangan: row.keterangan,
    status_request: row.status_request,
    status_b: row.status_b,
    nama_admin: row.nama_admin,
  }))

  return (
    <div>
      <Box sx={{ height: 660, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{
          toolbar: GridToolbar,
        }}

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
      />
    </Box>
    </div>

  )
}

export default AdminDataGrid
