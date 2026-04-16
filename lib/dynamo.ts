import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { getDynamoDocClient } from "./aws";
import { DYNAMODB_TABLES, S3_BUCKETS } from "./constants";
import type { UserProfile, ResumeRecord } from "@/types/resume";

// ---- User Profile ----

export async function getUserProfile(email: string): Promise<UserProfile | null> {
  const result = await getDynamoDocClient().send(
    new GetCommand({
      TableName: DYNAMODB_TABLES.USERS,
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

  await getDynamoDocClient().send(
    new UpdateCommand({
      TableName: DYNAMODB_TABLES.USERS,
      Key: { pk: `USER#${email}`, sk: "PROFILE" },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeNames: Object.keys(names).length ? names : undefined,
      ExpressionAttributeValues: values,
    })
  );
}

// ---- Resume Record ----

export async function getResumeRecord(email: string): Promise<ResumeRecord | null> {
  const result = await getDynamoDocClient().send(
    new GetCommand({
      TableName: DYNAMODB_TABLES.RESUMES,
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
  await getDynamoDocClient().send(
    new PutCommand({
      TableName: DYNAMODB_TABLES.RESUMES,
      Item: {
        pk: `USER#${email}`,
        sk: "RESUME",
        s3Key: data.s3Key,
        s3Bucket: S3_BUCKETS.RESUMES,
        status: data.status,
        uploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
  );
}

export async function clearResumeRecord(email: string): Promise<void> {
  await getDynamoDocClient().send(
    new DeleteCommand({
      TableName: DYNAMODB_TABLES.RESUMES,
      Key: { pk: `USER#${email}`, sk: "RESUME" },
    })
  );
}
