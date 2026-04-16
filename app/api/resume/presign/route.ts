import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { getPresignedUploadUrl } from "@/lib/s3";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename, contentType } = await req.json();
  const ext = filename?.split(".").pop()?.toLowerCase();

  if (!ext || !["pdf", "docx"].includes(ext)) {
    return NextResponse.json({ error: "Only PDF and DOCX allowed" }, { status: 400 });
  }

  const key = `resumes/${session.sub}/${Date.now()}.${ext}`;

  const url = await getPresignedUploadUrl(key, contentType, {
    "user-sub": session.sub,
    "user-email": session.email,
  });

  return NextResponse.json({ url, key });
}
