import axios from "axios";
import { signInSchema } from "@/schemas/auth";
import validateFormData from "@/helpers/validate-schema";
import { NextResponse } from "next/server";
import { AuthTokens } from "@/types/auth";
import { cookies } from "next/headers";
import { setAuthCookies } from "@/lib/auth/cookies";
import { serverApi } from "@/lib/api/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { errors } = validateFormData(signInSchema, body);

  if (errors) {
    return NextResponse.json(
      { message: "Validation failed", errors },
      { status: 400 },
    );
  }

  try {
    const { data } = await serverApi.post("/auth/vendor/login", {
      email: body.email,
      password: body.password,
    });

    const tokens: AuthTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: new Date(data.expires_at).getTime(),
    };

    if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_at) {
      return NextResponse.json(
        { message: "Invalid response from auth server" },
        { status: 500 },
      );
    }

    const cookieStore = await cookies();

    setAuthCookies(cookieStore, tokens);

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          message: error.response?.data?.message ?? "Login failed",
        },
        {
          status: error.response?.status ?? 500,
        },
      );
    }

    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 },
    );
  }
}
