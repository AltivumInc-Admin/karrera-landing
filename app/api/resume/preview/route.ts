import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { getResumeRecord } from "@/lib/dynamo";
import { getPresignedDownloadUrl } from "@/lib/s3";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await getResumeRecord(session.email);
  if (!record?.s3Key) {
    return NextResponse.json({ error: "No resume" }, { status: 404 });
  }

  const url = await getPresignedDownloadUrl(record.s3Key);
  const isPdf = record.s3Key.endsWith(".pdf");

  return NextResponse.json({ url, isPdf });
}
