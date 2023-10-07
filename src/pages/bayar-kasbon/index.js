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
import Alert from '@mui/material/Alert'

function createData(id_bayar, tanggaljam, nama_user, jumlah, metode, keterangan, status_bayar) {
  return { id_bayar, tanggaljam, nama_user, jumlah, metode, keterangan, status_bayar };
}

const FormBayarKasbon = () => {
  const [id_karyawan, setidkaryawan] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [sessionStorage, setSessionStorage] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [data, setData] = useState([])
  const [sorting, setSorting] = useState({ column: 'tanggaljam', direction: 'asc' })


  const handleidkaryawanChange = (e) => {
    const inputValue = e.target.value

    // Use a regular expression to allow only numbers and letters
    if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
      setidkaryawan(inputValue)
    } else {
      // Display an error message or prevent input, depending on your preference
      setErrorMessage('ID Hanya boleh huruf dan angka!')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }


  const [sessionData, setSessionData] = useState(null)

  useEffect(() => {
    const fetchSessionData = async () => {
      // Check if sessionStorage is available before trying to access it
      if (sessionStorage) {
        const sessionDataStr = sessionStorage.getItem('sessionData');
        if (sessionDataStr) {
          const sessionData = JSON.parse(sessionDataStr);
          setSessionData(sessionData);
        }
      }
    };
    fetchSessionData();
  }, []);


  //const id_akun = sessionStorage.getItem('id_akun')

  const handleSubmitID = async (e) => {
    e.preventDefault();

    if (!id_karyawan) {
      // Display Error jika ada yang tidak diisi
      setErrorMessage('ID Karyawan harus diinput terlebih dahulu');

      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/ambil-data-bayar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_karyawan }), // Make sure to pass an object with id_karyawan
      });

      if (response.ok) {
        setSuccessMessage('Permintaan data berhasil dikirim.');
        setidkaryawan('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);

        const result = await response.json();
        setData(result);
      } else {
        console.error('Error mengirim permintaan data.');
        setErrorMessage('Gagal mengirim permintaan data');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Internal Server Error');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

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

  const rows = data.map((row) => {
    return createData(
      row.id_request,
      formatTanggaljam(row.tanggaljam),
      row.nama_user,
      formatCurrencyIDR(row.jumlah),
      row.metode,
      row.keterangan,
    );
  });

  const [radioButtonValues, setRadioButtonValues] = useState({});

  const handleRadioChange = (event, requestId) => {
    setRadioButtonValues({
      ...radioButtonValues,
      [requestId]: event.target.value,
    });
  };

  const handleSimpan = async (id_request) => {
    const status_bayar = radioButtonValues[id_request]; // Get the status_bayar directly from radioButtonValues
    const id_akun = sessionData.id_akun;

    try {
      const response = await fetch(`http://localhost:3001/api/tambah-bayar/${id_request}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status_bayar, id_petugas: id_akun }),
      });

      if (response.ok) {
        setSuccessMessage(`Data request berhasil diupdate.`);
        setTimeout(() => {
          setSuccessMessage('');
        }, 1000);
        console.log('Data request berhasil diupdate');

        // Refresh the page after a successful update
        window.location.reload();
      } else {
        setErrorMessage(`Gagal mengirim update data request`);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        console.error('Error update data request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
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
        <form onSubmit={handleSubmitID}>
          <Grid item xs={4}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <TextField
                fullWidth
                type="text"
                label="ID Karyawan"
                name="id_karyawan"
                placeholder="ID Karyawan"
                helperText="Masukkan ID Karyawan"
                value={id_karyawan}
                onChange={handleidkaryawanChange}
              />
            </Box>
          </Grid><br></br>
          <Grid item xs={7}>
            <Button type="button" variant="contained" size="large" onClick={handleSubmitID}>
              Lihat Data
            </Button>
          </Grid>
        </form>

      </Grid><br></br>
      {errorMessage && (
        <Alert severity="error">{errorMessage}</Alert>
      )}
      {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
      )}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Tabel Bayar Kasbon' titleTypographyProps={{ variant: 'h6' }} />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>

                  <TableCell align="left">Tanggal Jam</TableCell>
                  <TableCell align="left">Nama Karyawan</TableCell>
                  <TableCell align="left">Jumlah</TableCell>
                  <TableCell align="left">Metode</TableCell>
                  <TableCell align="left">Keterangan</TableCell>
                  <TableCell align="left" id="b_tombol">Sudah Lunas?</TableCell>
                  <TableCell align="left" id="simpan_tombol">Simpan</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id_request}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >

                    <TableCell align="left">{row.tanggaljam}</TableCell>
                    <TableCell align="left">{row.nama_user}</TableCell>
                    <TableCell align="left">{row.jumlah}</TableCell>
                    <TableCell align="left">{row.metode}</TableCell>
                    <TableCell align="left">{row.keterangan}</TableCell>
                    <TableCell aligh="left">
                      <FormControl>
                        <RadioGroup
                          row
                          name={`row-radio-buttons-group-${row.id_request}`}
                          value={radioButtonValues[row.id_request] || ''}
                          onChange={(event) => handleRadioChange(event, row.id_request)}
                        >
                          <FormControlLabel value="lunas" control={<Radio />} label="Lunas" />
                          <FormControlLabel value="belum" control={<Radio />} label="Belum Lunas" />
                        </RadioGroup>
                      </FormControl>
                    </TableCell>
                    <TableCell align="left">
                      <Button type='submit' variant='contained' size='large' onClick={() => handleSimpan(row.id_request)}>
                        Simpan
                      </Button>
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
        </Box>
      </Grid>
    </Grid>
  )
}

export default FormBayarKasbon
