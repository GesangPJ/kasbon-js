import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import Menu from 'mdi-material-ui/Menu';
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler';
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown';
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown';
import SearchBar from './SearchBar';
import Typography from '@mui/material/Typography';

async function fetchSessionData() {
  try {
    const response = await fetch('/api/session');
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching session data:', error);
  }
}

const AppBarContent = (props) => {
  const { hidden, settings, saveSettings, toggleNavVisibility } = props;
  const hiddenSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    fetchSessionData().then(data => {
      setSessionData(data);
    });
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
      </Box>
      <Box className="actions-right" sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ModeToggler settings={settings} saveSettings={saveSettings} />
          <NotificationDropdown />
          <UserDropdown />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {sessionData && sessionData.nama}
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default AppBarContent;
