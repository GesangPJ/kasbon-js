// ** MUI Imports
import Grid from '@mui/material/Grid'
import FormTambahUser from './FormTambahUser'

const FormRegistrasiUser = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <FormTambahUser />
      </Grid>
    </Grid>
  )
}

export default FormRegistrasiUser
