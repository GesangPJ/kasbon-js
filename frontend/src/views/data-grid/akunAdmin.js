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
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Fade from '@mui/material/Fade'
import Backdrop from '@mui/material/Backdrop'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import FormControl from '@mui/material/FormControl'

dayjs.locale(id);

require('dotenv').config()

const RoundedRectangleButton = styled(Button)`
  border-radius: 32px;
  position: sticky;
  &:disabled {
    border-radius: 32px
  }`

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


// SSR Biar bisa ambil data waktu production build
export async function getServerSideProps() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-akun-admin`)
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



const AkunAdminDataGrid = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [open, setOpen] = React.useState(false)
  const handleOpen = (id) => {
    setidpetugas(id);
    setOpen(true);
  }
  const handleClose = () => setOpen(false)
  const [password, setpassword] = useState('')
  const [id_petugas, setidpetugas] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [password_check, setPasswordCheck] = useState('')

  const handlepasswordChange = (e) => setpassword(e.target.value)
  const handlepasswordCheck = (e) => setPasswordCheck(e.target.value)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ambil-akun-admin`);
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

  const handleSubmit = async (e, id_petugas) => {
    e.preventDefault();

    const AkunData = {
      password_check,
      password,
      id_petugas,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ganti-password-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(AkunData),
      });

      if (response.ok) {
        setSuccessMessage(`Admin Id: ${id_petugas} password berhasil dirubah`)
        setpassword('')
        setPasswordCheck('')
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
      } else if (response.status === 400) {
        setErrorMessage('Password lama salah')
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      }
      else {
        console.error('Error mengganti password Admin.')
        setErrorMessage('Gagal mengganti password, API Error')
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (isLoading) {

    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    // Handle the case when there are no data
    return <Alert severity="info">No data available.</Alert>
  }

  const rows = data.map((row, index) => ({
    id: row.id_petugas || `row-${index}`,
    tanggaljam: row.tanggal,
    nama_admin: row.nama_admin,
    email: row.email_admin,
  }))

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
      field: 'nama_admin',
      headerName: 'Nama Admin',
      width: 200,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: true,
    },
    {
      field: 'edit_b',
      headerName: '',
      width: 300,
      editable: false,
      renderCell: (params) => (
        <RoundedRectangleButton
          variant="outlined"
          onClick={() => handleOpen(params.row.id)} // Pass the id_petugas to handleOpen
        >
          Ganti Password
        </RoundedRectangleButton>
      ),
    },
  ]

  return (
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <form onSubmit={(e) => handleSubmit(e, id_petugas)}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Ganti Password Admin {id_petugas} {/* Use id_petugas here */}
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                masukkan password lama agar bisa ganti password
              </Typography>
              <br></br><br></br>
              <FormControl fullWidth variant="outlined">
                <TextField
                  label='Password Lama'
                  name='password_check'
                  placeholder='Password Lama'
                  helperText='Masukkan Password Lama'
                  value={password_check}
                  onChange={handlepasswordCheck}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          aria-label='toggle password visibility'
                        >
                          {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <br></br>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <TextField
                  label='Password Baru'
                  name='password'
                  placeholder='Password Baru'
                  helperText='Masukkan Password Baru'
                  value={password}
                  onChange={handlepasswordChange}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          aria-label='toggle password visibility'
                        >
                          {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              <br></br><br></br>
              <RoundedRectangleButton type='submit' variant='contained' size='medium' color="primary">
                Ganti
              </RoundedRectangleButton>
            </form>
          </Box>
        </Fade>
      </Modal>
    </Box>

  )
}

export default AkunAdminDataGrid
