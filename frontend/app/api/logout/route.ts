import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  try {
    // Call Django logout (ALWAYS TRAILING SLASH)
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/api/logout/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Cookie: req.headers.get("cookie") || "",
        },
      }
    );


    const res = NextResponse.json({ message: "Logged out" });

    // ⭐ FORCE REMOVE refresh cookie
    res.cookies.set("refresh", "", {
      maxAge: 0,
      path: "/",
    });

    // ⭐ FORCE REMOVE access cookie (FE-side)
    res.cookies.set("access", "", {
      maxAge: 0,
      path: "/",
    });


    return res;
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
