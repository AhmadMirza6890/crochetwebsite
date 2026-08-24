import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const isAdmin = req.auth?.user?.role === "ADMIN";
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isOnAdminLogin = req.nextUrl.pathname === "/admin/login";

  if (isOnAdmin) {
    if (isOnAdminLogin) {
      if (isLoggedIn && isAdmin) {
        return Response.redirect(new URL("/admin/dashboard", req.nextUrl));
      }
      return;
    }

    if (isLoggedIn && isAdmin) {
      return;
    }

    return Response.redirect(new URL("/admin/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
