// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Divider from '@mui/material/Divider'
import TableLaporanKaryawan from 'src/views/laporan-karyawan'
import TableSeluruhLaporanKasbon from 'src/views/semua-laporan-karyawan'

const DownloadKasbonPage = () => {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(true)

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('sessionData'))

    if (!userData || !userData.isAdmin) {
      // User is not authorized
      setIsAuthorized(false) // Set the state variable to false
      router.push('/401') // Redirect to the 401 page
    }
  }, [router])

  // If not authorized, don't render the content
  if (!isAuthorized) {
    return null
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link>
            LAPORAN KASBON KARYAWAN
          </Link>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TableLaporanKaryawan />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 4 }} />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link>
            LAPORAN SEMUA KASBON KARYAWAN
          </Link>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TableSeluruhLaporanKasbon />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 4 }} />
      </Grid>
    </Grid>
  )
}

export default DownloadKasbonPage
