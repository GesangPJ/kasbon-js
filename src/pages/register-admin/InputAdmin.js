import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const FormAdmin = () => {
  const [nama, setnama] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [roles, setRoles] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State variable for error message

  const handlepasswordChange = (e) => setpassword(e.target.value);
  const handlenamaChange = (e) => setnama(e.target.value);
  const handleemailChange = (e) => setemail(e.target.value);

  const handleChange = (event) => {
    setRoles(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    if (!nama || !email || !password || !roles) {
      // Display an error message if any field is empty
      setErrorMessage('All fields are required');

      return;
    }

    const AkunData = {
      nama,
      email,
      password,
      roles, // Include the selected role
    };

    try {
      const response = await fetch('http://localhost:3001/api/add-akun', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(AkunData),
      });

      if (response.ok) {
        setSuccessMessage(`Akun ${nama} sebagai ${roles} berhasil ditambahkan.`);
        setnama('');
        setemail('');
        setpassword('');
        setRoles(''); // Reset the role selection
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        console.error('Error adding akun.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card>
      <CardHeader title='Form Tambah Akun' titleTypographyProps={{ variant: 'h6' }} />
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
                label='Nama Akun'
                name='nama'
                placeholder='Nama Akun'
                helperText='Masukkan Nama Akun'
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
                helperText='Masukkan Email Akun'
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
                placeholder='Password Akun'
                helperText='Masukkan Password Akun'
                value={password}
                onChange={handlepasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="roles">Kategori</InputLabel>
                <Select
                  labelId="roles"
                  id="roles"
                  value={roles}
                  label="Kategori"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="superadmin">Super Admin</MenuItem>
                </Select>
                <FormHelperText>Pilih jenis akun</FormHelperText>
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
                <Button type='submit' variant='contained' size='large'>
                  Tambah Akun
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
