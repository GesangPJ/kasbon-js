// ** MUI Imports
import Grid from '@mui/material/Grid'

import FormAdmin from './InputAdmin'

const RegisterAdminPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <FormAdmin />
      </Grid>
    </Grid>
  )
}

export default RegisterAdminPage
