// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant='caption' sx={{ mr: 2 }}>
        {`KASBON WEB | © 2023 - ${new Date().getFullYear()} GESANG TECHNOLOGY`}
      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <Link
            target='_blank'
            href='https://github.com/GesangPJ/katalog-obat'
          >
            About
          </Link>
        </Box>
      )}
    </Box>
  )
}

export default FooterContent
