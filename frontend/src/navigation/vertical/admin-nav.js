// ** Icon imports
import { MonitorHeart } from '@mui/icons-material'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'

const AdminNavigation = () => {
  return [
    {
      sectionTitle: 'Data Kasbon'
    },
    {
      title: 'Dashboard',
      icon: SpaceDashboardOutlinedIcon,
      path: '/dashboard-admin',
      openInNewTab: false,
    },
    {
      title: 'Request',
      icon: RequestQuoteOutlinedIcon,
      path: '/RequestPage',
      openInNewTab: false,
    },
    {
      title: 'Bayar',
      icon: PaidOutlinedIcon,
      path: '/bayar-kasbon',
      openInNewTab: false
    },
    {
      title: 'Laporan Kasbon',
      icon: DescriptionOutlinedIcon,
      path: '/report',
      openInNewTab: false
    },
    {
      title: 'Download Bukti',
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
      icon: GroupAddOutlinedIcon,
      path: '/register-user',
      openInNewTab: false
    },
    {
      title: 'Tambah Admin',
      icon: PersonAddAltOutlinedIcon,
      path: '/register-admin',
      openInNewTab: false
    },
    {
      title: 'Daftar Admin',
      icon: SupervisorAccountOutlinedIcon,
      path: '/DaftarAdmin',
      openInNewTab: false
    },
    {
      title: 'Daftar Karyawan',
      icon: PeopleOutlinedIcon,
      path: '/DaftarKaryawan',
      openInNewTab: false
    }
  ]
}

export default AdminNavigation
