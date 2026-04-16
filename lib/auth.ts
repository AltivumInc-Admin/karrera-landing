import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  GetUserCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";

let _client: CognitoIdentityProviderClient | null = null;

function getClient(): CognitoIdentityProviderClient {
  if (!_client) {
    _client = new CognitoIdentityProviderClient({
      region: process.env.NEXT_PUBLIC_AWS_REGION ?? "us-east-1",
    });
  }
  return _client;
}

function getPoolId(): string {
  return process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "";
}

function getClientId(): string {
  return process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? "";
}

let _jwks: JWTVerifyGetKey | null = null;

function getJWKS(): JWTVerifyGetKey {
  if (!_jwks) {
    const poolId = getPoolId();
    const url = `https://cognito-idp.us-east-1.amazonaws.com/${poolId}/.well-known/jwks.json`;
    _jwks = createRemoteJWKSet(new URL(url));
  }
  return _jwks;
}

export async function signIn(email: string, password: string) {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: getClientId(),
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });
  return getClient().send(command);
}

export async function respondToNewPasswordChallenge(
  session: string,
  email: string,
  newPassword: string
) {
  const command = new RespondToAuthChallengeCommand({
    ChallengeName: "NEW_PASSWORD_REQUIRED",
    ClientId: getClientId(),
    ChallengeResponses: {
      USERNAME: email,
      NEW_PASSWORD: newPassword,
    },
    Session: session,
  });
  return getClient().send(command);
}

export async function refreshTokens(refreshToken: string) {
  const command = new InitiateAuthCommand({
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: getClientId(),
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  });
  const result = await getClient().send(command);
  return result.AuthenticationResult;
}

export async function getUserFromToken(accessToken: string) {
  const command = new GetUserCommand({ AccessToken: accessToken });
  return getClient().send(command);
}

export async function verifyToken(token: string) {
  return jwtVerify(token, getJWKS(), {
    issuer: `https://cognito-idp.us-east-1.amazonaws.com/${getPoolId()}`,
  });
}

export async function signOut(accessToken: string) {
  const command = new GlobalSignOutCommand({ AccessToken: accessToken });
  return getClient().send(command);
}
