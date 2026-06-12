// src/app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAMES, updateAccessTokenCookie } from "@/lib/auth/cookies";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "No refresh token found" },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Token refresh failed" },
        { status: res.status },
      );
    }

    if (!data.access_token || !data.expires_at) {
      return NextResponse.json(
        { message: "Invalid response from auth server" },
        { status: 500 },
      );
    }

    updateAccessTokenCookie(cookieStore, {
      access_token: data.access_token,
      expires_at: new Date(data.expires_at).getTime(),
    });

    return NextResponse.json({ message: "Token refreshed" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
