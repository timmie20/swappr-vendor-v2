import { signInSchema } from "@/schemas/auth";
import validateFormData from "@/helpers/validate-schema";
import { NextResponse } from "next/server";
import { AuthTokens } from "@/types/auth";
import { cookies } from "next/dist/server/request/cookies";
import { setAuthCookies } from "@/lib/auth/cookies";

export async function POST(request: Request) {
  const body = await request.json();
  // Server side form validation
  const { errors } = validateFormData(signInSchema, body);

  if (errors) {
    return NextResponse.json(
      { message: "Validation failed", errors },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/auth/vendor/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: body.email, password: body.password }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Login failed" },
        { status: response.status },
      );
    }

    const tokens: AuthTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: new Date(data.expires_at).getTime(), // ISO → ms
    };

    // Validate response shape
    if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_at) {
      return NextResponse.json(
        { message: "Invalid response from auth server" },
        { status: 500 },
      );
    }

    // Set HttpOnly cookies — tokens never leave the server
    const cookieStore = await cookies();

    setAuthCookies(cookieStore, tokens);

    // Return only what the UI needs — never the tokens themselves
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 },
    );
  }
}
