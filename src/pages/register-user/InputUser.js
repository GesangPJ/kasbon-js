import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert'; // Import the Alert component for displaying success message

const FormUser = () => {
  const [nama, setnama] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State variable for success message

  const handlepasswordChange = (e) => setpassword(e.target.value);
  const handlenamaChange = (e) => setnama(e.target.value);
  const handleemailChange = (e) => setemail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object with all the input data
    const obatData = {
      nama,
      email,
      password
    };

    try {
      const response = await fetch('http://localhost:3001/api/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obatData),
      });

      if (response.ok) {
        // Data sukses ditambah ke MongoDB
        // Popup sukses dan hapus input field
        setSuccessMessage(`User ${nama} berhasil ditambahkan.`);
        setnama('');
        setemail('');
        setpassword('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        // Kalo Error
        console.error('Error menambahkan user.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card>
      <CardHeader title='Form Tambah User' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        {successMessage && (
          <Alert severity="success">{successMessage}</Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
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
              <TextField
                fullWidth
                type='password'
                label='Password'
                name='password'
                placeholder='Password User'
                helperText='Masukkan Password User'
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
                  Tambah User
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

export default FormUser;
