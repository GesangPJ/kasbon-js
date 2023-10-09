// ** Icon imports
import { MonitorHeart } from '@mui/icons-material'
import { AddCircle } from '@mui/icons-material'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined'
import PaidIcon from '@mui/icons-material/Paid'
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined'

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
      title: 'Bayar',
      icon: PaidIcon,
      path: '/bayar-kasbon'
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
      title: 'Download Data',
      icon: SaveAltOutlinedIcon,
      path: '/download',
      openInNewTab: false
    }
  ]
}

export default AdminNavigation