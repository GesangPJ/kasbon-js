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


const FormKasbon = () => {
  const [jumlah, setjumlah] = useState('')
  const [keterangan, setketerangan] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  //const handlejumlahChange = (e) => setjumlah(e.target.value)
  const handlemetodeChange = (e) => setmetode(e.target.value)
  const handleketeranganChange = (e) => setketerangan(e.target.value)
  const [sessionData, setSessionData] = useState(null)

  const handlejumlahChange = (e) => {
    const inputValue = e.target.value;

    // Use regular expression to allow only numbers
    if (/^\d*$/.test(inputValue)) {
      setjumlah(inputValue);
    } else {
      // Display an error message or prevent input, depending on your preference
      setErrorMessage('Hanya boleh angka pada input nilai!');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  useEffect(() => {
    // Mengambil session storage
    const sessionDataStr = sessionStorage.getItem('sessionData');
    if (sessionDataStr) {
      const sessionData = JSON.parse(sessionDataStr);
      setSessionData(sessionData);
    }
  }, []);


  // Submit ke api
  const handleSubmit = async (e) => {
    e.preventDefault()

    // validasi form
    if (!jumlah || !metode || !keterangan) {
      // Display Error jika ada yang tidak diisi
      setErrorMessage('Semua kolom harus diisi!');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);

      return;
    }

    // Validasi panjang keterangan
    if (keterangan.length > 255) {
      setErrorMessage('Keterangan tidak boleh melebihi 255 karakter');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);

      return;
    }

    // Mengambil id_akun dari Session Storage
    const id_akun = sessionData.id_akun

    // Konstruksi Data Kasbon untuk dikirim
    const KasbonData = {
      jumlah,
      metode,
      keterangan,
      id_akun,
    }

    try {
      const response = await fetch('http://localhost:3001/api/input-kasbon', {
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
          setSuccessMessage('');
        }, 5000);
      } else {
        console.error('Error menambahkan Kasbon.')
        setErrorMessage(`Gagal mengirim permintaan`)
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const [metode, setmetode] = React.useState('');

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
                <Button type='submit' variant='contained' size='large'>
                  Request
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        {successMessage && (
          <Alert severity="success">{successMessage}</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FormKasbon;
