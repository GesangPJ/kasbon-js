import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import Menu from 'mdi-material-ui/Menu';
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler';
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown';
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown';
import Typography from '@mui/material/Typography';

const AppBarContent = (props) => {
  const { hidden, settings, saveSettings, toggleNavVisibility } = props;
  const hiddenSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    async function fetchSessionData() {
      try {
        const response = await fetch('http://localhost:3001/api/get-session', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          const sessionData = await response.json();

          if (sessionData && sessionData.username) {
            // Session data contains 'username' field
            setSessionData(sessionData);
          } else {
            console.error('Session data not found');
          }
        } else {
          console.error('Failed to fetch session data');
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    }

    fetchSessionData();
  }, []); // The empty array as the second argument means this effect runs only on component mount.

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
      </Box>
      <Box className="actions-right" sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ModeToggler settings={settings} saveSettings={saveSettings} />
          <NotificationDropdown />
          <UserDropdown />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {sessionData ? sessionData.username : 'User'}
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default AppBarContent;
