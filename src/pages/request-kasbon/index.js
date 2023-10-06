// Impor MUI Grid
import Grid from '@mui/material/Grid'

// Impor Tabel
import TableEditRequest from './editRequest'

const RequestKasbonAdmin = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableEditRequest />
      </Grid>
    </Grid>
  )
}

export default RequestKasbonAdmin
