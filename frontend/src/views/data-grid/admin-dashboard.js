import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { useState, useEffect } from 'react'
import Alert from '@mui/material/Alert'
import { makeStyles } from '@mui/styles'
import Chip from '@mui/material/Chip'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import dayjs from 'dayjs';
import id from 'dayjs/locale/id';

dayjs.locale(id);

require('dotenv').config()

const RoundedRectangleButton = styled(Button)`
  border-radius: 32px;
  position: sticky;
  &:disabled {
    border-radius: 32px
  }`

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
}))

const DateNow = new Date()

// Format tanggaljam standar Indonesia dan Zona Waktu UTC+7 (JAKARTA)
const formatTanggaljam = (tanggaljam) => {
  const jakartaTimezone = 'Asia/Jakarta'
  const utcDate = new Date(tanggaljam)
  const options = { timeZone: jakartaTimezone, hour12: false }

  return utcDate.toLocaleString('id-ID', options)
}

const valueFormatter = (params) => {
  return params.value.display;
};

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'tanggaljam',
    headerName: 'Tanggal Jam',
    width: 180,
    editable: true,
    type: 'date',
    valueGetter: (params) => {
      const tanggaljamValue = params.row.tanggaljam;

      if (!tanggaljamValue) {
        return null; // Handle the case where tanggaljam is undefined
      }

      const formattedDate = dayjs(tanggaljamValue).format('DD MMMM YYYY');

      return {
        display: formattedDate,
        sort: new Date(tanggaljamValue),
      };
    },
    valueFormatter: (params) => {
      return params.value.display;
    },
  },
  {
    field: 'nama_user',
    headerName: 'Nama Karyawan',
    width: 120,
    editable: true,
  },
  {
    field: 'jumlah',
    headerName: 'Jumlah',
    type: 'number',
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
    width: 90,
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

      if (statusRequest === 'wait') {
        chipColor = 'default'
        chipLabel = 'Wait'
      } else if (statusRequest === 'sukses') {
        chipColor = 'success'
        chipLabel = 'Sukses'
      } else if (statusRequest === 'tolak') {
        chipColor = 'error'
        chipLabel = 'Tolak'
      }

      return <Chip label={chipLabel} color={chipColor} variant="contained" />
    },
  },
  {
    field: 'status_b',
    headerName: 'Bayar',
    width: 90,
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

      if (statusB === 'lunas') {
        chipColor = 'success'
        chipLabel = 'Lunas'
      } else if (statusB === 'belum') {
        chipColor = 'secondary'
        chipLabel = 'Belum'
      }

      return <Chip label={chipLabel} color={chipColor} variant="contained" />
    },
  },
  {
    field: 'nama_admin',
    headerName: 'Petugas',
    width: 150,
    editable: true,
  },
]

function createData(id_request, tanggaljam, nama_user, jumlah, metode, keterangan, status_request, status_b, nama_admin) {
  return { id_request, tanggaljam, nama_user, jumlah, metode, keterangan, status_request, status_b, nama_admin }
}

/*
const rows = [
  { id: 1, tanggaljam: DateNow, nama_user: 'Jon', jumlah: 200000, metode: 'Cash', keterangan: 'AAAAA', status_request: 'wait', status_b: 'belum', nama_admin: 'Apabae' },
  { id: 2, tanggaljam: DateNow, nama_user: 'Cersei', jumlah: 100000, metode: 'TF', keterangan: 'AAAAA', status_request: 'sukses', status_b: 'belum', nama_admin: 'Apabae' },
  { id: 3, tanggaljam: DateNow, nama_user: 'Jaime', jumlah: 45000, metode: 'Cash', keterangan: 'AAAAA', status_request: 'sukses', status_b: 'belum', nama_admin: 'Trevor' },
  { id: 4, tanggaljam: DateNow, nama_user: 'Arya', jumlah: 16000, metode: 'TF', keterangan: 'AAAAA', status_request: 'wait', status_b: 'belum', nama_admin: 'Apabae' },
  { id: 5, tanggaljam: DateNow, nama_user: 'Daenerys', jumlah: null, metode: 'TF', keterangan: 'AAAAA', status_request: 'wait', status_b: 'belum', nama_admin: 'Trevor' },
  { id: 6, tanggaljam: DateNow, nama_user: 'Daenerys', jumlah: 150000, metode: 'TF', keterangan: 'AAAAA', status_request: 'sukses', status_b: 'belum', nama_admin: 'Trevor' },
  { id: 7, tanggaljam: DateNow, nama_user: 'Ferrara', jumlah: 44000, metode: 'TF', keterangan: 'AAAAA', status_request: 'sukses', status_b: 'lunas', nama_admin: 'Trevor' },
  { id: 8, tanggaljam: DateNow, nama_user: 'Rossini', jumlah: 36000, metode: 'Cash', keterangan: 'AAAAA', status_request: 'wait', status_b: 'belum', nama_admin: 'Trevor' },
  { id: 9, tanggaljam: DateNow, nama_user: 'Harvey', jumlah: 65000, metode: 'Cash', keterangan: 'AAAAA', status_request: 'wait', status_b: 'belum', nama_admin: 'Apabae' },
]
*/

const AdminDataGrid = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-dashboard-komplit`)
        if (response.ok) {
          const result = await response.json()
          setData(result)
        } else if (response.status === 403) {
          const router = useRouter()
          router.push('/401')
        }
        else {
          console.error('Error mengambil dashboard admin.')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [])

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
      const filterDate = new Date(filterValue);

      // Parse the row value as a date
      const rowDate = new Date(rowValue);

      // Compare the month and year of the filter value and row value
      return (
        filterDate.getMonth() === rowDate.getMonth() &&
        filterDate.getFullYear() === rowDate.getFullYear()
      );
    },
  };

  const preprocessTanggaljam = (tanggaljam) => {
    const dateParts = tanggaljam.split('/');
    if (dateParts.length === 3) {
      const day = dateParts[0];
      const month = dateParts[1];
      const year = dateParts[2];
      return `${day}-${month}-${year}`;
    }
    return ''; // Handle cases where the date format is invalid
  };

  const rows = data.map((row, index) => ({
    id: row.id_request,
    tanggaljam: row.tanggaljam,
    nama_user: row.nama_user,
    jumlah: formatCurrencyIDR(row.jumlah),
    metode: row.metode,
    keterangan: row.keterangan,
    status_request: row.status_request,
    status_b: row.status_b,
    nama_admin: row.nama_admin,
  }));

  return (
    <Box sx={{ height: 550, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 15, 20, 25, 50, 100]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>

  )
}

export default AdminDataGrid
