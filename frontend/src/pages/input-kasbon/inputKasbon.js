import React, { useState, useEffect } from 'react'
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
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'

require('dotenv').config()

const RoundedRectangleButton = styled(Button)`
  border-radius: 32px;
`

const FormKasbon = () => {
  const [jumlah, setjumlah] = useState('')
  const [keterangan, setketerangan] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  //const handlejumlahChange = (e) => setjumlah(e.target.value)
  const handlemetodeChange = (e) => setmetode(e.target.value)
  const handleketeranganChange = (e) => setketerangan(e.target.value)
  const [sessionData, setSessionData] = useState(null)
  const router = useRouter()

  useEffect(() => {

    // Get session data from sessionStorage
    const sessionDataStr = sessionStorage.getItem('sessionData')
    if (sessionDataStr) {
      const data = JSON.parse(sessionDataStr)
      setSessionData(data)
    }
  }, [])


  // Submit ke api
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!sessionData || !sessionData.id_akun) {
      setErrorMessage('Session data is not available. Please log in.')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)

      return
    }

    const id_akun = sessionData.id_akun

    // validasi form
    if (!jumlah || !metode || !keterangan) {
      // Display Error jika ada yang tidak diisi
      setErrorMessage('Semua kolom harus diisi!')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)

      return
    }

    // Validasi panjang keterangan
    if (keterangan.length > 255) {
      setErrorMessage('Keterangan tidak boleh melebihi 255 karakter')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)

      return
    }

    // Konstruksi Data Kasbon untuk dikirim
    const KasbonData = {
      jumlah,
      metode,
      keterangan,
      id_akun,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/input-kasbon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(KasbonData),
      })

      if (response.ok) {
        setSuccessMessage(`Permintaan Kasbon berhasil dikirim.`)
        setjumlah('')
        setmetode('')
        setketerangan('')
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
      } else {
        console.error('Error menambahkan Kasbon.')
        setErrorMessage(`Gagal mengirim permintaan`)
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const [metode, setmetode] = React.useState('')

  const handlejumlahChange = (e) => {
    const inputValue = e.target.value

    // Use regular expression to allow only numbers
    if (/^\d*$/.test(inputValue)) {
      setjumlah(inputValue)
    } else {
      // Display an error message or prevent input, depending on your preference
      setErrorMessage('Hanya boleh angka pada input nilai!')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  return (
    <Card>
      <CardHeader title='Form Request Kasbon' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        {errorMessage && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
        {successMessage && (
          <Alert severity="success">{successMessage}</Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12}>

            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">Nilai</InputLabel>
                <OutlinedInput
                  id="nilai"
                  startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                  label="Nilai"
                  value={jumlah}
                  onChange={handlejumlahChange}
                  placeholder='Masukkan Nilai'
                  helperText='Masukkan Nilai Kasbon'
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="metode">Metode</InputLabel>
                <Select
                  labelId="Metode Bayar"
                  id="metode"
                  value={metode}
                  label="Metode"
                  onChange={handlemetodeChange}
                >
                  <MenuItem value='Cash'>Cash</MenuItem>
                  <MenuItem value='TF'>TF (Transfer)</MenuItem>
                </Select>
                <FormHelperText>Pilih Metode Bayar</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Keterangan'
                name='keterangan'
                placeholder='Keterangan'
                helperText='Masukkan Keterangan'
                value={keterangan}
                onChange={handleketeranganChange}
              />
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
                  Request
                </RoundedRectangleButton>
              </Box>
            </Grid>
          </Grid>
        </form>
        {successMessage && (
          <Alert severity="success">{successMessage}</Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default FormKasbon
