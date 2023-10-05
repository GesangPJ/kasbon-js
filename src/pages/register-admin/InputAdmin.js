import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'

const FormAdmin = () => {
  const [nama, setnama] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [id_petugas, setidpetugas] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handlepasswordChange = (e) => setpassword(e.target.value)
  const handlenamaChange = (e) => setnama(e.target.value)
  const handleemailChange = (e) => setemail(e.target.value)
  const handleidpetugasChange = (e) => setidpetugas(e.target.value)

  const handleChange = (event) => {
    setRoles(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    if (!nama || !email || !password || !id_petugas) {
      // Display an error message if any field is empty
      setErrorMessage('Semua kolom harus diisi!');

      return;
    }

    const AkunData = {
      nama,
      email,
      password,
      id_petugas,
    };

    try {
      const response = await fetch('http://localhost:3001/api/tambah-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(AkunData),
      });

      if (response.ok) {
        setSuccessMessage(`Admin: ${nama} Id: ${id_petugas} berhasil ditambahkan.`);
        setnama('')
        setemail('')
        setpassword('')
        setidpetugas('')
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        console.error('Error menambahkan Admin.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card>
      <CardHeader title='Form Tambah Admin' titleTypographyProps={{ variant: 'h6' }} />
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
              <TextField
                fullWidth
                type='text'
                label='ID'
                name='id_petugas'
                placeholder='ID Admin / Petugas'
                helperText='Masukkan ID'
                value={id_petugas}
                onChange={handleidpetugasChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Nama Admin'
                name='nama'
                placeholder='Nama Admin'
                helperText='Masukkan Nama Admin'
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
                helperText='Masukkan Email Admin'
                value={email}
                onChange={handleemailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='password'
                label='Password'
                name='password'
                placeholder='Password Admin'
                helperText='Masukkan Password Admin'
                value={password}
                onChange={handlepasswordChange}
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
                  Tambah Admin
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

export default FormAdmin;
