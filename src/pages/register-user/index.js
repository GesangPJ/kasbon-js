// ** MUI Imports
import Grid from '@mui/material/Grid'

import FormUser from './InputUser'

const RegisterUserPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <FormUser />
      </Grid>
    </Grid>
  )
}

export default RegisterUserPage
