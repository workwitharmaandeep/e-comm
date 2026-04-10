// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { adminAuth } from '@/lib/firebase-admin';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Phone',
      credentials: {
        idToken: { label: "ID Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.idToken) return null;

        try {
          // Verify the Firebase ID token
          const decodedToken = await adminAuth.verifyIdToken(credentials.idToken);
          
          // Return the user object for NextAuth
          return {
            id: decodedToken.uid,
            phone: decodedToken.phone_number,
            name: decodedToken.phone_number, // Default name to phone number
            image: null,
          };
        } catch (error) {
          console.error("Firebase admin auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    // Append the phone number to the JWT token and session
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        if (token.phone) session.user.phone = token.phone;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt" // Required when using Credentials provider
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };