import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

const POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const JWKS_URL = `https://cognito-idp.us-east-1.amazonaws.com/${POOL_ID}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export const config = { matcher: ["/dashboard/:path*"] };

async function verifyAccessToken(token: string) {
  return jwtVerify(token, JWKS, {
    issuer: `https://cognito-idp.us-east-1.amazonaws.com/${POOL_ID}`,
  });
}

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("karrera_access_token")?.value;

  if (accessToken) {
    try {
      await verifyAccessToken(accessToken);
      return NextResponse.next();
    } catch {
      // Token invalid or expired — try refresh below
    }
  }

  const refreshToken = req.cookies.get("karrera_refresh_token")?.value;
  if (refreshToken) {
    try {
      const refreshRes = await fetch(
        `https://cognito-idp.us-east-1.amazonaws.com/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
          },
          body: JSON.stringify({
            AuthFlow: "REFRESH_TOKEN_AUTH",
            ClientId: CLIENT_ID,
            AuthParameters: { REFRESH_TOKEN: refreshToken },
          }),
        }
      );

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const tokens = data.AuthenticationResult;
        if (tokens?.AccessToken) {
          const res = NextResponse.next();
          res.cookies.set("karrera_access_token", tokens.AccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 3600,
          });
          if (tokens.IdToken) {
            res.cookies.set("karrera_id_token", tokens.IdToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              path: "/",
              sameSite: "lax",
              maxAge: 3600,
            });
          }
          return res;
        }
      }
    } catch {
      // Refresh failed
    }
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
