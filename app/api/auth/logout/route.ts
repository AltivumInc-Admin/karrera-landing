import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signOut } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("karrera_access_token")?.value;

    if (accessToken) {
      try {
        await signOut(accessToken);
      } catch {
        // Continue with local logout even if Cognito call fails
      }
    }

    cookieStore.delete("karrera_access_token");
    cookieStore.delete("karrera_id_token");
    cookieStore.delete("karrera_refresh_token");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
