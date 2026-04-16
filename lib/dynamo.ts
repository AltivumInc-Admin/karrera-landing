import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import type { UserProfile, ResumeRecord } from "@/types/resume";

let _docClient: DynamoDBDocumentClient | null = null;

function getDocClient(): DynamoDBDocumentClient {
  if (!_docClient) {
    const ddbClient = new DynamoDBClient({
      region: process.env.NEXT_PUBLIC_AWS_REGION ?? "us-east-1",
      credentials: {
        accessKeyId: (process.env.KARRERA_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID)!,
        secretAccessKey: (process.env.KARRERA_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY)!,
      },
    });
    _docClient = DynamoDBDocumentClient.from(ddbClient);
  }
  return _docClient;
}

const USERS_TABLE = "karrera-users";
const RESUMES_TABLE = "karrera-resumes";

// ---- User Profile ----

export async function getUserProfile(email: string): Promise<UserProfile | null> {
  const result = await getDocClient().send(
    new GetCommand({
      TableName: USERS_TABLE,
      Key: { pk: `USER#${email}`, sk: "PROFILE" },
    })
  );
  return (result.Item as UserProfile) ?? null;
}

export async function updateUserProfile(
  email: string,
  updates: { name?: string; phone?: string }
): Promise<void> {
  const expressions: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};

  if (updates.name !== undefined) {
    expressions.push("#n = :name");
    names["#n"] = "name";
    values[":name"] = updates.name;
  }
  if (updates.phone !== undefined) {
    expressions.push("phone = :phone");
    values[":phone"] = updates.phone;
  }

  expressions.push("updatedAt = :now");
  values[":now"] = new Date().toISOString();

  await getDocClient().send(
    new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { pk: `USER#${email}`, sk: "PROFILE" },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeNames: Object.keys(names).length ? names : undefined,
      ExpressionAttributeValues: values,
    })
  );
}

// ---- Resume Record ----

export async function getResumeRecord(email: string): Promise<ResumeRecord | null> {
  const result = await getDocClient().send(
    new GetCommand({
      TableName: RESUMES_TABLE,
      Key: { pk: `USER#${email}`, sk: "RESUME" },
    })
  );
  return (result.Item as ResumeRecord) ?? null;
}

export async function putResumeRecord(
  email: string,
  data: {
    s3Key: string;
    status: "pending" | "parsed" | "error";
  }
): Promise<void> {
  await getDocClient().send(
    new PutCommand({
      TableName: RESUMES_TABLE,
      Item: {
        pk: `USER#${email}`,
        sk: "RESUME",
        s3Key: data.s3Key,
        s3Bucket: "karrera-resumes-prod",
        status: data.status,
        uploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
  );
}

export async function clearResumeRecord(email: string): Promise<void> {
  await getDocClient().send(
    new DeleteCommand({
      TableName: RESUMES_TABLE,
      Key: { pk: `USER#${email}`, sk: "RESUME" },
    })
  );
}
