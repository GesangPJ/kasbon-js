// ** MUI Imports
import Grid from '@mui/material/Grid'
import LicenseText from 'src/views/license/LicenseText'

const License = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <LicenseText />
      </Grid>
    </Grid>
  )
}

export default License
