import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
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
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { makeStyles } from '@mui/styles'

require('dotenv').config()



const RoundedRectangleButton = styled(Button)`
  border-radius: 32px;
  position: sticky;
  &:disabled {
    border-radius: 32px
  }`

const useStyles = makeStyles((theme) => ({
  ovalButton: {
    borderRadius: '50%',
  },
}))

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
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const classes = useStyles()

  const [values, setValues] = useState({
    idakun: '',
    password: '',
    showPassword: false,
  })

  const router = useRouter()

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleLogin = async () => {
    if (!values.idakun || !values.password) {
      // Display an error message if either field is empty
      setErrorMessage('Semua kolom harus diisi !')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)

      return
    }
    try {
      const AksesKunci = process.env.NEXT_PUBLIC_SECRET_API_KEY
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/masuk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Key-Api': process.env.NEXT_PUBLIC_SECRET_API_KEY,
        },
        body: JSON.stringify(values),
      })

      if (response.status === 200) {
        const data = await response.json()
        console.log('Response data:', data)
        setSuccessMessage('Login Sukses')
        setTimeout(() => {
          setSuccessMessage('')
        }, 2000)

        // Check if data contains role information
        if (data && data.isAdmin !== undefined && data.roles !== '') {
          const role = data.roles

          const tanggalAkun = new Date(data.tanggal_akun)
          const jakartaTimezone = 'Asia/Jakarta'

          const tanggalFormat = tanggalAkun.toLocaleString('id-ID', { timeZone: jakartaTimezone })

          const sessionData = {
            id_table: data.id,
            username: data.username,
            email: data.email,
            role,
            isAdmin: role === 'admin',
            id_akun: data.id_akun,
            tanggal_akun: tanggalFormat,
            csrfToken: data.csrfToken,
          }

          // Store the session data as a JSON string in session storage
          sessionStorage.setItem('sessionData', JSON.stringify(sessionData))

          // Jika sukses
          router.push(`/dashboard-${role}`)
        }
        else {
          console.error('ID Tidak ditemukan')
        }
      } else if (response.status === 401) {
        // Jika data akun tidak ketemu
        setErrorMessage('Data tidak valid. Mohon cek kembali ID Dan Password.')
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      }
      else {
        console.error('Login error:', response.statusText)
        setErrorMessage('Login Error : ', response.statusText)
        setTimeout(() => {
          setErrorMessage('')
        }, 3000)
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('Internal Server Error')
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
  }
  useEffect(() => {

  }, [])

  const theme = useTheme()

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: (theme) => `${theme.spacing(12, 9, 7)} !important` }}>
          {errorMessage && (
            <Alert severity="error">{errorMessage}</Alert>
          )}
          {successMessage && (
            <Alert severity="success">{successMessage}</Alert>
          )}<br></br>
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
          <form noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <TextField
              autoFocus
              fullWidth
              id="idakun"
              label="ID Anda"
              sx={{ marginBottom: 4 }}
              value={values.idakun}
              onChange={handleChange("idakun")}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor="auth-login-password">Password</InputLabel>
              <OutlinedInput
                label="Password"
                value={values.password}
                id="auth-login-password"
                onChange={handleChange("password")}
                type={values.showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label="toggle password visibility"
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (values.idakun && values.password) {
                      handleLogin()
                    }
                  }
                }}
              />
            </FormControl>
            <Box
              sx={{
                mb: 4,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            ></Box>
            <RoundedRectangleButton
              type="button"
              variant="contained"
              color="primary"
              sx={{
                marginBottom: 7,
                display: "block",
                margin: "0 auto",
                width: "300px",
              }}
              onClick={() => {
                if (values.idakun && values.password) {
                  handleLogin()
                } else {

                  setErrorMessage("Semua Kolom Harus Diisi !")
                  setTimeout(() => {
                    setErrorMessage("")
                  }, 5000)
                }
              }}
            >
              Masuk
            </RoundedRectangleButton>
          </form>
        </CardContent><br></br><br></br>
        <Typography variant='caption'>
        {themeConfig.buildVersion}
        </Typography>
        <Typography variant='caption'>
          --{themeConfig.backVersion}
        </Typography>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

SignPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default SignPage
