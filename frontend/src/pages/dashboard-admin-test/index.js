// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminDataGrid from 'src/views/data-grid/admin-dashboard'

const DataGridAdmin = () => {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(true)

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('sessionData'))

    if (!userData || !userData.isAdmin) {
      setIsAuthorized(false)
      router.push('/401')
    }
  }, [router])

  if (!isAuthorized) {
    return null
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Typography variant='h5'>
          <Link href=''>
            Dashboard Admin
          </Link>
        </Typography>
        <Typography variant='body2'></Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='' titleTypographyProps={{ variant: 'h6' }} />
          <AdminDataGrid />
        </Card>
      </Grid>
    </Grid>
  )
}

export default DataGridAdmin
