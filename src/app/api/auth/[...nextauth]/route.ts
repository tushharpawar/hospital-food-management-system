import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions:NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const users = [
          { email: "hospital_manager@xyz.com", password: "Password@2025" },
          { email: "hospital_pantry@xyz.com", password: "Password@2025" },
          { email: "hospital_delivery@xyz.com", password: "Password@2025" },
        ];

        const user = users.find(
          (u) => u.email === credentials?.email && u.password === credentials?.password
        );

        if (user) {
          console.log(user);
          return { id: user.email || '', email: user.email };
        }
        return null;
      },
    }),
  ],

  session: {
    strategy: 'jwt' as 'jwt' | 'database', // Change to "database" for server-side sessions
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
