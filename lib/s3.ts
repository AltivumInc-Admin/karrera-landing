import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let _s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!_s3Client) {
    _s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_REGION ?? "us-east-1",
      credentials: {
        accessKeyId: (process.env.KARRERA_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID)!,
        secretAccessKey: (process.env.KARRERA_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY)!,
      },
    });
  }
  return _s3Client;
}

const BUCKET = process.env.NEXT_PUBLIC_S3_RESUME_BUCKET ?? "karrera-resumes-prod";

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  metadata: Record<string, string>
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    Metadata: metadata,
  });
  return getSignedUrl(getS3Client(), command, { expiresIn: 300 });
}

export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  return getSignedUrl(getS3Client(), command, { expiresIn: 300 });
}
