// ** Icon imports
import { MonitorHeart } from '@mui/icons-material'
import { AddCircle } from '@mui/icons-material'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined'
import PaidIcon from '@mui/icons-material/Paid'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

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
      path: '/RequestPage'
    },
    {
      title: 'Bayar',
      icon: PaidIcon,
      path: '/bayar-kasbon'
    },
    {
      title: 'Download Data',
      icon: FileDownloadOutlinedIcon,
      path: '/download',
      openInNewTab: false
    },
    {
      sectionTitle: 'Lainnya'
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
    }
  ]
}

export default AdminNavigation
