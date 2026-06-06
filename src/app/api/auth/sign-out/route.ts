import { NextResponse } from "next/server";
import { clearAuthCookies, getAccessToken } from "@/lib/auth/cookies";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = getAccessToken(cookieStore);

  try {
    await fetch(`${process.env.API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error occurred while logging out:", error);
  } finally {
    clearAuthCookies(cookieStore);
  }

  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 },
  );
}
