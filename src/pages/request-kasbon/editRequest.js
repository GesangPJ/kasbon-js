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
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import Button from '@mui/material/Button'


// Menggunakan style untuk edit style cell table nanti
const useStyles = makeStyles((theme) => ({
  // warna warning/kuning
  warningCell: {
    backgroundColor: 'yellow',

  },

  //warna success/hijau
  successCell: {
    backgroundColor: 'green',
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px', // Adjust as needed
  },
  setujuButton: {
    '&.Mui-selected': {
      backgroundColor: 'green !important',
    },
  },
  tolakButton: {
    '&.Mui-selected': {
      backgroundColor: 'red !important',
    },
  },
}));

const columns = [
  { id: 'id_request', label: 'ID', minWidth: 10, sortable: true },
  { id: 'tanggaljam', label: 'Tanggal Waktu', minWidth: 10, sortable: true },
  { id: 'nama_user', label: 'Nama Karyawan', minWidth: 10, sortable: true },
  { id: 'jumlah', label: 'Nilai', minWidth: 10, sortable: false },
  { id: 'metode', label: 'Metode', minWidth: 10, sortable: false },
  { id: 'keterangan', label: 'Keterangan', minWidth: 10, align: 'left', sortable: false },
  { id: 'status_request', label: 'Req', minWidth: 10, align: 'left', sortable: false },
  {
    id: 'confirm',
    label: 'Konfirmasi',
    minWidth: 10,
    sortable: false,
  },
];

// Konstruktor row
function createData(id_request, tanggaljam, nama_user, jumlah, metode, keterangan, status_request) {

  return {
    id_request, tanggaljam, jumlah, nama_user, metode, keterangan, status_request,
    setuju: false,
    tolak: false
  };
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
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [data, setData] = useState([])
  const [sorting, setSorting] = useState({ column: 'tanggaljam', direction: 'asc' })
  const [sessionData, setSessionData] = useState(null)
  const [updatedRequests, setUpdatedRequests] = useState({});


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
    const sessionDataStr = sessionStorage.getItem('sessionData');
    if (sessionDataStr) {
      const sessionData = JSON.parse(sessionDataStr);
      setSessionData(sessionData);
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/ambil-request-kasbon`)
        if (response.ok) {
          const result = await response.json()
          setData(result)
        } else {
          console.error('Error mendapatkan data.')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    };
    fetchData()
  }, [])

  // Format mata uang ke rupiah
  const formatCurrencyIDR = (jumlah) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(jumlah)
  }

  // Format tanggaljam standar Indonesia dan Zona Waktu UTC+7 (JAKARTA)
  const formatTanggaljam = (tanggaljam) => {
    const jakartaTimezone = 'Asia/Jakarta'
    const utcDate = new Date(tanggaljam)
    const options = { timeZone: jakartaTimezone, hour12: false }

    return utcDate.toLocaleString('id-ID', options)
  }

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
      row.status_bayar,
    );
  });

  const [rowButtonStates, setRowButtonStates] = useState({})

  const classes = useStyles();

  const sortedData = stableSort(rows, getComparator(sorting.direction, sorting.column))

  const [selectedRequestIds, setSelectedRequestIds] = useState([]);

  const handleRowButtonChange = (event, requestId) => {
    const newSelectedRequestIds = [...selectedRequestIds];

    if (event === 'setuju') {
      // Add requestId to selectedRequestIds if "Setuju" is selected
      if (!newSelectedRequestIds.includes(requestId)) {
        newSelectedRequestIds.push(requestId);
      }
    } else if (event === 'tolak') {
      // Remove requestId from selectedRequestIds if "Tolak" is selected
      const index = newSelectedRequestIds.indexOf(requestId);
      if (index !== -1) {
        newSelectedRequestIds.splice(index, 1);
      }
    }

    setSelectedRequestIds(newSelectedRequestIds);
  };

  const handleSimpanButtonClick = () => {
    const id_akun = sessionData.id_akun;

    const updatePromises = [];
    for (const requestId of selectedRequestIds) {
      const requestData = {
        status_request: updatedRequests[requestId],
        id_petugas: id_akun,
      };
      updatePromises.push(
        fetch(`http://localhost:3001/api/update-request/${requestId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })
      );
    }

    // Handle the responses of all update requests
    Promise.all(updatePromises)
      .then((responses) => {
        const successResponses = responses.filter((response) => response.ok);
        console.log(`Updated ${successResponses.length} requests successfully.`);

        // Handle any additional actions after successful updates

        // Clear the updatedRequests state to avoid resending the same updates
        setUpdatedRequests({});

        // Clear the selectedRequestIds state
        setSelectedRequestIds([]);
      })
      .catch((error) => {
        console.error('Error updating requests:', error);

        // Handle errors here
      });
  };

  const handleSave = async () => {
    // Iterate over the updatedRequests object
    for (const id_request in updatedRequests) {
      const status_request = updatedRequests[id_request];

      try {
        // Make a PUT request to your API endpoint
        const response = await fetch(`http://localhost:3001/api/update-request/${id_request}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status_request }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.message); // Log the success message
        } else {
          console.error('Error updating request.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id_request}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'confirm' ? (
                          <ToggleButtonGroup
                            value={row.setuju ? 'setuju' : row.tolak ? 'tolak' : []}
                            exclusive
                            onChange={(event, newValue) => {
                              if (newValue === 'setuju') {
                                // Handle setuju button click
                                // Update row.setuju state
                              } else if (newValue === 'tolak') {
                                // Handle tolak button click
                                // Update row.tolak state
                              }
                            }}
                          >
                            <ToggleButton value="setuju" classes={{ selected: classes.setujuButton }}>
                              <CheckIcon />
                            </ToggleButton>
                            <ToggleButton value="tolak" classes={{ selected: classes.tolakButton }}>
                              <ClearIcon />
                            </ToggleButton>
                          </ToggleButtonGroup>
                        ) : column.format && typeof rows[column.id] === 'number'
                          ? column.format(rows[column.id])
                          : rows[column.id]
                        }
                        {column.format && typeof row[column.id] === 'number' ? column.format(row[column.id]) : row[column.id]}
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
      </Paper>
      <br></br>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>

        <div className={classes.buttonContainer}>
          <Button type='submit' variant='contained' size='large' onClick={handleSave}>
            SIMPAN
          </Button>
        </div>
      </Paper>

    </div>
  );
};

export default TableEditRequest;
