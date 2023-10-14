// Impor MUI Grid
import Grid from '@mui/material/Grid'

// Impor Form Kasbon
import FormKasbon from './inputKasbon'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const RegisterKasbonPage = () => {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(true)

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('sessionData'))

    if (!userData) {
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
        <FormKasbon />
      </Grid>
    </Grid>
  )
}

export default RegisterKasbonPage
