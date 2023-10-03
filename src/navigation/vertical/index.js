// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import { MonitorHeart } from '@mui/icons-material'
import { AddCircle } from '@mui/icons-material'
import { ModeEdit } from '@mui/icons-material'
import { AdminPanelSettings } from '@mui/icons-material'

const navigation = () => {
  return [
    {
      sectionTitle: 'Data'
    },
    {
      title: 'Dashboard',
      icon: Table,
      path: '/'
    },
    {
      title: 'Obat Herbal',
      icon: Table,
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


    /*
    {
      title: 'Admin Settings',
      icon: AdminPanelSettings,
      path: '/'
    }


        {
          title: 'Login',
          icon: Login,
          path: '/pages/login',
          openInNewTab: true
        },
        {
          title: 'Register',
          icon: AccountPlusOutline,
          path: '/pages/register',
          openInNewTab: true
        },

    {
      sectionTitle: ''
    }


    {
      title: 'Typography',
      icon: FormatLetterCase,
      path: '/typography'
    },
    {
      title: 'Icons',
      path: '/icons',
      icon: GoogleCirclesExtended
    },
    {
      title: 'Cards',
      icon: CreditCardOutline,
      path: '/cards'
    },
    {
      title: 'Tables',
      icon: Table,
      path: '/tables'
    },
    {
      icon: CubeOutline,
      title: 'Form Layouts',
      path: '/form-layouts'
    }*/
  ]
}

export default navigation
