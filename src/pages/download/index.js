// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import TypographyTexts from 'src/views/typography/TypographyTexts'
import TypographyHeadings from 'src/views/typography/TypographyHeadings'
import DownloadPage from './DownloadPage'


const DownloadIndex = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DownloadPage />
      </Grid>
    </Grid>
  )
}

export default DownloadIndex
