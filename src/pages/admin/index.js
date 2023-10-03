import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client'; // If you are using NextAuth.js for session management

import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import TableObatGenerik from 'src/pages/tableobatgenerik';

const AdminPage = () => {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // Fetch the session data
    getSession().then((session) => {
      if (session) {
        setSessionData(session);
      }
    });
  }, []);

  const router = useRouter();

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='' target='_blank'>
            Admin Page
          </Link>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Obat Generik' titleTypographyProps={{ variant: 'h6' }} />
          <TableObatGenerik />
        </Card>
      </Grid>

      {/* Display session data */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Session Data' titleTypographyProps={{ variant: 'h6' }} />
          <pre>{JSON.stringify(sessionData, null, 2)}</pre>
        </Card>
      </Grid>
    </Grid>
  );
}

export default AdminPage;
