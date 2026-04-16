import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { putResumeRecord, clearResumeRecord } from "@/lib/dynamo";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await req.json();
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  await putResumeRecord(session.email, {
    s3Key: key,
    status: "pending",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await clearResumeRecord(session.email);
  return NextResponse.json({ ok: true });
}
