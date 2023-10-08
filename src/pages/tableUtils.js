// tableUtils.js
// File berisi fungsi yang digunakan pada tabel-tabel

import { makeStyles } from '@mui/styles'
import React, { useState, useEffect } from 'react'

// Menggunakan style untuk edit style cell table nanti
export const useStyles = makeStyles((theme) => ({
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

// Komparasi sortir
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// Komparasi sortir descending
export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1

  return 0;
}

export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order

    return a[1] - b[1]
  });

  return stabilizedThis.map((el) => el[0])
}


// Format mata uang ke rupiah
export function formatCurrencyIDR(jumlah) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(jumlah)
}

// Format tanggaljam standar Indonesia dan Zona Waktu UTC+7 (JAKARTA)
export function formatTanggaljam(tanggaljam) {
  const jakartaTimezone = 'Asia/Jakarta';
  const utcDate = new Date(tanggaljam);
  const options = { timeZone: jakartaTimezone, hour12: false }

  return utcDate.toLocaleString('id-ID', options)
}

//Handling fungsi sortir pada tabel
export const handleSort = (columnId, sorting, setSorting) => {
  const isAsc = sorting.column === columnId && sorting.direction === 'asc';
  setSorting({ column: columnId, direction: isAsc ? 'desc' : 'asc' });
};

// Handling jika ada perubahan pada RadiButton
export const handleRadioChange = (event, requestId, radioButtonValues, setRadioButtonValues) => {
  setRadioButtonValues({
    ...radioButtonValues,
    [requestId]: event.target.value,
  })
}

// Untuk fungsi page berikutnya pada tabel sticky header
export const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

// Untuk fungsi row berikutnya pada tabel sticky header
export const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(+event.target.value);
  setPage(0);
};
