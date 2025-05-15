import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              expiresInMins: 30,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Invalid login credentials");
          }
     

          return {
            id: data.id,
            permissions: data.permissions,
            email: data.email,
            role: data.role,
            token: data.token,
          };
        } catch (error) {
          console.error("Authorize Error:", error);
          throw new Error("Login failed. Please check your credentials.");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }:{ token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.permissions = user.permissions;
        token.email = user.email;
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },

    async session({ session, token }:{ session: any; token: any }) {
      const res = await fetch(`http://localhost:5000/api/auth/user/${token.id}`,{
        headers:{
          Authorization: `Bearer ${token.token}`,
        }
      });
      
      if (!res.ok) return null; 
      if (session.user) {
        session.user.id = token.id;
        session.user.permissions = token.permissions;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.token = token.token;
      }
      return session;
    },
  },
});
