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
  const [userRole, setUserRole] = useState(null)

  // Fetch user role from the session
  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch('http://localhost:3001/api/session', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user ? 'user' : data.admin ? 'admin' : null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    }

    fetchUserRole();
  }, [])

  const getNavigationItems = () => {
    if (userRole === 'admin') {
      return AdminNavigation();
    } else if (userRole === 'user') {
      return VerticalNavItems();
    } else {
      // Return empty navigation items if the user is not logged in.
      return [];
    }
  };

  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalNavItems={getNavigationItems()} // Mengubah sidebar sesuai session

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
