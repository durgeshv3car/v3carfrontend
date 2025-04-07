import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Google,
    GitHub,
    CredentialsProvider({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        try {
          const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
              expiresInMins: 30,
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Invalid login credentials");
          }

          return {
            id: data.id,
            username: data.username,
            email: data.email,
            image: data.image,
          };
        } catch (error) {
          throw new Error("Login failed. Please check your credentials.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.image=user.image;
      }
      return token;
    },
    async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id;
          session.user.username = token.username;
          session.user.email = token.email;
          session.user.image=token.image;
          
    
        }
        return session;
      },
  },
});
