// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import { MonitorHeart } from '@mui/icons-material'
import { AddCircle } from '@mui/icons-material'
import { ModeEdit } from '@mui/icons-material'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';

const AdminNavigation = () => {
  return [
    {
      sectionTitle: 'Data Kasbon'
    },
    {
      title: 'Dashboard',
      icon: SpaceDashboardOutlinedIcon,
      path: '/dashboard-admin'
    },
    {
      title: 'Request',
      icon: RequestQuoteOutlinedIcon,
      path: '/request-kasbon'
    },
    {
      sectionTitle: 'Admin'
    },
    {
      title: 'Web Status',
      icon: MonitorHeart,
      path: '/status'
    },
    {
      title: 'Tambah User',
      icon: AddCircle,
      path: '/register-user',
      openInNewTab: false
    },
    {
      title: 'Tambah Admin',
      icon: AddCircle,
      path: '/register-admin',
      openInNewTab: false
    },
    {
      title: 'Edit Obat Generik',
      icon: ModeEdit,
      path: '/edit-obat-generik',
      openInNewTab: false
    },
    {
      title: 'Edit Obat Herbal',
      icon: ModeEdit,
      path: '/edit-obat-herbal',
      openInNewTab: false
    }
  ]
}

export default AdminNavigation
