import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
const BACKEND_ROOT = process.env.NEXT_PUBLIC_BACKEND_ROOT!;

const HEALTH_URL = `${BACKEND_ROOT}/`;
const REFRESH_URL = `${API_BASE}/token/refresh-cookie/`;
const ME_URL = `${API_BASE}/me/`;

// Allowed only during maintenance mode
const MAINTENANCE_ALLOWED = ["/", "/login", "/admin"];

function isMaintenanceAllowed(path: string) {
  const allowed = MAINTENANCE_ALLOWED.some(
    (p) => path === p || path.startsWith(p + "/")
  );
  return allowed;
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;


  // ⭐ Bypass ONLY the Django backend logout endpoint
  if (path === "/api/logout/" || path === "/api/logout") {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  /* -----------------------------------------
   * 1️⃣ BACKEND HEALTH CHECK
   * -----------------------------------------*/
  const { healthy, underMaintenance } = await checkHealth();


  res.cookies.set("backend_healthy", healthy ? "true" : "false", { path: "/" });
  res.cookies.set("under_maintenance", underMaintenance ? "true" : "false", {
    path: "/",
  });

  /* -----------------------------------------
   * A️⃣ BACKEND DOWN → HARD STOP
   * -----------------------------------------*/
  if (!healthy) {

    if (path !== "/") {
      return redirect(req, "/");
    }

    return res;
  }

  /* -----------------------------------------
   * B️⃣ MAINTENANCE MODE
   * -----------------------------------------*/

  if (underMaintenance) {

    if (!isMaintenanceAllowed(path)) {
      return redirect(req, "/");
    }

    if (path.startsWith("/login")) {
      return res;
    }

    if (path.startsWith("/admin")) {
      return handleProtectedAuth(req, res, path);
    }

    return res;
  }

  /* -----------------------------------------
   * C️⃣ NORMAL MODE
   * -----------------------------------------*/
  return handleProtectedAuth(req, res, path);
}

/* -----------------------------------------
 * PROTECTED ROUTE HANDLER
 * -----------------------------------------*/
async function handleProtectedAuth(
  req: NextRequest,
  res: NextResponse,
  path: string
) {

  if (path === "/") {
    return res;
  }

  const refresh = req.cookies.get("refresh")?.value;

  const PROTECTED = ["/admin", "/manager", "/sales"];
  const isProtected = PROTECTED.some((p) => path.startsWith(p));


  if (isProtected && !refresh) {
    return redirect(req, "/");
  }

  let user = null;

  if (refresh) {

    const access = await refreshAccessToken(refresh);

    if (!access) {
      return logout(req);
    }

    res.cookies.set("access", access, { httpOnly: false, path: "/" });

    user = await fetchUser(access);

    if (!user) {
      return logout(req);
    }


    if (!allowRole(path, user.role)) {
      return redirect(req, routeForRole(user.role));
    }

  }

  if (path === "/login" && user) {
    return redirect(req, routeForRole(user.role));
  }

  return res;
}

/* -----------------------------------------
 * HELPERS WITH LOGGING
 * -----------------------------------------*/
async function checkHealth() {

  try {
    const r = await fetch(HEALTH_URL, { cache: "no-store" });


    const json = await r.json().catch(() => {
      return {};
    });

    const result = {
      healthy: r.ok && json?.status === "ok",
      underMaintenance: json?.under_maintenance === true,
    };

    return result;
  } catch (err) {
    return { healthy: false, underMaintenance: false };
  }
}

async function refreshAccessToken(refreshToken: string) {

  try {
    const res = await fetch(REFRESH_URL, {
      method: "POST",
      headers: { Cookie: `refresh=${refreshToken};` },
    });


    if (!res.ok) {
      return null;
    }

    const json = await res.json();

    return json.access ?? null;
  } catch (err) {
    return null;
  }
}

async function fetchUser(access: string) {

  try {
    const res = await fetch(ME_URL, {
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
    });


    if (!res.ok) return null;

    const json = await res.json();
    return json;
  } catch (err) {
    return null;
  }
}

function allowRole(path: string, role: string) {

  if (path.startsWith("/admin")) return role === "admin";
  if (path.startsWith("/manager")) return role === "manager";
  if (path.startsWith("/sales")) return role === "sales";

  return true;
}

function routeForRole(role: string) {

  if (role === "admin") return "/admin";
  if (role === "manager") return "/manager";
  if (role === "sales") return "/sales";
  return "/";
}

function redirect(req: NextRequest, to: string) {
  return NextResponse.redirect(new URL(to, req.url));
}

function logout(req: NextRequest) {

  const r = redirect(req, "/");
  r.cookies.set("refresh", "", { maxAge: 0, path: "/" });

  return r;
}

/* -----------------------------------------
 * MATCHER
 * -----------------------------------------*/
export const config = {
  matcher: [
    "/((?!_next/|static/|assets/|media/|images/|fonts/|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$|.*\\.mp4$|.*\\.mp3$|.*\\.css$|.*\\.js$).*)",
  ],
};
