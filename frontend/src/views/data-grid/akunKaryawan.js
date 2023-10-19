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
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-akun-karyawan`)
  const data = await response.json()

  return {
    props: {
      data,
    },
    revalidate: 5, // ambil setiap X detik
  }
}

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
    headerName: 'Tanggal Daftar',
    width: 180,
    editable: true,
    type: 'date',
    valueFormatter: (params) => {
      const formattedDate = formatTanggaljam(params.value);
      return formattedDate;
    },
    sortComparator: (v1, v2) => {
      // Parse the dates and compare them for sorting
      const date1 = new Date(v1);
      const date2 = new Date(v2);

      return date1 - date2;
    },
  },
  {
    field: 'nama_user',
    headerName: 'Nama Karyawan',
    width: 200,
    editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
    editable: true,
  },
]

const KaryawanDataGrid = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-akun-karyawan`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else if (response.status === 403) {
          const router = useRouter();
          router.push('/401');
        } else {
          console.error('Error mengambil dashboard admin.');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {

    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    // Handle the case when there are no data
    return <Alert severity="info">No data available.</Alert>
  }

  const rows = data.map((row, index) => ({
    id: row.id_karyawan || `row-${index}`,
    tanggaljam: row.tanggal,
    nama_user: row.nama_user,
    email: row.email_user,
  }))

  return (
    <Box sx={{ height: 600, width: '100%' }}>
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

  )
}

export default KaryawanDataGrid
