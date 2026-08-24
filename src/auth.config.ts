import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  // Required for production hosting (Vercel) where the host header comes
  // from a proxy — without this every sign-in fails with UntrustedHost.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
