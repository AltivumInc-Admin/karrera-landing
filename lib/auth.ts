import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  GetUserCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createRemoteJWKSet, jwtVerify } from "jose";

const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION ?? "us-east-1",
});

const POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

const JWKS_URL = `https://cognito-idp.us-east-1.amazonaws.com/${POOL_ID}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export async function signIn(email: string, password: string) {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });
  return client.send(command);
}

export async function respondToNewPasswordChallenge(
  session: string,
  email: string,
  newPassword: string
) {
  const command = new RespondToAuthChallengeCommand({
    ChallengeName: "NEW_PASSWORD_REQUIRED",
    ClientId: CLIENT_ID,
    ChallengeResponses: {
      USERNAME: email,
      NEW_PASSWORD: newPassword,
    },
    Session: session,
  });
  return client.send(command);
}

export async function refreshTokens(refreshToken: string) {
  const command = new InitiateAuthCommand({
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  });
  const result = await client.send(command);
  return result.AuthenticationResult;
}

export async function getUserFromToken(accessToken: string) {
  const command = new GetUserCommand({ AccessToken: accessToken });
  return client.send(command);
}

export async function verifyToken(token: string) {
  return jwtVerify(token, JWKS, {
    issuer: `https://cognito-idp.us-east-1.amazonaws.com/${POOL_ID}`,
  });
}

export async function signOut(accessToken: string) {
  const command = new GlobalSignOutCommand({ AccessToken: accessToken });
  return client.send(command);
}
