// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import TableRequestDownload from 'src/views/download-request'
import TableBayarDownload from 'src/views/download-bayar'
import Divider from '@mui/material/Divider'

const DownloadPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href=''>
            DOWNLOAD DATA REQUEST
          </Link>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TableRequestDownload />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 4 }} />
      </Grid>
      <Grid item xs={12}><br></br>
        <Typography variant='h5'>
          <Link href=''>
            DOWNLOAD DATA BAYAR
          </Link>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 4 }} />
      </Grid>
      <Grid item xs={12}>
        <TableBayarDownload />
      </Grid>
    </Grid>
  )
}

export default DownloadPage
