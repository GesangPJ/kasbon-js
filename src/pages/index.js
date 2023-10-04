import { useState } from 'react'
import { signIn } from 'next-auth/react'
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

const SignPage = () => {
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
    try {
      const response = await fetch('http://localhost:3001/api/masuk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.status === 200) {
        const data = await response.json();

        // Check if data contains role information
        if (data && data.roles) {
          const role = data.roles; // Assuming the role is directly available in data

          // Store the user or admin data in sessionStorage
          const sessionData = {
            id: data.id,
            username: values.username,
            email: data.email,
            nama: data.nama,
            roles: role,
            isAdmin: role === 'admin',

            // Add other attributes from your session data if needed
          };

          // Store the session data as a JSON string
          sessionStorage.setItem('sessionData', JSON.stringify(sessionData));

          // Wait for the session data to be set
          await fetch('http://localhost:3001/api/get-session', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // Once session data is available, perform routing
          router.push(`/dashboard-${role}`);
        } else {
          console.error('Role tidak dapat diambil');
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
              Masuk Ke Akun Anda Untuk Melanjutkan
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
                Tidak ada akun?
              </Typography>
              <Link passHref href='/registrasi'>
                <LinkStyled>Buat Akun</LinkStyled>
              </Link>
            </Box><br></br>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Admin?
              </Typography>
              <Link passHref href='/admin-masuk'>
                <LinkStyled>Akses Admin</LinkStyled>
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

SignPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default SignPage
