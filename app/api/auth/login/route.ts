import { NextResponse } from "next/server";
import { signIn } from "@/lib/auth";
import { setSessionCookies } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await signIn(email, password);

    if (result.ChallengeName === "NEW_PASSWORD_REQUIRED") {
      return NextResponse.json({
        challenge: "NEW_PASSWORD_REQUIRED",
        session: result.Session,
        email,
      });
    }

    if (result.AuthenticationResult) {
      await setSessionCookies({
        AccessToken: result.AuthenticationResult.AccessToken,
        IdToken: result.AuthenticationResult.IdToken,
        RefreshToken: result.AuthenticationResult.RefreshToken,
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string };
    if (error.name === "NotAuthorizedException") {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    if (error.name === "UserNotFoundException") {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    console.error("Login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
