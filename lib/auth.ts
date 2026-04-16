import {
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  GetUserCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";
import { getCognitoClient } from "./aws";
import { AWS_REGION, COGNITO } from "./constants";

let _jwks: JWTVerifyGetKey | null = null;

function getJWKS(): JWTVerifyGetKey {
  if (!_jwks) {
    const url = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO.USER_POOL_ID}/.well-known/jwks.json`;
    _jwks = createRemoteJWKSet(new URL(url));
  }
  return _jwks;
}

export async function signIn(email: string, password: string) {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: COGNITO.WEB_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });
  return getCognitoClient().send(command);
}

export async function respondToNewPasswordChallenge(
  session: string,
  email: string,
  newPassword: string
) {
  const command = new RespondToAuthChallengeCommand({
    ChallengeName: "NEW_PASSWORD_REQUIRED",
    ClientId: COGNITO.WEB_CLIENT_ID,
    ChallengeResponses: {
      USERNAME: email,
      NEW_PASSWORD: newPassword,
    },
    Session: session,
  });
  return getCognitoClient().send(command);
}

export async function refreshTokens(refreshToken: string) {
  const command = new InitiateAuthCommand({
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: COGNITO.WEB_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  });
  const result = await getCognitoClient().send(command);
  return result.AuthenticationResult;
}

export async function getUserFromToken(accessToken: string) {
  const command = new GetUserCommand({ AccessToken: accessToken });
  return getCognitoClient().send(command);
}

export async function verifyToken(token: string) {
  return jwtVerify(token, getJWKS(), {
    issuer: `https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO.USER_POOL_ID}`,
  });
}

export async function signOut(accessToken: string) {
  const command = new GlobalSignOutCommand({ AccessToken: accessToken });
  return getCognitoClient().send(command);
}
