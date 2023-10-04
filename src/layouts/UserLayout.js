// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import VerticalLayout from 'src/@core/layouts/VerticalLayout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'
import AdminNavigation from 'src/navigation/vertical/admin-nav'

// ** Component Import
import VerticalAppBarContent from './components/vertical/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import React, { useEffect, useState } from 'react'

const UserLayout = ({ children }) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/components/use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  // Fetch user role from the session
  const useLoginStatus = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      async function fetchSessionData() {
        try {
          const response = await fetch('http://localhost:3001/api/get-session', {
            method: 'GET',
            credentials: 'include',
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
    }, []);

    return isAdmin;
  };

  //const isAdmin = useLoginStatus();
  //console.log('isAdmin:', isAdmin);

  const navigationItems = AdminNavigation()


  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalNavItems={navigationItems} // Mengubah sidebar sesuai session

      verticalAppBarContent={(
        props // AppBar Content
      ) => (
        <VerticalAppBarContent
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          toggleNavVisibility={props.toggleNavVisibility}
        />
      )}
    >
      {children}
    </VerticalLayout>
  )
}

export default UserLayout
