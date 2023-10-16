import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'

const DateNow = new Date()

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'tanggaljam',
    headerName: 'Tanggal Jam',
    width: 180,
    editable: true,
  },
  {
    field: 'nama_user',
    headerName: 'Nama Karyawan',
    width: 150,
    editable: true,
  },
  {
    field: 'jumlah',
    headerName: 'Jumlah',
    type: 'number',
    width: 110,
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
    headerName: 'Req.',
    width: 80,
    editable: true,
  },
  {
    field: 'status_b',
    headerName: 'Bayar',
    width: 80,
    editable: true,
  },
  {
    field: 'nama_admin',
    headerName: 'Petugas',
    width: 150,
    editable: true,
  },
];

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
];


const AdminDataGrid = () => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pjumlahSize: 5,
            },
          },
        }}
        pjumlahSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>

  )
}

export default AdminDataGrid
