// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import TableObatGenerik from 'src/pages/tableobatgenerik'

const UserPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='' target='_blank'>
            User Page
          </Link>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Obat Generik' titleTypographyProps={{ variant: 'h6' }} />
          <TableObatGenerik />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserPage
