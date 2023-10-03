// next-auth.js

import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { pool } from './server/postgres'; // Import your PostgreSQL connection

export default NextAuth({
  providers: [
    Providers.Credentials({
      // The name to display on the sign-in form (e.g., 'Sign in with...')
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { username, password } = credentials;

        try {
          const client = await pool.connect();

          const result = await client.query(
            'SELECT id, name, roles FROM akun WHERE name = $1 AND password = $2',
            [username, password]
          );
          client.release();

          if (result.rowCount === 1) {
            const user = result.rows[0];

            return Promise.resolve({ id: user.id, name: user.name, roles: user.roles });
          }
        } catch (error) {
          console.error('Error during login:', error);
        }

        return Promise.resolve(null);
      },
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.roles = user.roles;
      }

      return token;
    },
  },
  pages: {
    signIn: '/',
    signOut: '/auth/signout',
  },
});
