import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import FormControl from '@mui/material/FormControl'
import styled from '@emotion/styled'

const dotenv = require('dotenv')
dotenv.config()

const RoundedRectangleButton = styled(Button)`
  border-radius: 32px;
  position: sticky;
  bottom: 0;
  &:disabled {
    border-radius: 32px;
  }`

const FormUser = () => {
  const [nama, setnama] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [id_karyawan, setidkaryawan] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    setRoles(event.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate the form fields
    if (!nama || !email || !password || !id_karyawan) {
      // Display an error message if any field is empty
      setErrorMessage('Semua kolom harus diisi!')

      return
    }

    const AkunData = {
      nama,
      email,
      password,
      id_karyawan,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tambah-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(AkunData),
      })

      if (response.ok) {
        setSuccessMessage(`User: ${nama} Id: ${id_karyawan} berhasil ditambahkan.`)
        setnama('')
        setemail('')
        setpassword('')
        setidkaryawan('')
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
      } else if (response.status === 400) {
        setErrorMessage('Sudah ada akun dengan ID yang sama')
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      }
      else {
        console.error('Error menambahkan User.')
        setErrorMessage('Gagal menambahkan akun, API Error')
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  //Validasi Nama
  const handlenamaChange = (e) => {
    const inputValue = e.target.value

    // Use a regular expression to allow only numbers and letters
    if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
      setnama(inputValue)
    } else {
      // Display an error message or prevent input, depending on your preference
      setErrorMessage('Nama hanya boleh huruf dan angka!')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  // Handle passowrd dan email
  const handlepasswordChange = (e) => setpassword(e.target.value)

  const handleemailChange = (e) => setemail(e.target.value)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleidkaryawanChange = (e) => {
    const inputValue = e.target.value

    // Use a regular expression to allow only numbers and letters
    if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
      setidkaryawan(inputValue)
    } else {
      // Display an error message or prevent input, depending on your preference
      setErrorMessage('ID hanya boleh huruf dan angka!')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  return (
    <Card>
      <CardHeader title='Form Tambah User' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        {errorMessage && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
        {successMessage && (
          <Alert severity="success">{successMessage}</Alert>
        )}<br></br>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='ID'
                name='id_karyawan'
                placeholder='ID Karyawan'
                helperText='Masukkan ID'
                value={id_karyawan}
                onChange={handleidkaryawanChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Nama User'
                name='nama'
                placeholder='Nama User'
                helperText='Masukkan Nama User'
                value={nama}
                onChange={handlenamaChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='email'
                label='Email'
                name='email'
                placeholder='Email'
                helperText='Masukkan Email User'
                value={email}
                onChange={handleemailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined"> {/* Wrap the TextField in a FormControl */}
                <TextField
                  label='Password'
                  name='password'
                  placeholder='Password User'
                  helperText='Masukkan Password User'
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
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <RoundedRectangleButton type='submit' variant='contained' size='large' color="primary">
                  Tambah User
                </RoundedRectangleButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormUser
