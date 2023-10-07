// Impor MUI Grid
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Link from '@mui/material/Link'

// Impor Tabel
import TableEditRequest from './editRequest'

const RequestKasbonAdmin = () => {
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
          <CardHeader title='Tabel Request Kasbon' titleTypographyProps={{ variant: 'h6' }} />
          <TableEditRequest />
        </Card>
      </Grid>
    </Grid>
  )
}

export default RequestKasbonAdmin
