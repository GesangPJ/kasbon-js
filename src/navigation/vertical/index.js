// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import { MonitorHeart } from '@mui/icons-material'
import { AddCircle } from '@mui/icons-material'
import { ModeEdit } from '@mui/icons-material'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

const navigation = () => {
  return [
    {
      sectionTitle: 'Data Kasbon'
    },
    {
      title: 'Dashboard Karyawan',
      icon: SpaceDashboardOutlinedIcon,
      path: '/dashboard-user'
    },
    {
      title: 'Input Kasbon',
      icon: AccountBalanceWalletOutlinedIcon,
      path: '/input-kasbon'
    },
    {
      sectionTitle: 'Lainnya'
    }
  ]
}

export default navigation
