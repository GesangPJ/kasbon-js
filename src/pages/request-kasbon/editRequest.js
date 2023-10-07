import React, { useState, useEffect } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { makeStyles } from '@mui/styles'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

// Menggunakan style untuk edit style cell table nanti
const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
}));

const columns = [
  { id: 'id_request', label: 'ID', minWidth: 10, sortable: true },
  { id: 'tanggaljam', label: 'Tanggal Waktu', minWidth: 10, sortable: true },
  { id: 'nama_user', label: 'Nama Karyawan', minWidth: 10, sortable: true },
  { id: 'jumlah', label: 'Nilai', minWidth: 10, sortable: true },
  { id: 'metode', label: 'Metode', minWidth: 10, sortable: true },
  { id: 'keterangan', label: 'Keterangan', minWidth: 10, align: 'left', sortable: false },
  { id: 'status_request', label: 'Req', minWidth: 10, align: 'left', sortable: false },
  { id: 'b_tombol', label: '', minWidth: 10, align: 'left', sortable: false },
];

// Konstruktor row
function createData(id_request, tanggaljam, nama_user, jumlah, metode, keterangan, status_request, status_bayar) {


  return { id_request, tanggaljam, jumlah, nama_user, metode, keterangan, status_request, status_bayar };
}

// Sortir
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

// Komparasi sortir
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Komparasi sortir descending
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;

  return 0;
}

// Table dashboard karyawan
const TableEditRequest = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState({ column: 'tanggaljam', direction: 'asc' });
  const [sessionData, setSessionData] = useState(null);
  const [value, setValue] = React.useState('female');
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSort = (columnId) => {
    const isAsc = sorting.column === columnId && sorting.direction === 'asc';
    setSorting({ column: columnId, direction: isAsc ? 'desc' : 'asc' });
  };

  // Ambil data dari API/ambil-dashboard-karyawan
  useEffect(() => {
    // Ambil session storage
    const sessionDataStr = sessionStorage.getItem('sessionData');
    if (sessionDataStr) {
      const sessionData = JSON.parse(sessionDataStr);
      setSessionData(sessionData);
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/ambil-request-kasbon`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error('Error mendapatkan data.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

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

  // Masukkan data ke baris tabel
  const rows = data.map((row) => {
    return createData(
      row.id_request,
      formatTanggaljam(row.tanggaljam),
      row.nama_user,
      formatCurrencyIDR(row.jumlah),
      row.metode,
      row.keterangan,
      row.status_request,
    );
  });

  const classes = useStyles();

  const sortedData = stableSort(rows, getComparator(sorting.direction, sorting.column));

  const [radioButtonValues, setRadioButtonValues] = useState({});

  const handleRadioChange = (event, requestId) => {
    setRadioButtonValues({
      ...radioButtonValues,
      [requestId]: event.target.value,
    });
  };

  const id_akun = JSON.parse(sessionStorage.getItem('sessionData')).id_akun

  const handleSimpan = async (id_request) => {
    // Construct the request body with the updated status_request value
    const requestBody = {
      status_request: radioButtonValues,
      id_petugas: id_akun,
    };

    try {
      const response = await fetch(`http://localhost:3001/api/update-request/${id_request}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setSuccessMessage(`Data request berhasil diupdate.`)
        setTimeout(() => {
          setSuccessMessage('');
        }, 1000);
        console.log('Data request berhasil diupdate');

        // Refresh the page after a successful update
        window.location.reload();
      } else {
        setErrorMessage(`Gagal mengirim update data request`)
        setTimeout(() => {
          setErrorMessage('')
        }, 3000)

        console.error('Error update data request');
      }
    } catch (error) {
      console.error('Error:', error);


    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {errorMessage && (
        <Alert severity="error">{errorMessage}</Alert>
      )}
      {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
      )}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => column.sortable && handleSort(column.id)}>
                    {column.label}
                    {column.sortable && (
                      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '4px' }}>
                        {column.sortable && (
                          <div style={{ height: '24px' }}>
                            {sorting.column === column.id && sorting.direction === 'asc' && <ArrowUpwardIcon fontSize="small" />}
                            {sorting.column === column.id && sorting.direction === 'desc' && <ArrowDownwardIcon fontSize="small" />}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow hover role="checkbox" tabIndex={-1} key={rows.tanggaljam}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align} >

                    {column.format && typeof rows[column.id] === 'number' ? column.format(rows[column.id]) : rows[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ) : (
              sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.tanggaljam}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'b_tombol' ? (
                        <FormControl>
                          <RadioGroup
                            row
                            name={`row-radio-buttons-group-${row.id_request}`}
                            value={radioButtonValues[row.id_request] || ''}
                            onChange={(event) => handleRadioChange(event, row.id_request)}
                          >
                            <FormControlLabel value="setuju" control={<Radio />} label="Setuju" />
                            <FormControlLabel value="tolak" control={<Radio />} label="Tolak" />
                          </RadioGroup>
                        </FormControl>
                      ) : column.format && typeof row[column.id] === 'number'
                        ? column.format(row[column.id])
                        : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div className={classes.buttonContainer}>
        <Button type="submit" variant="contained" size="large" onClick={() => handleSimpan(rows.id_request)}>Simpan</Button>
      </div><br></br>
      {errorMessage && (
        <Alert severity="error">{errorMessage}</Alert>
      )}
      {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
      )}
    </Paper>
  );
};

export default TableEditRequest;
