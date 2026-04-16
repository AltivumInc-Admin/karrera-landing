import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";
import { AWS_REGION, COGNITO } from "./lib/constants";

export const config = { matcher: ["/dashboard/:path*"] };

let _jwks: JWTVerifyGetKey | null = null;

function getJWKS(): JWTVerifyGetKey {
  if (!_jwks) {
    const url = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO.USER_POOL_ID}/.well-known/jwks.json`;
    _jwks = createRemoteJWKSet(new URL(url));
  }
  return _jwks;
}

async function verifyAccessToken(token: string) {
  return jwtVerify(token, getJWKS(), {
    issuer: `https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO.USER_POOL_ID}`,
  });
}

export async function middleware(req: NextRequest) {
  // If Cognito is not configured, redirect to login
  if (!COGNITO.USER_POOL_ID || !COGNITO.WEB_CLIENT_ID) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

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
        `https://cognito-idp.${AWS_REGION}.amazonaws.com/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
          },
          body: JSON.stringify({
            AuthFlow: "REFRESH_TOKEN_AUTH",
            ClientId: COGNITO.WEB_CLIENT_ID,
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
