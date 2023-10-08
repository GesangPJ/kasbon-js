// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({ nama: '' });
  const [admin, setAdmin] = useState({ nama: '' });
  const router = useRouter();

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  // Fungsi Tombol Logout
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/api/logout', {
        method: 'GET',
        credentials: 'include',
      });

      // hapus session storage saat logout
      sessionStorage.clear();

      // Arahkan ke login
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);


    }

    setAnchorEl(null); // tutup dropdown
  };


  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // Ambil Data session dari session storage
    const sessionDataStr = sessionStorage.getItem('sessionData');
    if (sessionDataStr) {
      const sessionData = JSON.parse(sessionDataStr);
      setSessionData(sessionData);
    }
  }, []);

  return (
    <Fragment>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt="User Icon"
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src="/images/avatars/user-icon.png"
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap="circular"
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar
                alt="User Icon"
                src="/images/avatars/user-icon.png"
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 450 }}>{sessionData ? sessionData.username : 'User'}</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {sessionData ? sessionData.id_akun : 'User'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />

        <Divider />
        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={handleLogout}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
