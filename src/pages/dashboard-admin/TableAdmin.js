import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import Link from 'next/dist/client/link'
import { useRouter } from 'next/router'
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
import Chip from '@mui/material/Chip'
import API_URL from 'src/configs/api'

const useStyles = makeStyles((theme) => ({
  // warna warning/kuning
  warningCell: {
    backgroundColor: 'yellow',
  },

  // warna success/hijau
  successCell: {
    backgroundColor: 'green',
  },

  // warna error/merah
  errorCell: {
    backgroundColor: 'red',
  },
}))

const columns = [
  { id: 'tanggaljam', label: 'Tanggal Waktu', minWidth: 10, sortable: true },
  { id: 'nama_user', label: 'Nama Karyawan', minWidth: 10, sortable: true },
  { id: 'jumlah', label: 'Nilai', minWidth: 10, sortable: false },
  { id: 'metode', label: 'Metode', minWidth: 10, sortable: true },
  { id: 'keterangan', label: 'Keterangan', minWidth: 10, align: 'left', sortable: false },
  { id: 'status_request', label: 'Req', minWidth: 10, align: 'left', sortable: false },
  { id: 'status_b', label: 'Bayar', minWidth: 10, align: 'left', sortable: false },
  { id: 'nama_admin', label: 'Nama Admin', minWidth: 10, align: 'left', sortable: false },
]


//function createData(nama_user, nama_admin, status_request, tanggaljam, jumlah, metode, keterangan, status_b) {
// return { nama_user, nama_admin, status_request, tanggaljam, jumlah, metode, keterangan, status_b };
//}

function createData(tanggaljam, nama_user, jumlah, metode, keterangan, status_request, status_b, nama_admin) {
  return { tanggaljam, nama_user, jumlah, metode, keterangan, status_request, status_b, nama_admin }
}


// Fungsi Sortir
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;

    return a[1] - b[1];
  })

  return stabilizedThis.map((el) => el[0])
}

// Sortir order
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

const TableDataAdmin = () => {
  const classes = useStyles();

  // ** States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]); // Declare data state
  const [sorting, setSorting] = useState({ column: 'tanggaljam', direction: 'asc' });
  const router = useRouter();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ambil-dashboard-komplit`);
        if (response.ok) {
          const result = await response.json();
          setData(result); // Update data state
        } else {
          console.error('Error mengambil dashboard admin.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const rows = data.map((row) => {
    const {
      tanggaljam,
      nama_user,
      jumlah,
      metode,
      status_request,
      status_b,
      keterangan,
      nama_admin,
    } = row;

    return createData(
      formatTanggaljam(tanggaljam),
      nama_user,
      formatCurrencyIDR(jumlah),
      metode,
      keterangan,
      status_request,
      status_b,
      nama_admin,
    );
  });


  // Sorting function
  const sortedData = stableSort(rows, getComparator(sorting.direction, sorting.column));

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ minWidth: column.minWidth }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    {column.label}
                    {column.sortable && (
                      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '4px' }}>
                        {column.sortable && (
                          <div style={{ height: '24px' }}>
                            {sorting.column === column.id && sorting.direction === 'asc' && (
                              <ArrowUpwardIcon fontSize="small" />
                            )}
                            {sorting.column === column.id && sorting.direction === 'desc' && (
                              <ArrowDownwardIcon fontSize="small" />
                            )}
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
            {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.tanggaljam}>
                {columns.map((column) => {
                  const value = row[column.id];
                  if (column.id === 'aksi') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'status_request' ? (
                        row.status_request === 'wait' ? (
                          <Chip label="Wait" className={classes.warningCell} color="secondary" variant="outlined" style={{ color: 'black' }} />
                        ) : row.status_request === 'sukses' ? (
                          <Chip label="Sukses" className={classes.successCell} color="primary" variant="outlined" style={{ color: 'white' }} />
                        ) : row.status_request === 'tolak' ? (
                          <Chip label="Tolak" className={classes.errorCell} color="error" variant="outlined" style={{ color: 'white' }} />
                        ) : (
                          row.status_request
                        )
                      ) : column.format && typeof row[column.id] === 'number' ? (
                        column.format(row[column.id])
                      ) : (
                        row[column.id]
                      )
                      }
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
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
  );
}

export default TableDataAdmin;
