// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import { MonitorHeart } from '@mui/icons-material'
import { AddCircle } from '@mui/icons-material'
import { ModeEdit } from '@mui/icons-material'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'

const AdminNavigation = () => {
  return [
    {
      sectionTitle: 'Data'
    },
    {
      title: 'Dashboard',
      icon: SpaceDashboardOutlinedIcon,
      path: '/'
    },
    {
      title: 'Kasbon',
      icon: AccountBalanceWalletOutlinedIcon,
      path: '/obat-herbal'
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
      title: 'Tambah Obat Generik',
      icon: AddCircle,
      path: '/tambah-obat-generik',
      openInNewTab: false
    },
    {
      title: 'Tambah Obat Herbal',
      icon: AddCircle,
      path: '/tambah-obat-herbal',
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
