// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import TableRequestDownload from 'src/views/download-request'

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
    </Grid>
  )
}

export default DownloadPage
