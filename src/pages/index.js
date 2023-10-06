import { useState, useEffect } from 'react'
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
import Skeleton from '@mui/material/Skeleton'

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
  const [loading, setLoading] = useState(true)

  const [values, setValues] = useState({
    idakun: '', // Change 'name' to 'username'
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
        console.log('Response data:', data);

        // Check if data contains role information
        if (data && data.isAdmin !== undefined && data.roles !== '') {
          const role = data.roles;

          const tanggalAkun = new Date(data.tanggal_akun);
          const jakartaTimezone = 'Asia/Jakarta';

          const tanggalFormat = tanggalAkun.toLocaleString('id-ID', { timeZone: jakartaTimezone });

          const sessionData = {
            id_table: data.id,
            username: data.username,
            email: data.email,
            role,
            isAdmin: role === 'admin',
            id_akun: data.id_akun,
            tanggal_akun: tanggalFormat,
          };

          // Store the session data as a JSON string in session storage
          sessionStorage.setItem('sessionData', JSON.stringify(sessionData));

          // Once session data is available, perform routing
          router.push(`/dashboard-${role}`);
        } else {
          console.error('Role or id not found');
        }
      } else {
        console.error('Login error:', response.statusText);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  useEffect(() => {
    // Simulate loading the login form
    setTimeout(() => {
      setLoading(false);
    }, 2500);

  }, []);




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
            {loading ? (
              <Skeleton animation="wave" variant="rect" width={40} height={40} sx={{ backgroundColor: 'lightgray', marginRight: 2 }} />
            ) : (
              <ReceiptLongOutlinedIcon color='primary' />
            )}
            {loading ? (
              <Skeleton animation="wave" variant="text" width={120} sx={{ backgroundColor: 'lightgray' }} />
            ) : (
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
            )}
          </Box>
          <Box sx={{ mb: 6 }}>
            {loading ? (
              <Skeleton animation="wave" variant="text" width={200} sx={{ backgroundColor: 'lightgray' }} />
            ) : (
              <Typography variant='body2' align='center'>
                Masuk Ke Akun Anda Untuk Melanjutkan
              </Typography>
            )}
          </Box>
          {loading ? (
            <Skeleton animation="wave" variant="text" width={240} height={40} sx={{ backgroundColor: 'lightgray' }} />
          ) : (
            <form noValidate autoComplete='off' onSubmit={(e) => e.preventDefault()}>
              <TextField
                autoFocus
                fullWidth
                id='idakun'
                label='ID Anda' // Change 'Nama' to 'Username'
                sx={{ marginBottom: 4 }}
                value={values.idakun}
                onChange={handleChange('idakun')}
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
            </form>
          )}
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

SignPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default SignPage
