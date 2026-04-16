import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { getResumeRecord } from "@/lib/dynamo";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await getResumeRecord(session.email);
  return NextResponse.json({ status: record?.status ?? "none" });
}
