import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "./auth";

export interface SessionUser {
  email: string;
  name: string;
  sub: string;
  stripeProduct?: string;
}

export async function getServerSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("karrera_id_token")?.value;
  if (!idToken) return null;
  try {
    const { payload } = await verifyToken(idToken);
    return {
      email: payload.email as string,
      name: (payload.name as string) ?? "",
      sub: payload.sub as string,
      stripeProduct: payload["custom:stripe_product"] as string | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Build a NextResponse with session cookies attached.
 * This avoids the Next.js 15 issue where cookies().set() throws
 * in Route Handlers after the request body has been read.
 */
export function buildSessionResponse(
  body: Record<string, unknown>,
  tokens: {
    AccessToken?: string;
    IdToken?: string;
    RefreshToken?: string;
  },
  status = 200
): NextResponse {
  const res = NextResponse.json(body, { status });
  const isProduction = process.env.NODE_ENV === "production";

  const baseOptions = {
    httpOnly: true,
    secure: isProduction,
    path: "/",
    sameSite: "lax" as const,
  };

  if (tokens.AccessToken) {
    res.cookies.set("karrera_access_token", tokens.AccessToken, {
      ...baseOptions,
      maxAge: 3600,
    });
  }
  if (tokens.IdToken) {
    res.cookies.set("karrera_id_token", tokens.IdToken, {
      ...baseOptions,
      maxAge: 3600,
    });
  }
  if (tokens.RefreshToken) {
    res.cookies.set("karrera_refresh_token", tokens.RefreshToken, {
      ...baseOptions,
      maxAge: 30 * 24 * 3600,
    });
  }

  return res;
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("karrera_access_token");
  cookieStore.delete("karrera_id_token");
  cookieStore.delete("karrera_refresh_token");
}
