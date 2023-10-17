// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import UserDataGrid from 'src/views/data-grid/user-dashboard'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const DataUser = () => {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(true)

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('sessionData'))

    if (!userData) {
      setIsAuthorized(false)
      router.push('/401')
    }
  }, [router])

  if (!isAuthorized) {
    return null
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href=''>
            Dashboard Karyawan
          </Link>
        </Typography>
        <Typography variant='body2'></Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Kasbon' titleTypographyProps={{ variant: 'h6' }} />
          <UserDataGrid />
        </Card>
      </Grid>
    </Grid>
  )
}

export default DataUser
