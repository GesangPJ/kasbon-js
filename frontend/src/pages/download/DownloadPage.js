import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'


const DemoGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    paddingTop: `${theme.spacing(1)} !important`,
  },
}));

const DownloadPage = () => {
  const [PostgreStatus, setPostgreStatus] = useState('Loading'); // Default status
  const [serverStatus, setServerStatus] = useState('Loading');

  useEffect(() => {

    // Ambil status PostgreSQL
    fetch('http://localhost:3001/api/postgres-status')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setPostgreStatus(data.isConnected ? 'Online' : 'Offline');
      })
      .catch((error) => {
        console.error('Error:', error);
        setPostgreStatus('Error');
      })

    fetch('http://localhost:3001/api/server-status')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return response.json();
      })
      .then((data) => {
        setServerStatus(data.status)
      })
      .catch((error) => {
        console.error('Error:', error)
        setServerStatus('Error');
      })

  })

  return (
    <div>
      <Card>
        <CardHeader title='' titleTypographyProps={{ variant: 'h3' }} position="center" />
        <CardContent>
          <Grid container spacing={6} justifyContent="center" textAlign={'justify'} style={{ marginBottom: '10px' }}>
            <Divider component="div" role="presentation">

              <Typography variant="h4">Download Data</Typography>
            </Divider>
          </Grid>
          <br></br>
          <Grid container spacing={2} justifyContent="center" textAlign={'justify'}>
            <Grid item xs={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'left',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant='h6'>Download Dashboard</Typography>
              </Box>
            </Grid><br></br>

            <Grid item xs={4}>
              <Button type="button" variant="contained" size="small">
                Download
              </Button>
            </Grid>

            <Grid item xs={5} sm={9}>
              <Typography variant="body1">
                Download Dashboard Data
              </Typography>
              <Typography variant="body1">
                Download Daftar User/Karyawan
              </Typography>
              <Typography variant="body1">
                Download Daftar Admin
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card><br></br>
    </div>
  );
}

export default DownloadPage;
