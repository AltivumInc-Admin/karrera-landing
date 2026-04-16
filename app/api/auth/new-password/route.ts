import { NextResponse } from "next/server";
import { respondToNewPasswordChallenge } from "@/lib/auth";
import { buildSessionResponse } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { session, email, newPassword } = await req.json();

    if (!session || !email || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await respondToNewPasswordChallenge(session, email, newPassword);

    if (result.AuthenticationResult) {
      return buildSessionResponse({ ok: true }, {
        AccessToken: result.AuthenticationResult.AccessToken,
        IdToken: result.AuthenticationResult.IdToken,
        RefreshToken: result.AuthenticationResult.RefreshToken,
      });
    }

    return NextResponse.json({ error: "Challenge failed" }, { status: 400 });
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string };
    console.error("New password error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to set new password" },
      { status: 500 }
    );
  }
}
