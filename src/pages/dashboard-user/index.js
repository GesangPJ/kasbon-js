// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import TableSpanning from 'src/views/tables/TableSpanning'
import TableCustomized from 'src/views/tables/TableCustomized'
import TableCollapsible from 'src/views/tables/TableCollapsible'
import TableObatHerbal from './TableObatHerbal'
import TableDataUser from './TableUser'

const DataUser = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='' target='_blank'>
            Dashboard User
          </Link>
        </Typography>
        <Typography variant='body2'></Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Kasbon' titleTypographyProps={{ variant: 'h6' }} />
          <TableDataUser />
        </Card>
      </Grid>
    </Grid>
  )
}

export default DataUser
