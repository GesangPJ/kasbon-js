import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { pool } from 'server/postgres';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Admin Credentials',
      credentials: {
        username: { label: "Nama" },
        password: { label: "Password" }
      },
      authorize: async (credentials) => {
        const { username, password } = credentials;
        const client = await pool.connect();

        try {
          const query = 'SELECT id_user, nama, roles FROM admin WHERE username = $1 AND password = $2';
          const { rows } = await client.query(query, [username, password]);

          if (rows.length === 1) {
            const admin = rows[0];

            return Promise.resolve(admin);
          }
        } finally {
          client.release();
        }

        return Promise.resolve(null);
      },
    }),
  ],
  callbacks: {
    async session(session, admin) {
      session.admin = admin;
      if (admin.id_admin) {
        session.id_admin = admin.id_admin;
      }
      if (admin.nama) {
        session.nama = admin.nama;
      }
      if (admin.roles) {
        session.roles = admin.roles;
      }

      return session;
    },
  },
  session: {
    jwt: true,
  },
  pages: {
    signIn: '/admin-masuk', // Adjust this based on your Next.js routes for admin login
  },
});
