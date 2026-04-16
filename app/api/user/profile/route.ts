import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { getUserProfile, updateUserProfile } from "@/lib/dynamo";
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";

let _cognito: CognitoIdentityProviderClient | null = null;

function getCognitoClient(): CognitoIdentityProviderClient {
  if (!_cognito) {
    _cognito = new CognitoIdentityProviderClient({
      region: process.env.NEXT_PUBLIC_AWS_REGION ?? "us-east-1",
      credentials: {
        accessKeyId: (process.env.KARRERA_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID)!,
        secretAccessKey: (process.env.KARRERA_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY)!,
      },
    });
  }
  return _cognito;
}

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getUserProfile(session.email);
  return NextResponse.json(profile ?? { email: session.email, name: session.name });
}

export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone } = body;

  // Update Cognito attributes
  try {
    const attributes = [];
    if (name) attributes.push({ Name: "name", Value: name });
    if (phone) attributes.push({ Name: "phone_number", Value: phone });

    if (attributes.length > 0) {
      await getCognitoClient().send(
        new AdminUpdateUserAttributesCommand({
          UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
          Username: session.email,
          UserAttributes: attributes,
        })
      );
    }
  } catch (err) {
    console.error("Cognito update error:", err);
    // Continue to update DynamoDB even if Cognito fails
  }

  // Update DynamoDB
  await updateUserProfile(session.email, { name, phone });

  return NextResponse.json({ ok: true });
}
