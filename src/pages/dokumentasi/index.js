// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import TypographyTexts from 'src/views/typography/TypographyTexts'
import TypographyHeadings from 'src/views/typography/TypographyHeadings'
import TextDokumen from './TextDokumentasi'

const Dokumentasi = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TextDokumen />
      </Grid>
    </Grid>
  )
}

export default Dokumentasi
