import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

const dotenv = require('dotenv')
dotenv.config()

const DemoGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    paddingTop: `${theme.spacing(1)} !important`,
  },
}))

const StatusPage = () => {
  const [PostgreStatus, setPostgreStatus] = useState('Loading..')
  const [serverStatus, setServerStatus] = useState('Loading..')
  const [CSRF, setCSRFNumber] = useState('Loading..')
  const [AccountName, setAccountName] = useState('Loading..')
  const [AccountEmail, setAccountEmail] = useState('Loading..')
  const [AccountID, setAccountID] = useState('Loading..')
  const [AccountDate, setAccountDate] = useState('Loading')

  useEffect(() => {

    const SessionDatas = JSON.parse(sessionStorage.getItem('sessionData'))
    setCSRFNumber(SessionDatas.csrfToken)
    setAccountName(SessionDatas.username)
    setAccountEmail(SessionDatas.email)
    setAccountID(SessionDatas.id_akun)
    setAccountDate(SessionDatas.tanggal_akun)


    // Ambil status PostgreSQL
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postgres-status`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return response.json()
      })
      .then((data) => {
        setPostgreStatus(data.isConnected ? 'Online' : 'Offline')
      })
      .catch((error) => {
        console.error('Error:', error)
        setPostgreStatus('Error')
      })

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/server-status`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return response.json()
      })
      .then((data) => {
        setServerStatus(data.status)
      })
      .catch((error) => {
        console.error('Error:', error)
        setServerStatus('Error')
      })

  })

  return (
    <div>
      <Card>
        <CardHeader title='' titleTypographyProps={{ variant: 'h3' }} position="center" />
        <CardContent>
          <Grid container spacing={6} justifyContent="center" textAlign={'justify'} style={{ marginBottom: '10px' }}>
            <Typography variant='h4'>
              Web Status
            </Typography>
          </Grid>
          <br></br>
          <Grid container spacing={6} justifyContent="center" textAlign={'justify'}>
            <DemoGrid item xs={5} sm={9}>
              <Typography variant="body1">
                PostgreSQL Status : {PostgreStatus}
              </Typography>
              <Typography variant="body1">
                Server Status : {serverStatus}
              </Typography>
            </DemoGrid>
          </Grid>
        </CardContent>
      </Card><br></br>
      <Card>
        <CardHeader title='' titleTypographyProps={{ variant: 'h3' }} position="center" />
        <CardContent>
          <Grid container spacing={6} justifyContent="center" textAlign={'justify'} style={{ marginBottom: '10px' }}>
            <Typography variant='h4'>
              Debug
            </Typography>
          </Grid>
          <br></br>
          <Grid container spacing={6} justifyContent="center" textAlign={'justify'}>
            <DemoGrid item xs={5} sm={9}>
              <Typography variant="body1">
                API : {process.env.NEXT_PUBLIC_API_URL}
              </Typography>
              <Typography variant="body1">
                Current Session :
              </Typography>
              <Typography variant="body1">
                Account ID : {AccountID}
              </Typography>
              <Typography variant="body1">
                Name       : {AccountName}
              </Typography>
              <Typography variant="body1">
                Email      : {AccountEmail}
              </Typography>
              <Typography variant="body1">
                Account Created: {AccountDate}
              </Typography>
              <Typography variant="body1">
                CSRF : {CSRF}
              </Typography>
            </DemoGrid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatusPage
