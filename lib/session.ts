import { cookies } from "next/headers";
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

export async function setSessionCookies(tokens: {
  AccessToken?: string;
  IdToken?: string;
  RefreshToken?: string;
}) {
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax" as const,
  };

  if (tokens.AccessToken) {
    cookieStore.set("karrera_access_token", tokens.AccessToken, {
      ...cookieOptions,
      maxAge: 3600, // 1 hour
    });
  }
  if (tokens.IdToken) {
    cookieStore.set("karrera_id_token", tokens.IdToken, {
      ...cookieOptions,
      maxAge: 3600,
    });
  }
  if (tokens.RefreshToken) {
    cookieStore.set("karrera_refresh_token", tokens.RefreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 3600, // 30 days
    });
  }
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("karrera_access_token");
  cookieStore.delete("karrera_id_token");
  cookieStore.delete("karrera_refresh_token");
}
