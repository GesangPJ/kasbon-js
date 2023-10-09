// Impor MUI Grid
import Grid from '@mui/material/Grid'

// Impor Form Kasbon
import FormKasbon from './inputKasbon'

const RegisterKasbonPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <FormKasbon />
      </Grid>
    </Grid>
  )
}

export default RegisterKasbonPage
