import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "./aws";
import { S3_BUCKETS } from "./constants";

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  metadata: Record<string, string>
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKETS.RESUMES,
    Key: key,
    ContentType: contentType,
    Metadata: metadata,
  });
  return getSignedUrl(getS3Client(), command, { expiresIn: 300 });
}

export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKETS.RESUMES,
    Key: key,
  });
  return getSignedUrl(getS3Client(), command, { expiresIn: 300 });
}
