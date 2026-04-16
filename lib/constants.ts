export const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION ?? "us-east-1";

export const STRIPE_PAYMENT_URL =
  "https://buy.stripe.com/aFa6oAcMN2Pl4Spcpcb3q02";

export const DYNAMODB_TABLES = {
  USERS: "karrera-users",
  RESUMES: "karrera-resumes",
} as const;

export const S3_BUCKETS = {
  RESUMES: "karrera-resumes-prod",
} as const;

export const COGNITO = {
  USER_POOL_ID:
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "us-east-1_zp5vUWnd5",
  WEB_CLIENT_ID:
    process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "7fnsnujmgili0k5lai9qm97cmr",
} as const;

export const WAITLIST_API_URL =
  "https://105ec3w0n3.execute-api.us-east-1.amazonaws.com/waitlist";

export const TYPEFORM_URL = "https://form.typeform.com/to/JZktLW1h";
