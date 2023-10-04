import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'

import themeConfig from 'src/configs/themeConfig'

import BlankLayout from 'src/@core/layouts/BlankLayout'

import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { Receipt } from '@mui/icons-material'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const AdminSignIn = () => {
  const [values, setValues] = useState({
    username: '', // Change 'name' to 'username'
    password: '',
    showPassword: false,
  });

  const router = useRouter(); // Use the router to navigate

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleLogin = async () => {
    // Send a POST request to your Express server for user authentication
    try {
      const response = await fetch('http://localhost:3001/api/login-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.status === 200) {
        const data = await response.json();
        if (data.admin === 'admin') {
          router.push('/dashboard-admin')
        } else {
          router.push('/dashboard-admin')
        }
      } else {
        console.error('Login error:', response.statusText);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const theme = useTheme();

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [PostgreStatus, setPostgreStatus] = useState('Loading'); // Default status
  const [serverStatus, setServerStatus] = useState('Loading');

  useEffect(() => {

    // Ambil status PostgreSQL
    fetch('http://localhost:3001/api/postgres-status')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setPostgreStatus(data.isConnected ? 'Online' : 'Offline');
      })
      .catch((error) => {
        console.error('Error:', error);
        setPostgreStatus('Error');
      })

    fetch('http://localhost:3001/api/server-status')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return response.json();
      })
      .then((data) => {
        setServerStatus(data.status)
      })
      .catch((error) => {
        console.error('Error:', error)
        setServerStatus('Error');
      })

  })

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: (theme) => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ReceiptLongOutlinedIcon color='primary' />
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important',
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='body2' align='center'>
              Akses Admin
            </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={(e) => e.preventDefault()}>
            <TextField
              autoFocus
              fullWidth
              id='username'
              label='Username' // Change 'Nama' to 'Username'
              sx={{ marginBottom: 4 }}
              value={values.username}
              onChange={handleChange('username')}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            ></Box>
            <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }} onClick={handleLogin}>
              Masuk
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Bukan Admin?
              </Typography>
              <Link passHref href='/'>
                <LinkStyled>Kembali</LinkStyled>
              </Link>
            </Box>
          </form>
        </CardContent>
        <Typography variant="caption" display="block" gutterBottom>
          PostgreSQL : {PostgreStatus}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Server     : {serverStatus}
        </Typography>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

AdminSignIn.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default AdminSignIn
