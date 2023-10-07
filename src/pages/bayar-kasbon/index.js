// Impor MUI Grid
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Link from '@mui/material/Link'
import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const FormBayarKasbon = () => {
  const [id_karyawan, setidkaryawan] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [sessionStorage, setSessionStorage] = useState(null)


  const handleidkaryawanChange = (e) => setidkaryawan(e.target.value)

  useEffect(() => {

  }, []);


  //const id_akun = sessionStorage.getItem('id_akun')

  const handleSubmitID = async (e) => {
    e.preventDefault()

    if (!id_karyawan) {
      // Display Error jika ada yang tidak diisi
      setErrorMessage('ID Karyawan harus di input terlebih dahulu');

      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/ambil-data-bayar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(id_karyawan),
      })
      if (response.ok) {
        setSuccessMessage(`Permintaan data berhasil dikirim.`)
        setidkaryawan('')
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);

        const result = await response.json();
        setData(result);

      } else {
        console.error('Error mengirim permintaan data.')
        setErrorMessage(`Gagal mengirim permintaan data`)
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      }

    }
    catch (error) {
      console.error('Error:', error)
      setErrorMessage(`Internal Server Error`)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)

    }



  }


  // Format mata uang ke rupiah
  const formatCurrencyIDR = (jumlah) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(jumlah);
  };

  // Format tanggaljam standar Indonesia dan Zona Waktu UTC+7 (JAKARTA)
  const formatTanggaljam = (tanggaljam) => {
    const jakartaTimezone = 'Asia/Jakarta';
    const utcDate = new Date(tanggaljam);
    const options = { timeZone: jakartaTimezone, hour12: false };

    return utcDate.toLocaleString('id-ID', options);
  };

  const [radioButtonValues, setRadioButtonValues] = useState({});

  const handleRadioChange = (event, requestId) => {
    setRadioButtonValues({
      ...radioButtonValues,
      [requestId]: event.target.value,
    });
  };



  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href=''>
            Bayar Kasbon
          </Link>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          type='text'
          label='ID Karyawan'
          name='id_karyawan'
          placeholder='ID Karyawan'
          helperText='Masukkan ID Karyawan'
          value={id_karyawan}
          onChange={handleidkaryawanChange}
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
            Lihat Data
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Tabel Bayar Kasbon' titleTypographyProps={{ variant: 'h6' }} />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" id="id_request">ID</TableCell>
                  <TableCell align="left">Tanggal Jam</TableCell>
                  <TableCell align="left">Jumlah</TableCell>
                  <TableCell align="left">Metode</TableCell>
                  <TableCell align="left">Keterangan</TableCell>
                  <TableCell align="left" id="b_tombol">Bayar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.calories}</TableCell>
                    <TableCell align="left">{row.fat}</TableCell>
                    <TableCell align="left">{row.carbs}</TableCell>
                    <TableCell align="left">{row.protein}</TableCell>
                    <TableCell aligh="left">
                      <FormControl>
                        <RadioGroup
                          row
                          name={`row-radio-buttons-group-${row.id_request}`}
                          value={radioButtonValues[row.id_request] || ''}
                          onChange={(event) => handleRadioChange(event, row.id_request)}
                        >
                          <FormControlLabel value="lunas" control={<Radio />} label="Lunas" />
                          <FormControlLabel value="belum" control={<Radio />} label="Belum" />
                        </RadioGroup>
                      </FormControl>


                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
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
            Simpan
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default FormBayarKasbon
