import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import Menu from 'mdi-material-ui/Menu';
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler';
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown';
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown';
import SearchBar from './SearchBar'; // Import the SearchBar component
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react';


const AppBarContent = (props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props;

  // ** Hook
  const hiddenSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [user, setUser] = useState({ nama: '' });
  const [admin, setAdmin] = useState({ nama: '' });

  useEffect(() => {
    // Fetch user information from the session when the component mounts
    async function fetchUserInfo() {
      try {
        const response = await fetch('http://localhost:3001/api/session', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    fetchUserInfo();
  }, []);



  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space between' }}>
      <Box className="actions-left" sx={{ mr: 2, display: 'flex', justifyContent: 'flex-end' }}>
        {hidden ? (
          <IconButton
            color="inherit"
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
          >
            <Menu />
          </IconButton>
        ) : null}
        {/*<SearchBar />*/} {/* New Custom Search Bar */}
      </Box>
      <Box className="actions-right" sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ModeToggler settings={settings} saveSettings={saveSettings} />
          <NotificationDropdown />
          <UserDropdown />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>{user.nama || (admin.nama ? admin.nama : 'User')}</Typography>
        </div>
      </Box>
    </Box>
  )
}

export default AppBarContent
