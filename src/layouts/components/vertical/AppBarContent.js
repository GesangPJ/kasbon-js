import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import Menu from 'mdi-material-ui/Menu';
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler';
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown';
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown';
import SearchBar from './SearchBar'; // Import the SearchBar component

const AppBarContent = (props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props;

  // ** Hook
  const hiddenSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space between' }}>
      <Box className="actions-left" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
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
      <Box className="actions-right" sx={{ display: 'flex', alignItems: 'center' }}>
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <NotificationDropdown />
        <UserDropdown />
      </Box>
    </Box>
  );
};

export default AppBarContent;
