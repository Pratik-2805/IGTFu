import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Call Django backend login API
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ROOT}/api/login/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    const { access, refresh } = data;

    // Prepare response
    const res = NextResponse.json({ success: true });

    // Set refresh token cookie
    res.cookies.set("refreshToken", refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Set access token cookie
    res.cookies.set("accessToken", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { detail: "Login request failed" },
      { status: 500 }
    );
  }
}
