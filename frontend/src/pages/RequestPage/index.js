// Impor MUI Grid
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Link from '@mui/material/Link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// Impor Tabel
import RequestDataGrid from 'src/views/data-grid/requestTable'


const RequestIndex = () => {
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
          <Link href=''>
            Request Kasbon
          </Link>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='' titleTypographyProps={{ variant: 'h6' }} />
          <RequestDataGrid />
        </Card>
      </Grid>
    </Grid>
  )
}

export default RequestIndex
