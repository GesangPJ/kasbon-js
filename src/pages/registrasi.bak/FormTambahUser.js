import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'
import Link from 'next/link'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const FormTambahUser = () => {
  const [nama, setnama] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handlepasswordChange = (e) => setpassword(e.target.value)
  const handlenamaChange = (e) => setnama(e.target.value)
  const handleemailChange = (e) => setemail(e.target.value)

  const handleChange = (event) => {
    setRoles(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    if (!nama || !email || !password) {
      // Display an error message if any field is empty
      setErrorMessage('Semua kolom harus diisi!')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)

      return;
    }

    const AkunData = {
      nama,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:3001/api/tambah-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(AkunData),
      });

      if (response.ok) {
        setSuccessMessage(`User ${nama} berhasil ditambahkan.`);
        setnama('');
        setemail('');
        setpassword('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        const data = await response.json();
        if (response.status === 400) {
          // User dengan nama yang sama sudah ada
          setErrorMessage(data.error)
          setTimeout(() => {
            setErrorMessage('')
          }, 5000)
        } else {
          console.error('Error menambahkan User.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const theme = useTheme()

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  return (
    <Card>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          {errorMessage && (
            <Alert severity="error">{errorMessage}</Alert>
          )}
          {successMessage && (
            <Alert severity="success">{successMessage}</Alert>
          )}
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ReceiptLongOutlinedIcon color="primary" />
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='body2' align="center">Registrasi Akun User</Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus fullWidth
              id='nama'
              label='Nama'
              name='nama'
              sx={{ marginBottom: 4 }}
              value={nama}
              onChange={handlenamaChange}
            />
            <TextField
              autoFocus fullWidth
              id='email'
              label='Email'
              name='email'
              sx={{ marginBottom: 4 }}
              value={email}
              onChange={handleemailChange}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={password}
                onChange={handlepasswordChange}
                id='password'
                type='password'
              />
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
            </Box>
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={handleSubmit}
            >
              Buat Akun
            </Button>
          </form>
        </CardContent>
      </Card>
      );
    </Card>
  )
};

export default FormTambahUser;