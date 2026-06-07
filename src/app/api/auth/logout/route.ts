import { NextResponse } from "next/server";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
} from "@/lib/auth/cookies";
import { cookies } from "next/headers";
import { serverApi } from "@/lib/api/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = getAccessToken(cookieStore);
  const refreshToken = getRefreshToken(cookieStore);

  try {
    await serverApi.post(
      "/auth/logout",
      { refresh_token: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
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
