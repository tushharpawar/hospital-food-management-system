import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const users = [
          { email: process.env.HOSPITAL_MANAGER_EMAIL, password: process.env.PASSWORD },
          { email: process.env.HOSPITAL_PANTRY_EMAIL, password: process.env.PASSWORD },
          { email: process.env.HOSPITAL_DELIVERY_EMAIL, password: process.env.PASSWORD },
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
