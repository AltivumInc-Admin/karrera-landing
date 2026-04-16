import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { AWS_REGION } from "./constants";

// All clients use the default credential chain.
// On Amplify, credentials come from the IAM role automatically.
// For local dev, use ~/.aws/credentials or standard AWS env vars.

let _dynamoDoc: DynamoDBDocumentClient | null = null;
let _s3: S3Client | null = null;
let _cognito: CognitoIdentityProviderClient | null = null;

export function getDynamoDocClient(): DynamoDBDocumentClient {
  if (!_dynamoDoc) {
    const raw = new DynamoDBClient({ region: AWS_REGION });
    _dynamoDoc = DynamoDBDocumentClient.from(raw);
  }
  return _dynamoDoc;
}

export function getS3Client(): S3Client {
  if (!_s3) {
    _s3 = new S3Client({ region: AWS_REGION });
  }
  return _s3;
}

export function getCognitoClient(): CognitoIdentityProviderClient {
  if (!_cognito) {
    _cognito = new CognitoIdentityProviderClient({ region: AWS_REGION });
  }
  return _cognito;
}
