import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { pool } from 'server/postgres' // Import your PostgreSQL connection pool

export default NextAuth({
  providers: [
    Providers.Credentials({
      // The name to display on the sign-in form (e.g., 'Sign in with...')
      name: 'Credentials',
      credentials: {
        username: { label: "Nama" },
        password: { label: "Password" }
      },
      authorize: async (credentials) => {
        // Add custom logic to validate user credentials in the database
        const { username, password } = credentials;
        const client = await pool.connect();

        try {
          const query = 'SELECT id_user, nama, roles FROM user WHERE username = $1 AND password = $2';
          const { rows } = await client.query(query, [username, password]);

          if (rows.length === 1) {
            const user = rows[0];

            return Promise.resolve(user);
          }
        } finally {
          client.release();
        }

        return Promise.resolve(null);
      },
    }),
  ],
  callbacks: {
    async session(session, user) {
      // Add custom properties to the session
      session.user = user;

      return session;
    },
  },
  session: {
    jwt: true,
  },
  pages: {
    signIn: '/', // Adjust this based on your Next.js routes
  },
})
